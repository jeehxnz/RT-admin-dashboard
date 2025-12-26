import type { Session, User as SupabaseUser } from '@supabase/supabase-js';

// API Response Types
export interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  error?: string;
  count?: number;
}

// Supabase Auth Types
export type AuthUser = SupabaseUser;
export type AuthSession = Session;

// User Types
export interface User {
  club_gg_username: string;
  club_gg_id: string;
  email: string;
  clubs: string[];
  created_at: string;
  updated_at: string;
}

export interface UpsertUserRequest {
  club_gg_username: string;
  club_gg_id: string;
  club?: string;
  email?: string;
}

export interface UserFilters {
  email?: string;
  club_gg_username?: string;
  club_gg_id?: string;
  club?: string;
}

// Bonus Code Types
export interface BonusCode {
  id: string;
  code: string;
  bonus_type: string;
  player_email: string;
  club_gg_id: string;
  is_redeemed: boolean;
  redeemed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateBonusCodeRequest {
  code: string;
  bonus_type: string;
  player_email: string;
  club_gg_id: string;
  is_redeemed?: boolean;
}

export interface UpdateBonusCodeRequest {
  bonus_type?: string;
  player_email?: string;
  club_gg_id?: string;
  is_redeemed?: boolean;
}

export interface BonusCodeFilters {
  player_email?: string;
  club_gg_id?: string;
  is_redeemed?: string;
  club?: string;
}

// Email Types
export interface SendEmailRequest {
  to: string[];
  subject: string;
  html_body?: string;
  plain_text_body?: string;
}

export interface SendEmailResponse {
  success: boolean;
  message: string;
}

// Club Email
export interface SendClubEmailRequest {
  club: string; // e.g., "CC|AT|RT"
  subject: string;
  html_body?: string;
  plain_text_body?: string;
}

export interface SendClubEmailResponse {
  club: string;
  recipients: number;
  sent: number;
  skipped: number;
}

// Telegram
export interface SendTelegramRequest {
  club: 'CC' | 'AT' | 'RT';
  text: string;
  parse_mode?: 'MarkdownV2' | 'HTML';
  disable_web_page_preview?: boolean;
  dry_run?: boolean;
  max_per_second?: number;
  max_concurrency?: number;
}

export interface SendTelegramResponse {
  club: string;
  distinct_chat_ids: number;
  attempted: number;
  sent: number;
  failed: number;
  failures: Array<{ chat_id: string; error: string }>;
}

// Delete Response
export interface DeleteResponse {
  deleted: boolean;
  club_gg_id?: string;
  code?: string;
}

