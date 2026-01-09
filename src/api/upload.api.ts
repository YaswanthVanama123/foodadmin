import { apiClient } from './client';

interface UploadLogoResponse {
  success: boolean;
  data: {
    logoUrl: string;
  };
}

export const uploadApi = {
  /**
   * Upload restaurant logo
   */
  uploadLogo: async (formData: FormData): Promise<UploadLogoResponse> => {
    const response = await apiClient.post<UploadLogoResponse>(
      '/upload/logo',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },
};
