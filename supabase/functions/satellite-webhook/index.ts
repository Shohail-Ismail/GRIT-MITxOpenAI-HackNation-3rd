import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.80.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Google Cloud Pub/Sub message structure
interface PubSubMessage {
  message: {
    data: string; // base64 encoded
    messageId: string;
    publishTime: string;
    attributes?: Record<string, string>;
  };
  subscription: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    
    console.log('Received Google Cloud Pub/Sub webhook:', JSON.stringify(body, null, 2));
    
    // Parse Pub/Sub message
    const pubsubMessage = body as PubSubMessage;
    
    if (!pubsubMessage.message) {
      throw new Error('Invalid Pub/Sub message format');
    }
    
    // Decode base64 data
    const decodedData = atob(pubsubMessage.message.data);
    const messageData = JSON.parse(decodedData);
    
    console.log('Decoded Pub/Sub data:', messageData);
    
    // Extract event information
    const {
      eventType,
      satellite,
      location,
      acquisitionTime,
      severity,
    } = messageData;
    
    console.log(`Processing satellite event: ${eventType} from ${satellite}`);
    console.log(`Location: ${location?.latitude}, ${location?.longitude}`);
    console.log(`Severity: ${severity}`);
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Trigger satellite data ingestion for the affected location
    const ingestUrl = `${supabaseUrl}/functions/v1/ingest-satellite-data`;
    
    const ingestResponse = await fetch(ingestUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        trigger: 'pubsub',
        source: 'google-cloud',
        latitude: location?.latitude,
        longitude: location?.longitude,
        eventType: eventType,
        satellite: satellite,
        severity: severity,
      }),
    });
    
    const ingestResult = await ingestResponse.json();
    
    console.log('Satellite data ingestion triggered:', ingestResult);
    
    // Log the event
    const logEntry = {
      event_type: eventType,
      satellite: satellite,
      location: location,
      severity: severity,
      acquisition_time: acquisitionTime,
      pubsub_message_id: pubsubMessage.message.messageId,
      pubsub_publish_time: pubsubMessage.message.publishTime,
      ingestion_result: ingestResult,
      processed_at: new Date().toISOString(),
    };
    
    console.log('Event processing complete:', logEntry);
    
    // Return success response (important for Pub/Sub acknowledgment)
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Satellite event processed successfully',
        messageId: pubsubMessage.message.messageId,
        eventType: eventType,
        dataPointsProcessed: ingestResult.dataPointsInserted,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
    
  } catch (error) {
    console.error('Error in satellite-webhook function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    // Return error but with 200 status to prevent Pub/Sub retries on permanent errors
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200, // Return 200 to acknowledge receipt even on error
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
