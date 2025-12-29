import { getApiClient } from './client';
import type { 
  ApiResponse, 
  BonusCode, 
  CreateBonusCodeRequest, 
  UpdateBonusCodeRequest, 
  BonusCodeFilters, 
  DeleteResponse 
} from '../types';

export async function listBonusCodes(filters?: BonusCodeFilters): Promise<ApiResponse<BonusCode[]>> {
  const params = new URLSearchParams();
  if (filters?.player_email) params.append('player_email', filters.player_email);
  if (filters?.club_gg_id) params.append('club_gg_id', filters.club_gg_id);
  if (filters?.is_redeemed !== undefined) params.append('is_redeemed', filters.is_redeemed);
  if (filters?.club) params.append('club', filters.club);

  const queryString = params.toString();
  const url = queryString ? `/bonus-codes?${queryString}` : '/bonus-codes';
  
  const response = await getApiClient().get<ApiResponse<BonusCode[]>>(url);
  return response.data;
}

export async function getBonusCode(code: string): Promise<ApiResponse<BonusCode>> {
  const response = await getApiClient().get<ApiResponse<BonusCode>>(`/bonus-codes/${code}`);
  return response.data;
}

export async function createBonusCode(data: CreateBonusCodeRequest): Promise<ApiResponse<BonusCode>> {
  const response = await getApiClient().post<ApiResponse<BonusCode>>('/bonus-codes', data);
  return response.data;
}

export async function updateBonusCode(code: string, data: UpdateBonusCodeRequest): Promise<ApiResponse<BonusCode>> {
  const response = await getApiClient().put<ApiResponse<BonusCode>>(`/bonus-codes/${code}`, data);
  return response.data;
}

export async function deleteBonusCode(code: string): Promise<ApiResponse<DeleteResponse>> {
  const response = await getApiClient().delete<ApiResponse<DeleteResponse>>(`/bonus-codes/${code}`);
  return response.data;
}

export async function redeemBonusCode(code: string): Promise<ApiResponse<BonusCode>> {
  const response = await getApiClient().post<ApiResponse<BonusCode>>('/bonus-codes/redeem', { code });
  return response.data;
}

