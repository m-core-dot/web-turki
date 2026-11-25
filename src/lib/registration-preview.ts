export const REGISTRATION_PREVIEW_STORAGE_KEY = "mtas:registration-preview";

export type RegistrationPreview = {
  id: string;
  values: Record<string, string>;
  source: string;
  sourceOther: string;
  submittedAt: string;
  proofFile?: { name: string; size: number; type: string; dataUrl: string };
};
