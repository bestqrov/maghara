import type { Locale } from '@/lib/seo';

export interface LandingDictionary {
  nav: {
    features: string;
    how: string;
    trust: string;
    successStories: string;
    soon: string;
    login: string;
    register: string;
    ariaLabel: string;
  };
  hero: {
    badge: string;
    h1Main: string;
    h1Accent: string;
    text: string;
    ctaRegister: string;
    ctaLogin: string;
    storesSoon: string;
    trustPoints: [string, string, string];
  };
  phoneMockup: {
    chooseLabel: string;
    searchHusband: string;
    searchWife: string;
    ctaButton: string;
    whyTitle: string;
    miniFeatures: [string, string, string];
  };
  features: {
    heading: string;
    items: [
      { title: string; text: string },
      { title: string; text: string },
      { title: string; text: string },
      { title: string; text: string },
    ];
  };
  steps: {
    heading: string;
    items: [{ title: string; text: string }, { title: string; text: string }, { title: string; text: string }];
  };
  trustStrip: {
    title: string;
    text: string;
    cta: string;
  };
  finalCta: {
    heading: string;
    text: string;
    button: string;
  };
  keywords: {
    links: [string, string, string, string, string, string, string];
    soon: [string, string];
  };
  footer: {
    text: string;
  };
}

const ar: LandingDictionary = {
  nav: {
    features: 'مميزاتنا',
    how: 'كيف تعمل المنصة',
    trust: 'الخصوصية والأمان',
    successStories: 'قصص نجاح',
    soon: 'قريبًا',
    login: 'تسجيل الدخول',
    register: 'سجّل الآن',
    ariaLabel: 'التنقل الرئيسي',
  },
  hero: {
    badge: 'منصة إلكترونية للتعارف بقصد الزواج الحلال',
    h1Main: 'الزواج الحلالُ يبدأ',
    h1Accent: 'بخطوةٍ جادّة',
    text: 'منصةُ تعارفٍ موثوقة تجمع المقيمين في الوطن وأبناء الجالية في الخارج، بستْرٍ وأمان، بعيدًا عن الحسابات الوهمية.',
    ctaRegister: 'أنشئ حسابك الآن',
    ctaLogin: 'لديّ حساب، تسجيل الدخول',
    storesSoon: 'قريبًا على App Store وGoogle Play',
    trustPoints: ['تسجيلٌ مجاني بالكامل', 'بياناتك مشفَّرة وآمنة', 'دعمٌ ومتابعة بالعربية'],
  },
  phoneMockup: {
    chooseLabel: 'اختر ما يناسبك',
    searchHusband: 'أبحث عن زوج',
    searchWife: 'أبحث عن زوجة',
    ctaButton: 'أنشئ حسابك الآن',
    whyTitle: 'لماذا قسمة و نصيب؟',
    miniFeatures: ['ملفات موثّقة', 'خصوصية تامة', 'تعارف جادّ'],
  },
  features: {
    heading: 'ما الذي يميّزنا؟',
    items: [
      {
        title: 'توثيقٌ جادّ',
        text: 'كل ملفٍ تعريفي موثَّق بالهوية أو الإقامة يظهر أولًا في نتائج البحث، لتطمئن أنك تتحدث إلى شخصٍ حقيقي.',
      },
      {
        title: 'الزواج الدولي والجالية',
        text: 'صفِّ نتائج البحث بين المقيمين في الوطن وأبناء الجالية في الخارج، وحدِّد استعدادك للانتقال.',
      },
      {
        title: 'مَن زار ملفّك؟',
        text: 'تابع آخر الزوّار الذين اطّلعوا على ملفك التعريفي، واكتشف مَن أبدى اهتمامه بك.',
      },
      {
        title: 'محادثةٌ آمنة',
        text: 'لا يُسمح بتبادل الأرقام أو روابط التواصل داخل المحادثة، فيبقى الحوار محفوظًا داخل المنصة حتى يتم التوافق.',
      },
    ],
  },
  steps: {
    heading: 'كيف تسير الرحلة؟',
    items: [
      { title: 'أنشئ ملفّك التعريفي', text: 'أكمل بياناتك، وحدِّد بلد إقامتك وأصلك، وأضِف صورتك.' },
      { title: 'ابحث وتواصل', text: 'صفِّ النتائج حسب المدينة والبلد، وابعث اهتمامك لمن يعجبك.' },
      { title: 'وثِّق وتزوَّج', text: 'وثِّق هويتك، أكمِل الحوار، وسجِّل الخطوبة عند حصول التوافق.' },
    ],
  },
  trustStrip: {
    title: 'الستْر والخصوصية أولًا',
    text: 'الصور محجوبة حتى يتحقّق التوافق المتبادل، والمحادثة محمية من تبادل معلومات الاتصال.',
    cta: 'ابدأ رحلتك',
  },
  finalCta: {
    heading: 'جاهزٌ لتبدأ رحلتك نحو الزواج الحلال؟',
    text: 'انضمّ الآن مجانًا، وابدأ البحث عن شريك حياتك بستْرٍ وجدّية.',
    button: 'أنشئ حسابك الآن',
  },
  keywords: {
    links: ['تطبيق زواج', 'للمسلمين', 'مجاني', 'تعارف جادّ', 'تشات آمن', 'توثيق', 'الجالية والمهجر'],
    soon: ['الخطّابة', 'قصص الزواج'],
  },
  footer: {
    text: 'قسمة و نصيب — منصةٌ للتعارف بقصد الزواج الحلال',
  },
};

const fr: LandingDictionary = {
  nav: {
    features: 'Nos atouts',
    how: 'Comment ça marche',
    trust: 'Confidentialité et sécurité',
    successStories: 'Success stories',
    soon: 'Bientôt',
    login: 'Se connecter',
    register: "S'inscrire",
    ariaLabel: 'Navigation principale',
  },
  hero: {
    badge: 'La plateforme en ligne pour un mariage halal',
    h1Main: 'Le mariage halal commence',
    h1Accent: 'par une démarche sérieuse',
    text: 'Une plateforme de rencontre fiable qui réunit les résidents du pays et la diaspora à l\'étranger, avec pudeur et sécurité, loin des faux profils.',
    ctaRegister: 'Créer mon compte',
    ctaLogin: "J'ai un compte, se connecter",
    storesSoon: 'Bientôt sur App Store et Google Play',
    trustPoints: ['Inscription entièrement gratuite', 'Vos données sont chiffrées et sécurisées', 'Support en arabe'],
  },
  phoneMockup: {
    chooseLabel: 'Choisissez ce qui vous convient',
    searchHusband: 'Je cherche un mari',
    searchWife: 'Je cherche une épouse',
    ctaButton: 'Créer mon compte',
    whyTitle: 'Pourquoi Qisma W Nasib ?',
    miniFeatures: ['Profils vérifiés', 'Confidentialité totale', 'Rencontres sérieuses'],
  },
  features: {
    heading: 'Ce qui nous distingue',
    items: [
      {
        title: 'Vérification sérieuse',
        text: "Chaque profil vérifié par pièce d'identité ou de résidence apparaît en premier dans les résultats, pour discuter en toute confiance avec de vraies personnes.",
      },
      {
        title: 'Mariage international et diaspora',
        text: 'Filtrez les résultats entre résidents du pays et membres de la diaspora, et précisez votre disposition à déménager.',
      },
      {
        title: 'Qui a visité votre profil ?',
        text: 'Suivez les derniers visiteurs de votre profil, et découvrez qui s\'intéresse à vous.',
      },
      {
        title: 'Discussion sécurisée',
        text: "L'échange de numéros ou de liens de contact est interdit dans la discussion, qui reste protégée sur la plateforme jusqu'à l'accord mutuel.",
      },
    ],
  },
  steps: {
    heading: 'Comment se déroule le parcours ?',
    items: [
      { title: 'Créez votre profil', text: 'Complétez vos informations, indiquez votre pays de résidence et d\'origine, et ajoutez votre photo.' },
      { title: 'Recherchez et échangez', text: 'Filtrez les résultats par ville et pays, et manifestez votre intérêt à qui vous plaît.' },
      { title: 'Vérifiez-vous et mariez-vous', text: 'Vérifiez votre identité, poursuivez la discussion, et enregistrez vos fiançailles une fois l\'accord trouvé.' },
    ],
  },
  trustStrip: {
    title: "La pudeur et la confidentialité d'abord",
    text: "Les photos restent floutées jusqu'à un accord mutuel, et la discussion est protégée contre l'échange de coordonnées.",
    cta: 'Commencer mon parcours',
  },
  finalCta: {
    heading: 'Prêt à commencer votre parcours vers le mariage halal ?',
    text: 'Rejoignez-nous gratuitement dès maintenant, et commencez à chercher votre partenaire de vie avec pudeur et sérieux.',
    button: 'Créer mon compte',
  },
  keywords: {
    links: [
      'Appli de mariage',
      'Pour les musulmans',
      'Gratuit',
      'Rencontre sérieuse',
      'Chat sécurisé',
      'Vérification',
      'Diaspora et expatriés',
    ],
    soon: ['Khettaba', "Histoires de mariage"],
  },
  footer: {
    text: 'Qisma W Nasib — la plateforme de rencontre pour un mariage halal',
  },
};

const en: LandingDictionary = {
  nav: {
    features: 'Features',
    how: 'How it works',
    trust: 'Privacy & security',
    successStories: 'Success stories',
    soon: 'Coming soon',
    login: 'Log in',
    register: 'Sign up now',
    ariaLabel: 'Main navigation',
  },
  hero: {
    badge: 'The online platform for halal marriage',
    h1Main: 'Halal marriage starts',
    h1Accent: 'with a serious step',
    text: 'A trusted matchmaking platform bringing together residents back home and the diaspora abroad, with modesty and security, far from fake accounts.',
    ctaRegister: 'Create my account',
    ctaLogin: 'I have an account, log in',
    storesSoon: 'Coming soon to the App Store and Google Play',
    trustPoints: ['Completely free registration', 'Your data is encrypted and secure', 'Support available in Arabic'],
  },
  phoneMockup: {
    chooseLabel: 'Choose what suits you',
    searchHusband: "I'm looking for a husband",
    searchWife: "I'm looking for a wife",
    ctaButton: 'Create my account',
    whyTitle: 'Why Qisma W Nasib?',
    miniFeatures: ['Verified profiles', 'Complete privacy', 'Serious matchmaking'],
  },
  features: {
    heading: 'What sets us apart',
    items: [
      {
        title: 'Serious verification',
        text: 'Every ID- or residency-verified profile appears first in search results, so you can be confident you\'re talking to a real person.',
      },
      {
        title: 'International marriage & diaspora',
        text: 'Filter results between residents at home and diaspora members abroad, and set your willingness to relocate.',
      },
      {
        title: 'Who viewed your profile?',
        text: 'Track the latest visitors to your profile, and discover who has shown interest in you.',
      },
      {
        title: 'Secure conversations',
        text: "Sharing phone numbers or contact links inside the chat isn't allowed, keeping the conversation protected on the platform until there's mutual agreement.",
      },
    ],
  },
  steps: {
    heading: 'How does the journey work?',
    items: [
      { title: 'Create your profile', text: 'Complete your details, specify your country of residence and origin, and add your photo.' },
      { title: 'Search and connect', text: 'Filter results by city and country, and send your interest to whoever you like.' },
      { title: 'Verify and marry', text: 'Verify your identity, continue the conversation, and record your engagement once you\'ve found a match.' },
    ],
  },
  trustStrip: {
    title: 'Modesty and privacy come first',
    text: 'Photos stay hidden until mutual agreement is reached, and conversations are protected from the exchange of contact information.',
    cta: 'Start your journey',
  },
  finalCta: {
    heading: 'Ready to start your journey to halal marriage?',
    text: 'Join now for free, and start looking for your life partner with modesty and seriousness.',
    button: 'Create my account',
  },
  keywords: {
    links: [
      'Marriage app',
      'For Muslims',
      'Free',
      'Serious matchmaking',
      'Safe chat',
      'Verification',
      'Diaspora & expats',
    ],
    soon: ['Matchmakers', 'Marriage stories'],
  },
  footer: {
    text: 'Qisma W Nasib — the matchmaking platform for halal marriage',
  },
};

const es: LandingDictionary = {
  nav: {
    features: 'Ventajas',
    how: 'Cómo funciona',
    trust: 'Privacidad y seguridad',
    successStories: 'Historias de éxito',
    soon: 'Próximamente',
    login: 'Iniciar sesión',
    register: 'Regístrate ahora',
    ariaLabel: 'Navegación principal',
  },
  hero: {
    badge: 'La plataforma en línea para el matrimonio halal',
    h1Main: 'El matrimonio halal comienza',
    h1Accent: 'con un paso serio',
    text: 'Una plataforma de contactos confiable que reúne a residentes del país y a la diáspora en el extranjero, con pudor y seguridad, lejos de los perfiles falsos.',
    ctaRegister: 'Crear mi cuenta',
    ctaLogin: 'Ya tengo cuenta, iniciar sesión',
    storesSoon: 'Próximamente en App Store y Google Play',
    trustPoints: ['Registro totalmente gratuito', 'Tus datos están cifrados y seguros', 'Soporte disponible en árabe'],
  },
  phoneMockup: {
    chooseLabel: 'Elige lo que te conviene',
    searchHusband: 'Busco un esposo',
    searchWife: 'Busco una esposa',
    ctaButton: 'Crear mi cuenta',
    whyTitle: '¿Por qué Qisma W Nasib?',
    miniFeatures: ['Perfiles verificados', 'Privacidad total', 'Contactos serios'],
  },
  features: {
    heading: 'Lo que nos distingue',
    items: [
      {
        title: 'Verificación seria',
        text: 'Cada perfil verificado por identidad o residencia aparece primero en los resultados de búsqueda, para que tengas la confianza de hablar con una persona real.',
      },
      {
        title: 'Matrimonio internacional y diáspora',
        text: 'Filtra los resultados entre residentes del país y miembros de la diáspora en el extranjero, y define tu disposición a mudarte.',
      },
      {
        title: '¿Quién visitó tu perfil?',
        text: 'Sigue a los últimos visitantes de tu perfil, y descubre quién ha mostrado interés en ti.',
      },
      {
        title: 'Conversación segura',
        text: 'No se permite compartir números o enlaces de contacto dentro del chat, manteniendo la conversación protegida en la plataforma hasta que haya un acuerdo mutuo.',
      },
    ],
  },
  steps: {
    heading: '¿Cómo funciona el proceso?',
    items: [
      { title: 'Crea tu perfil', text: 'Completa tus datos, indica tu país de residencia y origen, y añade tu foto.' },
      { title: 'Busca y conecta', text: 'Filtra los resultados por ciudad y país, y envía tu interés a quien te guste.' },
      { title: 'Verifícate y cásate', text: 'Verifica tu identidad, continúa la conversación, y registra tu compromiso cuando encuentres a la persona indicada.' },
    ],
  },
  trustStrip: {
    title: 'El pudor y la privacidad primero',
    text: 'Las fotos permanecen ocultas hasta que se alcanza un acuerdo mutuo, y la conversación está protegida contra el intercambio de datos de contacto.',
    cta: 'Comienza tu camino',
  },
  finalCta: {
    heading: '¿Listo para comenzar tu camino hacia el matrimonio halal?',
    text: 'Únete ahora gratis, y comienza a buscar a tu compañero/a de vida con pudor y seriedad.',
    button: 'Crear mi cuenta',
  },
  keywords: {
    links: [
      'App de matrimonio',
      'Para musulmanes',
      'Gratis',
      'Contactos serios',
      'Chat seguro',
      'Verificación',
      'Diáspora y expatriados',
    ],
    soon: ['Casamenteras', 'Historias de matrimonio'],
  },
  footer: {
    text: 'Qisma W Nasib — la plataforma de contactos para el matrimonio halal',
  },
};

export const LANDING_DICTIONARY: Record<Locale, LandingDictionary> = { ar, fr, en, es };
