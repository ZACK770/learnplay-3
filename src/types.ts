/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UserProfile {
  id: string; // Matches PG id
  userId?: string; // Legacy support
  display_name: string;
  displayName?: string; // Legacy support
  email: string;
  photo_url?: string;
  photoURL?: string; // Legacy support
  total_xp: number;
  totalXP?: number; // Legacy support
  plan: string;
  is_premium: boolean;
  subscription_expiry?: string;
  billing_cycle?: string;
  created_at: string;
  createdAt?: string; // Legacy support
}

export interface LanguageItem {
  id: string;
  [key: string]: any;
}

export interface LanguageSchema {
  type: 'LANGUAGES_PAIRS_GLOSSARY' | 'GENERAL_QUIZ_TERMS' | 'GENERAL_QUIZ_SHORT' | 'SCIENCES_QUIZ_BOOLEAN' | 'GENERAL_QUIZ_CLOZE' | 'GENERAL_ORDER_CATEGORIZE' | 'LANGUAGE_LIVE_STORY' | 'LANGUAGE_SENTENCE_BUILDER';
  items: LanguageItem[];
  categories?: string[];
}

export interface LanguageDatasetContent {
  extracted_text: string;
  words_hebrew: string[];
  words_english: string[];
  sentences: string[];
  schemas: LanguageSchema[];
}

export interface GameEngine {
  gameId: string;
  type: 'match' | 'trivia' | 'sort' | 'language' | 'uav-intercept';
  name: string;
  description: string;
  thumbnail: string;
  authorId: string;
  author_id?: string;
  authorName: string;
  schema: any;
  rating: number;
  playsCount: number;
  plays_count?: number;
  createdAt: string;
}

export interface Dataset {
  datasetId: string;
  title: string;
  description: string;
  domain: string;
  content: any;
  gameType: string;
  authorId: string;
  isPublic: boolean;
  createdAt: string;
}

export interface GameSession {
  sessionId: string;
  userId: string;
  userName: string;
  gameId: string;
  gameName: string;
  datasetId: string;
  datasetTitle: string;
  domain: string;
  score: number;
  maxScore: number;
  accuracy: number;
  durationMs: number;
  completedAt: any; // Server Timestamp
  completed_at?: any;
}

export type AppState = 
  'landing' | 'lobby' | 'wizard' | 'playing' | 'reports' | 'account' | 
  'courses' | 'playrooms' | 'academy' | 'studio' | 'course-builder' | 'playroom-setup' | 'overview' | 
  'creator-dash' | 'leads' | 'prizes' | 'prize-bag' | 'knowledge' |
  'admin-dash' | 'admin-users' | 'admin-content' | 'admin-finance' |
  'pricing' | 'terms' | 'privacy' | 'refunds';
