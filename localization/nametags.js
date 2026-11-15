/** Replace native entity labels with attached, localized TextPrimitive labels. */
import { groupPrimitiveViewers, createPrimitiveText, hasPrimitiveTranslation } from './primitive-text.js';

export function createNameTagPresenter(ui, server, namespace, options = {}) {
    const { world, system, Entity, ItemStack, Player, TextPrimitive } = server;
    const tag = `game_ui_label_${namespace}`;
    const property = 'game_ui:original_name';
    const records = new Map(), labels = new Map();
    const nativePlayers = new WeakSet();
    const npcTypes=['npc:karoearth','npc:karontoon','npc:server_guide'];
    function npcMessage(entity) {
        if(!options.adoptNpcs || !npcTypes.includes(entity.typeId))return undefined;
        return {rawtext:[{text:entity.typeId==='npc:server_guide'?'§e§l':'§a§l'},
            {translate:'entity.'+entity.typeId+'.name'},{text:'§r\n§7'},
            {translate:entity.typeId==='npc:server_guide'?'game.ui.npc.open_guide':'game.ui.npc.join_server'}]};
    }
    const healthViewers=globalThis[Symbol.for('karoearth.ui.health-name-viewers')] ??= new Map();
    const sharedCache = new WeakMap();
    const SOURCE_TAG='game_ui_source:';
    const alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    function encode(value) {
        const bytes=[];
        for(const part of encodeURIComponent(value).match(/%[0-9A-F]{2}|./g) ?? [])bytes.push(part[0]==='%'?parseInt(part.slice(1),16):part.charCodeAt(0));
        let out='';
        for(let i=0;i<bytes.length;i+=3){const a=bytes[i],b=bytes[i+1],c=bytes[i+2];out+=alphabet[a>>2]+alphabet[((a&3)<<4)|((b??0)>>4)]+(b===undefined?'=':alphabet[((b&15)<<2)|((c??0)>>6)])+(c===undefined?'=':alphabet[c&63]);}
        return out;
    }
    function decode(value) {
        let encoded='';
        for(let i=0;i<value.length;i+=4){const a=alphabet.indexOf(value[i]),b=alphabet.indexOf(value[i+1]),c=alphabet.indexOf(value[i+2]),d=alphabet.indexOf(value[i+3]);
            if(a<0||b<0)throw Error('invalid UI source');
            const bytes=[(a<<2)|(b>>4),...(c>=0?[((b&15)<<4)|(c>>2)]:[]),...(d>=0?[((c&3)<<6)|d]:[])];
            encoded+=bytes.map(byte=>'%'+byte.toString(16).padStart(2,'0')).join('');
        }
        return decodeURIComponent(encoded);
    }
    function shareSource(entity,original,message) {
        if(entity instanceof Player)return;
        const old=entity.getTags().filter(value=>value.startsWith(SOURCE_TAG));
        const encoded=original===undefined?undefined:encode(JSON.stringify({v:2,original,message}));
        if(encoded!==undefined && encoded.length>12800){for(const value of old)entity.removeTag(value);sharedCache.delete(entity);return;}
        const chunks=encoded===undefined?[]:encoded.match(/.{1,200}/g) ?? [''];
        // Tags are visible across addon UUIDs; dynamic properties are not.
        // Only source text is shared, never translated text or item identity.
        for(let i=0;i<chunks.length;i++)entity.addTag(SOURCE_TAG+i+'/'+chunks.length+':'+chunks[i]);
        const wanted=new Set(chunks.map((part,i)=>SOURCE_TAG+i+'/'+chunks.length+':'+part));
        for(const value of old)if(!wanted.has(value))entity.removeTag(value);
        sharedCache.set(entity,{original,message,until:system.currentTick+20});
    }
    function sharedRecord(entity) {
        const previous=sharedCache.get(entity);
        if(previous && previous.until>system.currentTick)return previous;
        try {
            const tags=entity.getTags().filter(value=>value.startsWith(SOURCE_TAG));
            const chunks=[];let total;
            for(const value of tags){const match=/^(\d+)\/(\d+):([A-Za-z0-9+/=]*)$/.exec(value.slice(SOURCE_TAG.length));if(!match)return;
                const count=Number(match[2]),index=Number(match[1]);if(count>64||index>=count||index<0||chunks[index]!==undefined||total!==undefined&&total!==count)return;total=count;chunks[index]=match[3];}
            if(total===undefined || chunks.length!==total || Array.from({length:total},(_,i)=>chunks[i]).some(value=>value===undefined))return;
            const decoded=decode(chunks.join(''));let record={original:decoded,until:system.currentTick+20};
            try{const parsed=JSON.parse(decoded);if(parsed.v===2&&typeof parsed.original==='string'&&parsed.message!==undefined)record={original:parsed.original,message:parsed.message,until:system.currentTick+20};}catch{/* old lobby source tag */}
            sharedCache.set(entity,record);return record;
        } catch{return undefined;}
    }
    const RANGE = 48, INTERVAL = 10, MAX_LABELS = 256;
    let started = false, timer, discoveryScheduled=false, warned = -1200;
    function scheduleDiscovery() {
        if(discoveryScheduled)return;discoveryScheduled=true;
        system.run(()=>{discoveryScheduled=false;discover();});
    }
    function ensureTimer() {
        if (started && records.size && timer===undefined) timer=system.runInterval(update,INTERVAL);
    }
    function remove(id) {
        for (const [key, label] of labels) {
            if (key !== id && label.entityId !== id) continue;
            labels.delete(key);
            try { label.shape.remove(); } catch { /* expired/unloaded native shape */ }
        }
    }
    function nativeEntity(value) { return value instanceof Entity && !(value instanceof ItemStack); }
    function nativePlayer(player, value, write=false) {
        if (!nativePlayers.has(player)) {
            let original=player.nameTag;
            if (original==='§r') {
                try { original=JSON.parse(player.getDynamicProperty(property) ?? '{}').original ?? player.name; }
                catch { original=player.name; }
                player.nameTag=original;
            }
            player.setDynamicProperty(property,undefined);
            for(const value of player.getTags())if(value.startsWith('game_ui_label_'))player.removeTag(value);
            records.delete(player.id);remove(player.id);nativePlayers.add(player);
        }
        if(write)player.nameTag=value ?? '';
        return player.nameTag;
    }
    function restore(entity) {
        if(entity instanceof Player){nativePlayer(entity);return undefined;}
        try {
            const saved = entity.getDynamicProperty(property);
            if (typeof saved !== 'string' || saved.length > 32768) return undefined;
            const record = JSON.parse(saved);
            if (typeof record.original !== 'string' || !record.message) return undefined;
            const message=npcMessage(entity) ?? (record.formatVersion===2 ? record.message
                : entity instanceof Player || record.message?.text===record.original ? record.message : ui.raw(record.original));
            const next = { entity, original: record.original, message, signature: JSON.stringify(message) };
            records.set(entity.id, next);
            ensureTimer();
            return next;
        } catch { return undefined; }
    }
    function getNameTag(target, optional=false) {
        if(optional && target==null) return undefined;
        if(target instanceof Player){
            if(target.nameTag!=='§r')return target.nameTag;
            try{return JSON.parse(target.getDynamicProperty(property) ?? '{}').original ?? target.name;}catch{return target.name;}
        }
        if (!nativeEntity(target)) return target.nameTag;
        const original=(records.get(target.id) ?? restore(target))?.original;
        if(original!==undefined)return original;
        if(target.nameTag==='§r')return sharedRecord(target)?.original ?? (target instanceof Player?target.name:target.nameTag);
        return target.nameTag;
    }
    function getNameTagMessage(target,optional=false) {
        if(optional && target==null)return ui.literal('');
        if(target instanceof Player)return ui.literal(getNameTag(target));
        if(!nativeEntity(target))return ui.literal(target.nameTag);
        const record=records.get(target.id) ?? restore(target);
        if(record)return ui.preserve(record.message);
        const shared=target.nameTag==='§r'?sharedRecord(target):undefined;
        if(shared)return ui.preserve(shared.message ?? ui.raw(shared.original));
        return ui.literal(target.nameTag);
    }
    function setNameTag(target, value) {
        const original = typeof value === 'string' || value === undefined ? value : ui.original(value);
        if(target instanceof Player)return nativePlayer(target,original,true);
        if (!nativeEntity(target)) { target.nameTag = original; return original; }
        if (typeof original !== 'string') {
            shareSource(target,undefined);
            target.setDynamicProperty(property,undefined);
            target.removeTag(tag);
            target.nameTag = original ?? '';
            records.delete(target.id);remove(target.id);
            return original;
        }
        const previous = records.get(target.id);
        if(previous?.input===value) {
            if(target.nameTag!=='§r') target.nameTag='§r';
            return original;
        }
        // Player and country names are user-authored text, not translation source.
        const message = npcMessage(target) ?? (target instanceof Player ? { text: original }
            : typeof value === 'object' && value ? value : ui.raw(original));
        const signature = JSON.stringify(message);
        if (previous?.original === original && previous.signature === signature) {
            // Another addon or a native rename may have restored the native tag.
            if (target.nameTag !== '§r') target.nameTag = '§r';
            return original;
        }
        const record = { entity: target, original, message, signature, input:value };
        // Save before hiding the native name: a rejected metadata write must not
        // leave the entity without either a recoverable label or its old name.
        shareSource(target,original,message);
        target.setDynamicProperty(property, JSON.stringify({ original, message, formatVersion:2 }));
        target.addTag(tag);
        target.nameTag = '§r';
        records.set(target.id, record);
        ensureTimer();
        if (!original) remove(target.id);
        return original;
    }
    function warning(error) {
        if (system.currentTick - warned < 1200) return;
        warned = system.currentTick;
        console.warn(`[UI labels:${namespace}] native shape unavailable: ${String(error)}`);
    }
    function discover() {
        for(const player of world.getAllPlayers())if(player.isValid)nativePlayer(player);
        // One startup scan. Later chunk loads are tracked by entityLoad, so
        // unchanged worlds do not pay for a repeated global entity query.
        for (const dimensionId of ['overworld','nether','the_end']) {
          try {
            const dimension = world.getDimension(dimensionId);
            for (const entity of dimension.getEntities({ tags: [tag] })) if (!records.has(entity.id)) restore(entity);
            if (options.adoptNpcs) {
                // Existing lobby NPCs can have names saved in the world rather
                // than assigned by a script. Only adopt the lobby's guide types.
                for (const type of npcTypes) {
                    for (const entity of dimension.getEntities({ type })) {
                        if (!records.has(entity.id) && entity.nameTag && entity.nameTag !== '§r') setNameTag(entity, entity.nameTag);
                    }
                }
            }
          } catch (error) { warning(error); }
        }
    }
    function loaded(entity) {
        if(!entity?.isValid)return;
        try {
            if(entity instanceof Player){nativePlayer(entity);return;}
            if(entity.hasTag(tag))restore(entity);
            else if(options.adoptNpcs && npcTypes.includes(entity.typeId)
                && entity.nameTag && entity.nameTag!=='§r')setNameTag(entity,entity.nameTag);
        } catch(error){warning(error);}
    }
    function concealed(entity) {
        if (!(entity instanceof Player)) return false;
        return entity.isSneaking || String(entity.getGameMode()).toLowerCase() === 'spectator' || !!entity.getEffect('invisibility');
    }
    function update() {
        const players = world.getAllPlayers().filter(player => player.isValid);
        // Snapshot native coordinates once per player, rather than once per label.
        const byDimension=new Map();
        for(const player of players) {
            const id=player.dimension.id;
            const list=byDimension.get(id) ?? [];
            list.push({player,location:player.location});byDimension.set(id,list);
        }
        const candidates = [];
        for (const [id, record] of records) {
            const entity = record.entity;
            if (!entity.isValid) { records.delete(id); remove(id); continue; }
            if (!record.original || concealed(entity)) { remove(id); continue; }
            const healthName = options.monsterHealthNames ? healthViewers.get(id) : undefined;
            const location = entity.location;
            const dimensionId=entity.dimension.id;
            let distance = Infinity;
            const viewers = (byDimension.get(dimensionId) ?? []).filter(({player,location:point}) => {
                if (player.id === id) return false;
                const squared = (point.x-location.x)**2 + (point.y-location.y)**2 + (point.z-location.z)**2;
                distance = Math.min(distance, squared);
                // Nearby hunters share the existing combined name+HP primitive.
                if (healthName?.has(player.id) && squared <= 24*24) return false;
                return squared <= RANGE*RANGE;
            }).map(({player})=>player);
            if (viewers.length) {
                if (!(entity instanceof Player) && hasPrimitiveTranslation(record.message)) {
                    for (const group of groupPrimitiveViewers(viewers)) candidates.push({ id:id+'|'+group.locale, entityId:id, record, viewers:group.viewers, locale:group.locale, distance });
                } else candidates.push({ id, entityId:id, record, viewers, distance });
            }
            else remove(id);
        }
        const limit = Math.min(MAX_LABELS, Math.max(0, world.primitiveShapesManager.maxShapes-32));
        const selected = candidates.sort((a,b) => a.distance-b.distance).slice(0,limit);
        const wanted = new Set(selected.map(candidate => candidate.id));
        for (const id of labels.keys()) if (!wanted.has(id)) remove(id);
        for (const { id, entityId, record, viewers, locale } of selected) {
            try {
                const viewerKey = viewers.map(player => player.id).sort().join(',');
                const entity = record.entity;
                const worldAnchored = entity.hasTag('karoearth_dungeon_mob');
                let label = labels.get(id);
                if(label && (label.signature!==record.signature || label.worldAnchored!==worldAnchored)){remove(id);label=undefined;}
                let position;
                if (!label || worldAnchored) {
                    const root = entity.location, head = entity.getHeadLocation();
                    const npcOffset=options.adoptNpcs && npcTypes.includes(entity.typeId)?1:0;
                    const height=Math.max(.35,head.y-root.y)+.85+npcOffset;
                    position=worldAnchored?{x:root.x,y:root.y+height,z:root.z}:{x:0,y:height,z:0};
                }
                if (!label) {
                    // Dungeon coordinates can be far from the origin. Send
                    // world positions so range culling does not depend on the
                    // client resolving an attached entity first.
                    const message=entity instanceof Player?record.original:record.message;
                    const shape = createPrimitiveText(TextPrimitive,position,message,locale,record.original);
                    if (!worldAnchored) shape.attachedTo = entity;
                    shape.depthTest = true;
                    shape.useRotation = false;
                    shape.scale = .8;
                    shape.maximumRenderDistance = RANGE;
                    shape.color = {red:1,green:1,blue:1,alpha:1};
                    shape.backgroundColorOverride = {red:0,green:0,blue:0,alpha:.25};
                    shape.visibleTo = viewers; // [] means EVERYONE: never add an empty viewer list.
                    shape.timeLeft = 2;
                    world.primitiveShapesManager.addText(shape,entity.dimension);
                    label = { shape, entityId, signature:record.signature, viewers:viewerKey, worldAnchored, position, dimension:entity.dimension.id };
                    labels.set(id,label);
                } else {
                    if (worldAnchored && (label.position.x!==position.x || label.position.y!==position.y || label.position.z!==position.z || label.dimension!==entity.dimension.id)) {
                        label.shape.setLocation({...position,dimension:entity.dimension});
                        label.position=position;label.dimension=entity.dimension.id;
                    }
                    if (label.viewers !== viewerKey) { label.shape.visibleTo=viewers; label.viewers=viewerKey; }
                    label.shape.timeLeft = 2;
                }
            } catch (error) { remove(id); warning(error); }
        }
        if(!records.size && timer!==undefined){system.clearRun(timer);timer=undefined;}
    }
    function start() {
        if (started) return;
        started = true;
        scheduleDiscovery();
        world.afterEvents.entityLoad.subscribe(({entity})=>loaded(entity));
        world.afterEvents.entitySpawn.subscribe(({entity})=>loaded(entity));
        world.afterEvents.worldLoad.subscribe(scheduleDiscovery);
        world.afterEvents.playerSpawn.subscribe(({player,initialSpawn})=>{loaded(player);if(options.adoptNpcs && initialSpawn)scheduleDiscovery();});
        world.afterEvents.entityRemove.subscribe(({removedEntityId}) => { records.delete(removedEntityId); remove(removedEntityId); });
        world.afterEvents.playerLeave.subscribe(({playerId}) => { records.delete(playerId); remove(playerId); });
        system.afterEvents?.scriptEventReceive.subscribe(event=>{
            if(event.id==='game_ui:labels_status' && !event.sourceEntity && !event.sourceBlock && !event.initiator) {
                const {npcs,...counts}=stats();console.warn('[UI labels:'+namespace+'] '+JSON.stringify(counts));
            }
        });
    }
    function stats() {
        return {records:records.size,shapes:labels.size,empty:[...labels.values()].filter(label=>label.shape.text==='').length,players:[...records.values()].filter(record=>record.entity instanceof Player).length,plain:true,npcs:[...records.values()].filter(record=>record.entity.typeId.startsWith('npc:')).map(record=>({type:record.entity.typeId,original:record.original,message:record.message}))};
    }
    return { getNameTag, getNameTagMessage, setNameTag, update, start, stats, refresh:discover };
}
