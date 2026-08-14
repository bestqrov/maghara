import { z } from 'zod';

export const loginSchema = z.object({
  phoneNumber: z.string().min(8, 'رقم الهاتف قصير بزاف'),
  password: z.string().min(1, 'خاصك تكتب الپاسوورد'),
});

export const registerStep1Schema = z.object({
  phoneNumber: z.string().min(8, 'رقم الهاتف قصير بزاف'),
  password: z.string().min(8, 'خاصو يكون 8 حروف على الأقل'),
});

export const registerStep2Schema = z.object({
  firstName: z.string().min(2, 'السمية قصيرة بزاف'),
  gender: z.enum(['MALE', 'FEMALE']),
  birthDate: z.string().min(1, 'خاصك تحدد تاريخ الميلاد'),
});

export const registerStep3Schema = z.object({
  residenceCountry: z.string().min(2, 'خاصك تحدد بلد الإقامة'),
  currentCity: z.string().min(2, 'خاصك تحدد المدينة'),
  originCountry: z.string().min(2, 'خاصك تحدد بلد الأصل'),
});

export const registerStep4Schema = z.object({
  relocationPreference: z.enum(['OPEN_TO_MOVE', 'LOOKING_FOR_EXPAT', 'LOCAL_ONLY']),
  jobTitle: z.string().optional(),
  bio: z.string().max(500, 'النص طويل بزاف').optional(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'خاصك تكتب الپاسوورد الحالي'),
    newPassword: z.string().min(8, 'خاصو يكون 8 حروف على الأقل'),
    confirmPassword: z.string().min(1, 'أكد الپاسوورد الجديد'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'الپاسوورد الجديد ماشي متطابق مع التأكيد',
    path: ['confirmPassword'],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type RegisterStep1Input = z.infer<typeof registerStep1Schema>;
export type RegisterStep2Input = z.infer<typeof registerStep2Schema>;
export type RegisterStep3Input = z.infer<typeof registerStep3Schema>;
export type RegisterStep4Input = z.infer<typeof registerStep4Schema>;
