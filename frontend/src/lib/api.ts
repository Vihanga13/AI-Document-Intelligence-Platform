import {
  ApiResponse,
  CreateProjectInput,
  HealthStatus,
  Project,
  UpdateProjectInput,
} from '@/types';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

class ApiClientError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(
    message: string,
    status: number,
    errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.errors = errors;
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const isJson = response.headers
    .get('content-type')
    ?.includes('application/json');
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    const errorMessage =
      data?.message || `Request failed with status ${response.status}`;
    throw new ApiClientError(errorMessage, response.status, data?.errors);
  }

  return data as T;
}

export const api = {
  /**
   * Health check endpoint.
   */
  async getHealth(): Promise<HealthStatus> {
    return request<HealthStatus>('/health', {
      method: 'GET',
      cache: 'no-store',
    });
  },

  /**
   * Get all projects.
   */
  async getProjects(): Promise<Project[]> {
    const res = await request<ApiResponse<Project[]>>('/projects', {
      method: 'GET',
      cache: 'no-store',
    });
    return res.data;
  },

  /**
   * Get a single project by ID.
   */
  async getProject(id: number): Promise<Project> {
    const res = await request<ApiResponse<Project>>(`/projects/${id}`, {
      method: 'GET',
      cache: 'no-store',
    });
    return res.data;
  },

  /**
   * Create a new project.
   */
  async createProject(input: CreateProjectInput): Promise<Project> {
    const res = await request<ApiResponse<Project>>('/projects', {
      method: 'POST',
      body: JSON.stringify(input),
    });
    return res.data;
  },

  /**
   * Update an existing project.
   */
  async updateProject(
    id: number,
    input: UpdateProjectInput
  ): Promise<Project> {
    const res = await request<ApiResponse<Project>>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(input),
    });
    return res.data;
  },

  /**
   * Delete a project.
   */
  async deleteProject(id: number): Promise<{ message: string }> {
    return request<{ message: string }>(`/projects/${id}`, {
      method: 'DELETE',
    });
  },
};

export { ApiClientError };
