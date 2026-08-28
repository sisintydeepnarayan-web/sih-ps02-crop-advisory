/**
 * ==============================================================================
 * DISTRESS-RISK SCORING ENGINE
 * ==============================================================================
 *
 * Evaluates multi-dimensional risk signals to calculate a 0-100 Farmer Distress
 * Early-Warning Score and generates plain-language, non-technical factor summaries
 * for NGO workers, extension agents, and field counselors.
 *
 * Weight Distribution:
 * - 40% Rainfall / Drought / Flood Deviation
 * - 30% Mandi Market Commodity Price Drop
 * - 20% Crop Loan Repayment Proximity
 * - 10% Farmer Sentiment / Mood Check-in (when available)
 * (If no mood check-in exists, the 10% weight is redistributed proportionally across the other 3).
 */

/**
 * Calculates a 0-100 distress score and plain-language triggered factor summaries.
 *
 * @param {Object} farmer - Farmer database row { id, name, district, primary_crop, loan_due_date }
 * @param {Object} weatherData - { rainfall_mm, expected_rainfall_mm, temp_c }
 * @param {Array} priceHistory - Array of crop_prices records sorted by date descending
 * @param {Array} moodHistory - Array of mood_checkins records sorted by date descending
 * @returns {Object} { score: number, riskLevel: 'low'|'medium'|'high', triggeredFactors: string[], breakdown: Object }
 */
function calculateDistressScore(farmer = {}, weatherData = {}, priceHistory = [], moodHistory = []) {
  const district = farmer.district || 'District';
  const crop = farmer.primary_crop || farmer.crop || 'Crop';
  const triggeredFactors = [];

  // ----------------------------------------------------------------------------
  // 1. SIGNAL 1: RAINFALL DEVIATION (40% Weight)
  // ----------------------------------------------------------------------------
  const rainfall = Number(weatherData.rainfall_mm ?? 5);
  const expectedRainfall = Number(weatherData.expected_rainfall_mm ?? 30);
  let rainfallSubscore = 10; // baseline

  if (expectedRainfall > 0) {
    const deviation = ((rainfall - expectedRainfall) / expectedRainfall) * 100;

    if (deviation <= -25) {
      // Significant rainfall deficit / drought
      const deficit = Math.round(Math.abs(deviation));
      if (deficit >= 75) {
        rainfallSubscore = 100;
      } else if (deficit >= 50) {
        rainfallSubscore = 75;
      } else {
        rainfallSubscore = 45;
      }
      triggeredFactors.push(
        `Monsoon rainfall is ${deficit}% below normal in ${district} (${rainfall}mm actual vs ${expectedRainfall}mm expected).`
      );
    } else if (rainfall >= 60 || (expectedRainfall > 0 && (rainfall / expectedRainfall) >= 1.6 && rainfall >= 40)) {
      // Waterlogging / excessive downpour
      rainfallSubscore = rainfall >= 80 ? 90 : 65;
      triggeredFactors.push(
        `Excessive rainfall (${rainfall}mm recorded in ${district}) creating severe waterlogging and root rot risks.`
      );
    } else {
      rainfallSubscore = 10;
    }
  }

  // ----------------------------------------------------------------------------
  // 2. SIGNAL 2: CROP MANDI PRICE DROP (30% Weight)
  // ----------------------------------------------------------------------------
  let priceSubscore = 10; // baseline

  if (Array.isArray(priceHistory) && priceHistory.length >= 2) {
    const latestPrice = Number(priceHistory[0].price_per_quintal);
    const previousPrice = Number(priceHistory[1].price_per_quintal);

    if (previousPrice > 0 && latestPrice < previousPrice) {
      const dropPercent = Math.round(((previousPrice - latestPrice) / previousPrice) * 100);

      if (dropPercent >= 25) {
        priceSubscore = 100;
      } else if (dropPercent >= 15) {
        priceSubscore = 75;
      } else if (dropPercent >= 7) {
        priceSubscore = 45;
      } else {
        priceSubscore = 20;
      }

      if (dropPercent >= 7) {
        triggeredFactors.push(
          `APMC Mandi price for ${crop} dropped by ${dropPercent}% recently (from ₹${previousPrice} to ₹${latestPrice}/Qtl).`
        );
      }
    } else {
      priceSubscore = 0; // price is stable or increasing
    }
  }

  // ----------------------------------------------------------------------------
  // 3. SIGNAL 3: LOAN REPAYMENT PROXIMITY (20% Weight)
  // ----------------------------------------------------------------------------
  let loanSubscore = 10; // baseline

  if (farmer.loan_due_date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueDate = new Date(farmer.loan_due_date);
    dueDate.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      // Overdue
      loanSubscore = 100;
      triggeredFactors.push(
        `Crop loan repayment is overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) === 1 ? '' : 's'} (Due date was ${farmer.loan_due_date}).`
      );
    } else if (diffDays <= 7) {
      // Imminent
      loanSubscore = 95;
      triggeredFactors.push(
        `Bank crop loan repayment deadline is imminent: due in ${diffDays} day${diffDays === 1 ? '' : 's'} (${farmer.loan_due_date}).`
      );
    } else if (diffDays <= 15) {
      loanSubscore = 75;
      triggeredFactors.push(
        `Bank crop loan repayment deadline approaching: due in ${diffDays} days (${farmer.loan_due_date}).`
      );
    } else if (diffDays <= 30) {
      loanSubscore = 45;
      triggeredFactors.push(
        `Crop loan payment scheduled within the next ${diffDays} days (${farmer.loan_due_date}).`
      );
    } else if (diffDays <= 60) {
      loanSubscore = 20;
    } else {
      loanSubscore = 5;
    }
  }

  // ----------------------------------------------------------------------------
  // 4. SIGNAL 4: MOOD / PSYCHOLOGICAL SENTIMENT (10% Weight, Optional)
  // ----------------------------------------------------------------------------
  let moodSubscore = 0;
  const hasMoodData = Array.isArray(moodHistory) && moodHistory.length > 0;

  if (hasMoodData) {
    const latestMood = String(moodHistory[0].mood || '').toLowerCase();

    if (latestMood === 'struggling') {
      moodSubscore = 100;
      triggeredFactors.push(
        `Farmer reported acute stress or struggling in recent well-being check-in.`
      );
    } else if (latestMood === 'okay') {
      moodSubscore = 40;
    } else if (latestMood === 'good') {
      moodSubscore = 0; // Reduces overall distress
    }
  }

  // ----------------------------------------------------------------------------
  // 5. WEIGHTED SUM & REDISTRIBUTION
  // ----------------------------------------------------------------------------
  let totalScore;

  if (hasMoodData) {
    // 40% Weather, 30% Price, 20% Loan, 10% Mood
    totalScore = Math.round(
      rainfallSubscore * 0.40 +
      priceSubscore * 0.30 +
      loanSubscore * 0.20 +
      moodSubscore * 0.10
    );
  } else {
    // Redistribute mood's 10% proportionally: 40/90, 30/90, 20/90
    totalScore = Math.round(
      rainfallSubscore * (0.40 / 0.90) +
      priceSubscore * (0.30 / 0.90) +
      loanSubscore * (0.20 / 0.90)
    );
  }

  // Clamp between 0 and 100
  totalScore = Math.max(0, Math.min(100, totalScore));

  // Determine Risk Level Category
  let riskLevel = 'low';
  if (totalScore >= 65) {
    riskLevel = 'high';
  } else if (totalScore >= 35) {
    riskLevel = 'medium';
  }

  // If no critical factors were triggered, provide an assuring default summary
  if (triggeredFactors.length === 0) {
    triggeredFactors.push(
      `Weather conditions, market commodity rates, and loan repayment timelines are currently within stable limits.`
    );
  }

  return {
    score: totalScore,
    riskLevel, // 'low' | 'medium' | 'high'
    triggeredFactors,
    breakdown: {
      rainfallSubscore,
      priceSubscore,
      loanSubscore,
      moodSubscore: hasMoodData ? moodSubscore : null,
      moodEvaluated: hasMoodData,
    }
  };
}

/**
 * Returns mock emergency alert routing details for demo purposes when risk is High.
 *
 * @param {string} riskLevel - 'low' | 'medium' | 'high'
 * @param {string} district - District name
 * @returns {Object|null}
 */
function getMockAlertRouting(riskLevel, district = 'Nashik') {
  if (riskLevel !== 'high') {
    return null;
  }

  const officers = {
    'Nashik': { name: 'Dr. Suresh Gaikwad', designation: 'Sub-Divisional Agriculture Officer (SDAO)', phone: '+91 94231 88412' },
    'Pune': { name: 'Dr. Pravin Kulkarni', designation: 'District Extension Agronomist (KVK)', phone: '+91 98224 55190' },
    'Nagpur': { name: 'Dr. Ramesh Bhende', designation: 'District Agriculture Officer', phone: '+91 94033 11874' },
    'Varanasi': { name: 'Dr. Alok Srivastava', designation: 'Deputy Director of Agriculture', phone: '+91 94501 22840' },
    'Lucknow': { name: 'Dr. Mahendra Verma', designation: 'Chief Agriculture Extension Officer', phone: '+91 94150 78210' }
  };

  const officer = officers[district] || {
    name: 'Dr. Sunil Patil',
    designation: 'Sub-Divisional Agricultural Extension Officer',
    phone: '+91 98231 54720'
  };

  return {
    alertSent: true,
    routedTo: `${officer.name} (${officer.designation})`,
    officerName: officer.name,
    designation: officer.designation,
    contact: officer.phone,
    helpline: '1551 (Kisan Call Center)',
    timestamp: new Date().toISOString(),
    recommendedAction: 'Immediate field outreach & institutional credit moratorium counseling'
  };
}

module.exports = {
  calculateDistressScore,
  getMockAlertRouting,
};
