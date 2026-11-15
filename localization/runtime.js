/** Client-side RawMessage localization. This module never changes stored values. */
export function createLocalizer(entries) {
    const exact = new Map(), byKey = new Map(), fragments = new Map(), templates = new Map();
    const cache = new Map(), loreCache = new Map(), captured = new Map();
    const literalValues = new WeakSet();
    const literalMarker = Symbol('literal display data');
    const counters = { renderHits:0, renderMisses:0, loreHits:0, loreMisses:0 };
    const japanese = /[\u3040-\u30ff\u3400-\u9fff]/u;
    const escape = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const strip = value => value.replace(/§./g, '');
    for (const [key, parts, safeParameters=[]] of entries) {
        const entry = { key, parts, safeParameters };
        byKey.set(key, entry);
        if (parts.length === 1) {
            exact.set(parts[0], entry);
            const bare = strip(parts[0]);
            // Short fragments are useful for labels, but never rewrite Latin text or IDs.
            if (parts[0] === bare && japanese.test(bare) && bare.length >= 2 && !bare.includes('\n')) {
                const list = fragments.get(bare[0]) ?? [];
                if (!list.some(candidate => candidate.bare === bare)) list.push({ bare, entry });
                fragments.set(bare[0], list);
            }
        } else {
            // A particle such as "%1の%2" is too ambiguous to infer from
            // arbitrary joined text. Explicitly captured templates still work.
            const source=parts.join('').replace(/§./g,'');
            if(source.replace(/\s/g,'').length<3)continue;
            const anchor = parts.find(part => japanese.test(part)) ?? parts.find(part=>/[A-Za-z]{3}/.test(part));
            const character = anchor?.match(japanese)?.[0] ?? anchor?.replace(/§./g,'').match(/[A-Za-z]/)?.[0];
            if (character) {
                const list = templates.get(character) ?? [];
                list.push({ ...entry, length: parts.join('').length, pattern: null });
                templates.set(character, list);
            }
        }
    }
    for (const list of fragments.values()) list.sort((a,b) => b.bare.length-a.bare.length);
    for (const list of templates.values()) list.sort((a,b) => b.length-a.length);
    const literal = value => {
        // Build transforms may wrap an explicitly prepared display message again.
        if (value && typeof value === 'object' && (literalValues.has(value) || value[literalMarker] === true)) return value;
        const message={ text: String(value ?? '') };
        message[literalMarker]=true;
        literalValues.add(message);
        return message;
    };
    const preserve = value => {
        if(!value || typeof value!=='object')return literal(value);
        const message={...value};message[literalMarker]=true;literalValues.add(message);return message;
    };
    function template(key, parameters) {
        return { translate: key, with: { rawtext: parameters.map(parameter =>
            parameter && typeof parameter === 'object' && !Array.isArray(parameter) ? parameter : literal(parameter)) } };
    }
    function capture(key, parameters, translateParameters) {
        const entry=byKey.get(key);if(!entry)throw Error('Unknown UI template: '+key);
        let source=entry.parts[0];
        for(let index=0;index<parameters.length;index++)source+=parameters[index]+entry.parts[index+1];
        const message=template(key,parameters.map((value,index)=>translateParameters[index]?raw(value):literal(value)));
        captured.set(source,message);cache.delete(source);
        if(captured.size>2048)captured.delete(captured.keys().next().value);
        return source;
    }
    function resolveWhole(value, depth=0) {
        const capturedMessage=captured.get(value);if(capturedMessage)return capturedMessage;
        const found = exact.get(value);
        if (found) return found.message ??= Object.freeze({ translate: found.key });
        const visited = new Set();
        for (const character of value) {
            if (visited.has(character)) continue;
            visited.add(character);
            for (const candidate of templates.get(character) ?? []) {
                if(value.includes('\n')&&!candidate.parts.some(part=>part.includes('\n')))continue;
                if (!candidate.parts.every(part => value.includes(part))) continue;
                candidate.pattern ??= new RegExp('^'+candidate.parts.map(escape).join('([\\s\\S]*?)')+'$');
                const match = candidate.pattern.exec(value);
                // Captures are data, including player/country names. Never translate them.
                if (match) return template(candidate.key, match.slice(1).map((part,index)=>
                    candidate.safeParameters[index] && depth<10 ? raw(part,depth+1) : literal(part)));
            }
        }
        const prefix=value.match(/^(?:§.)+/)?.[0] ?? '';
        const suffix=value.slice(prefix.length).match(/(?:§.)+$/)?.[0] ?? '';
        if(prefix || suffix) {
            const middle=value.slice(prefix.length,suffix?value.length-suffix.length:undefined);
            const translated=resolveWhole(middle,depth+1);
            if(translated)return {rawtext:[...(prefix?[literal(prefix)]:[]),translated,...(suffix?[literal(suffix)]:[])]};
        }
        return undefined;
    }
    function stringMessage(value, depth=0) {
        if (value.length > 32768) return value;
        if(byKey.has(value))return byKey.get(value).message ??= Object.freeze({translate:value});
        if (!japanese.test(value) && !exact.has(value) && !/[A-Za-z]{3,}.*\s.*[A-Za-z]{3,}/.test(value)) return value;
        const previous = cache.get(value);
        if (previous !== undefined) { counters.renderHits++; return previous; }
        counters.renderMisses++;
        let result = resolveWhole(value,depth);
        if (!result) {
            const parts = [];
            const append = part => {
                if (part.text !== undefined && parts.at(-1)?.text !== undefined) parts.at(-1).text += part.text;
                else parts.push(part);
            };
            for (const [index, line] of value.split('\n').entries()) {
                if (index) append(literal('\n'));
                const whole = resolveWhole(line,depth);
                if (whole) { append(whole); continue; }
                let offset = 0, plain = '';
                while (offset < line.length) {
                    if (line[offset] === '§' && offset+1 < line.length) { plain += line.slice(offset,offset+2); offset+=2; continue; }
                    const candidate = (fragments.get(line[offset]) ?? []).find(entry => line.startsWith(entry.bare,offset));
                    if (!candidate) { plain += line[offset++]; continue; }
                    if (plain) { append(literal(plain)); plain=''; }
                    append({ translate: candidate.entry.key });
                    offset += candidate.bare.length;
                }
                if (plain) append(literal(plain));
            }
            const translated = part => !!(part?.translate || part?.rawtext?.some(translated));
            result = parts.some(translated) ? { rawtext: parts } : value;
        }
        // Dynamic HUD values must not grow this cache without bound.
        cache.set(value,result);
        if (cache.size > 512) cache.delete(cache.keys().next().value);
        return result;
    }
    function raw(value, depth=0) {
        if (depth>12) return value;
        if (typeof value === 'string') return stringMessage(value,depth);
        if (Array.isArray(value)) return value.map(part => raw(part,depth+1));
        if (!value || typeof value !== 'object') return value;
        if(literalValues.has(value) || value[literalMarker]===true) return value;
        if (typeof value.translate === 'string') {
            // Older chest menus sometimes use a literal Japanese label as a translate key.
            if (japanese.test(value.translate)) return stringMessage(value.translate);
            return value;
        }
        if (Array.isArray(value.rawtext)) return { ...value, rawtext: value.rawtext.map(part => {
            const translated = raw(part,depth+1);
            return typeof translated === 'string' ? literal(translated) : translated;
        }) };
        if (typeof value.text === 'string' && Object.keys(value).length===1) {
            const translated=stringMessage(value.text);
            return typeof translated==='string' ? value : translated;
        }
        return value;
    }
    // The primitive serializer treats a nested rawtext element as literal JSON.
    // Flatten concatenation only; with.rawtext is a positional argument list.
    function primitive(value) {
        const message=raw(value);
        function flatten(node) {
            if(!node || typeof node!=='object' || !Array.isArray(node.rawtext))return node;
            const parts=[];
            for(const child of node.rawtext) {
                const next=flatten(child);
                if(next && typeof next==='object' && Array.isArray(next.rawtext))parts.push(...next.rawtext);
                else parts.push(typeof next==='string'?{text:next}:next);
            }
            return {...node,rawtext:parts};
        }
        return typeof message==='string'?message:preserve(flatten(message));
    }
    function original(value, depth=0) {
        if(depth>16) return undefined;
        if(typeof value==='string') {
            if(value.length>32768) return undefined;
            if(value.trimStart().startsWith('{')) {
                try { return original(JSON.parse(value),depth+1); } catch { /* literal JSON-looking lore */ }
            }
            return value;
        }
        if(!value || typeof value!=='object') return undefined;
        if(Array.isArray(value.rawtext)) {
            const parts=value.rawtext.map(part=>original(part,depth+1));
            return parts.some(part=>part===undefined) ? undefined : parts.join('');
        }
        if(typeof value.text==='string') return value.text;
        const entry=byKey.get(value.translate);
        if(!entry) return undefined;
        const parameters=Array.isArray(value.with) ? value.with : value.with?.rawtext ?? [];
        let output='';
        for(let index=0;index<entry.parts.length;index++) {
            output+=entry.parts[index];
            if(index<entry.parts.length-1) {
                const parameter=original(parameters[index],depth+1);
                if(parameter===undefined) return undefined;
                output+=parameter;
            }
        }
        return output;
    }
    function literalLore(lines) {
        return Array.isArray(lines) ? lines.map(line=>{
            if(line && typeof line==='object') return original(line) ?? line;
            if(typeof line!=='string' || !line.trimStart().startsWith('{')) return line;
            if(loreCache.has(line)) { counters.loreHits++;return loreCache.get(line); }
            counters.loreMisses++;
            const source=original(line) ?? line;
            loreCache.set(line,source);
            if(loreCache.size>2048) loreCache.delete(loreCache.keys().next().value);
            return source;
        }) : lines;
    }
    function lore(lines) { return Array.isArray(lines) ? lines.map(line=>typeof line==='string'?raw(line):line) : lines; }
    function titleOptions(options) {
        return options && typeof options==='object' && options.subtitle!==undefined
            ? {...options,subtitle:raw(options.subtitle)} : options;
    }
    const stats=()=>({...counters,renderEntries:cache.size,loreEntries:loreCache.size,capturedEntries:captured.size});
    return { raw, primitive, template, capture, literal, preserve, original, literalLore, lore, titleOptions, stats };
}
