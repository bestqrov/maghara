import { z } from 'zod';

export const loginSchema = z.object({
  phoneNumber: z.string().min(8, 'رقم الهاتف قصير جداً'),
  password: z.string().min(1, 'يجب إدخال كلمة المرور'),
});

export const registerStep1Schema = z.object({
  phoneNumber: z.string().min(8, 'رقم الهاتف قصير جداً'),
  password: z.string().min(8, 'يجب أن تتكون من 8 أحرف على الأقل'),
});

export const registerStep2Schema = z.object({
  firstName: z.string().min(2, 'الاسم الأول قصير جداً'),
  gender: z.enum(['MALE', 'FEMALE']),
  birthDate: z.string().min(1, 'يجب تحديد تاريخ الميلاد'),
});

export const registerStep3Schema = z.object({
  residenceCountry: z.string().min(2, 'يجب تحديد بلد الإقامة'),
  currentCity: z.string().min(2, 'يجب تحديد المدينة'),
  originCountry: z.string().min(2, 'يجب تحديد بلد الأصل'),
});

export const registerStep4Schema = z.object({
  relocationPreference: z.enum(['OPEN_TO_MOVE', 'LOOKING_FOR_EXPAT', 'LOCAL_ONLY']),
  jobTitle: z.string().optional(),
  bio: z.string().max(500, 'النص طويل جداً').optional(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'يجب إدخال كلمة المرور الحالية'),
    newPassword: z.string().min(8, 'يجب أن تتكون من 8 أحرف على الأقل'),
    confirmPassword: z.string().min(1, 'يجب تأكيد كلمة المرور الجديدة'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'كلمة المرور الجديدة غير مطابقة للتأكيد',
    path: ['confirmPassword'],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type RegisterStep1Input = z.infer<typeof registerStep1Schema>;
export type RegisterStep2Input = z.infer<typeof registerStep2Schema>;
export type RegisterStep3Input = z.infer<typeof registerStep3Schema>;
export type RegisterStep4Input = z.infer<typeof registerStep4Schema>;
