export enum PostType {
  ARTICLE = 'article',
  TEXT = 'text',
  DIARY = 'diary',
}

export interface User {
  id: string;
  username: string;
  avatar_url: string;
  is_owner: boolean; // Determines if user sees private content/edit controls
}

export interface Comment {
  id: number;
  user: User;
  body: string;
  created_at: string;
}

export interface Post {
  id: number;
  title: string | null;
  body: string;
  created_at: string;
  type: PostType;
  tags: string[];
  user: User;
  comments_count: number;
  is_locked?: boolean; // For diaries viewed by non-owners
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}
