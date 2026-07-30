def evaluate_biomarker(name: str, value: float, unit: str) -> dict:
    norm_name = name.lower().strip()
    status = "NORMAL"
    ref_min = None
    ref_max = None
    tip = "Your level is within the standard reference range."
    is_hemoglobin = ("hemoglobin" in norm_name or "haemoglobin" in norm_name or norm_name in ["hgb", "hb"]) and not any(x in norm_name for x in ["mch", "mchc", "concentration", "mean corpuscular"])
    if is_hemoglobin:
        name = "Hemoglobin"
        ref_min = 12.0
        ref_max = 17.5
        if value < 7.0:
            status = "CRITICAL"
            tip = "Your Hemoglobin is critically low (< 7.0 g/dL), indicating severe anemia. Please seek medical attention immediately."
        elif value > 20.0:
            status = "CRITICAL"
            tip = "Your Hemoglobin is critically high (> 20.0 g/dL). Please consult a doctor to evaluate potential causes."
        elif value < 12.0:
            status = "ABNORMAL"
            tip = "Your Hemoglobin is low. Consider incorporating iron-rich foods (such as spinach, lentils, or red meat) into your diet."
        elif value > 17.5:
            status = "ABNORMAL"
            tip = "Your Hemoglobin is slightly elevated. Ensure you stay well hydrated and discuss with your physician."
# Fasting Blood Glucose / Blood Sugar
    elif "glucose" in norm_name or "sugar" in norm_name:
        name = "Fasting Blood Glucose / Blood Sugar"
        ref_min = 70.0
        ref_max = 100.0
        if value < 50.0:
            status = "CRITICAL"
            tip = "Your blood sugar level is critically low. Consume fast-acting sugar (fruit juice, candy) immediately and seek emergency medical care."
        elif value >= 126.0:
            status = "CRITICAL"
            tip = "Your blood sugar is critically high (>= 126 mg/dL), which is in the diabetic range. Please consult your physician immediately."
        elif value > 100.0:
            status = "ABNORMAL"
            tip = "Your blood sugar level is elevated (prediabetes range). Focus on low-glycemic foods, exercise regularly, and limit refined sugars."
        elif value < 70.0:
            status = "ABNORMAL"
            tip = "Your blood sugar level is low. Keep a source of quick-acting carbohydrates nearby and monitor your levels."
# Cholesterol
    elif "cholesterol" in norm_name:
        name = "Cholesterol"
        ref_min = 0.0
        ref_max = 200.0
        if value >= 240.0:
            status = "CRITICAL"
            tip = "Your cholesterol level is critically high (>= 240 mg/dL), increasing cardiovascular risk. Contact a doctor to discuss management."
        elif value >= 200.0:
            status = "ABNORMAL"
            tip = "Your cholesterol is borderline high. Focus on heart-healthy fats (olive oil, fish, oats, nuts) and limit saturated/trans fats."
# Creatinine
    elif "creatinine" in norm_name:
        name = "Creatinine"
        ref_min = 0.6
        ref_max = 1.2
        if value > 2.0:
            status = "CRITICAL"
            tip = "Your creatinine level is critically high, indicating potential kidney distress. Seek immediate follow-up with your doctor."
        elif value > 1.2:
            status = "ABNORMAL"
            tip = "Your creatinine level is slightly elevated. Ensure proper hydration and consult a physician to check your kidney function."
        elif value < 0.6:
            status = "ABNORMAL"
            tip = "Your creatinine level is low, which can occur due to lower muscle mass. Maintain a healthy balanced diet."
# WBC Count
    elif "wbc" in norm_name or "white blood cell" in norm_name or "leukocyte" in norm_name or "leucocyte" in norm_name:
        name = "WBC Count"

        is_thousands = value < 100.0  # if value is less than 100, it is measured in thousands
        if is_thousands:
            ref_min = 4.0
            ref_max = 11.0
            crit_low = 2.0
            crit_high = 30.0
        else: # else it isabsolute cells
            ref_min = 4000.0
            ref_max = 11000.0
            crit_low = 2000.0
            crit_high = 30000.0
            
        if value < crit_low:
            status = "CRITICAL"
            tip = "Your White Blood Cell count is critically low, indicating a compromised immune system. Avoid exposure to infections and contact a doctor."
        elif value > crit_high:
            status = "CRITICAL"
            tip = "Your White Blood Cell count is critically high, suggesting a severe infection or inflammation. Contact a physician immediately."
        elif value < ref_min:
            status = "ABNORMAL"
            tip = "Your White Blood Cell count is slightly low. This may indicate a temporary immune response. Consult a doctor for confirmation."
        elif value > ref_max:
            status = "ABNORMAL"
            tip = "Your White Blood Cell count is elevated, indicating your body may be fighting an active infection or inflammation."       
    else:
        name = name.title()
# Return the evaluated biomarker
    return {
        "name": name,
        "value": value,
        "unit": unit,
        "reference_range_min": ref_min,
        "reference_range_max": ref_max,
        "status": status,
        "educational_tip": tip
    }
