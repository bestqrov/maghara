/// Country list shared with the backend (`src/common/data/countries.data.ts`)
/// and web (`apps/web/src/data/countries.json`) — keep them in sync.
///
/// [ar] is the canonical value stored on profiles and sent to the API; the
/// other fields are display labels.
class Country {
  const Country({required this.code, required this.ar, required this.en, required this.fr, required this.es});

  final String code;
  final String ar;
  final String en;
  final String fr;
  final String es;

  String label(String locale) {
    switch (locale) {
      case 'en':
        return en;
      case 'fr':
        return fr;
      case 'es':
        return es;
      default:
        return ar;
    }
  }
}

const List<Country> kCountries = [
  Country(code: 'MA', ar: 'المغرب', en: 'Morocco', fr: 'Maroc', es: 'Marruecos'),
  Country(code: 'DZ', ar: 'الجزائر', en: 'Algeria', fr: 'Algérie', es: 'Argelia'),
  Country(code: 'TN', ar: 'تونس', en: 'Tunisia', fr: 'Tunisie', es: 'Túnez'),
  Country(code: 'LY', ar: 'ليبيا', en: 'Libya', fr: 'Libye', es: 'Libia'),
  Country(code: 'EG', ar: 'مصر', en: 'Egypt', fr: 'Égypte', es: 'Egipto'),
  Country(code: 'MR', ar: 'موريتانيا', en: 'Mauritania', fr: 'Mauritanie', es: 'Mauritania'),
  Country(code: 'SD', ar: 'السودان', en: 'Sudan', fr: 'Soudan', es: 'Sudán'),
  Country(code: 'SA', ar: 'السعودية', en: 'Saudi Arabia', fr: 'Arabie saoudite', es: 'Arabia Saudí'),
  Country(code: 'AE', ar: 'الإمارات', en: 'United Arab Emirates', fr: 'Émirats arabes unis', es: 'Emiratos Árabes Unidos'),
  Country(code: 'QA', ar: 'قطر', en: 'Qatar', fr: 'Qatar', es: 'Catar'),
  Country(code: 'KW', ar: 'الكويت', en: 'Kuwait', fr: 'Koweït', es: 'Kuwait'),
  Country(code: 'BH', ar: 'البحرين', en: 'Bahrain', fr: 'Bahreïn', es: 'Baréin'),
  Country(code: 'OM', ar: 'عمان', en: 'Oman', fr: 'Oman', es: 'Omán'),
  Country(code: 'YE', ar: 'اليمن', en: 'Yemen', fr: 'Yémen', es: 'Yemen'),
  Country(code: 'JO', ar: 'الأردن', en: 'Jordan', fr: 'Jordanie', es: 'Jordania'),
  Country(code: 'PS', ar: 'فلسطين', en: 'Palestine', fr: 'Palestine', es: 'Palestina'),
  Country(code: 'LB', ar: 'لبنان', en: 'Lebanon', fr: 'Liban', es: 'Líbano'),
  Country(code: 'SY', ar: 'سوريا', en: 'Syria', fr: 'Syrie', es: 'Siria'),
  Country(code: 'IQ', ar: 'العراق', en: 'Iraq', fr: 'Irak', es: 'Irak'),
  Country(code: 'TR', ar: 'تركيا', en: 'Turkey', fr: 'Turquie', es: 'Turquía'),
  Country(code: 'FR', ar: 'فرنسا', en: 'France', fr: 'France', es: 'Francia'),
  Country(code: 'ES', ar: 'إسبانيا', en: 'Spain', fr: 'Espagne', es: 'España'),
  Country(code: 'BE', ar: 'بلجيكا', en: 'Belgium', fr: 'Belgique', es: 'Bélgica'),
  Country(code: 'NL', ar: 'هولندا', en: 'Netherlands', fr: 'Pays-Bas', es: 'Países Bajos'),
  Country(code: 'DE', ar: 'ألمانيا', en: 'Germany', fr: 'Allemagne', es: 'Alemania'),
  Country(code: 'IT', ar: 'إيطاليا', en: 'Italy', fr: 'Italie', es: 'Italia'),
  Country(code: 'GB', ar: 'بريطانيا', en: 'United Kingdom', fr: 'Royaume-Uni', es: 'Reino Unido'),
  Country(code: 'IE', ar: 'إيرلندا', en: 'Ireland', fr: 'Irlande', es: 'Irlanda'),
  Country(code: 'CH', ar: 'سويسرا', en: 'Switzerland', fr: 'Suisse', es: 'Suiza'),
  Country(code: 'AT', ar: 'النمسا', en: 'Austria', fr: 'Autriche', es: 'Austria'),
  Country(code: 'PT', ar: 'البرتغال', en: 'Portugal', fr: 'Portugal', es: 'Portugal'),
  Country(code: 'LU', ar: 'لوكسمبورغ', en: 'Luxembourg', fr: 'Luxembourg', es: 'Luxemburgo'),
  Country(code: 'SE', ar: 'السويد', en: 'Sweden', fr: 'Suède', es: 'Suecia'),
  Country(code: 'NO', ar: 'النرويج', en: 'Norway', fr: 'Norvège', es: 'Noruega'),
  Country(code: 'DK', ar: 'الدنمارك', en: 'Denmark', fr: 'Danemark', es: 'Dinamarca'),
  Country(code: 'FI', ar: 'فنلندا', en: 'Finland', fr: 'Finlande', es: 'Finlandia'),
  Country(code: 'PL', ar: 'بولندا', en: 'Poland', fr: 'Pologne', es: 'Polonia'),
  Country(code: 'GR', ar: 'اليونان', en: 'Greece', fr: 'Grèce', es: 'Grecia'),
  Country(code: 'RU', ar: 'روسيا', en: 'Russia', fr: 'Russie', es: 'Rusia'),
  Country(code: 'US', ar: 'الولايات المتحدة', en: 'United States', fr: 'États-Unis', es: 'Estados Unidos'),
  Country(code: 'CA', ar: 'كندا', en: 'Canada', fr: 'Canada', es: 'Canadá'),
  Country(code: 'MX', ar: 'المكسيك', en: 'Mexico', fr: 'Mexique', es: 'México'),
  Country(code: 'BR', ar: 'البرازيل', en: 'Brazil', fr: 'Brésil', es: 'Brasil'),
  Country(code: 'AU', ar: 'أستراليا', en: 'Australia', fr: 'Australie', es: 'Australia'),
  Country(code: 'NZ', ar: 'نيوزيلندا', en: 'New Zealand', fr: 'Nouvelle-Zélande', es: 'Nueva Zelanda'),
  Country(code: 'MY', ar: 'ماليزيا', en: 'Malaysia', fr: 'Malaisie', es: 'Malasia'),
  Country(code: 'ID', ar: 'إندونيسيا', en: 'Indonesia', fr: 'Indonésie', es: 'Indonesia'),
  Country(code: 'SG', ar: 'سنغافورة', en: 'Singapore', fr: 'Singapour', es: 'Singapur'),
  Country(code: 'PK', ar: 'باكستان', en: 'Pakistan', fr: 'Pakistan', es: 'Pakistán'),
  Country(code: 'IN', ar: 'الهند', en: 'India', fr: 'Inde', es: 'India'),
  Country(code: 'CN', ar: 'الصين', en: 'China', fr: 'Chine', es: 'China'),
  Country(code: 'JP', ar: 'اليابان', en: 'Japan', fr: 'Japon', es: 'Japón'),
  Country(code: 'IR', ar: 'إيران', en: 'Iran', fr: 'Iran', es: 'Irán'),
  Country(code: 'AF', ar: 'أفغانستان', en: 'Afghanistan', fr: 'Afghanistan', es: 'Afganistán'),
  Country(code: 'AZ', ar: 'أذربيجان', en: 'Azerbaijan', fr: 'Azerbaïdjan', es: 'Azerbaiyán'),
  Country(code: 'KZ', ar: 'كازاخستان', en: 'Kazakhstan', fr: 'Kazakhstan', es: 'Kazajistán'),
  Country(code: 'BA', ar: 'البوسنة والهرسك', en: 'Bosnia and Herzegovina', fr: 'Bosnie-Herzégovine', es: 'Bosnia y Herzegovina'),
  Country(code: 'AL', ar: 'ألبانيا', en: 'Albania', fr: 'Albanie', es: 'Albania'),
  Country(code: 'SN', ar: 'السنغال', en: 'Senegal', fr: 'Sénégal', es: 'Senegal'),
  Country(code: 'ML', ar: 'مالي', en: 'Mali', fr: 'Mali', es: 'Malí'),
  Country(code: 'NE', ar: 'النيجر', en: 'Niger', fr: 'Niger', es: 'Níger'),
  Country(code: 'NG', ar: 'نيجيريا', en: 'Nigeria', fr: 'Nigeria', es: 'Nigeria'),
  Country(code: 'CI', ar: 'ساحل العاج', en: 'Côte d\'Ivoire', fr: 'Côte d\'Ivoire', es: 'Costa de Marfil'),
  Country(code: 'SO', ar: 'الصومال', en: 'Somalia', fr: 'Somalie', es: 'Somalia'),
  Country(code: 'DJ', ar: 'جيبوتي', en: 'Djibouti', fr: 'Djibouti', es: 'Yibuti'),
  Country(code: 'KM', ar: 'جزر القمر', en: 'Comoros', fr: 'Comores', es: 'Comoras'),
  Country(code: 'ZA', ar: 'جنوب أفريقيا', en: 'South Africa', fr: 'Afrique du Sud', es: 'Sudáfrica'),
];
