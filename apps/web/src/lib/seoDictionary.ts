import type { Locale } from './seo';

export interface SeoDictionary {
  badge: string;
  ctaRegister: string;
  ctaRegisterShort: string;
  ctaLogin: string;
  trustPoints: [string, string, string];
  membersHeading: (name: string) => string;
  membersSubheading: string;
  emptyState: (name: string) => string;
  verifyHeading: string;
  verifyText: string;
  verifyButton: string;
  languageLabel: string;
}

export const SEO_DICTIONARY: Record<Locale, SeoDictionary> = {
  ar: {
    badge: 'منصة إلكترونية للتعارف بقصد الزواج الحلال',
    ctaRegister: 'سجّل الآن واحصل على شهر VIP مجاني',
    ctaRegisterShort: 'سجّل الآن',
    ctaLogin: 'لديّ حساب، تسجيل الدخول',
    trustPoints: ['توثيقٌ بالهوية', 'خصوصية وأمان تامّان', 'شهر VIP مجاني عند التسجيل'],
    membersHeading: (name) => `أعضاء موثقون بالهوية في ${name}`,
    membersSubheading: 'نماذج حقيقية من ملفات موثّقة على قسمة ونصيب — سجّل مجانًا لعرض الصور والتواصل.',
    emptyState: (name) => `كن أول عضو موثّق بالهوية في ${name} — سجّل الآن وابدأ رحلتك نحو الزواج الحلال.`,
    verifyHeading: 'وثِّق ملفك اليوم واحصل على شهر VIP مجاني',
    verifyText: 'التسجيل مجاني بالكامل. وثِّق هويتك لتظهر أولًا في نتائج البحث وتحصل على شهر اشتراك VIP هدية.',
    verifyButton: 'أنشئ حسابك الآن',
    languageLabel: 'اللغة',
  },
  fr: {
    badge: 'Plateforme en ligne pour un mariage halal',
    ctaRegister: "S'inscrire et obtenir 1 mois VIP gratuit",
    ctaRegisterShort: 'S\'inscrire',
    ctaLogin: "J'ai un compte, se connecter",
    trustPoints: ["Vérification d'identité", 'Confidentialité totale', '1 mois VIP offert à l’inscription'],
    membersHeading: (name) => `Membres vérifiés par pièce d'identité à ${name}`,
    membersSubheading:
      'De vrais profils vérifiés sur Qisma W Nasib — inscrivez-vous gratuitement pour voir les photos et échanger.',
    emptyState: (name) => `Soyez le premier membre vérifié à ${name} — inscrivez-vous et commencez votre parcours.`,
    verifyHeading: 'Vérifiez votre profil aujourd\'hui et obtenez 1 mois VIP gratuit',
    verifyText:
      "L'inscription est entièrement gratuite. Vérifiez votre identité pour apparaître en premier dans les résultats et recevoir un mois VIP offert.",
    verifyButton: 'Créer mon compte',
    languageLabel: 'Langue',
  },
  en: {
    badge: 'The online platform for halal marriage',
    ctaRegister: 'Sign up now and get 1 month VIP free',
    ctaRegisterShort: 'Sign up',
    ctaLogin: 'I have an account, log in',
    trustPoints: ['ID verification', 'Complete privacy', '1 free VIP month on signup'],
    membersHeading: (name) => `ID-verified members in ${name}`,
    membersSubheading: 'Real verified profiles on Qisma W Nasib — sign up for free to see photos and connect.',
    emptyState: (name) => `Be the first verified member in ${name} — sign up and start your journey.`,
    verifyHeading: 'Verify your profile today and get 1 month VIP free',
    verifyText:
      'Signing up is completely free. Verify your ID to appear first in search results and receive a free VIP month.',
    verifyButton: 'Create my account',
    languageLabel: 'Language',
  },
  es: {
    badge: 'La plataforma en línea para el matrimonio halal',
    ctaRegister: 'Regístrate y obtén 1 mes VIP gratis',
    ctaRegisterShort: 'Regístrate',
    ctaLogin: 'Ya tengo cuenta, iniciar sesión',
    trustPoints: ['Verificación de identidad', 'Privacidad total', '1 mes VIP gratis al registrarte'],
    membersHeading: (name) => `Miembros verificados por identidad en ${name}`,
    membersSubheading:
      'Perfiles reales y verificados en Qisma W Nasib — regístrate gratis para ver fotos y contactar.',
    emptyState: (name) => `Sé el primer miembro verificado en ${name} — regístrate y comienza tu camino.`,
    verifyHeading: 'Verifica tu perfil hoy y obtén 1 mes VIP gratis',
    verifyText:
      'El registro es totalmente gratuito. Verifica tu identidad para aparecer primero en los resultados y recibir un mes VIP de regalo.',
    verifyButton: 'Crear mi cuenta',
    languageLabel: 'Idioma',
  },
};
