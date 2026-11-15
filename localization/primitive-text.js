import translations, {locales} from './catalog/primitive-text.js';
import {createPrimitiveTextRuntime} from './primitive-runtime.js';
export const {getPrimitiveLocale,groupPrimitiveViewers,renderPrimitiveText,createPrimitiveText,primitiveTextCacheSize,fitPrimitiveText,hasPrimitiveTranslation,LocalizedTextGroup}=createPrimitiveTextRuntime(translations,locales);
