import type {
  Application,
  GeneratedDoc,
  MatchListResponse,
  TokenResponse,
} from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return headers;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: getHeaders(),
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Auth
  register(name: string, email: string, password: string) {
    return request<TokenResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
  },

  login(email: string, password: string) {
    return request<TokenResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  // CV
  async uploadCV(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    const headers: Record<string, string> = {};
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) headers["Authorization"] = `Bearer ${token}`;
    }
    const res = await fetch(`${API_BASE}/api/cv/upload`, {
      method: "POST",
      headers,
      body: formData,
    });
    if (!res.ok) throw new Error("Upload failed");
    return res.json();
  },

  getProfile() {
    return request("/api/cv/profile");
  },

  // Matching
  computeMatches() {
    return request("/api/match/compute", { method: "POST" });
  },

  getMatches(minScore = 0) {
    return request<MatchListResponse>(
      `/api/match/results?min_score=${minScore}&sort=score`
    );
  },

  // Generation
  generateCoverLetter(vacancyId: string) {
    return request<GeneratedDoc>("/api/generate/cover-letter", {
      method: "POST",
      body: JSON.stringify({ vacancy_id: vacancyId }),
    });
  },

  generateCVOptimization(vacancyId: string) {
    return request<GeneratedDoc>("/api/generate/cv-optimization", {
      method: "POST",
      body: JSON.stringify({ vacancy_id: vacancyId }),
    });
  },

  // Applications
  getApplications() {
    return request<Application[]>("/api/applications");
  },

  createApplication(vacancyId: string, status = "interested") {
    return request<Application>("/api/applications", {
      method: "POST",
      body: JSON.stringify({ vacancy_id: vacancyId, status }),
    });
  },

  updateApplication(appId: string, data: { status?: string; notes?: string }) {
    return request<Application>(`/api/applications/${appId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  deleteApplication(appId: string) {
    return request(`/api/applications/${appId}`, { method: "DELETE" });
  },
};
