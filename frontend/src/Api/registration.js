const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5205";

async function request(path) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`);
  } catch {
    throw new Error(
      "Cannot reach the API. Make sure the backend is running."
    );
  }

  if (!response.ok) {
    let body = null;

    try {
      body = await response.json();
    } catch {
      throw new Error(`The API returned HTTP ${response.status}.`);
    }

    if (body.errors) {
      throw new Error(
        Object.values(body.errors).flat().join(" ")
      );
    }

    throw new Error(
      body.detail ||
      body.title ||
      `The API returned HTTP ${response.status}.`
    );
  }

  return response.json();
}

export function getRegistrations({
  participantName = "",
  type = "",
  status = "",
  page = 1,
  pageSize = 10,
}) {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });

  if (participantName) {
    params.set("participantName", participantName);
  }

  if (type) params.set("type", type);
  if (status) params.set("status", status);

  return request(`/api/registrations?${params}`);
}

export function getSummary() {
  return request("/api/registrations/summary");
}