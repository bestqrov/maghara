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
    tabMembers: string;
    tabAds: string;
    tabAppConfig: string;
    tabSettings: string;
  };
  appConfig: {
    errorFetch: string;
    errorSave: string;
    success: string;
    save: string;
    generalTitle: string;
    emailLabel: string;
    authorLabel: string;
    contactLabel: string;
    websiteLabel: string;
    developedByLabel: string;
    descriptionLabel: string;
    settingsTitle: string;
    maintenanceModeLabel: string;
    maintenanceMessageLabel: string;
    screenshotBlockLabel: string;
    privacyPolicyTitle: string;
    termsTitle: string;
    urlLabel: string;
    contentLabel: string;
    appUpdateTitle: string;
    appUpdateEnabledLabel: string;
    requiredVersionCodeLabel: string;
    appUpdateDescriptionLabel: string;
    appLinkLabel: string;
    moreAppsTitle: string;
    moreAppsLinkLabel: string;
    buildsTitle: string;
    buildsSubtitle: string;
    apkUrlLabel: string;
    aabUrlLabel: string;
    downloadApk: string;
    downloadAab: string;
  };
  ads: {
    errorFetch: string;
    errorSave: string;
    success: string;
    save: string;
    globalTitle: string;
    interstitialIntervalLabel: string;
    nativeIndexLabel: string;
    manageTitle: string;
    activeLabel: string;
    networkLabel: string;
    appIdLabel: string;
    publisherIdLabel: string;
    bannerUnitIdLabel: string;
    interstitialUnitIdLabel: string;
    nativeUnitIdLabel: string;
    appOpenUnitIdLabel: string;
    placementTitle: string;
    placementSubtitle: string;
    placementBannerHome: string;
    placementBannerMatches: string;
    placementBannerVisitors: string;
    placementInterstitialFeed: string;
    placementNativeFeed: string;
    placementAppOpen: string;
  };
  members: {
    searchPlaceholder: string;
    search: string;
    export: string;
    errorFetch: string;
    empty: string;
    columnName: string;
    columnPhone: string;
    columnEmail: string;
    columnCity: string;
    columnCountry: string;
    columnVerification: string;
    columnTier: string;
    columnCoins: string;
    columnJoined: string;
    prev: string;
    next: string;
    pageOf: (page: number, totalPages: number) => string;
    totalCount: (count: number) => string;
    add: string;
    edit: string;
    delete: string;
    columnActions: string;
    createTitle: string;
    editTitle: string;
    save: string;
    cancel: string;
    passwordLabel: string;
    passwordEditHint: string;
    genderLabel: string;
    genderMale: string;
    genderFemale: string;
    birthDateLabel: string;
    originCountryLabel: string;
    confirmDelete: (name: string) => string;
    errorSave: string;
    errorDelete: string;
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
    selfie: string;
    compare: string;
    hideCompare: string;
    idCard: string;
    passport: string;
    faceChecking: string;
    faceStrong: string;
    faceMatch: string;
    faceNoMatch: string;
    faceError: string;
    profileMatch: string;
    profileNoMatch: string;
    similarity: (percent: number) => string;
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
    tabMembers: 'الأعضاء',
    tabAds: 'الإعلانات',
    tabAppConfig: 'إعدادات التطبيق',
    tabSettings: 'الإعدادات',
  },
  appConfig: {
    errorFetch: 'تعذّر جلب إعدادات التطبيق',
    errorSave: 'تعذّر حفظ إعدادات التطبيق',
    success: 'تم حفظ إعدادات التطبيق بنجاح',
    save: 'حفظ الإعدادات',
    generalTitle: 'معلومات عامة',
    emailLabel: 'البريد الإلكتروني',
    authorLabel: 'المطوّر (Author)',
    contactLabel: 'رقم التواصل',
    websiteLabel: 'الموقع الإلكتروني',
    developedByLabel: 'تطوير بواسطة',
    descriptionLabel: 'وصف التطبيق',
    settingsTitle: 'إعدادات التطبيق',
    maintenanceModeLabel: 'وضع الصيانة (يوقف التطبيق مؤقتاً)',
    maintenanceMessageLabel: 'رسالة الصيانة',
    screenshotBlockLabel: 'منع لقطة الشاشة داخل التطبيق',
    privacyPolicyTitle: 'سياسة الخصوصية',
    termsTitle: 'الشروط والأحكام',
    urlLabel: 'الرابط',
    contentLabel: 'النص',
    appUpdateTitle: 'تحديث التطبيق الإجباري',
    appUpdateEnabledLabel: 'إجبار التحديث فعّال',
    requiredVersionCodeLabel: 'رقم النسخة المطلوبة (Version Code)',
    appUpdateDescriptionLabel: 'وصف التحديث',
    appLinkLabel: 'رابط المتجر',
    moreAppsTitle: 'تطبيقات أخرى',
    moreAppsLinkLabel: 'رابط',
    buildsTitle: 'ملفات التطبيق (APK / AAB)',
    buildsSubtitle: 'الصق الرابط بعد كل مرة تدير eas build، وضغط زر التحميل باش تجيب الملف مباشرة.',
    apkUrlLabel: 'رابط ملف APK',
    aabUrlLabel: 'رابط ملف AAB',
    downloadApk: 'تحميل APK',
    downloadAab: 'تحميل AAB',
  },
  ads: {
    errorFetch: 'تعذّر جلب إعدادات الإعلانات',
    errorSave: 'تعذّر حفظ إعدادات الإعلانات',
    success: 'تم حفظ إعدادات الإعلانات بنجاح',
    save: 'حفظ الإعدادات',
    globalTitle: 'الإعدادات العامة',
    interstitialIntervalLabel: 'فاصل الإعلان الانتقالي (كل كم ملف)',
    nativeIndexLabel: 'الإعلان الأصلي (كل كم بروفايل فـ اللائحة)',
    manageTitle: 'إدارة الإعلانات',
    activeLabel: 'الإعلانات فعّالة',
    networkLabel: 'شبكة الإعلانات',
    appIdLabel: 'App ID',
    publisherIdLabel: 'Publisher ID',
    bannerUnitIdLabel: 'Banner Ad Unit ID',
    interstitialUnitIdLabel: 'Interstitial Ad Unit ID',
    nativeUnitIdLabel: 'Native Ad Unit ID',
    appOpenUnitIdLabel: 'App Open Ad Unit ID',
    placementTitle: 'أماكن ظهور الإعلانات',
    placementSubtitle: 'فعّل أو عطّل كل نوع إعلان فـ الصفحة المناسبة ليه فـ تطبيق الهاتف.',
    placementBannerHome: 'Banner فـ الصفحة الرئيسية (البحث)',
    placementBannerMatches: 'Banner فـ صفحة الاهتمامات',
    placementBannerVisitors: 'Banner فـ صفحة الزوار',
    placementInterstitialFeed: 'إعلان انتقالي فـ صفحة البحث',
    placementNativeFeed: 'إعلان أصلي داخل لائحة البحث',
    placementAppOpen: 'إعلان عند فتح التطبيق',
  },
  members: {
    searchPlaceholder: 'ابحث بالاسم، الهاتف، أو البريد الإلكتروني',
    search: 'بحث',
    export: 'تصدير CSV',
    errorFetch: 'تعذّر جلب قائمة الأعضاء',
    empty: 'لا يوجد أعضاء',
    columnName: 'الاسم',
    columnPhone: 'الهاتف',
    columnEmail: 'البريد الإلكتروني',
    columnCity: 'المدينة',
    columnCountry: 'البلد',
    columnVerification: 'التوثيق',
    columnTier: 'الاشتراك',
    columnCoins: 'النقاط',
    columnJoined: 'تاريخ التسجيل',
    prev: 'السابق',
    next: 'التالي',
    pageOf: (page, totalPages) => `صفحة ${page} من ${totalPages}`,
    totalCount: (count) => `${count} عضو`,
    add: '+ إضافة عضو',
    edit: 'تعديل',
    delete: 'حذف',
    columnActions: 'إجراءات',
    createTitle: 'إضافة عضو جديد',
    editTitle: 'تعديل بيانات العضو',
    save: 'حفظ',
    cancel: 'إلغاء',
    passwordLabel: 'كلمة المرور',
    passwordEditHint: 'اتركها فارغة للإبقاء على كلمة المرور الحالية',
    genderLabel: 'الجنس',
    genderMale: 'ذكر',
    genderFemale: 'أنثى',
    birthDateLabel: 'تاريخ الميلاد',
    originCountryLabel: 'بلد الأصل',
    confirmDelete: (name) => `واش متأكد بغيتي تحذف ${name}؟ غادي يتحذفو حتى المطابقات والمحادثات ديالو، وما يمكنش ترجعهم.`,
    errorSave: 'تعذّر حفظ بيانات العضو',
    errorDelete: 'تعذّر حذف العضو',
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
    selfie: 'السيلفي',
    compare: 'قارن الوثيقة والسيلفي',
    hideCompare: 'إخفاء المقارنة',
    idCard: 'بطاقة تعريف',
    passport: 'جواز سفر',
    faceChecking: 'جاري مقارنة الوجه…',
    faceStrong: 'الوجه مطابق بقوة',
    faceMatch: 'الوجه مطابق',
    faceNoMatch: 'الوجه غير مطابق — تحقق بعناية',
    faceError: 'تعذّرت المقارنة الآلية — قارن يدوياً',
    profileMatch: 'صور البروفايل لنفس الشخص',
    profileNoMatch: 'صور البروفايل لا تطابق السيلفي',
    similarity: (percent) => `تشابه ${percent}%`,
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
    tabMembers: 'Members',
    tabAds: 'Ads',
    tabAppConfig: 'App settings',
    tabSettings: 'Settings',
  },
  appConfig: {
    errorFetch: 'Could not fetch app settings',
    errorSave: 'Could not save app settings',
    success: 'App settings saved successfully',
    save: 'Save settings',
    generalTitle: 'General info',
    emailLabel: 'Email',
    authorLabel: 'Author',
    contactLabel: 'Contact',
    websiteLabel: 'Website',
    developedByLabel: 'Developed by',
    descriptionLabel: 'App description',
    settingsTitle: 'App settings',
    maintenanceModeLabel: 'Maintenance mode (blocks the app temporarily)',
    maintenanceMessageLabel: 'Maintenance message',
    screenshotBlockLabel: 'Block screenshots inside the app',
    privacyPolicyTitle: 'Privacy policy',
    termsTitle: 'Terms & conditions',
    urlLabel: 'URL',
    contentLabel: 'Text',
    appUpdateTitle: 'Forced app update',
    appUpdateEnabledLabel: 'Forced update active',
    requiredVersionCodeLabel: 'Required version code',
    appUpdateDescriptionLabel: 'Update description',
    appLinkLabel: 'Store link',
    moreAppsTitle: 'More apps',
    moreAppsLinkLabel: 'Link',
    buildsTitle: 'App build files (APK / AAB)',
    buildsSubtitle: 'Paste the link after each eas build, then click download to get the file directly.',
    apkUrlLabel: 'APK file URL',
    aabUrlLabel: 'AAB file URL',
    downloadApk: 'Download APK',
    downloadAab: 'Download AAB',
  },
  ads: {
    errorFetch: 'Could not fetch ad settings',
    errorSave: 'Could not save ad settings',
    success: 'Ad settings saved successfully',
    save: 'Save settings',
    globalTitle: 'Global configuration',
    interstitialIntervalLabel: 'Interstitial ad interval (every N profiles)',
    nativeIndexLabel: 'Native ad frequency (every N profiles in the list)',
    manageTitle: 'Manage ads',
    activeLabel: 'Ads active',
    networkLabel: 'Ad network',
    appIdLabel: 'App ID',
    publisherIdLabel: 'Publisher ID',
    bannerUnitIdLabel: 'Banner Ad Unit ID',
    interstitialUnitIdLabel: 'Interstitial Ad Unit ID',
    nativeUnitIdLabel: 'Native Ad Unit ID',
    appOpenUnitIdLabel: 'App Open Ad Unit ID',
    placementTitle: 'Ads placement',
    placementSubtitle: 'Enable or disable each ad format on its matching screen in the mobile app.',
    placementBannerHome: 'Banner on home (search) screen',
    placementBannerMatches: 'Banner on matches screen',
    placementBannerVisitors: 'Banner on visitors screen',
    placementInterstitialFeed: 'Interstitial ad on the search screen',
    placementNativeFeed: 'Native ad inside the search results list',
    placementAppOpen: 'Ad on app open',
  },
  members: {
    searchPlaceholder: 'Search by name, phone, or email',
    search: 'Search',
    export: 'Export CSV',
    errorFetch: 'Could not fetch the member list',
    empty: 'No members found',
    columnName: 'Name',
    columnPhone: 'Phone',
    columnEmail: 'Email',
    columnCity: 'City',
    columnCountry: 'Country',
    columnVerification: 'Verification',
    columnTier: 'Tier',
    columnCoins: 'Coins',
    columnJoined: 'Joined',
    prev: 'Previous',
    next: 'Next',
    pageOf: (page, totalPages) => `Page ${page} of ${totalPages}`,
    totalCount: (count) => `${count} members`,
    add: '+ Add member',
    edit: 'Edit',
    delete: 'Delete',
    columnActions: 'Actions',
    createTitle: 'Add a new member',
    editTitle: 'Edit member',
    save: 'Save',
    cancel: 'Cancel',
    passwordLabel: 'Password',
    passwordEditHint: 'Leave empty to keep the current password',
    genderLabel: 'Gender',
    genderMale: 'Male',
    genderFemale: 'Female',
    birthDateLabel: 'Birth date',
    originCountryLabel: 'Country of origin',
    confirmDelete: (name) => `Delete ${name}? Their matches and conversations will be deleted too. This cannot be undone.`,
    errorSave: 'Could not save the member',
    errorDelete: 'Could not delete the member',
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
    selfie: 'Selfie',
    compare: 'Compare document and selfie',
    hideCompare: 'Hide comparison',
    idCard: 'ID card',
    passport: 'Passport',
    faceChecking: 'Comparing faces…',
    faceStrong: 'Strong face match',
    faceMatch: 'Face matches',
    faceNoMatch: 'Face does not match — check carefully',
    faceError: 'Automatic comparison failed — compare by eye',
    profileMatch: 'Profile photos show the same person',
    profileNoMatch: "Profile photos don't match the selfie",
    similarity: (percent) => `${percent}% similar`,
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
