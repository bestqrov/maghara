import { notFound } from 'next/navigation';
import { dirForLocale, isSupportedLocale, type Locale } from '@/lib/seo';

const CONTENT: Record<Locale, { title: string; steps: string[]; note: string }> = {
  ar: {
    title: 'حذف الحساب',
    steps: [
      'سجل الدخول إلى حسابك عبر الموقع أو التطبيق.',
      'اذهب إلى الإعدادات.',
      'اضغط على "حذف حسابي نهائياً" فأسفل الصفحة، وأدخل كلمة المرور للتأكيد.',
      'سيتم حذف حسابك ومحادثاتك وتفاعلاتك وجميع بياناتك بشكل نهائي وفوري.',
    ],
    note: 'إذا فقدت الوصول إلى حسابك ولم تستطع تسجيل الدخول، راسلنا عبر البريد الإلكتروني الموضح في صفحة "اتصل بنا" وسنحذف حسابك يدوياً.',
  },
  fr: {
    title: 'Supprimer le compte',
    steps: [
      'Connectez-vous à votre compte via le site ou l’application.',
      'Allez dans Paramètres.',
      'Cliquez sur « Supprimer définitivement mon compte » en bas de la page, puis entrez votre mot de passe pour confirmer.',
      'Votre compte, vos conversations, vos interactions et toutes vos données seront supprimés définitivement et immédiatement.',
    ],
    note: 'Si vous avez perdu l’accès à votre compte et ne pouvez pas vous connecter, contactez-nous par e-mail (voir la page Contact) et nous supprimerons votre compte manuellement.',
  },
  en: {
    title: 'Delete Account',
    steps: [
      'Log in to your account on the website or the app.',
      'Go to Settings.',
      'Tap "Permanently delete my account" at the bottom of the page, and enter your password to confirm.',
      'Your account, conversations, interactions and all your data will be permanently and immediately deleted.',
    ],
    note: 'If you lost access to your account and cannot log in, email us (see the Contact page) and we will delete your account manually.',
  },
  es: {
    title: 'Eliminar cuenta',
    steps: [
      'Inicia sesión en tu cuenta a través del sitio web o la app.',
      'Ve a Configuración.',
      'Pulsa "Eliminar mi cuenta permanentemente" al final de la página e introduce tu contraseña para confirmar.',
      'Tu cuenta, conversaciones, interacciones y todos tus datos se eliminarán permanente e inmediatamente.',
    ],
    note: 'Si perdiste el acceso a tu cuenta y no puedes iniciar sesión, escríbenos por correo electrónico (ver la página de Contacto) y eliminaremos tu cuenta manualmente.',
  },
};

export default async function DeleteAccountPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) notFound();

  const content = CONTENT[locale];

  return (
    <main dir={dirForLocale(locale)} className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-2xl font-bold text-ink-900">{content.title}</h1>
      <ol className="mt-6 flex flex-col gap-3 text-sm leading-7 text-ink-700">
        {content.steps.map((step, i) => (
          <li key={i} className="flex gap-2">
            <span className="font-bold text-rose-600">{i + 1}.</span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
      <p className="mt-8 text-sm leading-7 text-ink-500">{content.note}</p>
    </main>
  );
}
