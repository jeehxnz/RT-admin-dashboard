import { getApiClient } from './client';
import type { ApiResponse, SendTelegramRequest, SendTelegramResponse } from '../types';

export async function sendTelegramToClub(
  data: SendTelegramRequest
): Promise<ApiResponse<SendTelegramResponse>> {
  const response = await getApiClient().post<ApiResponse<SendTelegramResponse>>(
    '/telegram/send-club',
    data
  );
  return response.data;
}

