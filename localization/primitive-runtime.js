/** Shared native-safe text rendering. Data is supplied by each pack build. */
export function createPrimitiveTextRuntime(translations, locales) {


function fitPrimitiveText(value) {
    const output=[];
    let color='',styles='';
    const bytes=text=>Array.from(text).reduce((sum,c)=>{const n=c.codePointAt(0);return sum+(n<128?1:n<2048?2:n<65536?3:4);},0);
    for(const line of String(value ?? '').replace(/\r\n/g,'\n').split('\n')) {
        const chars=Array.from(line);let part='',size=0;
        for(let i=0;i<chars.length;i++) {
            const token=chars[i]==='§' && i+1<chars.length?chars[i]+chars[++i]:chars[i];
            const width=bytes(token);
            if(size+width>120 && part){output.push(part);part=color+styles;size=bytes(part);}
            part+=token;size+=width;
            if(token[0]==='§' && token.length>1){const code=token[1].toLowerCase();
                if(code==='r'){color='';styles='';}
                else if(['k','l','o'].includes(code)){if(!styles.includes(token))styles+=token;}
                else{color=token;styles='';}
            }
        }
        output.push(part);
    }
    if(output.length>128)throw Error('Native primitive text exceeds 128 lines');
    return output.join('\n');
}
function hasPrimitiveTranslation(message, depth=0) {
    if(depth>24||!message||typeof message!=='object')return false;
    if(typeof message.translate==='string')return true;
    return Array.isArray(message.rawtext)&&message.rawtext.some(part=>hasPrimitiveTranslation(part,depth+1));
}

const byKey = new Map(translations.map(([key, ...values]) => [key, values]));
const localeIndex = new Map(locales.map((locale, index) => [locale.toLowerCase(), index]));
const cache = new Map(), warned = new Set();
const playerLocales = new WeakMap();
const CACHE_LIMIT = 512;

function getPrimitiveLocale(player) {
    const now = Date.now(), previous = playerLocales.get(player);
    if (previous && previous.until > now) return previous.locale;
    let locale;
    try { locale = player.clientSystemInfo.locale; } catch { /* player left */ }
    const key = String(locale ?? '').replace('-', '_').toLowerCase();
    const selected = locales[localeIndex.get(key) ?? 1];
    playerLocales.set(player, { locale:selected, until:now+5000 });
    return selected;
}

function groupPrimitiveViewers(viewers) {
    const groups = new Map();
    for (const player of viewers) {
        const locale = getPrimitiveLocale(player);
        const group = groups.get(locale) ?? { locale, viewers: [] };
        group.viewers.push(player); groups.set(locale, group);
    }
    return [...groups.values()];
}

/** RawMessage is decoded before calling the native text constructor. Native
 * JSON length checks can otherwise silently turn long messages into ''. */
function renderPrimitiveText(message, locale, fallback) {
    const index = localeIndex.get(String(locale).replace('-', '_').toLowerCase()) ?? 1;
    const signature = index + ':' + JSON.stringify(message);
    if (cache.has(signature)) return cache.get(signature);
    let invalid = false;
    function render(value, depth = 0) {
        if (depth > 24) { invalid = true; return ''; }
        if (typeof value === 'string') return value;
        if (!value || typeof value !== 'object') { invalid = true; return ''; }
        if (Array.isArray(value.rawtext)) return value.rawtext.map(part => render(part, depth + 1)).join('');
        if (typeof value.text === 'string') return value.text;
        if (typeof value.translate === 'string') {
            const row = byKey.get(value.translate);
            if (!row) {
                invalid = true;
                if (warned.size < 64 && !warned.has(value.translate)) {
                    warned.add(value.translate); console.warn('[PrimitiveText] missing key ' + value.translate);
                }
                const args = Array.isArray(value.with) ? value.with : value.with?.rawtext ?? [];
                return args.map(part => render(part, depth + 1)).join(' ');
            }
            const args = Array.isArray(value.with) ? value.with : value.with?.rawtext ?? [];
            const parameters = args.map(part => render(part, depth + 1));
            let sequential = 0;
            return row[index].replace(/%%|%(?:(\d+)(?:\$s)?|s)/g, (match, number) => {
                if (match === '%%') return '%';
                const position = number ? Number(number) - 1 : sequential++;
                if (position < 0 || position >= parameters.length) { invalid = true; return ''; }
                return parameters[position];
            });
        }
        invalid = true; return '';
    }
    const rendered = render(message);
    const text = fitPrimitiveText(invalid ? (fallback ?? rendered) : (rendered || fallback || ''));
    // A fallback depends on the caller's saved source, so don't cache failures.
    if (!invalid && rendered) {
        cache.set(signature, text);
        if (cache.size > CACHE_LIMIT) cache.delete(cache.keys().next().value);
    }
    return text;
}

function createPrimitiveText(TextClass, position, message, locale, fallback) {
    const shape = new TextClass(position, renderPrimitiveText(message, locale, fallback));
    if (shape.text === '') throw Error('Native primitive text is empty');
    return shape;
}

function primitiveTextCacheSize() { return cache.size; }


class LocalizedTextGroup {
    constructor(TextClass, manager) {this.TextClass=TextClass;this.manager=manager;this.labels=new Map();this.created=0;}
    get size(){return this.labels.size;}
    remove(locale){const current=this.labels.get(locale);this.labels.delete(locale);if(current)try{current.shape.remove();}catch{}}
    clear(){for(const locale of [...this.labels.keys()])this.remove(locale);}
    update({position,dimension,viewers,message,fallback,style={},timeLeft=4}) {
        const groups=hasPrimitiveTranslation(message)?groupPrimitiveViewers(viewers):viewers.length?[{locale:'literal',viewers}]:[];
        const wanted=new Set(groups.map(group=>group.locale));
        for(const locale of this.labels.keys())if(!wanted.has(locale))this.remove(locale);
        const styleKey=JSON.stringify(style),dimensionId=dimension?.id;
        for(const group of groups){
            const text=renderPrimitiveText(message,group.locale,fallback),viewerKey=group.viewers.map(player=>player.id).sort().join(',');
            let current=this.labels.get(group.locale);
            if(current && current.text!==text){this.remove(group.locale);current=undefined;}
            if(!current){
                const shape=new this.TextClass(position,text);
                if(shape.text==='')throw Error('Native primitive text is empty');
                try{Object.assign(shape,style);shape.visibleTo=group.viewers;shape.timeLeft=timeLeft;this.manager.addText(shape,dimension);}
                catch(error){try{shape.remove();}catch{}throw error;}
                current={shape,text,position:{...position},dimension:dimensionId,viewers:viewerKey,style:styleKey};
                this.labels.set(group.locale,current);this.created++;
            }else{
                if(current.position.x!==position.x||current.position.y!==position.y||current.position.z!==position.z||current.dimension!==dimensionId){
                    current.shape.setLocation(dimension?{...position,dimension}:position);current.position={...position};current.dimension=dimensionId;
                }
                if(current.style!==styleKey){Object.assign(current.shape,style);current.style=styleKey;}
                if(current.viewers!==viewerKey){current.shape.visibleTo=group.viewers;current.viewers=viewerKey;}
                current.shape.timeLeft=timeLeft;
            }
        }
    }
    snapshot(){return [...this.labels].map(([locale,value])=>({locale,text:value.text,viewers:value.shape.visibleTo.length}));}
}

return {getPrimitiveLocale,groupPrimitiveViewers,renderPrimitiveText,createPrimitiveText,primitiveTextCacheSize,fitPrimitiveText,hasPrimitiveTranslation,LocalizedTextGroup};
}
