// Calculation points data for risk factors
export const floodCalculationPoints = [
  {
    title: "Precipitation Intensity-Duration-Frequency (IDF) Curves",
    description: "Analyzes extreme rainfall patterns using statistical distributions of precipitation intensity over various durations. This factor receives the highest weight (2.5x) due to its direct correlation with flood magnitude.",
    formula: "P = \\frac{a \\cdot T^b}{(t_d + c)^d} \\times W_p",
    variables: [
      { symbol: "P", description: "Precipitation intensity factor (mm/hour)" },
      { symbol: "T", description: "Return period (years: 10, 25, 50, 100, 250)" },
      { symbol: "t_d", description: "Storm duration (hours)" },
      { symbol: "a, b, c, d", description: "Regional IDF coefficients from NOAA Atlas 14" },
      { symbol: "W_p = 2.5", description: "Precipitation weighting factor" }
    ]
  },
  {
    title: "Elevation-Based Vulnerability Assessment",
    description: "Evaluates flood susceptibility based on height above mean sea level (MSL). Lower elevations face exponentially higher risk from both riverine flooding and storm surge.",
    formula: "E = \\begin{cases} 40 & \\text{if } h < 10m \\\\ 25 & \\text{if } 10m \\leq h < 50m \\\\ 12 & \\text{if } 50m \\leq h < 200m \\\\ 0 & \\text{if } h \\geq 200m \\end{cases}",
    variables: [
      { symbol: "E", description: "Elevation vulnerability score" },
      { symbol: "h", description: "Height above mean sea level (meters)" }
    ]
  },
  {
    title: "Hydraulic Conductivity & Drainage Capacity",
    description: "Assesses soil permeability and drainage infrastructure effectiveness. Poor drainage amplifies flood duration and severity, increasing water damage claims.",
    formula: "H = \\left(1 - \\frac{K_{sat}}{K_{max}}\\right) \\times 100 + D_{penalty}",
    variables: [
      { symbol: "H", description: "Hydraulic impedance score (0-100)" },
      { symbol: "K_{sat}", description: "Saturated hydraulic conductivity (cm/hr)" },
      { symbol: "K_{max}", description: "Maximum observed conductivity in region" },
      { symbol: "D_{penalty}", description: "Drainage infrastructure deficit adjustment" }
    ]
  },
  {
    title: "Historical Loss Ratios from Catastrophe Models",
    description: "Incorporates validated loss data from leading catastrophe modeling firms (RMS, AIR, CoreLogic). Uses actuarial loss development patterns to estimate probable maximum loss.",
    formula: "C = \\frac{\\sum_{i=1}^{n} (L_i \\times f_i)}{TIV} \\times 100",
    variables: [
      { symbol: "C", description: "Catastrophe model severity score" },
      { symbol: "L_i", description: "Historical loss amount for event i" },
      { symbol: "f_i", description: "Frequency weight for event i" },
      { symbol: "n", description: "Number of historical events analyzed" },
      { symbol: "TIV", description: "Total Insured Value of portfolio" }
    ]
  },
  {
    title: "Climate-Adjusted Return Period Calculations",
    description: "Projects future flood frequency by incorporating IPCC climate scenarios (RCP 8.5). Adjusts historical return periods to account for increased precipitation intensity due to global warming.",
    formula: "R = R_0 \\times \\left(1 + \\alpha \\cdot \\Delta T\\right)^\\beta",
    variables: [
      { symbol: "R", description: "Climate-adjusted return period score" },
      { symbol: "R_0", description: "Historical baseline return period" },
      { symbol: "\\alpha", description: "Climate sensitivity coefficient (0.07 per °C)" },
      { symbol: "\\Delta T", description: "Projected temperature increase (°C) by 2050" },
      { symbol: "\\beta", description: "Exponential adjustment factor (1.3 for extreme events)" }
    ]
  }
];

export const wildfireCalculationPoints = [
  {
    title: "Fire Weather Index (FWI) with Keetch-Byram Drought Index (KBDI)",
    description: "Combines temperature, humidity, wind speed, and precipitation to assess fire danger. KBDI measures soil moisture deficit to determine vegetation dryness and ignition potential.",
    formula: "FWI = f(T, RH, W, P_{24h}) \\times \\left(1 + \\frac{KBDI}{800}\\right)",
    variables: [
      { symbol: "T", description: "Maximum daily temperature (°C)" },
      { symbol: "RH", description: "Relative humidity (%)" },
      { symbol: "W", description: "Wind speed (km/h)" },
      { symbol: "P_{24h}", description: "24-hour precipitation (mm)" },
      { symbol: "KBDI", description: "Drought index (0-800 scale)" },
      { symbol: "f()", description: "Canadian Forest Fire Danger Rating System function" }
    ]
  },
  {
    title: "Temperature Threshold Analysis",
    description: "Extreme heat accelerates fuel desiccation and increases fire intensity exponentially. Temperatures above 35°C create critical fire weather conditions with rapid flame propagation.",
    formula: "T_{score} = \\begin{cases} W_T \\times 3.5 \\times (T - 35) & \\text{if } T > 35°C \\\\ W_T \\times (T - 25) & \\text{if } 25°C \\leq T \\leq 35°C \\\\ 0 & \\text{if } T < 25°C \\end{cases}",
    variables: [
      { symbol: "T_{score}", description: "Temperature-driven fire risk score" },
      { symbol: "T", description: "Ambient temperature (°C)" },
      { symbol: "W_T", description: "Temperature weighting coefficient (3.5 for extreme heat)" }
    ]
  },
  {
    title: "Relative Humidity Deficit Assessment",
    description: "Low humidity removes moisture from live and dead fuels, creating highly combustible conditions. Critical thresholds represent tipping points for extreme fire behavior.",
    formula: "RH_{score} = \\begin{cases} 40 & \\text{if } RH < 25\\% \\\\ 25 & \\text{if } 25\\% \\leq RH < 35\\% \\\\ 10 & \\text{if } 35\\% \\leq RH < 50\\% \\\\ 0 & \\text{if } RH \\geq 50\\% \\end{cases}",
    variables: [
      { symbol: "RH_{score}", description: "Humidity-based fire risk points" },
      { symbol: "RH", description: "Relative humidity percentage" }
    ]
  },
  {
    title: "Wind-Driven Fire Spread Modeling",
    description: "Wind velocity governs fire spread rate and ember transport distance. Sustained winds above 25 km/h cause exponential increases in fire intensity and structure loss potential.",
    formula: "S = S_0 \\times e^{k \\cdot W} \\times \\cos(\\theta)",
    variables: [
      { symbol: "S", description: "Fire spread rate (m/min)" },
      { symbol: "S_0", description: "Base spread rate in calm conditions" },
      { symbol: "k", description: "Wind coefficient (typically 0.05-0.15)" },
      { symbol: "W", description: "Wind speed (km/h)" },
      { symbol: "\\theta", description: "Angle between wind direction and fire front" }
    ]
  },
  {
    title: "Fuel Moisture Content Thresholds",
    description: "Dead fuel moisture below 10% creates extreme fire behavior with rapid combustion rates. Live fuel moisture stress indicates vegetation susceptibility to ignition.",
    formula: "FM_{risk} = \\begin{cases} 50 & \\text{if } FM < 8\\% \\\\ 35 & \\text{if } 8\\% \\leq FM < 12\\% \\\\ 15 & \\text{if } 12\\% \\leq FM < 20\\% \\\\ 0 & \\text{if } FM \\geq 20\\% \\end{cases}",
    variables: [
      { symbol: "FM_{risk}", description: "Fuel moisture risk score" },
      { symbol: "FM", description: "Dead fuel moisture content (%)" }
    ]
  },
  {
    title: "Defensible Space & Structure Vulnerability",
    description: "Evaluates clearance zones, building materials, and ember-resistant features. Properties with adequate defensible space (30m radius) show 85% lower loss severity in wildfire events.",
    formula: "DS_{score} = (1 - C_{30}) \\times 100 \\times M_{vuln}",
    variables: [
      { symbol: "DS_{score}", description: "Defensible space vulnerability score" },
      { symbol: "C_{30}", description: "Clearance compliance within 30m radius (0-1)" },
      { symbol: "M_{vuln}", description: "Material vulnerability multiplier (1.0-2.5)" }
    ]
  }
];

export const stormCalculationPoints = [
  {
    title: "Peak Wind Gust Potential",
    description: "Maximum sustained wind velocity correlates directly with structural damage severity. Applied 2.2x weighting reflects empirical loss data showing exponential damage escalation above 50 m/s.",
    formula: "W_{damage} = W_{gust}^{2.2} \\times C_{structural} \\times A_{exposure}",
    variables: [
      { symbol: "W_{damage}", description: "Wind damage index" },
      { symbol: "W_{gust}", description: "Peak wind gust velocity (m/s)" },
      { symbol: "C_{structural}", description: "Structural vulnerability coefficient (0.5-1.5)" },
      { symbol: "A_{exposure}", description: "Building exposure area (m²)" }
    ]
  },
  {
    title: "Convective Available Potential Energy (CAPE)",
    description: "Measures atmospheric instability energy available for convective storms. Values exceeding 1500 J/kg indicate high probability of severe weather including tornadoes and large hail.",
    formula: "CAPE = g \\int_{z_{LFC}}^{z_{EL}} \\left(\\frac{T_{parcel} - T_{env}}{T_{env}}\\right) dz",
    variables: [
      { symbol: "CAPE", description: "Convective available potential energy (J/kg)" },
      { symbol: "g", description: "Gravitational acceleration (9.81 m/s²)" },
      { symbol: "z_{LFC}", description: "Level of free convection height" },
      { symbol: "z_{EL}", description: "Equilibrium level height" },
      { symbol: "T_{parcel}", description: "Temperature of rising air parcel (K)" },
      { symbol: "T_{env}", description: "Environmental temperature (K)" }
    ]
  },
  {
    title: "Atmospheric Instability & Temperature Lapse Rate",
    description: "Steep temperature gradients indicate strong frontal systems capable of producing severe thunderstorms, derechos, and tornadic supercells. Lapse rates >15°C/day signal extreme instability.",
    formula: "\\Gamma = -\\frac{dT}{dz} \\times 1000",
    variables: [
      { symbol: "\\Gamma", description: "Environmental lapse rate (°C per 1000m)" },
      { symbol: "dT", description: "Temperature change with altitude" },
      { symbol: "dz", description: "Change in height (meters)" }
    ]
  },
  {
    title: "Precipitation Intensity & Flash Flood Trigger",
    description: "Extreme rainfall rates (>50mm/hour) overwhelm drainage systems causing flash flooding and wind-driven water intrusion. Secondary water damage often exceeds primary wind damage in severe storms.",
    formula: "P_{intensity} = \\frac{P_{total}}{t_{duration}} \\times (1 + 0.3 \\times W_{wind})",
    variables: [
      { symbol: "P_{intensity}", description: "Adjusted precipitation intensity (mm/hr)" },
      { symbol: "P_{total}", description: "Total precipitation accumulation (mm)" },
      { symbol: "t_{duration}", description: "Storm duration (hours)" },
      { symbol: "W_{wind}", description: "Wind speed normalization factor" }
    ]
  },
  {
    title: "Historical Frequency-Severity Distribution",
    description: "Analyzes past severe weather events to establish baseline occurrence rates and loss magnitudes. Critical for setting attachment points and exhaustion layers in excess-of-loss treaties.",
    formula: "\\lambda_{severity} = \\frac{1}{n} \\sum_{i=1}^{n} \\left(\\frac{L_i}{E_i}\\right) \\times f(T_i)",
    variables: [
      { symbol: "\\lambda_{severity}", description: "Expected annual severity rate" },
      { symbol: "n", description: "Number of historical events" },
      { symbol: "L_i", description: "Loss amount for event i" },
      { symbol: "E_i}", description: "Exposure value for event i" },
      { symbol: "f(T_i)", description: "Time decay function for event i recency" }
    ]
  }
];

export const droughtCalculationPoints = [
  {
    title: "Precipitation Deficit Analysis",
    description: "Measures cumulative rainfall shortfall over 90-day rolling window. Severe deficits (<5mm) trigger parametric insurance payouts for agricultural portfolios. Moderate deficits indicate emerging stress.",
    formula: "PD = \\begin{cases} 50 & \\text{if } P_{90d} < 5mm \\\\ 30 & \\text{if } 5mm \\leq P_{90d} < 15mm \\\\ 10 & \\text{if } 15mm \\leq P_{90d} < 30mm \\\\ 0 & \\text{if } P_{90d} \\geq 30mm \\end{cases}",
    variables: [
      { symbol: "PD", description: "Precipitation deficit score" },
      { symbol: "P_{90d}", description: "Total precipitation over 90-day window (mm)" }
    ]
  },
  {
    title: "Evapotranspiration Excess & Water Stress",
    description: "Calculates water loss through evaporation and plant transpiration. Temperatures exceeding 30°C exponentially increase crop water demand, creating moisture deficits even with normal precipitation.",
    formula: "ET_0 = \\frac{0.408 \\Delta (R_n - G) + \\gamma \\frac{900}{T+273} u_2 (e_s - e_a)}{\\Delta + \\gamma(1 + 0.34 u_2)}",
    variables: [
      { symbol: "ET_0", description: "Reference evapotranspiration (mm/day)" },
      { symbol: "\\Delta", description: "Slope of saturation vapor pressure curve (kPa/°C)" },
      { symbol: "R_n", description: "Net radiation at crop surface (MJ/m²/day)" },
      { symbol: "G", description: "Soil heat flux density (MJ/m²/day)" },
      { symbol: "\\gamma", description: "Psychrometric constant (kPa/°C)" },
      { symbol: "T", description: "Mean daily air temperature (°C)" },
      { symbol: "u_2", description: "Wind speed at 2m height (m/s)" },
      { symbol: "e_s", description: "Saturation vapor pressure (kPa)" },
      { symbol: "e_a", description: "Actual vapor pressure (kPa)" }
    ]
  },
  {
    title: "Vapor Pressure Deficit (VPD) Stress Assessment",
    description: "Quantifies atmospheric demand for moisture extraction from plants and soil. Critical VPD levels (<30% RH) cause stomatal closure, halting photosynthesis and reducing crop yields.",
    formula: "VPD = e_s(T) - e_a = e_s(T) \\times \\left(1 - \\frac{RH}{100}\\right)",
    variables: [
      { symbol: "VPD", description: "Vapor pressure deficit (kPa)" },
      { symbol: "e_s(T)", description: "Saturation vapor pressure at temperature T (kPa)" },
      { symbol: "e_a", description: "Actual vapor pressure (kPa)" },
      { symbol: "RH", description: "Relative humidity (%)" }
    ]
  },
  {
    title: "Growing Degree Days (GDD) Deviation",
    description: "Tracks accumulated heat units for crop development. Significant deviations from historical normals indicate phenological stress, premature maturation, or crop failure scenarios.",
    formula: "GDD = \\sum_{i=1}^{n} \\max\\left(\\frac{T_{max,i} + T_{min,i}}{2} - T_{base}, 0\\right)",
    variables: [
      { symbol: "GDD", description: "Cumulative growing degree days" },
      { symbol: "T_{max,i}", description: "Maximum temperature on day i (°C)" },
      { symbol: "T_{min,i}", description: "Minimum temperature on day i (°C)" },
      { symbol: "T_{base}", description: "Base temperature for crop growth (typically 10°C)" },
      { symbol: "n", description: "Number of days in growing season" }
    ]
  },
  {
    title: "Root Zone Soil Moisture & Wilting Point",
    description: "Monitors available water in active root zone. When soil moisture falls below permanent wilting point (-1.5 MPa), plants cannot extract water, leading to irreversible crop damage.",
    formula: "\\theta_{available} = \\theta_{actual} - \\theta_{PWP}",
    variables: [
      { symbol: "\\theta_{available}", description: "Plant-available soil moisture (volumetric %)" },
      { symbol: "\\theta_{actual}", description: "Current volumetric soil moisture content (%)" },
      { symbol: "\\theta_{PWP}", description: "Permanent wilting point moisture content (%)" }
    ]
  }
];
