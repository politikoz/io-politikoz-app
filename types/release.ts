export interface ReleaseFromJailDTO {
  assetNames: string[];
}

export interface ReleaseFromJailResponse {
  success: boolean;
  message?: string;
  error?: string;
}