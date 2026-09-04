export type AdminLocale = 'ar' | 'en';

export interface AdminDictionary {
  common: {
    loading: string;
    save: string;
    cancel: string;
    ok: string;
    yes: string;
    no: string;
  };
  login: {
    title: string;
    subtitle: string;
    passwordLabel: string;
    submit: string;
    errorInvalid: string;
    errorGeneric: string;
  };
  dashboard: {
    title: string;
    logout: string;
    tabAnalytics: string;
    tabVerifications: string;
    tabPayments: string;
    tabPaymentSettings: string;
    tabPromos: string;
    tabReferrals: string;
    tabSignupCampaign: string;
    tabSettings: string;
  };
  signupCampaign: {
    intro: string;
    errorFetch: string;
    errorSave: string;
    success: string;
    save: string;
    activeLabel: string;
    startsAtLabel: string;
    endsAtLabel: string;
    vipDaysLabel: string;
    statusRunning: string;
    statusScheduled: string;
    statusEnded: string;
    statusOff: string;
  };
  verifications: {
    errorFetch: string;
    errorApprove: string;
    errorReject: string;
    empty: string;
    idDocument: string;
    residencyDocument: string;
    rejectReasonLabel: string;
    confirmReject: string;
    cancel: string;
    approve: string;
    reject: string;
  };
  payments: {
    errorFetch: string;
    errorReview: string;
    empty: string;
    unknownUser: string;
    typeLabel: string;
    methodLabel: string;
    referenceLabel: string;
    approve: string;
    reject: string;
    types: { COIN_PURCHASE: string; VIP_SUBSCRIPTION: string; VERIFICATION_FEE: string };
    methods: {
      CRYPTO_TRC20: string;
      CRYPTO_POLYGON: string;
      CRYPTO_SOLANA: string;
      BANK_TRANSFER: string;
      CASH_PLUS: string;
      INTERNATIONAL_WIRE: string;
    };
  };
  promos: {
    errorFetch: string;
    errorCreate: string;
    createTitle: string;
    codeLabel: string;
    typeLabel: string;
    rewardValueLabel: string;
    maxRedemptionsLabel: string;
    expiresAtLabel: string;
    requiresVerificationLabel: string;
    activeLabel: string;
    submit: string;
    tableCode: string;
    tableType: string;
    tableValue: string;
    tableUsage: string;
    tableVerification: string;
    tableStatus: string;
    statusActive: string;
    statusInactive: string;
    empty: string;
    types: { VIP_DAYS: string; COINS: string; CROSS_BORDER_ACCESS: string };
  };
  referrals: {
    errorFetch: string;
    columnMember: string;
    columnCode: string;
    columnTotal: string;
    columnVerified: string;
    columnBalance: string;
    empty: string;
  };
  settings: {
    title: string;
    currentPasswordLabel: string;
    newPasswordLabel: string;
    confirmPasswordLabel: string;
    save: string;
    errorMinLength: string;
    errorMismatch: string;
    errorWrongPassword: string;
    errorGeneric: string;
    successTitle: string;
    successSubtitle: string;
    successOk: string;
  };
  paymentSettings: {
    intro: string;
    errorFetch: string;
    errorSave: string;
    success: string;
    save: string;
    cryptoTitle: string;
    bankTitle: string;
    cashPlusTitle: string;
    wireTitle: string;
    wireSubtitle: string;
    bankNameLabel: string;
    accountHolderLabel: string;
    ribLabel: string;
    cashPlusCodeLabel: string;
    ibanLabel: string;
    swiftLabel: string;
    bankAddressLabel: string;
  };
  analytics: {
    errorFetch: string;
    totalRevenue: string;
    thisMonthRevenue: string;
    monthlyRevenueTitle: string;
    revenueByType: string;
    pendingTitle: string;
    pendingVerifications: string;
    pendingPayments: string;
    activePromos: string;
    totalUsers: string;
    verifiedUsers: string;
    vipUsers: string;
    newUsersThisMonth: string;
  };
  months: string[];
}

const ar: AdminDictionary = {
  common: { loading: 'جارٍ التحميل...', save: 'حفظ', cancel: 'إلغاء', ok: 'حسناً', yes: 'نعم', no: 'لا' },
  login: {
    title: 'لوحة تحكم المشرف',
    subtitle: 'أدخل كلمة المرور للمتابعة',
    passwordLabel: 'كلمة المرور',
    submit: 'دخول',
    errorInvalid: 'كلمة المرور غير صحيحة',
    errorGeneric: 'تعذّر الاتصال بالخادم، حاول مرة أخرى',
  },
  dashboard: {
    title: 'لوحة تحكم المشرف',
    logout: 'خروج',
    tabAnalytics: 'التحليلات',
    tabVerifications: 'طلبات التوثيق',
    tabPayments: 'المدفوعات',
    tabPaymentSettings: 'حسابات الاستلام',
    tabPromos: 'الأكواد الترويجية',
    tabReferrals: 'الإحالات',
    tabSignupCampaign: 'حملة التسجيل',
    tabSettings: 'الإعدادات',
  },
  signupCampaign: {
    intro: 'ملي تكون هاد الحملة فعّالة، كل عضو جديد يسجل خلال الفترة المحددة يربح اشتراك VIP مجاني تلقائياً بلا ما يدخل أي كود.',
    errorFetch: 'تعذّر جلب إعدادات الحملة',
    errorSave: 'تعذّر حفظ إعدادات الحملة',
    success: 'تم حفظ إعدادات الحملة بنجاح',
    save: 'حفظ الحملة',
    activeLabel: 'الحملة فعّالة',
    startsAtLabel: 'تاريخ ووقت البداية',
    endsAtLabel: 'تاريخ ووقت النهاية',
    vipDaysLabel: 'عدد أيام VIP الممنوحة',
    statusRunning: 'جارية الآن 🟢',
    statusScheduled: 'مجدولة، لم تبدأ بعد ⏳',
    statusEnded: 'انتهت ⏹️',
    statusOff: 'موقوفة',
  },
  verifications: {
    errorFetch: 'تعذّر جلب طلبات التوثيق',
    errorApprove: 'تعذّرت الموافقة على الطلب',
    errorReject: 'تعذّر رفض الطلب',
    empty: 'لا توجد طلبات توثيق قيد الانتظار',
    idDocument: 'وثيقة الهوية',
    residencyDocument: 'وثيقة الإقامة',
    rejectReasonLabel: 'سبب الرفض (اختياري)',
    confirmReject: 'تأكيد الرفض',
    cancel: 'إلغاء',
    approve: 'موافقة',
    reject: 'رفض',
  },
  payments: {
    errorFetch: 'تعذّر جلب المعاملات',
    errorReview: 'تعذّرت مراجعة المعاملة',
    empty: 'لا توجد معاملات قيد الانتظار',
    unknownUser: 'مستخدم',
    typeLabel: 'النوع',
    methodLabel: 'الطريقة',
    referenceLabel: 'المرجع',
    approve: 'موافقة',
    reject: 'رفض',
    types: { COIN_PURCHASE: 'شحن نقاط', VIP_SUBSCRIPTION: 'اشتراك VIP', VERIFICATION_FEE: 'رسوم توثيق' },
    methods: {
      CRYPTO_TRC20: 'USDT (TRC20)',
      CRYPTO_POLYGON: 'USDT (Polygon)',
      CRYPTO_SOLANA: 'USDT (Solana)',
      BANK_TRANSFER: 'تحويل بنكي',
      CASH_PLUS: 'Cash Plus',
      INTERNATIONAL_WIRE: 'حوالة دولية',
    },
  },
  promos: {
    errorFetch: 'تعذّر جلب الأكواد الترويجية',
    errorCreate: 'تعذّر إنشاء الكود',
    createTitle: 'إنشاء كود ترويجي جديد',
    codeLabel: 'الكود',
    typeLabel: 'النوع',
    rewardValueLabel: 'قيمة المكافأة',
    maxRedemptionsLabel: 'الحد الأقصى للاستخدام',
    expiresAtLabel: 'تاريخ الانتهاء (اختياري)',
    requiresVerificationLabel: 'يتطلب توثيق الحساب',
    activeLabel: 'فعّال',
    submit: 'إنشاء الكود',
    tableCode: 'الكود',
    tableType: 'النوع',
    tableValue: 'القيمة',
    tableUsage: 'الاستخدام',
    tableVerification: 'توثيق',
    tableStatus: 'الحالة',
    statusActive: 'فعّال',
    statusInactive: 'موقوف',
    empty: 'لا توجد أكواد ترويجية بعد',
    types: { VIP_DAYS: 'أيام VIP', COINS: 'نقاط', CROSS_BORDER_ACCESS: 'الزواج الدولي' },
  },
  referrals: {
    errorFetch: 'تعذّر جلب بيانات الإحالات',
    columnMember: 'العضو',
    columnCode: 'رمز الإحالة',
    columnTotal: 'إجمالي المُحالين',
    columnVerified: 'الموثّقون منهم',
    columnBalance: 'رصيد النقاط',
    empty: 'لا توجد إحالات بعد',
  },
  settings: {
    title: 'تغيير كلمة مرور المشرف',
    currentPasswordLabel: 'كلمة المرور الحالية',
    newPasswordLabel: 'كلمة المرور الجديدة',
    confirmPasswordLabel: 'تأكيد كلمة المرور الجديدة',
    save: 'حفظ كلمة المرور',
    errorMinLength: 'يجب أن تتكون كلمة المرور الجديدة من 8 أحرف على الأقل',
    errorMismatch: 'كلمة المرور الجديدة غير مطابقة للتأكيد',
    errorWrongPassword: 'كلمة المرور الحالية غير صحيحة',
    errorGeneric: 'تعذّر تغيير كلمة المرور، حاول مرة أخرى',
    successTitle: 'تم تغيير كلمة المرور بنجاح',
    successSubtitle: 'استعمل كلمة المرور الجديدة في المرة القادمة اللي تدخل فيها.',
    successOk: 'حسناً',
  },
  paymentSettings: {
    intro:
      'هاد الحسابات هي اللي كتبان للأعضاء ملي يبغيو يشحنو نقاط أو يشتركو فـ VIP. خلي أي حقل فارغ باش تخفي الطريقة ديالو من المستخدمين.',
    errorFetch: 'تعذّر جلب إعدادات الدفع',
    errorSave: 'تعذّر حفظ إعدادات الدفع',
    success: 'تم حفظ إعدادات الدفع بنجاح',
    save: 'حفظ الإعدادات',
    cryptoTitle: 'محافظ العملات الرقمية (USDT)',
    bankTitle: 'تحويل بنكي محلي',
    cashPlusTitle: 'Cash Plus',
    wireTitle: 'حوالة دولية (IBAN / SWIFT)',
    wireSubtitle: 'لأعضاء الجالية اللي بغاو يحولو من برا المغرب.',
    bankNameLabel: 'اسم البنك',
    accountHolderLabel: 'صاحب الحساب',
    ribLabel: 'RIB',
    cashPlusCodeLabel: 'الرمز / الرقم',
    ibanLabel: 'IBAN',
    swiftLabel: 'SWIFT / BIC',
    bankAddressLabel: 'عنوان البنك (اختياري)',
  },
  analytics: {
    errorFetch: 'تعذّر جلب التحليلات',
    totalRevenue: 'الإيراد الكلي',
    thisMonthRevenue: 'الإيراد هذا الشهر',
    monthlyRevenueTitle: 'الإيراد الشهري (آخر 6 أشهر)',
    revenueByType: 'الإيراد حسب النوع',
    pendingTitle: 'قيد الانتظار',
    pendingVerifications: 'طلبات توثيق',
    pendingPayments: 'معاملات دفع',
    activePromos: 'أكواد ترويجية فعّالة',
    totalUsers: 'إجمالي الأعضاء',
    verifiedUsers: 'أعضاء موثّقون',
    vipUsers: 'مشتركو VIP',
    newUsersThisMonth: 'أعضاء جدد هذا الشهر',
  },
  months: ['يناير', 'فبراير', 'مارس', 'أبريل', 'ماي', 'يونيو', 'يوليوز', 'غشت', 'شتنبر', 'أكتوبر', 'نونبر', 'دجنبر'],
};

const en: AdminDictionary = {
  common: { loading: 'Loading...', save: 'Save', cancel: 'Cancel', ok: 'OK', yes: 'Yes', no: 'No' },
  login: {
    title: 'Admin Dashboard',
    subtitle: 'Enter the password to continue',
    passwordLabel: 'Password',
    submit: 'Sign in',
    errorInvalid: 'Incorrect password',
    errorGeneric: 'Could not reach the server, try again',
  },
  dashboard: {
    title: 'Admin Dashboard',
    logout: 'Log out',
    tabAnalytics: 'Analytics',
    tabVerifications: 'Verification requests',
    tabPayments: 'Payments',
    tabPaymentSettings: 'Payout accounts',
    tabPromos: 'Promo codes',
    tabReferrals: 'Referrals',
    tabSignupCampaign: 'Signup campaign',
    tabSettings: 'Settings',
  },
  signupCampaign: {
    intro:
      'While this campaign is active, every new member who signs up within the window gets free VIP automatically, with no code needed.',
    errorFetch: 'Could not fetch the campaign settings',
    errorSave: 'Could not save the campaign settings',
    success: 'Campaign settings saved successfully',
    save: 'Save campaign',
    activeLabel: 'Campaign active',
    startsAtLabel: 'Start date and time',
    endsAtLabel: 'End date and time',
    vipDaysLabel: 'VIP days granted',
    statusRunning: 'Running now 🟢',
    statusScheduled: "Scheduled, hasn't started yet ⏳",
    statusEnded: 'Ended ⏹️',
    statusOff: 'Off',
  },
  verifications: {
    errorFetch: 'Could not fetch verification requests',
    errorApprove: 'Could not approve the request',
    errorReject: 'Could not reject the request',
    empty: 'No pending verification requests',
    idDocument: 'ID document',
    residencyDocument: 'Residency document',
    rejectReasonLabel: 'Rejection reason (optional)',
    confirmReject: 'Confirm rejection',
    cancel: 'Cancel',
    approve: 'Approve',
    reject: 'Reject',
  },
  payments: {
    errorFetch: 'Could not fetch transactions',
    errorReview: 'Could not review the transaction',
    empty: 'No pending transactions',
    unknownUser: 'User',
    typeLabel: 'Type',
    methodLabel: 'Method',
    referenceLabel: 'Reference',
    approve: 'Approve',
    reject: 'Reject',
    types: { COIN_PURCHASE: 'Coin purchase', VIP_SUBSCRIPTION: 'VIP subscription', VERIFICATION_FEE: 'Verification fee' },
    methods: {
      CRYPTO_TRC20: 'USDT (TRC20)',
      CRYPTO_POLYGON: 'USDT (Polygon)',
      CRYPTO_SOLANA: 'USDT (Solana)',
      BANK_TRANSFER: 'Bank transfer',
      CASH_PLUS: 'Cash Plus',
      INTERNATIONAL_WIRE: 'International wire',
    },
  },
  promos: {
    errorFetch: 'Could not fetch promo codes',
    errorCreate: 'Could not create the code',
    createTitle: 'Create a new promo code',
    codeLabel: 'Code',
    typeLabel: 'Type',
    rewardValueLabel: 'Reward value',
    maxRedemptionsLabel: 'Max redemptions',
    expiresAtLabel: 'Expiry date (optional)',
    requiresVerificationLabel: 'Requires verified account',
    activeLabel: 'Active',
    submit: 'Create code',
    tableCode: 'Code',
    tableType: 'Type',
    tableValue: 'Value',
    tableUsage: 'Usage',
    tableVerification: 'Verification',
    tableStatus: 'Status',
    statusActive: 'Active',
    statusInactive: 'Disabled',
    empty: 'No promo codes yet',
    types: { VIP_DAYS: 'VIP days', COINS: 'Coins', CROSS_BORDER_ACCESS: 'Cross-border marriage' },
  },
  referrals: {
    errorFetch: 'Could not fetch referral data',
    columnMember: 'Member',
    columnCode: 'Referral code',
    columnTotal: 'Total referred',
    columnVerified: 'Verified of those',
    columnBalance: 'Coin balance',
    empty: 'No referrals yet',
  },
  settings: {
    title: 'Change admin password',
    currentPasswordLabel: 'Current password',
    newPasswordLabel: 'New password',
    confirmPasswordLabel: 'Confirm new password',
    save: 'Save password',
    errorMinLength: 'The new password must be at least 8 characters',
    errorMismatch: 'The new password does not match the confirmation',
    errorWrongPassword: 'Current password is incorrect',
    errorGeneric: 'Could not change the password, try again',
    successTitle: 'Password changed successfully',
    successSubtitle: 'Use the new password the next time you sign in.',
    successOk: 'OK',
  },
  paymentSettings: {
    intro:
      "These are the accounts members see when they top up coins or subscribe to VIP. Leave a field empty to hide that method from users.",
    errorFetch: 'Could not fetch payment settings',
    errorSave: 'Could not save payment settings',
    success: 'Payment settings saved successfully',
    save: 'Save settings',
    cryptoTitle: 'Crypto wallets (USDT)',
    bankTitle: 'Local bank transfer',
    cashPlusTitle: 'Cash Plus',
    wireTitle: 'International wire (IBAN / SWIFT)',
    wireSubtitle: 'For diaspora members transferring from abroad.',
    bankNameLabel: 'Bank name',
    accountHolderLabel: 'Account holder',
    ribLabel: 'RIB',
    cashPlusCodeLabel: 'Code / number',
    ibanLabel: 'IBAN',
    swiftLabel: 'SWIFT / BIC',
    bankAddressLabel: 'Bank address (optional)',
  },
  analytics: {
    errorFetch: 'Could not fetch analytics',
    totalRevenue: 'Total revenue',
    thisMonthRevenue: 'Revenue this month',
    monthlyRevenueTitle: 'Monthly revenue (last 6 months)',
    revenueByType: 'Revenue by type',
    pendingTitle: 'Pending',
    pendingVerifications: 'Verification requests',
    pendingPayments: 'Payment transactions',
    activePromos: 'Active promo codes',
    totalUsers: 'Total members',
    verifiedUsers: 'Verified members',
    vipUsers: 'VIP subscribers',
    newUsersThisMonth: 'New members this month',
  },
  months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
};

export const adminDictionaries: Record<AdminLocale, AdminDictionary> = { ar, en };
