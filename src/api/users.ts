import { getApiClient } from './client';
import type { ApiResponse, User, UpsertUserRequest, UserFilters, DeleteResponse } from '../types';

export async function listUsers(filters?: UserFilters): Promise<ApiResponse<User[]>> {
  const params = new URLSearchParams();
  if (filters?.email) params.append('email', filters.email);
  if (filters?.club_gg_username) params.append('club_gg_username', filters.club_gg_username);
  if (filters?.club_gg_id) params.append('club_gg_id', filters.club_gg_id);
  if (filters?.club) params.append('club', filters.club);

  const queryString = params.toString();
  const url = queryString ? `/users?${queryString}` : '/users';
  
  const response = await getApiClient().get<ApiResponse<User[]>>(url);
  return response.data;
}

export async function upsertUser(data: UpsertUserRequest): Promise<ApiResponse<User>> {
  const response = await getApiClient().post<ApiResponse<User>>('/users.upsert', data);
  return response.data;
}

export async function deleteUser(clubGgId: string): Promise<ApiResponse<DeleteResponse>> {
  const response = await getApiClient().delete<ApiResponse<DeleteResponse>>(`/users/${clubGgId}`);
  return response.data;
}

