/**
 * API service for communicating with ES ETHNIC STYLES FastAPI backend.
 */

const API_BASE = '/api/v1';

export async function fetchHealthStatus() {
  try {
    const response = await fetch(`${API_BASE}/health`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        ok: false,
        status: response.status,
        error: errorData.message || 'Service temporarily degraded',
      };
    }

    const data = await response.json();
    return {
      ok: true,
      data,
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      error: 'Backend API is currently unreachable. Start backend server at http://127.0.0.1:8000.',
    };
  }
}
