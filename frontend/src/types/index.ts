export type ProjectStatus = 'pending' | 'processing' | 'ready' | 'failed';

export interface Project {
  id: number;
  name: string;
  description: string | null;
  repository_name: string | null;
  status: ProjectStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateProjectInput {
  name: string;
  description?: string;
  repository_name?: string;
  status?: ProjectStatus;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
  repository_name?: string;
  status?: ProjectStatus;
}

export interface HealthStatus {
  status: string;
  message: string;
  database?: string;
  timestamp?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
