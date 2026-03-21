import type {
  Application,
  ApplicationRecruiter,
  CandidateSearchResponse,
  CVProfile,
  GeneratedDoc,
  MatchListResponse,
  RecruiterAnalytics,
  TokenResponse,
  User,
  Vacancy,
  VacancyListResponse,
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
    const detail = (body as { detail?: unknown }).detail;
    if (typeof detail === "string") {
      throw new Error(detail);
    }
    throw new Error(`Request failed: ${res.status}`);
  }
  if (res.status === 204) {
    return undefined as T;
  }
  return res.json();
}

export const api = {
  me() {
    return request<User>("/api/auth/me");
  },

  register(name: string, email: string, password: string, role: "candidate" | "recruiter") {
    return request<TokenResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, role }),
    });
  },

  login(email: string, password: string) {
    return request<TokenResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

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
    return res.json() as Promise<CVProfile>;
  },

  getProfile() {
    return request<CVProfile>("/api/cv/profile");
  },

  updateProfile(data: Record<string, unknown>) {
    return request<CVProfile>("/api/cv/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  listVacancies(params: {
    page?: number;
    limit?: number;
    q?: string;
    location?: string;
    organization?: string;
    source?: string;
    mine?: boolean;
  }) {
    const qs = new URLSearchParams();
    if (params.page) qs.set("page", String(params.page));
    if (params.limit) qs.set("limit", String(params.limit));
    if (params.q) qs.set("q", params.q);
    if (params.location) qs.set("location", params.location);
    if (params.organization) qs.set("organization", params.organization);
    if (params.source) qs.set("source", params.source);
    if (params.mine) qs.set("mine", "true");
    const suffix = qs.toString() ? `?${qs}` : "";
    return request<VacancyListResponse>(`/api/vacancies${suffix}`);
  },

  getVacancy(id: string) {
    return request<Vacancy>(`/api/vacancies/${id}`);
  },

  createVacancy(data: {
    title: string;
    organization: string;
    location?: string | null;
    contract_type?: string | null;
    deadline?: string | null;
    description?: string | null;
    url?: string | null;
    keywords?: string[];
    salary_range?: string | null;
  }) {
    return request<Vacancy>("/api/vacancies", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateVacancy(
    id: string,
    data: Partial<{
      title: string;
      organization: string;
      location: string | null;
      contract_type: string | null;
      deadline: string | null;
      description: string | null;
      url: string | null;
      keywords: string[];
      salary_range: string | null;
      is_active: boolean;
    }>
  ) {
    return request<Vacancy>(`/api/vacancies/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  deleteVacancy(id: string) {
    return request<void>(`/api/vacancies/${id}`, { method: "DELETE" });
  },

  computeMatches() {
    return request("/api/match/compute", { method: "POST" });
  },

  getMatches(minScore = 0) {
    return request<MatchListResponse>(
      `/api/match/results?min_score=${minScore}&sort=score`
    );
  },

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

  getApplications() {
    return request<Application[]>("/api/applications");
  },

  getRecruiterApplications() {
    return request<ApplicationRecruiter[]>("/api/applications/recruiter");
  },

  createApplication(vacancyId: string, status = "interested") {
    return request<Application>("/api/applications", {
      method: "POST",
      body: JSON.stringify({ vacancy_id: vacancyId, status }),
    });
  },

  updateApplication(
    appId: string,
    data: { status?: string; notes?: string; applied_at?: string | null }
  ) {
    return request<Application>(`/api/applications/${appId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  deleteApplication(appId: string) {
    return request<void>(`/api/applications/${appId}`, { method: "DELETE" });
  },

  getRecruiterAnalytics() {
    return request<RecruiterAnalytics>("/api/analytics/recruiter");
  },

  searchCandidates(params: { q?: string; min_years?: number; page?: number }) {
    const qs = new URLSearchParams();
    if (params.q) qs.set("q", params.q);
    if (params.min_years != null) qs.set("min_years", String(params.min_years));
    if (params.page) qs.set("page", String(params.page));
    const suffix = qs.toString() ? `?${qs}` : "";
    return request<CandidateSearchResponse>(`/api/candidates/search${suffix}`);
  },

  /** Only when API has HIRESCOPE_DEV=1 */
  devToken(role: "candidate" | "recruiter") {
    return request<TokenResponse>("/api/dev/token", {
      method: "POST",
      body: JSON.stringify({ role }),
    });
  },

  runScrape(sourceId: string) {
    return request<{ source: string; listings_processed: number }>(
      `/api/dev/scrape/${sourceId}`,
      { method: "POST" }
    );
  },
};
