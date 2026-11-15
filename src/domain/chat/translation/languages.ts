// PLaMo 3 Translate's official language codes (Chinese variants count separately).
export const LANGUAGES: Array<[string, string]> = [
    ['ja', '日本語'], ['en', 'English'], ['zh-hans', '简体中文'], ['zh-hant', '繁體中文'],
    ['ko', '한국어'], ['ar', 'العربية'], ['az', 'Azərbaycanca'], ['be', 'Беларуская'],
    ['bg', 'Български'], ['bn', 'বাংলা'], ['ca', 'Català'], ['ceb', 'Cebuano'],
    ['de', 'Deutsch'], ['es', 'Español'], ['et', 'Eesti'], ['eu', 'Euskara'],
    ['fa', 'فارسی'], ['fr', 'Français'], ['gu', 'ગુજરાતી'], ['he', 'עברית'],
    ['hi', 'हिन्दी'], ['hr', 'Hrvatski'], ['hu', 'Magyar'], ['hy', 'Հայերեն'],
    ['id', 'Bahasa Indonesia'], ['it', 'Italiano'], ['jv', 'Basa Jawa'], ['ka', 'ქართული'],
    ['kk', 'Қазақша'], ['km', 'ខ្មែរ'], ['lt', 'Lietuvių'], ['lv', 'Latviešu'],
    ['ml', 'മലയാളം'], ['mr', 'मराठी'], ['ms', 'Bahasa Melayu'], ['my', 'မြန်မာ'],
    ['ne', 'नेपाली'], ['nl', 'Nederlands'], ['pa', 'ਪੰਜਾਬੀ'], ['pl', 'Polski'],
    ['ru', 'Русский'], ['si', 'සිංහල'], ['sk', 'Slovenčina'], ['sl', 'Slovenščina'],
    ['sr', 'Српски'], ['sw', 'Kiswahili'], ['ta', 'தமிழ்'], ['te', 'తెలుగు'],
    ['th', 'ไทย'], ['tl', 'Filipino'], ['ur', 'اردو'], ['uz', 'Oʻzbekcha'], ['vi', 'Tiếng Việt'],
];
export const LANGUAGE_CODES = new Set(LANGUAGES.map(([code]) => code));
export function normalizeLanguage(value: unknown): string | null {
    if (typeof value !== 'string') return null;
    const code = value.trim().toLowerCase().replace(/_/g, '-');
    if (LANGUAGE_CODES.has(code)) return code;
    if (/^zh-(?:hant|tw|hk|mo)(?:-|$)/.test(code)) return 'zh-hant';
    if (code === 'zh' || /^zh-(?:hans|cn|sg)(?:-|$)/.test(code)) return 'zh-hans';
    const aliases: Record<string, string> = { jp: 'ja', kr: 'ko', in: 'id', iw: 'he', fil: 'tl' };
    const base = code.split('-')[0];
    return aliases[base] ?? (LANGUAGE_CODES.has(base) ? base : null);
}
export function languageName(code: string): string {
    return LANGUAGES.find(([key]) => key === code)?.[1] ?? code;
}
export function plainText(value: unknown): string {
    return String(value ?? '').replace(/§./g, '').replace(/[\u0000-\u001f\u007f]/g, ' ').trim();
}
export function comparable(value: unknown): string {
    return plainText(value).normalize('NFKC').replace(/\s+/g, '').toLowerCase();
}
