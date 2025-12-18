import { getApiClient } from './client';
import type { ApiResponse, SendEmailRequest, SendEmailResponse, SendClubEmailRequest, SendClubEmailResponse } from '../types';

export async function sendEmail(data: SendEmailRequest): Promise<ApiResponse<SendEmailResponse>> {
  const response = await getApiClient().post<ApiResponse<SendEmailResponse>>('/v1/emails/send', data);
  return response.data;
}

export async function sendClubEmail(data: SendClubEmailRequest): Promise<ApiResponse<SendClubEmailResponse>> {
  const response = await getApiClient().post<ApiResponse<SendClubEmailResponse>>('/v1/emails/send-club', data);
  return response.data;
}

