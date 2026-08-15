import type { Locale } from '@/store/locale.store';

export interface AppDictionary {
  common: {
    errorGeneric: string;
    logout: string;
    close: string;
    confirm: string;
    save: string;
    ok: string;
  };
  nav: {
    search: string;
    visitors: string;
    matches: string;
    store: string;
    settingsIcon: string;
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
    passwordLabel: string;
    errorFieldsRequired: string;
    firstNameLabel: string;
    genderLabel: string;
    genderMale: string;
    genderFemale: string;
    birthDateLabel: string;
    birthDatePlaceholder: string;
    residenceCountryLabel: string;
    residenceCountryPlaceholder: string;
    currentCityLabel: string;
    originCountryLabel: string;
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
    errorPasswordTooShort: string;
    errorPasswordMismatch: string;
    errorWrongPassword: string;
    languageTitle: string;
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
    vipPlanLabel: string;
    vipPricePerMonth: string;
    coinPriceLabels: [string, string, string];
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
    empty: string;
    lockLabel: string;
    lockedName: string;
  };
  imageUploader: {
    permissionDenied: string;
    uploading: string;
    changePhoto: string;
    choosePhoto: string;
    errorUploadFailed: string;
  };
  languageSelector: {
    title: string;
  };
}

const ar: AppDictionary = {
  common: {
    errorGeneric: 'كاين مشكل، حاول مرة أخرى',
    logout: 'خروج',
    close: 'إغلاق',
    confirm: 'تأكيد',
    save: 'حفظ',
    ok: 'تمام',
  },
  nav: {
    search: 'البحث',
    visitors: 'الزوار',
    matches: 'الاهتمامات',
    store: 'المتجر',
    settingsIcon: '⚙️',
  },
  login: {
    title: 'مرحباً بك من جديد',
    subtitle: 'دخل لحسابك وكمّل رحلتك نحو الزواج',
    phoneLabel: 'رقم الهاتف',
    phonePlaceholder: '+212600000000',
    passwordLabel: 'الپاسوورد',
    submit: 'دخول',
    errorInvalid: 'رقم الهاتف أو الپاسوورد غير صحيحين',
    noAccount: 'ماعندكش حساب؟ ',
    registerLink: 'سجل دابا',
  },
  register: {
    title: 'إنشاء حساب جديد',
    stepOf: (step, total) => `خطوة ${step} من ${total}`,
    phoneLabel: 'رقم الهاتف',
    phonePlaceholder: '+212600000000',
    passwordLabel: 'الپاسوورد',
    errorFieldsRequired: 'خاصك تعمر الحقول المطلوبة',
    firstNameLabel: 'السمية',
    genderLabel: 'الجنس',
    genderMale: 'ذكر',
    genderFemale: 'أنثى',
    birthDateLabel: 'تاريخ الميلاد (YYYY-MM-DD)',
    birthDatePlaceholder: '1995-01-01',
    residenceCountryLabel: 'بلد الإقامة الحالية',
    residenceCountryPlaceholder: 'المغرب، فرنسا، الإمارات...',
    currentCityLabel: 'المدينة',
    originCountryLabel: 'بلد الأصل',
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
    haveAccount: 'عندك حساب من قبل؟ ',
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
    errorPasswordTooShort: 'الپاسوورد الجديد خاصو يكون 8 حروف على الأقل',
    errorPasswordMismatch: 'الپاسوورد الجديد ماشي متطابق مع التأكيد',
    errorWrongPassword: 'الپاسوورد الحالي غير صحيح',
    languageTitle: 'اللغة',
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
    vipPlanLabel: 'VIP شهري',
    vipPricePerMonth: '99 درهم / الشهر',
    coinPriceLabels: ['20 درهم', '50 درهم', '150 درهم'],
  },
  paymentModal: {
    choosePaymentMethod: 'اختار طريقة الدفع',
    bankTransfer: 'تحويل بنكي',
    cashPlus: 'Cash Plus',
    sendCryptoTo: (amount) => `صيفط ${amount} MAD (USDT) لهاد العنوان:`,
    placeholderWarningCrypto: '⚠️ هاد العنوان placeholder ديمو، خاصو يتبدل قبل الإطلاق',
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
    empty: 'حتى واحد مازال ما زار البروفايل ديالك',
    lockLabel: 'ترقى لـ VIP',
    lockedName: '••••••',
  },
  imageUploader: {
    permissionDenied: 'خاصنا الإذن باش نوصلو للصور',
    uploading: 'كتصيفط...',
    changePhoto: 'بدّل الصورة',
    choosePhoto: 'اختار صورة',
    errorUploadFailed: 'ماقدرناش نرفعو الصورة، حاول مرة أخرى',
  },
  languageSelector: {
    title: 'اختار اللغة',
  },
};

const fr: AppDictionary = {
  common: {
    errorGeneric: 'Un problème est survenu, réessayez',
    logout: 'Déconnexion',
    close: 'Fermer',
    confirm: 'Confirmer',
    save: 'Enregistrer',
    ok: "D'accord",
  },
  nav: {
    search: 'Recherche',
    visitors: 'Visiteurs',
    matches: 'Intérêts',
    store: 'Boutique',
    settingsIcon: '⚙️',
  },
  login: {
    title: 'Bon retour parmi nous',
    subtitle: 'Connectez-vous et poursuivez votre chemin vers le mariage',
    phoneLabel: 'Numéro de téléphone',
    phonePlaceholder: '+212600000000',
    passwordLabel: 'Mot de passe',
    submit: 'Se connecter',
    errorInvalid: 'Numéro de téléphone ou mot de passe incorrect',
    noAccount: "Vous n'avez pas de compte ? ",
    registerLink: "S'inscrire",
  },
  register: {
    title: 'Créer un nouveau compte',
    stepOf: (step, total) => `Étape ${step} sur ${total}`,
    phoneLabel: 'Numéro de téléphone',
    phonePlaceholder: '+212600000000',
    passwordLabel: 'Mot de passe',
    errorFieldsRequired: 'Veuillez remplir les champs requis',
    firstNameLabel: 'Prénom',
    genderLabel: 'Genre',
    genderMale: 'Homme',
    genderFemale: 'Femme',
    birthDateLabel: 'Date de naissance (AAAA-MM-JJ)',
    birthDatePlaceholder: '1995-01-01',
    residenceCountryLabel: 'Pays de résidence actuel',
    residenceCountryPlaceholder: 'Maroc, France, Émirats...',
    currentCityLabel: 'Ville',
    originCountryLabel: "Pays d'origine",
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
    haveAccount: 'Vous avez déjà un compte ? ',
    loginLink: 'Se connecter',
  },
  feed: {
    greeting: (firstName) => `Bonjour ${firstName} 👋`,
    interestsToday: (sent, limit) => `${sent}/${limit} intérêts aujourd'hui`,
    errorSearchFailed: 'Impossible de charger les résultats, réessayez',
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
    sendInterest: 'Envoyer un intérêt',
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
    errorPasswordTooShort: 'Le nouveau mot de passe doit contenir au moins 8 caractères',
    errorPasswordMismatch: 'Le nouveau mot de passe ne correspond pas à la confirmation',
    errorWrongPassword: 'Le mot de passe actuel est incorrect',
    languageTitle: 'Langue',
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
    vipPlanLabel: 'VIP mensuel',
    vipPricePerMonth: '99 MAD / mois',
    coinPriceLabels: ['20 MAD', '50 MAD', '150 MAD'],
  },
  paymentModal: {
    choosePaymentMethod: 'Choisissez un mode de paiement',
    bankTransfer: 'Virement bancaire',
    cashPlus: 'Cash Plus',
    sendCryptoTo: (amount) => `Envoyez ${amount} MAD (USDT) à cette adresse :`,
    placeholderWarningCrypto:
      "⚠️ Cette adresse est un placeholder de démo, à remplacer avant le lancement",
    transferTo: (amount) => `Virez ${amount} MAD à :`,
    placeholderWarningBank: '⚠️ Ces informations sont des placeholders, à remplacer avant le lancement',
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
    residencyLabel: "Justificatif de résidence à l'étranger (optionnel)",
    submit: 'Envoyer pour examen',
    skip: 'Passer pour le moment, vérifier plus tard',
    alreadyVerified: 'Votre compte est déjà vérifié ✓',
    alreadyPending: "Votre demande de vérification est en cours d'examen, nous vous informerons bientôt",
  },
  visitors: {
    title: 'Visiteurs de votre profil',
    subtitle: 'Voici les personnes qui ont récemment visité votre profil',
    lockedBanner: (count) => `${count} autres visiteurs ont vu votre profil ! Passez VIP pour découvrir qui ils sont`,
    empty: "Personne n'a encore visité votre profil",
    lockLabel: 'Passer VIP',
    lockedName: '••••••',
  },
  imageUploader: {
    permissionDenied: "Nous avons besoin de l'autorisation d'accéder à vos photos",
    uploading: 'Envoi en cours...',
    changePhoto: 'Changer la photo',
    choosePhoto: 'Choisir une photo',
    errorUploadFailed: "Impossible d'envoyer la photo, réessayez",
  },
  languageSelector: {
    title: 'Choisir la langue',
  },
};

const en: AppDictionary = {
  common: {
    errorGeneric: 'Something went wrong, please try again',
    logout: 'Log out',
    close: 'Close',
    confirm: 'Confirm',
    save: 'Save',
    ok: 'Got it',
  },
  nav: {
    search: 'Search',
    visitors: 'Visitors',
    matches: 'Interests',
    store: 'Store',
    settingsIcon: '⚙️',
  },
  login: {
    title: 'Welcome back',
    subtitle: 'Log in to your account and continue your journey to marriage',
    phoneLabel: 'Phone number',
    phonePlaceholder: '+212600000000',
    passwordLabel: 'Password',
    submit: 'Log in',
    errorInvalid: 'Incorrect phone number or password',
    noAccount: "Don't have an account? ",
    registerLink: 'Sign up now',
  },
  register: {
    title: 'Create a new account',
    stepOf: (step, total) => `Step ${step} of ${total}`,
    phoneLabel: 'Phone number',
    phonePlaceholder: '+212600000000',
    passwordLabel: 'Password',
    errorFieldsRequired: 'Please fill in the required fields',
    firstNameLabel: 'First name',
    genderLabel: 'Gender',
    genderMale: 'Male',
    genderFemale: 'Female',
    birthDateLabel: 'Date of birth (YYYY-MM-DD)',
    birthDatePlaceholder: '1995-01-01',
    residenceCountryLabel: 'Current country of residence',
    residenceCountryPlaceholder: 'Morocco, France, UAE...',
    currentCityLabel: 'City',
    originCountryLabel: 'Country of origin',
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
    haveAccount: 'Already have an account? ',
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
    body: (coinCost) => `To keep chatting smoothly, unlock with ${coinCost} coins or upgrade to VIP for unlimited chat`,
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
    errorPasswordTooShort: 'New password must be at least 8 characters',
    errorPasswordMismatch: "New password doesn't match the confirmation",
    errorWrongPassword: 'Current password is incorrect',
    languageTitle: 'Language',
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
    vipPlanLabel: 'Monthly VIP',
    vipPricePerMonth: '99 MAD / month',
    coinPriceLabels: ['20 MAD', '50 MAD', '150 MAD'],
  },
  paymentModal: {
    choosePaymentMethod: 'Choose a payment method',
    bankTransfer: 'Bank transfer',
    cashPlus: 'Cash Plus',
    sendCryptoTo: (amount) => `Send ${amount} MAD (USDT) to this address:`,
    placeholderWarningCrypto: '⚠️ This is a demo placeholder address — must be replaced before launch',
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
    empty: 'No one has visited your profile yet',
    lockLabel: 'Upgrade to VIP',
    lockedName: '••••••',
  },
  imageUploader: {
    permissionDenied: 'We need permission to access your photos',
    uploading: 'Uploading...',
    changePhoto: 'Change photo',
    choosePhoto: 'Choose photo',
    errorUploadFailed: 'Could not upload the photo, please try again',
  },
  languageSelector: {
    title: 'Choose a language',
  },
};

const es: AppDictionary = {
  common: {
    errorGeneric: 'Ocurrió un problema, inténtalo de nuevo',
    logout: 'Cerrar sesión',
    close: 'Cerrar',
    confirm: 'Confirmar',
    save: 'Guardar',
    ok: 'Entendido',
  },
  nav: {
    search: 'Buscar',
    visitors: 'Visitantes',
    matches: 'Intereses',
    store: 'Tienda',
    settingsIcon: '⚙️',
  },
  login: {
    title: 'Bienvenido de nuevo',
    subtitle: 'Inicia sesión y continúa tu camino hacia el matrimonio',
    phoneLabel: 'Número de teléfono',
    phonePlaceholder: '+212600000000',
    passwordLabel: 'Contraseña',
    submit: 'Iniciar sesión',
    errorInvalid: 'Número de teléfono o contraseña incorrectos',
    noAccount: '¿No tienes una cuenta? ',
    registerLink: 'Regístrate ahora',
  },
  register: {
    title: 'Crear una cuenta nueva',
    stepOf: (step, total) => `Paso ${step} de ${total}`,
    phoneLabel: 'Número de teléfono',
    phonePlaceholder: '+212600000000',
    passwordLabel: 'Contraseña',
    errorFieldsRequired: 'Completa los campos obligatorios',
    firstNameLabel: 'Nombre',
    genderLabel: 'Género',
    genderMale: 'Hombre',
    genderFemale: 'Mujer',
    birthDateLabel: 'Fecha de nacimiento (AAAA-MM-DD)',
    birthDatePlaceholder: '1995-01-01',
    residenceCountryLabel: 'País de residencia actual',
    residenceCountryPlaceholder: 'Marruecos, Francia, Emiratos...',
    currentCityLabel: 'Ciudad',
    originCountryLabel: 'País de origen',
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
    haveAccount: '¿Ya tienes una cuenta? ',
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
    errorPasswordTooShort: 'La nueva contraseña debe tener al menos 8 caracteres',
    errorPasswordMismatch: 'La nueva contraseña no coincide con la confirmación',
    errorWrongPassword: 'La contraseña actual es incorrecta',
    languageTitle: 'Idioma',
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
    vipPlanLabel: 'VIP mensual',
    vipPricePerMonth: '99 MAD / mes',
    coinPriceLabels: ['20 MAD', '50 MAD', '150 MAD'],
  },
  paymentModal: {
    choosePaymentMethod: 'Elige un método de pago',
    bankTransfer: 'Transferencia bancaria',
    cashPlus: 'Cash Plus',
    sendCryptoTo: (amount) => `Envía ${amount} MAD (USDT) a esta dirección:`,
    placeholderWarningCrypto: '⚠️ Esta es una dirección de demostración — debe reemplazarse antes del lanzamiento',
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
    empty: 'Todavía nadie ha visitado tu perfil',
    lockLabel: 'Hazte VIP',
    lockedName: '••••••',
  },
  imageUploader: {
    permissionDenied: 'Necesitamos permiso para acceder a tus fotos',
    uploading: 'Subiendo...',
    changePhoto: 'Cambiar foto',
    choosePhoto: 'Elegir foto',
    errorUploadFailed: 'No se pudo subir la foto, inténtalo de nuevo',
  },
  languageSelector: {
    title: 'Elegir idioma',
  },
};

export const dictionaries: Record<Locale, AppDictionary> = { ar, fr, en, es };
