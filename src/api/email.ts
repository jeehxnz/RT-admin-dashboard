import { getApiClient } from './client';
import type { ApiResponse, SendEmailRequest, SendEmailResponse, SendClubEmailRequest, SendClubEmailResponse } from '../types';

export async function sendEmail(data: SendEmailRequest): Promise<ApiResponse<SendEmailResponse>> {
  const response = await getApiClient().post<ApiResponse<SendEmailResponse>>('/emails/send', data);
  return response.data;
}

export async function sendClubEmail(data: SendClubEmailRequest): Promise<ApiResponse<SendClubEmailResponse>> {
  const response = await getApiClient().post<ApiResponse<SendClubEmailResponse>>('/emails/send-club', data);
  return response.data;
}

