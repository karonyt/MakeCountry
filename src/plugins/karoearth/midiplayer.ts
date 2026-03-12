import { world, system, Player, CustomCommandParamType, CommandPermissionLevel } from '@minecraft/server';
import { http, HttpRequest } from '@minecraft/server-net';
import { ActionFormData, ModalFormData } from '@minecraft/server-ui';

const SERVER_URL = 'http://n2.khserver.xyz:25515';
const AUTH_TOKEN = '4yY1J6vWrP9L3LF801qqQIAcA9hAmx';

const playerPlaybackTasks = new Map<string, { runId: number }>();
const emitterSessions = new Map<string, any>();
const PLAYLIST_PROPERTY_BASE = 'playlist_data';
const PLAYLIST_PROPERTY_META = 'playlist_meta';
const CHUNK_SIZE = 20000;
const EMITTER_STORE = 'active_emitters';
const ITEMS_PER_PAGE = 15;

function tr(key: string, withArgs?: string[]) {
    return withArgs ? { translate: key, with: withArgs } : { translate: key };
}

async function makeAuthenticatedRequest(url: string) {
    const request = new HttpRequest(url);
    request.addHeader('X-Auth-Token', AUTH_TOKEN);
    return await http.request(request);
}

system.beforeEvents.startup.subscribe(ev => {
    ev.customCommandRegistry.registerCommand({
        name: 'makecountry:playmidi',
        description: 'MIDIファイルを再生します。',
        permissionLevel: CommandPermissionLevel.Any,
        optionalParameters: [
            { name: 'subcommand', type: CustomCommandParamType.String },
            // @ts-ignore
            { name: 'arg1', type: CustomCommandParamType.String, optional: true },
            // @ts-ignore
            { name: 'arg2', type: CustomCommandParamType.String, optional: true },
            // @ts-ignore
            { name: 'arg3', type: CustomCommandParamType.String, optional: true },
            // @ts-ignore
            { name: 'arg4', type: CustomCommandParamType.String, optional: true },
        ],
        // @ts-ignore
    }, (origin, ...args) => {
        system.run(() => handlePlayMidiCommand(origin.sourceEntity, args));
    });

    ev.customCommandRegistry.registerCommand({
        name: 'makecountry:playmidiemitter',
        description: 'MIDIファイルを再生します(emitter)',
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { name: 'file', type: CustomCommandParamType.String },
            { name: 'radius', type: CustomCommandParamType.Integer },
            { name: 'volume', type: CustomCommandParamType.Float },
            { name: 'falloff', type: CustomCommandParamType.String },
            { name: 'islooping', type: CustomCommandParamType.Boolean },
        ],
    // @ts-ignore
    }, (origin, ...args) => {
        system.run(() => handlePlayMidiEmitterCommand(origin.sourceEntity, args));
    });

    ev.customCommandRegistry.registerCommand({
        name: 'makecountry:stopmidiemitter',
        description: 'MIDIファイルの再生を停止します(emitter)',
        permissionLevel: CommandPermissionLevel.GameDirectors,
    // @ts-ignore
    }, () => {
        system.run(() => stopAllEmitters());
    });
});

async function handlePlayMidiCommand(sender: any, args: any[]) {
    if (!(sender instanceof Player)) return;
    const [subcommand, ...commandArgs] = args.filter(Boolean);

    if (!subcommand || ['help', 'ヘルプ'].includes(subcommand)) {
        const helpKeys = [
            'midiplayer.help.header',
            'midiplayer.help.play',
            'midiplayer.help.random',
            'midiplayer.help.playlist',
            'midiplayer.help.search',
            'midiplayer.help.gui',
            'midiplayer.help.stop',
            'midiplayer.help.credit',
            'midiplayer.help.options',
            'midiplayer.help.option.broadcast',
            'midiplayer.help.option.stationary',
            'midiplayer.help.option.loop',
            'midiplayer.help.option.shuffle',
            'midiplayer.help.option.poly',
            'midiplayer.help.option.vol',
            'midiplayer.help.footer',
        ];
        for (const key of helpKeys) sender.sendMessage(tr(key));
        return;
    }

    switch (subcommand) {
        case 'stop':
            stopPlayback(sender);
            return;
        case 'gui': {
            let page = 0;
            if (commandArgs.length > 0) {
                const pageArg = parseInt(commandArgs[0], 10);
                if (!isNaN(pageArg) && pageArg > 0) page = pageArg - 1;
                await openMidiSelectionGui(sender, { mode: 'play' }, page);
                return;
            }
            await openMainGui(sender, page);
            return;
        }
        case 'playlist': {
            const playlistName = commandArgs[0];
            if (playlistName) await openPlaylistManagementGui(sender, playlistName);
            else await openPlaylistListGui(sender);
            return;
        }
        case 'search': {
            const keyword = commandArgs.join(' ');
            if (!keyword) {
                sender.sendMessage(tr('midiplayer.error.keyword_required'));
                return;
            }
            await openMidiSelectionGui(sender, { mode: 'play' }, 0, keyword);
            return;
        }
        case 'credit':
            sender.sendMessage(tr('midiplayer.credit.header'));
            sender.sendMessage(tr('midiplayer.credit.source'));
            sender.sendMessage(tr('midiplayer.credit.author'));
            sender.sendMessage(tr('midiplayer.credit.url'));
            sender.sendMessage(tr('midiplayer.credit.footer'));
            return;
        case 'play':
        case 'random': {
            let fileName = 'random';
            let options = commandArgs;
            if (subcommand === 'play') {
                if (commandArgs.length < 1) {
                    sender.sendMessage(tr('midiplayer.error.file_required'));
                    return;
                }
                fileName = commandArgs[0];
                options = commandArgs.slice(1);
            }
            try {
                executePlayback(sender, parsePlayMidiOptions(fileName, options));
            } catch (error) {
                sender.sendMessage(tr('midiplayer.error.command_failed'));
                console.warn(error);
            }
            return;
        }
        default:
            sender.sendMessage(tr('midiplayer.error.invalid_subcommand'));
            return;
    }
}

async function executePlayback(sender: any, playOptions: any, playlistContext: any = null) {
    if (playerPlaybackTasks.has(sender.id)) {
        system.clearRun(playerPlaybackTasks.get(sender.id)!.runId);
    }
    if (!sender.isValid) return;

    let fileNameToPlay = playOptions.fileName;
    if (playlistContext) {
        if (playlistContext.songs.length === 0) {
            sender.sendMessage(tr('midiplayer.playlist.empty_named', [playlistContext.name]));
            return;
        }
        fileNameToPlay = playOptions.shuffle
            ? playlistContext.songs[Math.floor(Math.random() * playlistContext.songs.length)]
            : playlistContext.songs[playlistContext.index];
    }

    const isRandom = playOptions.originalFileName === 'random';
    if (!playOptions.isLooping) {
        sender.sendMessage(isRandom
            ? tr('midiplayer.playback.fetching_random')
            : tr('midiplayer.playback.fetching', [fileNameToPlay]));
    }

    const url = `${SERVER_URL}/midi-piano-sequence?file=${encodeURIComponent(fileNameToPlay)}&polyphony=${playOptions.polyphony}`;
    try {
        const response = await makeAuthenticatedRequest(url);
        if (response.status === 401) {
            sender.sendMessage(tr('midiplayer.error.auth_failed'));
            return;
        }
        if (response.status !== 200) {
            sender.sendMessage(tr('midiplayer.error.server_error_body', [`${response.status}`, `${response.body}`]));
            return;
        }

        const sequenceData = JSON.parse(response.body);
        const sequence = sequenceData.sequence;
        playOptions.fileName = sequenceData.fileName;
        if (!sequence || sequence.length === 0) {
            sender.sendMessage(tr('midiplayer.error.no_notes'));
            return;
        }

        const nowPlayingMessage = tr('midiplayer.playback.now_playing', [playOptions.fileName]);
        if (isRandom || playlistContext) {
            if (playOptions.broadcast) {
                const nearbyPlayers = sender.dimension.getPlayers({ location: sender.location, maxDistance: 15 });
                for (const player of nearbyPlayers) player.sendMessage(nowPlayingMessage);
            } else {
                sender.sendMessage(nowPlayingMessage);
            }
        }

        if (!playOptions.isLooping) {
            sender.sendMessage(tr('midiplayer.playback.loaded_notes', [`${sequence.length}`]));
        }

        await new Promise<void>(resolve => {
            playPianoSequence(sequence, sender, playOptions, resolve);
        });

        if (!playerPlaybackTasks.has(sender.id)) return;
        if (playlistContext) {
            const nextIndex = playlistContext.index + 1;
            if (playOptions.loop || nextIndex < playlistContext.songs.length) {
                executePlayback(sender, playOptions, { ...playlistContext, index: nextIndex % playlistContext.songs.length });
            }
        } else if (playOptions.loop) {
            playOptions.isLooping = true;
            executePlayback(sender, { ...playOptions, fileName: playOptions.originalFileName });
        }
    } catch (error) {
        sender.sendMessage(tr('midiplayer.error.request_failed'));
        console.warn(error);
    }
}

function parsePlayMidiOptions(fileName: string, args: string[]) {
    const options = {
        originalFileName: fileName,
        fileName,
        polyphony: 64,
        globalVolume: 0.3,
        loop: args.includes('loop'),
        stationary: args.includes('stationary'),
        broadcast: args.includes('broadcast'),
        shuffle: args.includes('shuffle'),
        isLooping: false,
    };
    args.forEach(arg => {
        if (arg.startsWith('poly:')) options.polyphony = parseInt(arg.split(':')[1]) || 64;
        if (arg.startsWith('vol:')) options.globalVolume = parseFloat(arg.split(':')[1]) || 0.3;
    });
    return options;
}

function getFrontLocation(player: any, distance = 2) {
    const headLocation = player.getHeadLocation();
    const viewDirection = player.getViewDirection();
    return {
        x: headLocation.x + viewDirection.x * distance,
        y: headLocation.y + viewDirection.y * distance,
        z: headLocation.z + viewDirection.z * distance,
    };
}

function playPianoSequence(sequence: any[], player: Player, playOptions: any, onComplete: () => void) {
    let sequenceIndex = 0;
    const startTime = Date.now();
    const songDurationMs = sequence.length > 0 ? sequence[sequence.length - 1].time * 1000 : 0;
    if (songDurationMs <= 0) {
        onComplete();
        return;
    }
    const fixedLocation = playOptions.stationary ? getFrontLocation(player) : null;
    const runId = system.runInterval(() => {
        try {
            if (!player.isValid || !playerPlaybackTasks.has(player.id)) {
                system.clearRun(runId);
                playerPlaybackTasks.delete(player.id);
                return;
            }
            const elapsedTime = Date.now() - startTime;
            if (elapsedTime > songDurationMs + 500) {
                system.clearRun(runId);
                onComplete();
                return;
            }
            while (sequenceIndex < sequence.length && sequence[sequenceIndex].time * 1000 <= elapsedTime) {
                const event = sequence[sequenceIndex];
                const pitch = Math.pow(2, event.pitch / 12.0 - 1.0);
                const volume = event.velocity * playOptions.globalVolume;
                if (volume > 0) {
                    const playbackLocation = fixedLocation || getFrontLocation(player);
                    if (playOptions.broadcast) player.dimension.playSound('note.harp', playbackLocation, { pitch, volume });
                    else player.playSound('note.harp', { location: playbackLocation, pitch, volume });
                }
                sequenceIndex++;
            }
        } catch (error) {
            console.warn('Playback error:', error);
            system.clearRun(runId);
            playerPlaybackTasks.delete(player.id);
        }
    }, 1);
    playerPlaybackTasks.set(player.id, { runId });
}

async function openMainGui(player: any, page = 0) {
    const form = new ActionFormData()
        .title(tr('midiplayer.form.main.title'))
        .button(tr('midiplayer.form.main.all_songs'), 'textures/items/record_cat')
        .button(tr('midiplayer.form.main.search'), 'textures/items/spyglass')
        .button(tr('midiplayer.form.main.playlists'), 'textures/items/record_blocks')
        .button(tr('midiplayer.form.main.random'), 'textures/items/record_13');
    const res = await form.show(player);
    if (res.canceled) return;
    if (res.selection === 0) await openMidiSelectionGui(player, { mode: 'play' }, page);
    else if (res.selection === 1) await promptForSearch(player, { mode: 'play' });
    else if (res.selection === 2) await openPlaylistListGui(player);
    else if (res.selection === 3) await openOptionsGui(player, 'random');
}

async function promptForSearch(player: any, context: any) {
    const form = new ModalFormData()
        .title(tr('midiplayer.form.search.title'))
        .textField(tr('midiplayer.form.search.label'), tr('midiplayer.form.search.placeholder'));
    const res = await form.show(player);
    if (res.canceled || !res.formValues?.[0]) {
        if (context.mode === 'add') await openAddSongToPlaylistGui(player, context.playlistName);
        else await openMainGui(player);
        return;
    }
    await openMidiSelectionGui(player, context, 0, String(res.formValues[0]));
}

async function openPlaylistListGui(player: any) {
    const playlists = getPlaylists(player);
    const playlistNames = Object.keys(playlists);
    const form = new ActionFormData()
        .title(tr('midiplayer.form.playlist_list.title'))
        .button(tr('midiplayer.form.playlist_list.create'));
    playlistNames.forEach(name => form.button(`§8§l${name}`));
    const res = await form.show(player);
    if (res.canceled) return;
    if (res.selection === 0) await createPlaylistGui(player);
    else await openPlaylistManagementGui(player, playlistNames[(res.selection ?? 1) - 1]);
}

async function createPlaylistGui(player: any) {
    const form = new ModalFormData()
        .title(tr('midiplayer.form.playlist_create.title'))
        .textField(tr('midiplayer.form.playlist_create.label'), tr('midiplayer.form.playlist_create.placeholder'));
    const res = await form.show(player);
    if (res.canceled || !res.formValues?.[0]) {
        player.sendMessage(tr('midiplayer.playlist.create_cancelled'));
        return;
    }
    const playlistName = String(res.formValues[0]);
    const playlists = getPlaylists(player);
    if (playlists[playlistName]) {
        player.sendMessage(tr('midiplayer.playlist.already_exists', [playlistName]));
        return;
    }
    playlists[playlistName] = { songs: [] };
    savePlaylists(player, playlists);
    player.sendMessage(tr('midiplayer.playlist.created', [playlistName]));
    await openPlaylistManagementGui(player, playlistName);
}

async function openPlaylistManagementGui(player: any, playlistName: string) {
    const playlists = getPlaylists(player);
    const playlist = playlists[playlistName];
    if (!playlist) {
        player.sendMessage(tr('midiplayer.playlist.not_found'));
        await openPlaylistListGui(player);
        return;
    }

    const form = new ActionFormData()
        .title(tr('midiplayer.form.playlist_manage.title'))
        .body(tr('midiplayer.form.playlist_manage.body', [playlistName, `${playlist.songs.length}`]))
        .button(tr('midiplayer.form.playlist_manage.play'), 'textures/items/record_13')
        .button(tr('midiplayer.form.playlist_manage.view_songs'), 'textures/items/book_enchanted')
        .button(tr('midiplayer.form.playlist_manage.add_song'), 'textures/items/book_writable')
        .button(tr('midiplayer.form.playlist_manage.remove_song'), 'textures/ui/icon_trash')
        .button(tr('midiplayer.form.playlist_manage.delete'), 'textures/items/tnt_minecart')
        .button(tr('midiplayer.form.playlist_manage.back'));
    const res = await form.show(player);
    if (res.canceled) return;

    switch (res.selection) {
        case 0: await openOptionsGui(player, playlistName, true); break;
        case 1: await openPlaylistSongsGui(player, playlistName, 0); break;
        case 2: await openAddSongToPlaylistGui(player, playlistName); break;
        case 3: await openRemoveSongFromPlaylistGui(player, playlistName); break;
        case 4:
            delete playlists[playlistName];
            savePlaylists(player, playlists);
            player.sendMessage(tr('midiplayer.playlist.deleted', [playlistName]));
            await openPlaylistListGui(player);
            break;
        case 5:
            await openPlaylistListGui(player);
            break;
    }
}

async function openAddSongToPlaylistGui(player: any, playlistName: string) {
    const form = new ActionFormData()
        .title(tr('midiplayer.form.add_song.title'))
        .body(tr('midiplayer.form.add_song.body', [playlistName]))
        .button(tr('midiplayer.form.add_song.search'))
        .button(tr('midiplayer.form.add_song.all_songs'));
    const res = await form.show(player);
    if (res.canceled) return;
    if (res.selection === 0) await promptForSearch(player, { mode: 'add', playlistName });
    else await openMidiSelectionGui(player, { mode: 'add', playlistName });
}

async function openRemoveSongFromPlaylistGui(player: any, playlistName: string) {
    const playlists = getPlaylists(player);
    const playlist = playlists[playlistName];
    if (!playlist || playlist.songs.length === 0) {
        player.sendMessage(tr('midiplayer.playlist.no_removable_songs'));
        await openPlaylistManagementGui(player, playlistName);
        return;
    }
    const form = new ActionFormData()
        .title(tr('midiplayer.form.remove_song.title'))
        .body(tr('midiplayer.form.remove_song.body', [playlistName]));
    playlist.songs.forEach((song: string) => form.button(`§8§l${song}§r`));
    const res = await form.show(player);
    if (res.canceled || res.selection === undefined) return;
    const songToRemove = playlist.songs[res.selection];
    playlists[playlistName].songs.splice(res.selection, 1);
    savePlaylists(player, playlists);
    player.sendMessage(tr('midiplayer.playlist.song_removed', [songToRemove]));
    await openPlaylistManagementGui(player, playlistName);
}

async function openPlaylistSongsGui(player: any, playlistName: string, page = 0) {
    const playlists = getPlaylists(player);
    const playlist = playlists[playlistName];
    if (!playlist) {
        player.sendMessage(tr('midiplayer.playlist.not_found'));
        await openPlaylistListGui(player);
        return;
    }
    if (playlist.songs.length === 0) {
        player.sendMessage(tr('midiplayer.playlist.empty'));
        await openPlaylistManagementGui(player, playlistName);
        return;
    }

    const totalPages = Math.ceil(playlist.songs.length / ITEMS_PER_PAGE);
    const currentPage = Math.max(0, Math.min(page, totalPages - 1));
    const pageItems = playlist.songs.slice(currentPage * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE + ITEMS_PER_PAGE);
    const form = new ActionFormData()
        .title(tr('midiplayer.form.song_list.title', [playlistName, `${currentPage + 1}`, `${totalPages}`]))
        .button(tr('midiplayer.form.song_list.back'));
    const buttonsOnForm: string[] = ['back'];
    pageItems.forEach((song: string) => {
        form.button(`§0§l${song}`);
        buttonsOnForm.push(song);
    });
    if (currentPage > 0) {
        form.button(tr('midiplayer.form.page.prev'));
        buttonsOnForm.push('prev');
    }
    if (currentPage < totalPages - 1) {
        form.button(tr('midiplayer.form.page.next'));
        buttonsOnForm.push('next');
    }

    const res = await form.show(player);
    if (res.canceled || res.selection === undefined) return;
    const selected = buttonsOnForm[res.selection];
    if (selected === 'back') await openPlaylistManagementGui(player, playlistName);
    else if (selected === 'prev') await openPlaylistSongsGui(player, playlistName, currentPage - 1);
    else if (selected === 'next') await openPlaylistSongsGui(player, playlistName, currentPage + 1);
    else await openOptionsGui(player, selected);
}

async function openMidiSelectionGui(player: any, context: any, page = 0, keyword: string | null = null) {
    try {
        const response = await makeAuthenticatedRequest(`${SERVER_URL}/list-files`);
        if (response.status === 401) {
            player.sendMessage(tr('midiplayer.error.auth_failed'));
            return;
        }
        if (response.status !== 200) {
            player.sendMessage(tr('midiplayer.error.server_error', [`${response.status}`]));
            return;
        }

        let files = JSON.parse(response.body);
        const isSearch = keyword !== null;
        if (isSearch) files = files.filter((file: string) => file.toLowerCase().includes(keyword!.toLowerCase()));

        if (files.length === 0) {
            player.sendMessage(isSearch
                ? tr('midiplayer.error.search_not_found', [keyword!])
                : tr('midiplayer.error.no_files'));
            if (isSearch) {
                if (context.mode === 'add') await openAddSongToPlaylistGui(player, context.playlistName);
                else await openMainGui(player);
            }
            return;
        }

        const selectableFiles = context.mode !== 'add' && !isSearch
            ? ['random', ...files]
            : files.filter((file: string) => !getPlaylists(player)[context.playlistName]?.songs.includes(file));

        const totalPages = Math.ceil(selectableFiles.length / ITEMS_PER_PAGE);
        const currentPage = Math.max(0, Math.min(page, totalPages - 1));
        const title = context.mode === 'add'
            ? tr('midiplayer.form.file_list.add_title', [`${currentPage + 1}`, `${totalPages}`])
            : isSearch
                ? tr('midiplayer.form.file_list.search_title', [keyword!, `${currentPage + 1}`, `${totalPages}`])
                : tr('midiplayer.form.file_list.title', [`${currentPage + 1}`, `${totalPages}`]);
        const pageItems = selectableFiles.slice(currentPage * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE + ITEMS_PER_PAGE);
        const form = new ActionFormData().title(title);
        const buttonsOnForm: string[] = [];

        for (const item of pageItems) {
            if (item === 'random') form.button(tr('midiplayer.form.file_list.random'));
            else form.button(`§8§l${item}§r`);
            buttonsOnForm.push(item);
        }
        if (currentPage > 0) {
            form.button(tr('midiplayer.form.page.prev'));
            buttonsOnForm.push('prev');
        }
        if (currentPage < totalPages - 1) {
            form.button(tr('midiplayer.form.page.next'));
            buttonsOnForm.push('next');
        }

        const result = await form.show(player);
        if (result.canceled || result.selection === undefined) return;
        const selected = buttonsOnForm[result.selection];
        if (!selected) return;
        if (selected === 'prev') {
            await openMidiSelectionGui(player, context, currentPage - 1, keyword);
            return;
        }
        if (selected === 'next') {
            await openMidiSelectionGui(player, context, currentPage + 1, keyword);
            return;
        }

        if (context.mode === 'play') {
            await openOptionsGui(player, selected);
        } else {
            const playlists = getPlaylists(player);
            playlists[context.playlistName].songs.push(selected);
            savePlaylists(player, playlists);
            player.sendMessage(tr('midiplayer.playlist.song_added', [selected, context.playlistName]));
            await openPlaylistManagementGui(player, context.playlistName);
        }
    } catch (error) {
        player.sendMessage(tr('midiplayer.error.file_list_failed'));
        console.warn('GUI Error:', error);
    }
}

async function openOptionsGui(player: any, fileNameOrPlaylist: string, isPlaylist = false) {
    const title = isPlaylist
        ? tr('midiplayer.form.options.playlist_title', [fileNameOrPlaylist])
        : fileNameOrPlaylist === 'random'
            ? tr('midiplayer.form.options.random_title')
            : tr('midiplayer.form.options.song_title', [fileNameOrPlaylist]);
    const form = new ModalFormData().title(title);
    if (isPlaylist) form.toggle(tr('midiplayer.form.options.shuffle'), { defaultValue: false });
    form.toggle(tr('midiplayer.form.options.loop'), { defaultValue: false })
        .toggle(tr('midiplayer.form.options.stationary'), { defaultValue: false })
        .toggle(tr('midiplayer.form.options.broadcast'), { defaultValue: false })
        .textField(tr('midiplayer.form.options.volume'), tr('midiplayer.form.options.volume_placeholder'), { defaultValue: '0.3' })
        .textField(tr('midiplayer.form.options.polyphony'), tr('midiplayer.form.options.polyphony_placeholder'), { defaultValue: '64' });

    const result = await form.show(player);
    if (result.canceled || !result.formValues) return;
    const formValues: any[] = result.formValues as any[];

    let shuffle = false;
    let loop;
    let stationary;
    let broadcast;
    let volStr;
    let polyStr;
    if (isPlaylist) [shuffle, loop, stationary, broadcast, volStr, polyStr] = formValues;
    else [loop, stationary, broadcast, volStr, polyStr] = formValues;

    const vol = parseFloat(String(volStr));
    const poly = parseInt(String(polyStr));
    if (isNaN(vol) || isNaN(poly)) {
        player.sendMessage(tr('midiplayer.error.option_number_required'));
        return;
    }

    const options = parsePlayMidiOptions('', []);
    options.loop = Boolean(loop);
    options.stationary = Boolean(stationary);
    options.broadcast = player.hasTag('music_admin') ? Boolean(broadcast) : Boolean(stationary) ? Boolean(broadcast) : false;
    options.shuffle = Boolean(shuffle);
    options.polyphony = poly;
    options.globalVolume = vol;

    if (isPlaylist) {
        const playlists = getPlaylists(player);
        const playlist = playlists[fileNameOrPlaylist];
        if (!playlist) {
            player.sendMessage(tr('midiplayer.playlist.not_found'));
            return;
        }
        executePlayback(player, options, { name: fileNameOrPlaylist, songs: playlist.songs, index: 0 });
    } else {
        options.originalFileName = fileNameOrPlaylist;
        options.fileName = fileNameOrPlaylist;
        executePlayback(player, options);
    }
}

function getPlaylists(player: any) {
    const metaRaw = player.getDynamicProperty(PLAYLIST_PROPERTY_META);
    if (!metaRaw) return {};
    const meta = JSON.parse(String(metaRaw));
    let json = '';
    for (let i = 0; i < meta.chunks; i++) {
        const chunk = player.getDynamicProperty(`${PLAYLIST_PROPERTY_BASE}_${i}`);
        if (typeof chunk !== 'string') throw new Error('Playlist data corrupted');
        json += chunk;
    }
    return JSON.parse(json);
}

function savePlaylists(player: any, playlists: any) {
    const json = JSON.stringify(playlists);
    const metaRaw = player.getDynamicProperty(PLAYLIST_PROPERTY_META);
    const oldMeta = metaRaw ? JSON.parse(String(metaRaw)) : { chunks: 0 };
    for (let i = 0; i < oldMeta.chunks; i++) player.setDynamicProperty(`${PLAYLIST_PROPERTY_BASE}_${i}`);

    const chunks = [];
    for (let i = 0; i < json.length; i += CHUNK_SIZE) chunks.push(json.slice(i, i + CHUNK_SIZE));
    chunks.forEach((chunk, i) => player.setDynamicProperty(`${PLAYLIST_PROPERTY_BASE}_${i}`, chunk));
    player.setDynamicProperty(PLAYLIST_PROPERTY_META, JSON.stringify({ chunks: chunks.length }));
}

function stopPlayback(sender: any) {
    if (!playerPlaybackTasks.has(sender.id)) return;
    system.clearRun(playerPlaybackTasks.get(sender.id)!.runId);
    playerPlaybackTasks.delete(sender.id);
    sender.sendMessage(tr('midiplayer.playback.stopped'));
}

world.afterEvents.playerLeave.subscribe(ev => {
    if (!playerPlaybackTasks.has(ev.playerId)) return;
    system.clearRun(playerPlaybackTasks.get(ev.playerId)!.runId);
    playerPlaybackTasks.delete(ev.playerId);
});

function saveEmittersToWorld() {
    const data = [...emitterSessions.values()].map(s => ({
        id: s.id,
        dimensionId: s.dimension.id,
        location: s.location,
        fileName: s.fileName,
        radius: s.radius,
        falloff: s.falloff,
        volume: s.volume,
        polyphony: s.polyphony,
        loop: s.loop,
    }));
    world.setDynamicProperty(EMITTER_STORE, JSON.stringify(data));
}

world.afterEvents.worldLoad.subscribe(() => {
    const raw = world.getDynamicProperty(EMITTER_STORE);
    if (!raw) return;
    const emitters = JSON.parse(String(raw));
    for (const emitter of emitters) restoreEmitter(emitter);
});

async function restoreEmitter(data: any) {
    const dim = world.getDimension(data.dimensionId);
    const url = `${SERVER_URL}/midi-piano-sequence?file=${encodeURIComponent(data.fileName)}&polyphony=${data.polyphony}`;
    const res = await makeAuthenticatedRequest(url);
    if (res.status !== 200) return;

    const { sequence } = JSON.parse(res.body);
    const session = {
        ...data,
        dimension: dim,
        sequence,
        startTime: 0,
        index: 0,
        runId: 0,
    };
    emitterSessions.set(session.id, session);
    startEmitter(session);
}

function generateEmitterId() {
    return `${Date.now().toString(36)}-${Math.floor(Math.random() * 1e9).toString(36)}`;
}

async function handlePlayMidiEmitterCommand(sender: any, args: any[]) {
    if (!(sender instanceof Player)) return;
    const [file, radiusStr, volumeStr, falloff, isLooping] = args;
    const radius = Number(radiusStr);
    const volume = Number(volumeStr);
    if (!file || isNaN(radius) || isNaN(volume)) {
        sender.sendMessage(tr('midiplayer.emitter.usage'));
        return;
    }

    const url = `${SERVER_URL}/midi-piano-sequence?file=${encodeURIComponent(file)}&polyphony=64`;
    const res = await makeAuthenticatedRequest(url);
    if (res.status !== 200) return;

    const { sequence, fileName } = JSON.parse(res.body);
    const session = {
        id: generateEmitterId(),
        dimension: sender.dimension,
        location: { ...sender.location },
        sequence,
        fileName,
        radius,
        falloff: falloff === 'square' ? 'square' : 'linear',
        volume,
        polyphony: 64,
        loop: isLooping,
        startTime: 0,
        index: 0,
        runId: 0,
    };
    emitterSessions.set(session.id, session);
    startEmitter(session);
    saveEmittersToWorld();
}

function calcAttenuation(distance: number, radius: number, falloff: string) {
    if (distance >= radius) return 0;
    const t = distance / radius;
    return falloff === 'square' ? 1 - t * t : 1 - t;
}

function playSoundWithRadius(session: any, pitch: number, baseVolume: number) {
    const players = session.dimension.getPlayers({ location: session.location, maxDistance: session.radius });
    for (const player of players) {
        const dx = player.location.x - session.location.x;
        const dy = player.location.y - session.location.y;
        const dz = player.location.z - session.location.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        const atten = calcAttenuation(dist, session.radius, session.falloff);
        if (atten <= 0) continue;
        player.playSound('note.harp', { location: player.location, pitch, volume: baseVolume * atten });
    }
}

function startEmitter(session: any) {
    session.startTime = Date.now();
    session.index = 0;
    const durationMs = (session.sequence.at(-1)?.time ?? 0) * 1000;

    session.runId = system.runInterval(() => {
        const elapsed = Date.now() - session.startTime;
        if (elapsed > durationMs + 300) {
            if (session.loop) {
                session.startTime = Date.now();
                session.index = 0;
                return;
            }
            finalizeEmitter(session.id);
            return;
        }

        while (session.index < session.sequence.length && session.sequence[session.index].time * 1000 <= elapsed) {
            const event = session.sequence[session.index];
            const pitch = Math.pow(2, event.pitch / 12 - 1);
            const volume = event.velocity * session.volume;
            if (volume > 0) playSoundWithRadius(session, pitch, volume);
            session.index++;
        }
    }, 1);
}

function finalizeEmitter(emitterId: string) {
    const session = emitterSessions.get(emitterId);
    if (!session) return;
    system.clearRun(session.runId);
    emitterSessions.delete(emitterId);
    saveEmittersToWorld();
}

function stopEmitter(emitterId: string) {
    const session = emitterSessions.get(emitterId);
    if (!session) return;
    system.clearRun(session.runId);
    emitterSessions.delete(emitterId);
}

function stopAllEmitters() {
    for (const id of emitterSessions.keys()) stopEmitter(id);
    saveEmittersToWorld();
}
