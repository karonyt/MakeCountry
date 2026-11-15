/** Localize player-facing command output without changing command semantics. */
export function createCommandPresenters(ui, server, strings={}) {
    const callbacks=new WeakMap();
    const textCache=new Map();
    function localeOf(player) {
        let locale='';try{locale=player.clientSystemInfo.locale;}catch{/* unavailable device locale */}
        locale=locale.toLowerCase().replace('-','_');
        if(locale.startsWith('ja'))return 'ja_JP';
        if(locale.startsWith('ko'))return 'ko_KR';
        if(/^zh_(?:tw|hk|hant)/.test(locale))return 'zh_TW';
        if(locale.startsWith('zh'))return 'zh_CN';
        return 'en_US';
    }
    function textOf(message,locale,depth=0) {
        if(depth>16)return '';
        if(typeof message==='string')return message;
        if(!message || typeof message!=='object')return '';
        if(Array.isArray(message.rawtext))return message.rawtext.map(part=>textOf(part,locale,depth+1)).join('');
        if(typeof message.text==='string')return message.text;
        const values=strings[message.translate];
        if(!values)return ui.original(message) ?? message.translate ?? '';
        const source=values[locale] ?? values.en_US ?? ui.original(message) ?? '';
        const parameters=Array.isArray(message.with)?message.with:message.with?.rawtext ?? [];
        return source.replace(/%(\d+)(?:\$s)?/g,(_,index)=>textOf(parameters[Number(index)-1],locale,depth+1));
    }
    // Kick's reason accepts only plain text. This exceptional path renders a
    // small prebuilt dictionary for that player's device locale; ordinary
    // forms, HUDs and labels always let the client resolve RawMessage itself.
    function commandText(command,source) {
        if(typeof command!=='string')return command;
        if(command.startsWith('titleraw ')) {
            const match=/^(titleraw\s+\S+\s+(?:title|subtitle|actionbar)\s+)([\s\S]+)$/.exec(command);
            if(match)try{return match[1]+JSON.stringify(ui.raw(JSON.parse(match[2])));}catch{/* preserve invalid command semantics */}
        }
        if(!command.startsWith('kick ') || !(source instanceof server.Player))return command;
        const match=/^(kick\s+(?:"[^"\\]*(?:\\.[^"\\]*)*"|\S+)\s+)([\s\S]+)$/.exec(command);
        if(!match)return command;
        const locale=localeOf(source),key=locale+'\0'+match[2];
        let text=textCache.get(key);
        if(text===undefined){text=textOf(ui.raw(match[2]),locale);textCache.set(key,text);if(textCache.size>128)textCache.delete(textCache.keys().next().value);}
        return match[1]+text;
    }
    function runCommand(source,command,optional=false) {
        if(optional && source==null)return undefined;
        if(typeof command==='function')command=command();
        return source.runCommand(commandText(command,source));
    }
    function commandInfo(definition) {
        if(!definition || typeof definition.description!=='string')return definition;
        const message=ui.raw(definition.description);
        if(message && typeof message==='object' && typeof message.translate==='string' && !message.with)
            return {...definition,description:message.translate};
        return definition;
    }
    function commandCallback(callback) {
        if(typeof callback!=='function')return callback;
        if(callbacks.has(callback))return callbacks.get(callback);
        const wrapped=(...args)=>{
            const result=callback(...args);
            const player=args[0]?.sourceEntity;
            if(!result || typeof result.message!=='string' || !(player instanceof server.Player))return result;
            const message=ui.raw(result.message);
            server.system.run(()=>{try{if(player.isValid)player.sendMessage(message);}catch{/* recipient left */}});
            const output={...result};delete output.message;
            return output;
        };
        callbacks.set(callback,wrapped);
        return wrapped;
    }
    return {commandInfo,commandCallback,commandText,runCommand};
}
