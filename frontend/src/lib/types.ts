export interface User {
  id: string;
  email: string;
  name: string | null;
  plan: string;
  role: "candidate" | "recruiter";
  created_at: string;
}

export interface Vacancy {
  id: string;
  source: string;
  posted_by_user_id: string | null;
  title: string;
  organization: string;
  location: string | null;
  contract_type: string | null;
  deadline: string | null;
  description: string | null;
  url: string;
  keywords: string[];
  salary_range: string | null;
  is_active: boolean;
  scraped_at: string;
}

export interface VacancyListResponse {
  items: Vacancy[];
  total: number;
  page: number;
  limit: number;
}

export interface MatchResult {
  id: string;
  vacancy: Vacancy;
  match_score: number;
  matched_keywords: string[];
  missing_keywords: string[];
  created_at: string;
}

export interface MatchListResponse {
  items: MatchResult[];
  total: number;
}

export interface Application {
  id: string;
  vacancy: Vacancy;
  status: string;
  applied_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApplicationRecruiter extends Application {
  candidate_user_id: string;
  candidate_name: string | null;
  candidate_email: string;
}

export interface GeneratedDoc {
  id: string;
  vacancy_id: string;
  doc_type: string;
  content: string;
  model_used: string | null;
  created_at: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface RecruiterAnalytics {
  open_jobs: number;
  total_applications: number;
  by_status: Record<string, number>;
  applications_last_7_days: number;
}

export interface CandidateSearchItem {
  user_id: string;
  name: string | null;
  email: string;
  cv_profile_id: string;
  years_experience: number;
  education_level: string | null;
  keywords: string[];
  updated_at: string;
}

export interface CandidateSearchResponse {
  items: CandidateSearchItem[];
  total: number;
}

export interface CVProfile {
  id: string;
  raw_text: string;
  file_url: string | null;
  file_name: string | null;
  has_legal: boolean;
  has_defence: boolean;
  has_procurement: boolean;
  has_policy: boolean;
  has_eu: boolean;
  has_international: boolean;
  years_experience: number;
  education_level: string | null;
  has_cast: boolean;
  has_epso: boolean;
  language_count: number;
  has_c2: boolean;
  keywords: string[];
  created_at: string;
}
