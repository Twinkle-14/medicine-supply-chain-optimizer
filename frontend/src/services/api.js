const API_URL = "https://medicine-supply-chain-optimizer-production.up.railway.app";

export default API_URL;
function authHeaders() {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// =====================
// Hospitals
// =====================

export async function getHospitals() {
  const response = await fetch(`${API_URL}/hospitals/`, {
    headers: authHeaders(),
  });

  return response.json();
}

export async function createHospital(hospital) {
  const response = await fetch(`${API_URL}/hospitals/`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(hospital),
  });

  return response.json();
}

export async function updateHospital(id, hospital) {
  const response = await fetch(`${API_URL}/hospitals/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(hospital),
  });

  return response.json();
}

export async function deleteHospital(id) {
  const response = await fetch(`${API_URL}/hospitals/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to delete hospital");
  }

  return data;
}

// =====================
// Medicines
// =====================

export async function getMedicines() {
  const response = await fetch(`${API_URL}/medicines/`, {
    headers: authHeaders(),
  });

  return response.json();
}

export async function createMedicine(medicine) {
  const response = await fetch(`${API_URL}/medicines/`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(medicine),
  });

  return response.json();
}

export async function updateMedicine(id, medicine) {
  const response = await fetch(`${API_URL}/medicines/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(medicine),
  });

  return response.json();
}

export async function deleteMedicine(id) {
  const response = await fetch(`${API_URL}/medicines/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to delete medicine");
  }

  return data;
}

// =====================
// Inventory
// =====================

export async function getInventory() {
  const response = await fetch(`${API_URL}/inventory/`, {
    headers: authHeaders(),
  });

  return response.json();
}

export async function createInventory(item) {
  const response = await fetch(`${API_URL}/inventory/`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(item),
  });

  return response.json();
}

export async function updateInventory(id, item) {
  const response = await fetch(`${API_URL}/inventory/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(item),
  });

  return response.json();
}

export async function deleteInventory(id) {
  const response = await fetch(`${API_URL}/inventory/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to delete inventory");
  }

  return data;
}

// =====================
// AI Predictions
// =====================

export async function getPredictions() {
  const response = await fetch(`${API_URL}/ai/predictions`, {
    headers: authHeaders(),
  });

  return response.json();
}

export async function getAIPredictions() {
  const response = await fetch(`${API_URL}/ai/predictions`, {
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch AI predictions");
  }

  return await response.json();
}
// =====================
// Transfers
// =====================

export async function getTransfers() {
  const response = await fetch(`${API_URL}/transfers/`, {
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch transfers");
  }

  return await response.json();
}

export async function executeTransfer(transfer) {
  const response = await fetch(`${API_URL}/transfers/`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(transfer),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Transfer failed");
  }

  return data;
}
export async function deleteTransfer(id) {
  const response = await fetch(
    `${API_URL}/transfers/${id}`,
    {
      method: "DELETE",
      headers: authHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to delete transfer");
  }

  return data;
}
