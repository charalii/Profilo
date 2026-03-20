export interface User {
  id: string;
  email: string;
  name: string | null;
  plan: string;
  created_at: string;
}

export interface Vacancy {
  id: string;
  source: string;
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
