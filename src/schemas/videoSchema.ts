import { z } from 'zod';

export const videoMetadataSchema = z.object({
  name: z.string().min(1, 'İsim alanı zorunludur').max(50, 'İsim en fazla 50 karakter olabilir'),
  description: z.string().max(500, 'Açıklama en fazla 500 karakter olabilir').optional(),
  startTime: z.number().min(0, 'Başlangıç zamanı 0 veya daha büyük olmalıdır'),
  endTime: z.number().min(0, 'Bitiş zamanı 0 veya daha büyük olmalıdır'),
});

export const validateVideoMetadata = (data: {
  name: string;
  description: string;
  startTime: number;
  endTime: number;
}) => {
  try {
    return {
      success: true,
      data: videoMetadataSchema.parse(data),
      error: null
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Hata mesajlarını birleştir
      const errorMessage = error.errors.map(e => e.message).join('\n');
      return {
        success: false,
        data: null,
        error: errorMessage
      };
    }
    return {
      success: false,
      data: null,
      error: 'Bilinmeyen bir hata oluştu'
    };
  }
}; 