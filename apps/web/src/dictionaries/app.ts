import type { Locale } from '@/lib/seo';

export interface AppDictionary {
  common: {
    brand: string;
    errorGeneric: string;
    loading: string;
    logout: string;
    close: string;
    confirm: string;
    save: string;
  };
  nav: {
    search: string;
    visitors: string;
    matches: string;
    store: string;
    profileAria: string;
    settingsAria: string;
    logoutAria: string;
    themeAria: string;
  };
  login: {
    title: string;
    subtitle: string;
    phoneLabel: string;
    phonePlaceholder: string;
    passwordLabel: string;
    submit: string;
    errorInvalid: string;
    noAccount: string;
    registerLink: string;
  };
  register: {
    title: string;
    stepOf: (step: number, total: number) => string;
    phoneLabel: string;
    phonePlaceholder: string;
    phoneRequired: string;
    emailLabel: string;
    emailPlaceholder: string;
    emailRequired: string;
    emailInvalid: string;
    errorEmailTaken: string;
    passwordLabel: string;
    passwordRequired: string;
    passwordMinLength: string;
    firstNameLabel: string;
    firstNameRequired: string;
    genderLabel: string;
    genderMale: string;
    genderFemale: string;
    birthDateLabel: string;
    birthDateRequired: string;
    residenceCountryLabel: string;
    residenceCountryPlaceholder: string;
    residenceCountryRequired: string;
    currentCityLabel: string;
    currentCityRequired: string;
    originCountryLabel: string;
    originCountryRequired: string;
    relocationLabel: string;
    relocationOpen: string;
    relocationExpat: string;
    relocationLocal: string;
    jobTitleLabel: string;
    bioLabel: string;
    photoLabel: string;
    back: string;
    next: string;
    submit: string;
    errorPhoneTaken: string;
    haveAccount: string;
    loginLink: string;
  };
  feed: {
    greeting: (firstName: string) => string;
    interestsToday: (sent: number, limit: number) => string;
    errorSearchFailed: string;
    errorSendInterestFailed: string;
    noResults: string;
  };
  searchFilters: {
    local: string;
    diaspora: string;
    ageFrom: string;
    ageTo: string;
    country: string;
    city: string;
    submit: string;
  };
  profileCard: {
    sent: string;
    sendInterest: string;
    lockLabel: string;
  };
  verificationBanner: {
    unverifiedTitle: string;
    unverifiedSubtitle: string;
    pendingTitle: string;
    pendingSubtitle: string;
    rejectedTitle: string;
    rejectedSubtitle: string;
    verifyNow: string;
  };
  matches: {
    title: string;
    loading: string;
    empty: string;
    statusPending: string;
    statusAccepted: string;
    statusRejected: string;
    statusEngaged: string;
    directionSent: string;
    directionReceived: string;
    accept: string;
    reject: string;
    chat: string;
    markEngaged: string;
  };
  chat: {
    freeMessages: (used: number, limit: number) => string;
    limitReached: string;
    unlockChat: string;
    placeholder: string;
    send: string;
    errorSendFailed: string;
    errorUnlockFailed: string;
    vipComingSoon: string;
  };
  paywallModal: {
    title: string;
    body: (coinCost: number) => string;
    upgradeVip: string;
    unlockWithCoins: (coinCost: number) => string;
    close: string;
  };
  settings: {
    title: string;
    changePasswordTitle: string;
    changePasswordSubtitle: string;
    currentPasswordLabel: string;
    newPasswordLabel: string;
    confirmPasswordLabel: string;
    save: string;
    success: string;
    errorWrongPassword: string;
  };
  profile: {
    title: string;
    subtitle: string;
    firstNameLabel: string;
    currentCityLabel: string;
    residenceCountryLabel: string;
    originCountryLabel: string;
    relocationLabel: string;
    relocationOpen: string;
    relocationExpat: string;
    relocationLocal: string;
    jobTitleLabel: string;
    bioLabel: string;
    photoLabel: string;
    save: string;
    success: string;
    errorGeneric: string;
  };
  store: {
    title: string;
    coinPackagesTitle: string;
    topUp: string;
    topUpFor: (coins: number) => string;
    vipPerks: string;
    upgradeNow: string;
    upgradeTitle: string;
    historyTitle: string;
    historyEmpty: string;
    statusPending: string;
    statusSuccess: string;
    statusFailed: string;
    typeCoinPurchase: string;
    typeVipSubscription: string;
    typeVerificationFee: string;
  };
  paymentModal: {
    choosePaymentMethod: string;
    bankTransfer: string;
    cashPlus: string;
    sendCryptoTo: (amount: number) => string;
    placeholderWarningCrypto: string;
    transferTo: (amount: number) => string;
    placeholderWarningBank: string;
    txHashLabel: string;
    receiptLabel: string;
    close: string;
    confirmPayment: string;
    doneTitle: string;
    doneSubtitle: string;
    doneButton: string;
    errorGeneric: string;
  };
  verification: {
    title: string;
    subtitle: string;
    idLabel: string;
    residencyLabel: string;
    submit: string;
    skip: string;
    alreadyVerified: string;
    alreadyPending: string;
  };
  visitors: {
    title: string;
    subtitle: string;
    lockedBanner: (count: number) => string;
    loading: string;
    empty: string;
    lockLabel: string;
    lockedName: string;
    unknownVisitorAlt: string;
  };
  promoInput: {
    title: string;
    subtitle: string;
    placeholder: string;
    activate: string;
    success: (reward: string) => string;
    rewardVipDays: (value: number) => string;
    rewardCoins: (value: number) => string;
    rewardCrossBorder: string;
  };
  referralCard: {
    title: string;
    subtitle: string;
    copyLink: string;
    copied: string;
    whatsapp: string;
    facebook: string;
    shareText: (link: string) => string;
    totalReferredLabel: string;
    verifiedReferredLabel: string;
  };
  imageUploader: {
    uploading: string;
    changePhoto: string;
    choosePhoto: string;
    errorUploadFailed: string;
  };
  languageSelector: {
    label: string;
  };
}

const ar: AppDictionary = {
  common: {
    brand: 'قسمة و نصيب',
    errorGeneric: 'كاين مشكل، حاول مرة أخرى',
    loading: 'تحميل...',
    logout: 'خروج',
    close: 'إغلاق',
    confirm: 'تأكيد',
    save: 'حفظ',
  },
  nav: {
    search: 'البحث',
    visitors: 'الزوار',
    matches: 'الاهتمامات',
    store: 'المتجر',
    profileAria: 'البروفايل',
    settingsAria: 'الإعدادات',
    logoutAria: 'خروج',
    themeAria: 'بدّل الوضع الداكن/الفاتح',
  },
  login: {
    title: 'مرحباً بك من جديد',
    subtitle: 'دخل لحسابك وكمّل رحلتك نحو الزواج',
    phoneLabel: 'رقم الهاتف',
    phonePlaceholder: '+212600000000',
    passwordLabel: 'الپاسوورد',
    submit: 'دخول',
    errorInvalid: 'رقم الهاتف أو الپاسوورد غير صحيحين',
    noAccount: 'ماعندكش حساب؟',
    registerLink: 'سجل دابا',
  },
  register: {
    title: 'إنشاء حساب جديد',
    stepOf: (step, total) => `خطوة ${step} من ${total}`,
    phoneLabel: 'رقم الهاتف',
    phonePlaceholder: '+212600000000',
    phoneRequired: 'خاصك تكتب رقم الهاتف',
    emailLabel: 'البريد الإلكتروني',
    emailPlaceholder: 'example@email.com',
    emailRequired: 'خاصك تكتب البريد الإلكتروني',
    emailInvalid: 'خاصك تكتب بريد إلكتروني صحيح',
    errorEmailTaken: 'هاد البريد الإلكتروني مسجل من قبل',
    passwordLabel: 'الپاسوورد',
    passwordRequired: 'خاصك تكتب الپاسوورد',
    passwordMinLength: 'خاصو يكون 8 حروف على الأقل',
    firstNameLabel: 'السمية',
    firstNameRequired: 'خاصك تكتب السمية',
    genderLabel: 'الجنس',
    genderMale: 'ذكر',
    genderFemale: 'أنثى',
    birthDateLabel: 'تاريخ الميلاد',
    birthDateRequired: 'خاصك تحدد تاريخ الميلاد',
    residenceCountryLabel: 'بلد الإقامة الحالية',
    residenceCountryPlaceholder: 'المغرب، فرنسا، الإمارات...',
    residenceCountryRequired: 'خاصك تحدد بلد الإقامة',
    currentCityLabel: 'المدينة',
    currentCityRequired: 'خاصك تحدد المدينة',
    originCountryLabel: 'بلد الأصل',
    originCountryRequired: 'خاصك تحدد بلد الأصل',
    relocationLabel: 'الاستعداد للانتقال أو الزواج بالجالية',
    relocationOpen: 'مستعد نتنقل',
    relocationExpat: 'كنبحث فـ الجالية',
    relocationLocal: 'فـ بلدي فقط',
    jobTitleLabel: 'المهنة (اختياري)',
    bioLabel: 'نبذة عنك (اختياري)',
    photoLabel: 'صورة البروفايل (اختياري)',
    back: 'رجوع',
    next: 'التالي',
    submit: 'إنشاء الحساب',
    errorPhoneTaken: 'رقم الهاتف هذا مسجل من قبل',
    haveAccount: 'عندك حساب من قبل؟',
    loginLink: 'دخول',
  },
  feed: {
    greeting: (firstName) => `أهلاً ${firstName} 👋`,
    interestsToday: (sent, limit) => `${sent}/${limit} اهتمامات اليوم`,
    errorSearchFailed: 'ماقدرناش نجيبو النتائج، حاول مرة أخرى',
    errorSendInterestFailed: 'ماقدرناش نبعثو الاهتمام',
    noResults: 'ماكاين حتى نتيجة دابا، حاول تبدل الفلاتر',
  },
  searchFilters: {
    local: 'البحث المحلي',
    diaspora: 'الجالية / الزواج الدولي',
    ageFrom: 'السن من',
    ageTo: 'السن إلى',
    country: 'البلد',
    city: 'المدينة',
    submit: 'بحث',
  },
  profileCard: {
    sent: 'تم الإرسال ✓',
    sendInterest: 'إبعث اهتمام',
    lockLabel: 'فتح بالنقط أو VIP',
  },
  verificationBanner: {
    unverifiedTitle: 'وثّق حسابك مجاناً',
    unverifiedSubtitle: 'احصل على شارة "عضو جاد وموثق" وزد فرصك فـ الظهور فـ البحث',
    pendingTitle: 'التوثيق قيد المراجعة',
    pendingSubtitle: 'غادي نراجعو الوثائق ديالك ونعلموك بالنتيجة قريباً',
    rejectedTitle: 'التوثيق تم رفضه',
    rejectedSubtitle: 'حاول تصيفط وثيقة أوضح، أو تواصل مع الدعم',
    verifyNow: 'وثّق دابا',
  },
  matches: {
    title: 'الاهتمامات والمطابقات',
    loading: 'تحميل...',
    empty: 'ماعندكش حتى اهتمام دابا',
    statusPending: 'فـ الانتظار',
    statusAccepted: 'متوافقين',
    statusRejected: 'مرفوض',
    statusEngaged: 'مخطوبين 💍',
    directionSent: 'بعثتي اهتمام',
    directionReceived: 'صيفط ليك اهتمام',
    accept: 'قبول',
    reject: 'رفض',
    chat: 'الشات',
    markEngaged: 'سجّل الخطوبة',
  },
  chat: {
    freeMessages: (used, limit) => `${used}/${limit} رسائل مجانية`,
    limitReached: 'وصلتي لحد الرسائل المجانية',
    unlockChat: 'افتح الشات',
    placeholder: 'كتب رسالتك...',
    send: 'صيفط',
    errorSendFailed: 'ماقدرناش نصيفطو الرسالة',
    errorUnlockFailed: 'ماعندكش نقط كافية، شحن ولا ترقى لـ VIP',
    vipComingSoon: 'باقة VIP قريباً 🚀',
  },
  paywallModal: {
    title: 'وصلتي لمرحلة مهمة!',
    body: (coinCost) => `باش تكمل الشات بسلاسة، فتحو بـ ${coinCost} نقط أو ترقى لـ VIP للشات بلا حدود`,
    upgradeVip: 'ترقى لـ VIP',
    unlockWithCoins: (coinCost) => `فتح بـ ${coinCost} نقط`,
    close: 'إغلاق',
  },
  settings: {
    title: 'الإعدادات',
    changePasswordTitle: 'بدّل الپاسوورد',
    changePasswordSubtitle: 'دخل الپاسوورد الحالي، وحدد وحدة جديدة',
    currentPasswordLabel: 'الپاسوورد الحالي',
    newPasswordLabel: 'الپاسوورد الجديد',
    confirmPasswordLabel: 'أكد الپاسوورد الجديد',
    save: 'حفظ',
    success: 'تبدل الپاسوورد بنجاح',
    errorWrongPassword: 'الپاسوورد الحالي غير صحيح',
  },
  profile: {
    title: 'البروفايل ديالي',
    subtitle: 'بدّل المعلومات ديالك اللي بانة للأعضاء الآخرين',
    firstNameLabel: 'السمية',
    currentCityLabel: 'المدينة',
    residenceCountryLabel: 'بلد الإقامة الحالية',
    originCountryLabel: 'بلد الأصل',
    relocationLabel: 'الاستعداد للانتقال أو الزواج بالجالية',
    relocationOpen: 'مستعد نتنقل',
    relocationExpat: 'كنبحث فـ الجالية',
    relocationLocal: 'فـ بلدي فقط',
    jobTitleLabel: 'المهنة (اختياري)',
    bioLabel: 'نبذة عنك (اختياري)',
    photoLabel: 'صورة البروفايل',
    save: 'حفظ التغييرات',
    success: 'تبدلت المعلومات ديالك بنجاح',
    errorGeneric: 'كاين مشكل، حاول مرة أخرى',
  },
  store: {
    title: 'المتجر والباقات',
    coinPackagesTitle: 'باقات النقط',
    topUp: 'شحن',
    topUpFor: (coins) => `شحن ${coins} نقط`,
    vipPerks: 'شات بلا حدود، شوف جميع الزوار، وأولوية فـ الظهور',
    upgradeNow: 'ترقى دابا',
    upgradeTitle: 'اشتراك VIP',
    historyTitle: 'سجل العمليات',
    historyEmpty: 'ماكاين حتى عملية دابا',
    statusPending: 'فـ الانتظار',
    statusSuccess: 'تأكدت ✓',
    statusFailed: 'مرفوضة',
    typeCoinPurchase: 'شحن نقط',
    typeVipSubscription: 'اشتراك VIP',
    typeVerificationFee: 'توثيق',
  },
  paymentModal: {
    choosePaymentMethod: 'اختار طريقة الدفع',
    bankTransfer: 'تحويل بنكي',
    cashPlus: 'Cash Plus',
    sendCryptoTo: (amount) => `صيفط ${amount} MAD (USDT) لهاد العنوان:`,
    placeholderWarningCrypto: '⚠️ هاد العنوان placeholder ديمو، ماشي عنوان حقيقي — خاصو يتبدل قبل الإطلاق',
    transferTo: (amount) => `حوّل ${amount} MAD لـ:`,
    placeholderWarningBank: '⚠️ هادو معطيات placeholder — خاصهم يتبدلو قبل الإطلاق',
    txHashLabel: 'TxHash',
    receiptLabel: 'صورة الوصل',
    close: 'إغلاق',
    confirmPayment: 'تأكيد',
    doneTitle: 'صيفطنا طلبك للمراجعة',
    doneSubtitle: 'غادي نأكدو العملية ونفعلو الخدمة قريباً',
    doneButton: 'تمام',
    errorGeneric: 'كاين مشكل، حاول مرة أخرى',
  },
  verification: {
    title: 'وثّق حسابك مجاناً',
    subtitle: 'صيفط CIN أو Passport للحصول على شارة "عضو جاد وموثق" وزد فرصك فـ الظهور',
    idLabel: 'صورة CIN / Passport',
    residencyLabel: 'وثيقة الإقامة بالخارج (اختياري)',
    submit: 'صيفط للمراجعة',
    skip: 'تخطى دابا، نوثق من بعد',
    alreadyVerified: 'حسابك موثق بالفعل ✓',
    alreadyPending: 'طلب التوثيق ديالك قيد المراجعة، غادي نعلموك بالنتيجة قريباً',
  },
  visitors: {
    title: 'زوار البروفايل ديالك',
    subtitle: 'هادو الناس لي زارو البروفايل ديالك مؤخراً',
    lockedBanner: (count) => `${count} زوار آخرين زارو البروفايل ديالك! رقّي لـ VIP باش تشوف شكون هوما`,
    loading: 'تحميل...',
    empty: 'حتى واحد مازال ما زار البروفايل ديالك',
    lockLabel: 'ترقى لـ VIP',
    lockedName: '••••••',
    unknownVisitorAlt: 'زائر مقفل',
  },
  promoInput: {
    title: 'عندك كود ترويجي؟',
    subtitle: 'دخل الكود وفعّل المكافأة ديالك فوراً',
    placeholder: 'مثال: QISMA2026',
    activate: 'تفعيل',
    success: (reward) => `تم تفعيل الكود! حصلت على ${reward}.`,
    rewardVipDays: (value) => `${value} يوم اشتراك VIP مجاني`,
    rewardCoins: (value) => `${value} كوين`,
    rewardCrossBorder: 'فتح ميزة الزواج الدولي / الجالية',
  },
  referralCard: {
    title: 'شارك ودّي أصحابك',
    subtitle: 'كل صاحب يوثّق حسابه عبر الرابط ديالك، تربحو 10 كوينات بجوج.',
    copyLink: 'نسخ الرابط',
    copied: 'تم النسخ',
    whatsapp: 'واتساب',
    facebook: 'فيسبوك',
    shareText: (link) => `سجّل معايا فـ قسمة و نصيب، منصة جادة للزواج الحلال 💍 استعمل الرابط ديالي: ${link}`,
    totalReferredLabel: 'سجّلو بالرابط',
    verifiedReferredLabel: 'توثقو وربحو الكوينات',
  },
  imageUploader: {
    uploading: 'كتصيفط...',
    changePhoto: 'بدّل الصورة',
    choosePhoto: 'اختار صورة',
    errorUploadFailed: 'ماقدرناش نرفعو الصورة، حاول مرة أخرى',
  },
  languageSelector: {
    label: 'اللغة',
  },
};

const fr: AppDictionary = {
  common: {
    brand: 'Qisma W Nasib',
    errorGeneric: "Un problème est survenu, réessayez",
    loading: 'Chargement...',
    logout: 'Déconnexion',
    close: 'Fermer',
    confirm: 'Confirmer',
    save: 'Enregistrer',
  },
  nav: {
    search: 'Recherche',
    visitors: 'Visiteurs',
    matches: 'Intérêts',
    store: 'Boutique',
    profileAria: 'Profil',
    settingsAria: 'Paramètres',
    logoutAria: 'Déconnexion',
    themeAria: 'Basculer le mode sombre/clair',
  },
  login: {
    title: 'Bon retour parmi nous',
    subtitle: 'Connectez-vous et poursuivez votre chemin vers le mariage',
    phoneLabel: 'Numéro de téléphone',
    phonePlaceholder: '+212600000000',
    passwordLabel: 'Mot de passe',
    submit: 'Se connecter',
    errorInvalid: 'Numéro de téléphone ou mot de passe incorrect',
    noAccount: "Vous n'avez pas de compte ?",
    registerLink: "S'inscrire",
  },
  register: {
    title: 'Créer un nouveau compte',
    stepOf: (step, total) => `Étape ${step} sur ${total}`,
    phoneLabel: 'Numéro de téléphone',
    phonePlaceholder: '+212600000000',
    phoneRequired: 'Le numéro de téléphone est requis',
    emailLabel: 'E-mail',
    emailPlaceholder: 'exemple@email.com',
    emailRequired: "L'e-mail est requis",
    emailInvalid: 'Entrez une adresse e-mail valide',
    errorEmailTaken: 'Cet e-mail est déjà enregistré',
    passwordLabel: 'Mot de passe',
    passwordRequired: 'Le mot de passe est requis',
    passwordMinLength: 'Doit contenir au moins 8 caractères',
    firstNameLabel: 'Prénom',
    firstNameRequired: 'Le prénom est requis',
    genderLabel: 'Genre',
    genderMale: 'Homme',
    genderFemale: 'Femme',
    birthDateLabel: 'Date de naissance',
    birthDateRequired: 'La date de naissance est requise',
    residenceCountryLabel: 'Pays de résidence actuel',
    residenceCountryPlaceholder: 'Maroc, France, Émirats...',
    residenceCountryRequired: 'Le pays de résidence est requis',
    currentCityLabel: 'Ville',
    currentCityRequired: 'La ville est requise',
    originCountryLabel: "Pays d'origine",
    originCountryRequired: "Le pays d'origine est requis",
    relocationLabel: "Disposition à s'installer ou mariage avec la diaspora",
    relocationOpen: 'Prêt(e) à déménager',
    relocationExpat: 'Je cherche dans la diaspora',
    relocationLocal: 'Dans mon pays uniquement',
    jobTitleLabel: 'Profession (optionnel)',
    bioLabel: 'Bio (optionnel)',
    photoLabel: 'Photo de profil (optionnel)',
    back: 'Retour',
    next: 'Suivant',
    submit: 'Créer le compte',
    errorPhoneTaken: 'Ce numéro de téléphone est déjà enregistré',
    haveAccount: 'Vous avez déjà un compte ?',
    loginLink: 'Se connecter',
  },
  feed: {
    greeting: (firstName) => `Bonjour ${firstName} 👋`,
    interestsToday: (sent, limit) => `${sent}/${limit} intérêts aujourd'hui`,
    errorSearchFailed: "Impossible de charger les résultats, réessayez",
    errorSendInterestFailed: "Impossible d'envoyer l'intérêt",
    noResults: 'Aucun résultat pour le moment, essayez de changer les filtres',
  },
  searchFilters: {
    local: 'Recherche locale',
    diaspora: 'Diaspora / Mariage international',
    ageFrom: 'Âge min',
    ageTo: 'Âge max',
    country: 'Pays',
    city: 'Ville',
    submit: 'Rechercher',
  },
  profileCard: {
    sent: 'Envoyé ✓',
    sendInterest: "Envoyer un intérêt",
    lockLabel: 'Débloquer avec des pièces ou VIP',
  },
  verificationBanner: {
    unverifiedTitle: 'Vérifiez votre compte gratuitement',
    unverifiedSubtitle: 'Obtenez le badge "Membre sérieux vérifié" et apparaissez plus souvent dans les recherches',
    pendingTitle: 'Vérification en cours',
    pendingSubtitle: 'Nous examinons vos documents et vous informerons bientôt du résultat',
    rejectedTitle: 'Vérification refusée',
    rejectedSubtitle: 'Essayez un document plus clair, ou contactez le support',
    verifyNow: 'Vérifier maintenant',
  },
  matches: {
    title: 'Intérêts et correspondances',
    loading: 'Chargement...',
    empty: "Vous n'avez aucun intérêt pour le moment",
    statusPending: 'En attente',
    statusAccepted: 'Compatibles',
    statusRejected: 'Refusé',
    statusEngaged: 'Fiancés 💍',
    directionSent: 'Intérêt envoyé',
    directionReceived: 'Intérêt reçu',
    accept: 'Accepter',
    reject: 'Refuser',
    chat: 'Discussion',
    markEngaged: 'Marquer comme fiancés',
  },
  chat: {
    freeMessages: (used, limit) => `${used}/${limit} messages gratuits`,
    limitReached: 'Vous avez atteint la limite de messages gratuits',
    unlockChat: 'Débloquer la discussion',
    placeholder: 'Écrivez votre message...',
    send: 'Envoyer',
    errorSendFailed: "Impossible d'envoyer le message",
    errorUnlockFailed: 'Solde insuffisant, rechargez ou passez VIP',
    vipComingSoon: 'Formule VIP bientôt disponible 🚀',
  },
  paywallModal: {
    title: 'Vous avez atteint une étape importante !',
    body: (coinCost) =>
      `Pour continuer la discussion sans interruption, débloquez avec ${coinCost} pièces ou passez VIP pour discuter sans limite`,
    upgradeVip: 'Passer VIP',
    unlockWithCoins: (coinCost) => `Débloquer avec ${coinCost} pièces`,
    close: 'Fermer',
  },
  settings: {
    title: 'Paramètres',
    changePasswordTitle: 'Changer le mot de passe',
    changePasswordSubtitle: 'Entrez le mot de passe actuel et choisissez-en un nouveau',
    currentPasswordLabel: 'Mot de passe actuel',
    newPasswordLabel: 'Nouveau mot de passe',
    confirmPasswordLabel: 'Confirmer le nouveau mot de passe',
    save: 'Enregistrer',
    success: 'Mot de passe modifié avec succès',
    errorWrongPassword: 'Le mot de passe actuel est incorrect',
  },
  profile: {
    title: 'Mon profil',
    subtitle: 'Modifiez les informations visibles par les autres membres',
    firstNameLabel: 'Prénom',
    currentCityLabel: 'Ville',
    residenceCountryLabel: 'Pays de résidence actuel',
    originCountryLabel: 'Pays d\'origine',
    relocationLabel: 'Disposé(e) à déménager ou épouser un(e) expatrié(e)',
    relocationOpen: 'Prêt(e) à déménager',
    relocationExpat: 'Je recherche dans la diaspora',
    relocationLocal: 'Dans mon pays uniquement',
    jobTitleLabel: 'Profession (optionnel)',
    bioLabel: 'À propos de vous (optionnel)',
    photoLabel: 'Photo de profil',
    save: 'Enregistrer les modifications',
    success: 'Vos informations ont été mises à jour avec succès',
    errorGeneric: 'Un problème est survenu, réessayez',
  },
  store: {
    title: 'Boutique et forfaits',
    coinPackagesTitle: 'Packs de pièces',
    topUp: 'Recharger',
    topUpFor: (coins) => `Recharger ${coins} pièces`,
    vipPerks: 'Discussion illimitée, voir tous les visiteurs, et priorité de visibilité',
    upgradeNow: 'Passer VIP maintenant',
    upgradeTitle: 'Abonnement VIP',
    historyTitle: 'Historique des transactions',
    historyEmpty: 'Aucune transaction pour le moment',
    statusPending: 'En attente',
    statusSuccess: 'Confirmée ✓',
    statusFailed: 'Refusée',
    typeCoinPurchase: 'Achat de pièces',
    typeVipSubscription: 'Abonnement VIP',
    typeVerificationFee: 'Vérification',
  },
  paymentModal: {
    choosePaymentMethod: 'Choisissez un mode de paiement',
    bankTransfer: 'Virement bancaire',
    cashPlus: 'Cash Plus',
    sendCryptoTo: (amount) => `Envoyez ${amount} MAD (USDT) à cette adresse :`,
    placeholderWarningCrypto:
      "⚠️ Cette adresse est un placeholder de démo, pas une adresse réelle — à remplacer avant le lancement",
    transferTo: (amount) => `Virez ${amount} MAD à :`,
    placeholderWarningBank: '⚠️ Ces informations sont des placeholders — à remplacer avant le lancement',
    txHashLabel: 'TxHash',
    receiptLabel: 'Photo du reçu',
    close: 'Fermer',
    confirmPayment: 'Confirmer',
    doneTitle: 'Votre demande a été envoyée pour examen',
    doneSubtitle: 'Nous confirmerons la transaction et activerons le service bientôt',
    doneButton: "D'accord",
    errorGeneric: 'Un problème est survenu, réessayez',
  },
  verification: {
    title: 'Vérifiez votre compte gratuitement',
    subtitle:
      "Envoyez votre CIN ou Passeport pour obtenir le badge \"Membre sérieux vérifié\" et augmenter votre visibilité",
    idLabel: 'Photo CIN / Passeport',
    residencyLabel: 'Justificatif de résidence à l\'étranger (optionnel)',
    submit: "Envoyer pour examen",
    skip: 'Passer pour le moment, vérifier plus tard',
    alreadyVerified: 'Votre compte est déjà vérifié ✓',
    alreadyPending: 'Votre demande de vérification est en cours d\'examen, nous vous informerons bientôt',
  },
  visitors: {
    title: 'Visiteurs de votre profil',
    subtitle: 'Voici les personnes qui ont récemment visité votre profil',
    lockedBanner: (count) => `${count} autres visiteurs ont vu votre profil ! Passez VIP pour découvrir qui ils sont`,
    loading: 'Chargement...',
    empty: "Personne n'a encore visité votre profil",
    lockLabel: 'Passer VIP',
    lockedName: '••••••',
    unknownVisitorAlt: 'Visiteur verrouillé',
  },
  promoInput: {
    title: 'Vous avez un code promo ?',
    subtitle: 'Entrez le code et activez votre récompense immédiatement',
    placeholder: 'Exemple : QISMA2026',
    activate: 'Activer',
    success: (reward) => `Code activé ! Vous avez obtenu ${reward}.`,
    rewardVipDays: (value) => `${value} jours d'abonnement VIP gratuit`,
    rewardCoins: (value) => `${value} pièces`,
    rewardCrossBorder: 'Déblocage de la fonctionnalité mariage international / diaspora',
  },
  referralCard: {
    title: 'Partagez avec vos amis',
    subtitle: 'Chaque ami qui vérifie son compte via votre lien vous rapporte 10 pièces à chacun.',
    copyLink: 'Copier le lien',
    copied: 'Copié',
    whatsapp: 'WhatsApp',
    facebook: 'Facebook',
    shareText: (link) => `Inscrivez-vous avec moi sur Qisma W Nasib, la plateforme sérieuse pour un mariage halal 💍 Utilisez mon lien : ${link}`,
    totalReferredLabel: 'Inscrits via le lien',
    verifiedReferredLabel: 'Vérifiés et pièces gagnées',
  },
  imageUploader: {
    uploading: 'Envoi en cours...',
    changePhoto: 'Changer la photo',
    choosePhoto: 'Choisir une photo',
    errorUploadFailed: "Impossible d'envoyer la photo, réessayez",
  },
  languageSelector: {
    label: 'Langue',
  },
};

const en: AppDictionary = {
  common: {
    brand: 'Qisma W Nasib',
    errorGeneric: 'Something went wrong, please try again',
    loading: 'Loading...',
    logout: 'Log out',
    close: 'Close',
    confirm: 'Confirm',
    save: 'Save',
  },
  nav: {
    search: 'Search',
    visitors: 'Visitors',
    matches: 'Interests',
    store: 'Store',
    profileAria: 'Profile',
    settingsAria: 'Settings',
    logoutAria: 'Logout',
    themeAria: 'Toggle dark/light mode',
  },
  login: {
    title: 'Welcome back',
    subtitle: 'Log in to your account and continue your journey to marriage',
    phoneLabel: 'Phone number',
    phonePlaceholder: '+212600000000',
    passwordLabel: 'Password',
    submit: 'Log in',
    errorInvalid: 'Incorrect phone number or password',
    noAccount: "Don't have an account?",
    registerLink: 'Sign up now',
  },
  register: {
    title: 'Create a new account',
    stepOf: (step, total) => `Step ${step} of ${total}`,
    phoneLabel: 'Phone number',
    phonePlaceholder: '+212600000000',
    phoneRequired: 'Phone number is required',
    emailLabel: 'Email',
    emailPlaceholder: 'example@email.com',
    emailRequired: 'Email is required',
    emailInvalid: 'Enter a valid email address',
    errorEmailTaken: 'This email is already registered',
    passwordLabel: 'Password',
    passwordRequired: 'Password is required',
    passwordMinLength: 'Must be at least 8 characters',
    firstNameLabel: 'First name',
    firstNameRequired: 'First name is required',
    genderLabel: 'Gender',
    genderMale: 'Male',
    genderFemale: 'Female',
    birthDateLabel: 'Date of birth',
    birthDateRequired: 'Date of birth is required',
    residenceCountryLabel: 'Current country of residence',
    residenceCountryPlaceholder: 'Morocco, France, UAE...',
    residenceCountryRequired: 'Country of residence is required',
    currentCityLabel: 'City',
    currentCityRequired: 'City is required',
    originCountryLabel: 'Country of origin',
    originCountryRequired: 'Country of origin is required',
    relocationLabel: 'Willingness to relocate or marry into the diaspora',
    relocationOpen: 'Willing to relocate',
    relocationExpat: "I'm looking in the diaspora",
    relocationLocal: 'In my country only',
    jobTitleLabel: 'Occupation (optional)',
    bioLabel: 'Bio (optional)',
    photoLabel: 'Profile photo (optional)',
    back: 'Back',
    next: 'Next',
    submit: 'Create account',
    errorPhoneTaken: 'This phone number is already registered',
    haveAccount: 'Already have an account?',
    loginLink: 'Log in',
  },
  feed: {
    greeting: (firstName) => `Hi ${firstName} 👋`,
    interestsToday: (sent, limit) => `${sent}/${limit} interests today`,
    errorSearchFailed: 'Could not load results, please try again',
    errorSendInterestFailed: 'Could not send interest',
    noResults: 'No results yet, try changing the filters',
  },
  searchFilters: {
    local: 'Local search',
    diaspora: 'Diaspora / International marriage',
    ageFrom: 'Age from',
    ageTo: 'Age to',
    country: 'Country',
    city: 'City',
    submit: 'Search',
  },
  profileCard: {
    sent: 'Sent ✓',
    sendInterest: 'Send interest',
    lockLabel: 'Unlock with coins or VIP',
  },
  verificationBanner: {
    unverifiedTitle: 'Verify your account for free',
    unverifiedSubtitle: 'Get the "Serious verified member" badge and appear more often in search',
    pendingTitle: 'Verification under review',
    pendingSubtitle: "We're reviewing your documents and will let you know the result soon",
    rejectedTitle: 'Verification was rejected',
    rejectedSubtitle: 'Try sending a clearer document, or contact support',
    verifyNow: 'Verify now',
  },
  matches: {
    title: 'Interests & matches',
    loading: 'Loading...',
    empty: "You don't have any interests yet",
    statusPending: 'Pending',
    statusAccepted: 'Matched',
    statusRejected: 'Rejected',
    statusEngaged: 'Engaged 💍',
    directionSent: 'You sent interest',
    directionReceived: 'Sent you interest',
    accept: 'Accept',
    reject: 'Reject',
    chat: 'Chat',
    markEngaged: 'Mark as engaged',
  },
  chat: {
    freeMessages: (used, limit) => `${used}/${limit} free messages`,
    limitReached: "You've reached the free message limit",
    unlockChat: 'Unlock chat',
    placeholder: 'Type your message...',
    send: 'Send',
    errorSendFailed: 'Could not send the message',
    errorUnlockFailed: 'Not enough coins, top up or upgrade to VIP',
    vipComingSoon: 'VIP plan coming soon 🚀',
  },
  paywallModal: {
    title: "You've reached an important step!",
    body: (coinCost) =>
      `To keep chatting smoothly, unlock with ${coinCost} coins or upgrade to VIP for unlimited chat`,
    upgradeVip: 'Upgrade to VIP',
    unlockWithCoins: (coinCost) => `Unlock with ${coinCost} coins`,
    close: 'Close',
  },
  settings: {
    title: 'Settings',
    changePasswordTitle: 'Change password',
    changePasswordSubtitle: 'Enter your current password and set a new one',
    currentPasswordLabel: 'Current password',
    newPasswordLabel: 'New password',
    confirmPasswordLabel: 'Confirm new password',
    save: 'Save',
    success: 'Password changed successfully',
    errorWrongPassword: 'Current password is incorrect',
  },
  profile: {
    title: 'My profile',
    subtitle: 'Edit the information other members can see',
    firstNameLabel: 'First name',
    currentCityLabel: 'City',
    residenceCountryLabel: 'Current country of residence',
    originCountryLabel: 'Country of origin',
    relocationLabel: 'Willingness to relocate or marry someone abroad',
    relocationOpen: 'Open to relocating',
    relocationExpat: 'Looking within the diaspora',
    relocationLocal: 'Local only',
    jobTitleLabel: 'Job title (optional)',
    bioLabel: 'About you (optional)',
    photoLabel: 'Profile photo',
    save: 'Save changes',
    success: 'Your information was updated successfully',
    errorGeneric: 'Something went wrong, please try again',
  },
  store: {
    title: 'Store & plans',
    coinPackagesTitle: 'Coin packages',
    topUp: 'Top up',
    topUpFor: (coins) => `Top up ${coins} coins`,
    vipPerks: 'Unlimited chat, see all visitors, and priority visibility',
    upgradeNow: 'Upgrade now',
    upgradeTitle: 'VIP subscription',
    historyTitle: 'Transaction history',
    historyEmpty: 'No transactions yet',
    statusPending: 'Pending',
    statusSuccess: 'Confirmed ✓',
    statusFailed: 'Rejected',
    typeCoinPurchase: 'Coin purchase',
    typeVipSubscription: 'VIP subscription',
    typeVerificationFee: 'Verification',
  },
  paymentModal: {
    choosePaymentMethod: 'Choose a payment method',
    bankTransfer: 'Bank transfer',
    cashPlus: 'Cash Plus',
    sendCryptoTo: (amount) => `Send ${amount} MAD (USDT) to this address:`,
    placeholderWarningCrypto: '⚠️ This is a demo placeholder address, not a real one — must be replaced before launch',
    transferTo: (amount) => `Transfer ${amount} MAD to:`,
    placeholderWarningBank: '⚠️ This is placeholder data — must be replaced before launch',
    txHashLabel: 'TxHash',
    receiptLabel: 'Receipt photo',
    close: 'Close',
    confirmPayment: 'Confirm',
    doneTitle: 'Your request was sent for review',
    doneSubtitle: "We'll confirm the transaction and activate the service soon",
    doneButton: 'Got it',
    errorGeneric: 'Something went wrong, please try again',
  },
  verification: {
    title: 'Verify your account for free',
    subtitle: 'Submit your ID card or Passport to get the "Serious verified member" badge and boost your visibility',
    idLabel: 'ID card / Passport photo',
    residencyLabel: 'Foreign residency document (optional)',
    submit: 'Submit for review',
    skip: "Skip for now, I'll verify later",
    alreadyVerified: 'Your account is already verified ✓',
    alreadyPending: 'Your verification request is under review, we will let you know the result soon',
  },
  visitors: {
    title: 'Your profile visitors',
    subtitle: 'These are the people who recently visited your profile',
    lockedBanner: (count) => `${count} other visitors viewed your profile! Upgrade to VIP to see who they are`,
    loading: 'Loading...',
    empty: 'No one has visited your profile yet',
    lockLabel: 'Upgrade to VIP',
    lockedName: '••••••',
    unknownVisitorAlt: 'Locked visitor',
  },
  promoInput: {
    title: 'Have a promo code?',
    subtitle: 'Enter the code and activate your reward instantly',
    placeholder: 'e.g. QISMA2026',
    activate: 'Activate',
    success: (reward) => `Code activated! You got ${reward}.`,
    rewardVipDays: (value) => `${value} days of free VIP`,
    rewardCoins: (value) => `${value} coins`,
    rewardCrossBorder: 'International marriage / diaspora feature unlocked',
  },
  referralCard: {
    title: 'Share with your friends',
    subtitle: 'Every friend who verifies their account through your link earns you both 10 coins.',
    copyLink: 'Copy link',
    copied: 'Copied',
    whatsapp: 'WhatsApp',
    facebook: 'Facebook',
    shareText: (link) =>
      `Sign up with me on Qisma W Nasib, the serious platform for halal marriage 💍 Use my link: ${link}`,
    totalReferredLabel: 'Signed up via link',
    verifiedReferredLabel: 'Verified & earned coins',
  },
  imageUploader: {
    uploading: 'Uploading...',
    changePhoto: 'Change photo',
    choosePhoto: 'Choose photo',
    errorUploadFailed: 'Could not upload the photo, please try again',
  },
  languageSelector: {
    label: 'Language',
  },
};

const es: AppDictionary = {
  common: {
    brand: 'Qisma W Nasib',
    errorGeneric: 'Ocurrió un problema, inténtalo de nuevo',
    loading: 'Cargando...',
    logout: 'Cerrar sesión',
    close: 'Cerrar',
    confirm: 'Confirmar',
    save: 'Guardar',
  },
  nav: {
    search: 'Buscar',
    visitors: 'Visitantes',
    matches: 'Intereses',
    store: 'Tienda',
    profileAria: 'Perfil',
    settingsAria: 'Ajustes',
    logoutAria: 'Cerrar sesión',
    themeAria: 'Cambiar modo oscuro/claro',
  },
  login: {
    title: 'Bienvenido de nuevo',
    subtitle: 'Inicia sesión y continúa tu camino hacia el matrimonio',
    phoneLabel: 'Número de teléfono',
    phonePlaceholder: '+212600000000',
    passwordLabel: 'Contraseña',
    submit: 'Iniciar sesión',
    errorInvalid: 'Número de teléfono o contraseña incorrectos',
    noAccount: '¿No tienes una cuenta?',
    registerLink: 'Regístrate ahora',
  },
  register: {
    title: 'Crear una cuenta nueva',
    stepOf: (step, total) => `Paso ${step} de ${total}`,
    phoneLabel: 'Número de teléfono',
    phonePlaceholder: '+212600000000',
    phoneRequired: 'El número de teléfono es obligatorio',
    emailLabel: 'Correo electrónico',
    emailPlaceholder: 'ejemplo@email.com',
    emailRequired: 'El correo electrónico es obligatorio',
    emailInvalid: 'Ingresa un correo electrónico válido',
    errorEmailTaken: 'Este correo electrónico ya está registrado',
    passwordLabel: 'Contraseña',
    passwordRequired: 'La contraseña es obligatoria',
    passwordMinLength: 'Debe tener al menos 8 caracteres',
    firstNameLabel: 'Nombre',
    firstNameRequired: 'El nombre es obligatorio',
    genderLabel: 'Género',
    genderMale: 'Hombre',
    genderFemale: 'Mujer',
    birthDateLabel: 'Fecha de nacimiento',
    birthDateRequired: 'La fecha de nacimiento es obligatoria',
    residenceCountryLabel: 'País de residencia actual',
    residenceCountryPlaceholder: 'Marruecos, Francia, Emiratos...',
    residenceCountryRequired: 'El país de residencia es obligatorio',
    currentCityLabel: 'Ciudad',
    currentCityRequired: 'La ciudad es obligatoria',
    originCountryLabel: 'País de origen',
    originCountryRequired: 'El país de origen es obligatorio',
    relocationLabel: 'Disposición a mudarte o casarte con la diáspora',
    relocationOpen: 'Dispuesto/a a mudarme',
    relocationExpat: 'Busco en la diáspora',
    relocationLocal: 'Solo en mi país',
    jobTitleLabel: 'Profesión (opcional)',
    bioLabel: 'Biografía (opcional)',
    photoLabel: 'Foto de perfil (opcional)',
    back: 'Atrás',
    next: 'Siguiente',
    submit: 'Crear cuenta',
    errorPhoneTaken: 'Este número de teléfono ya está registrado',
    haveAccount: '¿Ya tienes una cuenta?',
    loginLink: 'Iniciar sesión',
  },
  feed: {
    greeting: (firstName) => `Hola ${firstName} 👋`,
    interestsToday: (sent, limit) => `${sent}/${limit} intereses hoy`,
    errorSearchFailed: 'No se pudieron cargar los resultados, inténtalo de nuevo',
    errorSendInterestFailed: 'No se pudo enviar el interés',
    noResults: 'Aún no hay resultados, intenta cambiar los filtros',
  },
  searchFilters: {
    local: 'Búsqueda local',
    diaspora: 'Diáspora / Matrimonio internacional',
    ageFrom: 'Edad desde',
    ageTo: 'Edad hasta',
    country: 'País',
    city: 'Ciudad',
    submit: 'Buscar',
  },
  profileCard: {
    sent: 'Enviado ✓',
    sendInterest: 'Enviar interés',
    lockLabel: 'Desbloquear con monedas o VIP',
  },
  verificationBanner: {
    unverifiedTitle: 'Verifica tu cuenta gratis',
    unverifiedSubtitle: 'Obtén la insignia "Miembro serio verificado" y aparece más en las búsquedas',
    pendingTitle: 'Verificación en revisión',
    pendingSubtitle: 'Estamos revisando tus documentos y te avisaremos del resultado pronto',
    rejectedTitle: 'Verificación rechazada',
    rejectedSubtitle: 'Intenta enviar un documento más claro, o contacta con soporte',
    verifyNow: 'Verificar ahora',
  },
  matches: {
    title: 'Intereses y coincidencias',
    loading: 'Cargando...',
    empty: 'Aún no tienes ningún interés',
    statusPending: 'Pendiente',
    statusAccepted: 'Compatibles',
    statusRejected: 'Rechazado',
    statusEngaged: 'Comprometidos 💍',
    directionSent: 'Interés enviado',
    directionReceived: 'Te envió un interés',
    accept: 'Aceptar',
    reject: 'Rechazar',
    chat: 'Chat',
    markEngaged: 'Marcar como comprometidos',
  },
  chat: {
    freeMessages: (used, limit) => `${used}/${limit} mensajes gratis`,
    limitReached: 'Has alcanzado el límite de mensajes gratis',
    unlockChat: 'Desbloquear chat',
    placeholder: 'Escribe tu mensaje...',
    send: 'Enviar',
    errorSendFailed: 'No se pudo enviar el mensaje',
    errorUnlockFailed: 'No tienes monedas suficientes, recarga o hazte VIP',
    vipComingSoon: 'Plan VIP próximamente 🚀',
  },
  paywallModal: {
    title: '¡Has llegado a un paso importante!',
    body: (coinCost) =>
      `Para seguir chateando sin interrupciones, desbloquea con ${coinCost} monedas o hazte VIP para chatear sin límites`,
    upgradeVip: 'Hazte VIP',
    unlockWithCoins: (coinCost) => `Desbloquear con ${coinCost} monedas`,
    close: 'Cerrar',
  },
  settings: {
    title: 'Ajustes',
    changePasswordTitle: 'Cambiar contraseña',
    changePasswordSubtitle: 'Ingresa tu contraseña actual y elige una nueva',
    currentPasswordLabel: 'Contraseña actual',
    newPasswordLabel: 'Nueva contraseña',
    confirmPasswordLabel: 'Confirmar nueva contraseña',
    save: 'Guardar',
    success: 'Contraseña cambiada con éxito',
    errorWrongPassword: 'La contraseña actual es incorrecta',
  },
  profile: {
    title: 'Mi perfil',
    subtitle: 'Edita la información que ven los demás miembros',
    firstNameLabel: 'Nombre',
    currentCityLabel: 'Ciudad',
    residenceCountryLabel: 'País de residencia actual',
    originCountryLabel: 'País de origen',
    relocationLabel: 'Disposición a mudarse o casarse con alguien de la diáspora',
    relocationOpen: 'Dispuesto/a a mudarme',
    relocationExpat: 'Busco en la diáspora',
    relocationLocal: 'Solo en mi país',
    jobTitleLabel: 'Profesión (opcional)',
    bioLabel: 'Sobre ti (opcional)',
    photoLabel: 'Foto de perfil',
    save: 'Guardar cambios',
    success: 'Tu información se actualizó con éxito',
    errorGeneric: 'Ocurrió un problema, inténtalo de nuevo',
  },
  store: {
    title: 'Tienda y planes',
    coinPackagesTitle: 'Paquetes de monedas',
    topUp: 'Recargar',
    topUpFor: (coins) => `Recargar ${coins} monedas`,
    vipPerks: 'Chat ilimitado, ver todos los visitantes y prioridad de visibilidad',
    upgradeNow: 'Hazte VIP ahora',
    upgradeTitle: 'Suscripción VIP',
    historyTitle: 'Historial de transacciones',
    historyEmpty: 'Aún no hay transacciones',
    statusPending: 'Pendiente',
    statusSuccess: 'Confirmada ✓',
    statusFailed: 'Rechazada',
    typeCoinPurchase: 'Compra de monedas',
    typeVipSubscription: 'Suscripción VIP',
    typeVerificationFee: 'Verificación',
  },
  paymentModal: {
    choosePaymentMethod: 'Elige un método de pago',
    bankTransfer: 'Transferencia bancaria',
    cashPlus: 'Cash Plus',
    sendCryptoTo: (amount) => `Envía ${amount} MAD (USDT) a esta dirección:`,
    placeholderWarningCrypto:
      '⚠️ Esta dirección es un placeholder de demostración, no una dirección real — debe reemplazarse antes del lanzamiento',
    transferTo: (amount) => `Transfiere ${amount} MAD a:`,
    placeholderWarningBank: '⚠️ Estos son datos de placeholder — deben reemplazarse antes del lanzamiento',
    txHashLabel: 'TxHash',
    receiptLabel: 'Foto del recibo',
    close: 'Cerrar',
    confirmPayment: 'Confirmar',
    doneTitle: 'Tu solicitud fue enviada para revisión',
    doneSubtitle: 'Confirmaremos la transacción y activaremos el servicio pronto',
    doneButton: 'Entendido',
    errorGeneric: 'Ocurrió un problema, inténtalo de nuevo',
  },
  verification: {
    title: 'Verifica tu cuenta gratis',
    subtitle:
      'Envía tu DNI/CIN o Pasaporte para obtener la insignia "Miembro serio verificado" y aumentar tu visibilidad',
    idLabel: 'Foto de DNI/CIN o Pasaporte',
    residencyLabel: 'Documento de residencia en el extranjero (opcional)',
    submit: 'Enviar para revisión',
    skip: 'Omitir por ahora, verificaré después',
    alreadyVerified: 'Tu cuenta ya está verificada ✓',
    alreadyPending: 'Tu solicitud de verificación está en revisión, te avisaremos del resultado pronto',
  },
  visitors: {
    title: 'Visitantes de tu perfil',
    subtitle: 'Estas son las personas que visitaron tu perfil recientemente',
    lockedBanner: (count) => `¡${count} otros visitantes vieron tu perfil! Hazte VIP para ver quiénes son`,
    loading: 'Cargando...',
    empty: 'Todavía nadie ha visitado tu perfil',
    lockLabel: 'Hazte VIP',
    lockedName: '••••••',
    unknownVisitorAlt: 'Visitante bloqueado',
  },
  promoInput: {
    title: '¿Tienes un código promocional?',
    subtitle: 'Ingresa el código y activa tu recompensa al instante',
    placeholder: 'Ej: QISMA2026',
    activate: 'Activar',
    success: (reward) => `¡Código activado! Obtuviste ${reward}.`,
    rewardVipDays: (value) => `${value} días de VIP gratis`,
    rewardCoins: (value) => `${value} monedas`,
    rewardCrossBorder: 'Función de matrimonio internacional / diáspora desbloqueada',
  },
  referralCard: {
    title: 'Comparte con tus amigos',
    subtitle: 'Cada amigo que verifique su cuenta con tu enlace les da 10 monedas a ambos.',
    copyLink: 'Copiar enlace',
    copied: 'Copiado',
    whatsapp: 'WhatsApp',
    facebook: 'Facebook',
    shareText: (link) =>
      `Regístrate conmigo en Qisma W Nasib, la plataforma seria para el matrimonio halal 💍 Usa mi enlace: ${link}`,
    totalReferredLabel: 'Registrados con el enlace',
    verifiedReferredLabel: 'Verificados y monedas ganadas',
  },
  imageUploader: {
    uploading: 'Subiendo...',
    changePhoto: 'Cambiar foto',
    choosePhoto: 'Elegir foto',
    errorUploadFailed: 'No se pudo subir la foto, inténtalo de nuevo',
  },
  languageSelector: {
    label: 'Idioma',
  },
};

export const appDictionaries: Record<Locale, AppDictionary> = { ar, fr, en, es };
