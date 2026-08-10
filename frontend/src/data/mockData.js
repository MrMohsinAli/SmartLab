export const patientInfo = {
  name: "mohsin",
  id: "#PT-84920",
  role: "Patient",
  status: "Active"
};

export const dietTips = [
  "Include iron-rich spinach and citrus fruits to boost hemoglobin absorption & natural energy.",
  "Stay well-hydrated with 8-10 glasses of water daily to support kidney filtration and creatinine balance.",
  "Incorporate fiber-rich oats, chia seeds, and healthy fats to maintain optimal cholesterol levels.",
  "Pair complex carbohydrates with lean proteins to prevent sudden blood glucose spikes.",
  "Eat zinc and vitamin C rich foods (citrus, seeds, bell peppers) to strengthen immune WBC response."
];

export const mockPrescriptions = [
  { id: 1, drugName: 'Paracetamol', dosage: '500mg', interval: 'Every 8 hours', duration: '7 days', doctor: 'Dr. Saad Shahzad' },
  { id: 2, drugName: 'Ibuprofen', dosage: '400mg', interval: 'Twice daily (after meals)', duration: '5 days', doctor: 'Dr. Umair Dawood' },
  { id: 3, drugName: 'Aspirin', dosage: '20mg', interval: 'Once daily (at bedtime)', duration: '30 days', doctor: 'Dr. Usman Danish' },
];

export const mockBiomarkers = [
  { id: 1, name: 'Hemoglobin', value: '14.2 g/dL', range: '12.0 - 17.5 g/dL', status: 'NORMAL', tip: 'Your level is within the standard reference range.' },
  { id: 2, name: 'Fasting Blood Glucose / Blood Sugar', value: '110.0 mg/dL', range: '70.0 - 100.0 mg/dL', status: 'ABNORMAL', tip: 'Your blood sugar level is elevated (prediabetes range). Focus on low-glycemic foods.' },
  { id: 3, name: 'Cholesterol', value: '245.0 mg/dL', range: '0.0 - 200.0 mg/dL', status: 'CRITICAL', tip: 'Your cholesterol level is critically high (>= 240 mg/dL), increasing cardiovascular risk.' },
  { id: 4, name: 'Creatinine', value: '0.9 mg/dL', range: '0.6 - 1.2 mg/dL', status: 'NORMAL', tip: 'Your level is within the standard reference range.' },
  { id: 5, name: 'WBC Count', value: '12.5 x10³/µL', range: '4.0 - 11.0 x10³/µL', status: 'ABNORMAL', tip: 'Your White Blood Cell count is elevated, indicating an active infection response.' },
];
