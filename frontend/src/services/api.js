const API_BASE_URL = 'http://localhost:8000/api/v1';

export async function uploadPrescription(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/prescriptions/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Prescription upload failed');
  }

  return await response.json();
}

export async function uploadBloodReport(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/blood-reports/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Blood report upload failed');
  }

  return await response.json();
}
export async function fetchPrescriptions() {
  const response = await fetch(`${API_BASE_URL}/prescriptions/`);
  if (!response.ok) {
    throw new Error('Failed to fetch prescriptions from backend');
  }
  return await response.json();
}
export async function fetchBloodReports() {
  const response = await fetch(`${API_BASE_URL}/blood-reports/`);
  if (!response.ok) {
    throw new Error('Failed to fetch blood reports from backend');
  }
  return await response.json();
}
