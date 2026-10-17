import { api } from './api';

export interface VerificationStatusResponse {
  isVerified: boolean;
  verificationStatus: 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED';
  verificationDocuments?: {
    rejectionReason?: string;
    submittedAt?: string;
  };
}

export async function getMyVerificationStatus() {
  const { data } = await api.get<VerificationStatusResponse>('/verification/me');
  return data;
}

export type IdentityDocumentType = 'ID_CARD' | 'PASSPORT';

export async function submitVerification(payload: {
  documentType: IdentityDocumentType;
  idDocumentUrl: string;
  selfieUrl: string;
  residencyDocumentUrl?: string;
}) {
  const { data } = await api.post('/verification/submit', payload);
  return data;
}

