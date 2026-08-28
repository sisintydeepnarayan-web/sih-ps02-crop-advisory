/**
 * ==============================================================================
 * CROP ADVISORY ENGINE
 * ==============================================================================
 *
 * Rule-based expert agricultural advisory engine that evaluates environmental
 * conditions (temperature, precipitation deficit/surplus, humidity index)
 * against crop-specific agronomic thresholds.
 *
 * It returns structured advisories with i18n translation keys and dynamic params
 * to support multilingual farmer-facing presentation.
 */

// Temperature tolerance thresholds by crop category (in Celsius)
const CROP_TEMP_THRESHOLDS = {
  wheat: { heatStressThreshold: 31, idealMin: 15, idealMax: 26, name: 'Wheat' },
  rice: { heatStressThreshold: 37, idealMin: 22, idealMax: 33, name: 'Paddy / Rice' },
  mustard: { heatStressThreshold: 29, idealMin: 12, idealMax: 25, name: 'Mustard' },
  cotton: { heatStressThreshold: 39, idealMin: 21, idealMax: 35, name: 'Cotton' },
  maize: { heatStressThreshold: 36, idealMin: 18, idealMax: 32, name: 'Maize' },
  sugarcane: { heatStressThreshold: 40, idealMin: 20, idealMax: 36, name: 'Sugarcane' },
  potato: { heatStressThreshold: 28, idealMin: 15, idealMax: 24, name: 'Potato' },
  soybean: { heatStressThreshold: 36, idealMin: 20, idealMax: 32, name: 'Soybean' },
  pulses: { heatStressThreshold: 34, idealMin: 16, idealMax: 30, name: 'Pulses / Dal' },
};

// Common pests by crop in warm/humid conditions
const CROP_PESTS = {
  wheat: 'Yellow Rust / Aphids',
  rice: 'Brown Plant Hopper / Blast',
  mustard: 'Mustard Aphid / White Rust',
  cotton: 'Pink Bollworm / Whitefly',
  maize: 'Fall Armyworm / Stem Borer',
  sugarcane: 'Top Borer / Red Rot',
  potato: 'Late Blight / Tuber Moth',
  soybean: 'Stem Fly / Girdle Beetle',
  pulses: 'Pod Borer / Wilt',
};

// District-wise resilient alternate crops
const DISTRICT_FAVOURABLE_CROPS = {
  'Maharashtra': { cropId: 'soybean', cropName: 'Soybean & Gram (चना)', waterSaving: '35%' },
  'Uttar Pradesh': { cropId: 'mustard', cropName: 'Mustard (सरसों)', waterSaving: '40%' },
  'Madhya Pradesh': { cropId: 'pulses', cropName: 'Chickpea / Pulses (चना/दालें)', waterSaving: '45%' },
  'Punjab': { cropId: 'mustard', cropName: 'Mustard / Maize', waterSaving: '50%' },
  'Haryana': { cropId: 'pulses', cropName: 'Moong / Mustard', waterSaving: '45%' },
  'Rajasthan': { cropId: 'mustard', cropName: 'Mustard / Pearl Millet (बाजरा)', waterSaving: '60%' },
  'Bihar': { cropId: 'maize', cropName: 'Maize / Rabi Pulses', waterSaving: '30%' },
};

/**
 * Computes agricultural advisory recommendations based on environmental rules.
 *
 * @param {string} district - District name (e.g., 'Nashik', 'Varanasi')
 * @param {string} crop - Crop identifier (e.g., 'wheat', 'cotton', 'mustard')
 * @param {Object} weatherData - { rainfall_mm, expected_rainfall_mm, temp_c }
 * @returns {Object} Structured advisory output with translation keys and parameters
 */
function getCropAdvisory(district = 'Varanasi', crop = 'wheat', weatherData = {}) {
  const cropKey = (crop || 'wheat').toLowerCase();
  const cropConfig = CROP_TEMP_THRESHOLDS[cropKey] || CROP_TEMP_THRESHOLDS.wheat;

  // Safe extraction with standard agricultural defaults
  const rainfall = Number(weatherData.rainfall_mm ?? 5);
  const expectedRainfall = Number(weatherData.expected_rainfall_mm ?? 30);
  const temp = Number(weatherData.temp_c ?? 32);

  const advisories = [];

  // ----------------------------------------------------------------------------
  // RULE 1: DROUGHT STRESS
  // Reasoning: When actual rainfall is severely lower than expected evapotranspiration
  // demand (rainfall < 40% of expected and expected >= 15mm, or rainfall < 8mm in dry spell),
  // crops suffer moisture stress leading to stomatal closure, cell dehydration, and yield drop.
  // Recommendation: Apply light night/early morning drip or sprinkler irrigation; apply mulch.
  // ----------------------------------------------------------------------------
  const isDrought = expectedRainfall >= 15 && (rainfall / expectedRainfall) <= 0.40;
  if (isDrought || (expectedRainfall >= 25 && rainfall < 10)) {
    const deficitPercent = Math.max(0, Math.round(((expectedRainfall - rainfall) / expectedRainfall) * 100));
    advisories.push({
      id: 'drought_stress',
      category: 'irrigation',
      severity: deficitPercent > 70 ? 'high' : 'medium',
      issue_key: 'advisory.rules.drought_stress.issue',
      recommendation_key: 'advisory.rules.drought_stress.recommendation',
      params: {
        crop: cropConfig.name,
        deficit: `${deficitPercent}%`,
        rainfall: `${rainfall}mm`,
        expected: `${expectedRainfall}mm`,
        district
      }
    });
  }

  // ----------------------------------------------------------------------------
  // RULE 2: WATERLOGGING / EXCESS RAINFALL
  // Reasoning: When rainfall exceeds 160% of expected or heavy downpour exceeds 50mm,
  // soil pores saturate, displacing oxygen (hypoxia), leading to nitrogen leaching,
  // fungal root rot (Pythium/Phytophthora), and crop lodging.
  // Recommendation: Open drainage furrows immediately to remove stagnant water within 24h.
  // ----------------------------------------------------------------------------
  const isWaterlogged = (expectedRainfall > 0 && (rainfall / expectedRainfall) >= 1.60 && rainfall >= 40) || rainfall >= 60;
  if (isWaterlogged) {
    advisories.push({
      id: 'waterlogging',
      category: 'drainage',
      severity: rainfall >= 75 ? 'high' : 'medium',
      issue_key: 'advisory.rules.waterlogging.issue',
      recommendation_key: 'advisory.rules.waterlogging.recommendation',
      params: {
        crop: cropConfig.name,
        rainfall: `${rainfall}mm`,
        expected: `${expectedRainfall}mm`,
        district
      }
    });
  }

  // ----------------------------------------------------------------------------
  // RULE 3: HEAT STRESS
  // Reasoning: High ambient temperatures exceeding crop thresholds (e.g. >31C for wheat,
  // >28C for potato, >38C for cotton/soybean) cause terminal heat shock, pollen abortion,
  // poor pollination, and accelerated leaf senescence.
  // Recommendation: Light frequent sprinkling to cool microclimate, avoid afternoon spraying.
  // ----------------------------------------------------------------------------
  if (temp >= cropConfig.heatStressThreshold) {
    const excessTemp = Math.round(temp - cropConfig.heatStressThreshold);
    advisories.push({
      id: 'heat_stress',
      category: 'protection',
      severity: excessTemp >= 4 ? 'high' : 'medium',
      issue_key: 'advisory.rules.heat_stress.issue',
      recommendation_key: 'advisory.rules.heat_stress.recommendation',
      params: {
        crop: cropConfig.name,
        temp: `${temp}°C`,
        threshold: `${cropConfig.heatStressThreshold}°C`,
        district
      }
    });
  }

  // ----------------------------------------------------------------------------
  // RULE 4: PEST & FUNGAL RISK FROM HUMIDITY
  // Reasoning: When moderate to warm temperatures (22C to 34C) coincide with moderate
  // or high moisture (rainfall >= 12mm), relative humidity spikes above 80%, providing
  // optimal incubation for fungal spores and breeding for sucking insect vectors.
  // Recommendation: Inspect lower leaf surface, install pheromone traps, spray bio-fungicide.
  // ----------------------------------------------------------------------------
  const isHumidPestRisk = temp >= 22 && temp <= 34 && (rainfall >= 12 || isWaterlogged);
  if (isHumidPestRisk) {
    const pestName = CROP_PESTS[cropKey] || 'Aphids and Blight';
    advisories.push({
      id: 'pest_risk',
      category: 'pest_control',
      severity: rainfall >= 30 ? 'high' : 'medium',
      issue_key: 'advisory.rules.pest_risk.issue',
      recommendation_key: 'advisory.rules.pest_risk.recommendation',
      params: {
        crop: cropConfig.name,
        pestName,
        temp: `${temp}°C`,
        district
      }
    });
  }

  // ----------------------------------------------------------------------------
  // RULE 5: OPTIMAL SOWING & SEED MANAGEMENT WINDOW
  // Reasoning: Proper seed depth (3-5 cm), certified seed treatment (Trichoderma / Rhizobium),
  // and soil moisture check before sowing ensures >90% germination rate and robust rooting.
  // Recommendation: Treat seeds with bio-inoculant, ensure 4-5cm depth, basal DAP/NPK application.
  // ----------------------------------------------------------------------------
  advisories.push({
    id: 'sowing_window',
    category: 'sowing',
    severity: 'low', // Informational best practice
    issue_key: 'advisory.rules.sowing_window.issue',
    recommendation_key: 'advisory.rules.sowing_window.recommendation',
    params: {
      crop: cropConfig.name,
      depth: '4-5 cm',
      season: 'Rabi / Current Season',
      district
    }
  });

  // ----------------------------------------------------------------------------
  // RULE 6: FAVOURABLE REGIONAL CROP RECOMMENDATION
  // Reasoning: Climate-smart crop diversification (e.g. mustard or pulses instead of
  // water-heavy crops during water deficit) hedges climate distress and boosts farm income.
  // ----------------------------------------------------------------------------
  const stateRecommendation = DISTRICT_FAVOURABLE_CROPS['Maharashtra']; // default fallback
  const favourableCrop = {
    crop_key: `advisory.favourable.${stateRecommendation.cropId}.name`,
    reason_key: `advisory.favourable.${stateRecommendation.cropId}.reason`,
    crop_name: stateRecommendation.cropName,
    water_saving: stateRecommendation.waterSaving,
    params: {
      district,
      crop: stateRecommendation.cropName,
      waterSaving: stateRecommendation.waterSaving
    }
  };

  // Determine overall primary advisory severity
  const severityRank = { high: 3, medium: 2, low: 1 };
  const sortedAdvisories = [...advisories].sort((a, b) => severityRank[b.severity] - severityRank[a.severity]);
  const primaryAdvisory = sortedAdvisories[0] || advisories[0];

  return {
    district,
    crop: cropKey,
    crop_display_name: cropConfig.name,
    timestamp: new Date().toISOString(),
    weather: {
      rainfall_mm: rainfall,
      expected_rainfall_mm: expectedRainfall,
      temp_c: temp,
      condition: rainfall > 20 ? 'Rainy' : temp > 34 ? 'Hot & Dry' : 'Moderate'
    },
    primary_advisory: primaryAdvisory,
    advisories: sortedAdvisories,
    favourable_crop_recommendation: favourableCrop,
  };
}

module.exports = {
  getCropAdvisory,
  CROP_TEMP_THRESHOLDS,
  CROP_PESTS,
};
