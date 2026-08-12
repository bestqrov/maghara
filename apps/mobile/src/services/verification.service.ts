import { api } from './api';

export interface VerificationStatusResponse {
  isVerified: boolean;
  verificationStatus: 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED';
  verificationDocuments?: {
    idDocumentUrl?: string;
    residencyDocumentUrl?: string;
    rejectionReason?: string;
    submittedAt?: string;
  };
}

export async function getMyVerificationStatus() {
  const { data } = await api.get<VerificationStatusResponse>('/verification/me');
  return data;
}

export async function submitVerification(payload: { idDocumentUrl: string; residencyDocumentUrl?: string }) {
  const { data } = await api.post('/verification/submit', payload);
  return data;
}
