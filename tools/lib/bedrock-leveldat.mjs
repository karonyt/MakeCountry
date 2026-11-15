// Bedrock level.dat: an 8-byte header followed by little-endian NBT. Preserve
// unrelated tags exactly, including unknown future tags and their ordering.
function textAt(buffer, offset) {
    const length = buffer.readUInt16LE(offset);
    const end = offset + 2 + length;
    if (end > buffer.length) throw Error('Truncated NBT string');
    return { text: buffer.toString('utf8', offset + 2, end), end };
}
function skip(buffer, type, offset) {
    if (type >= 1 && type <= 6) return offset + [0,1,2,4,8,4,8][type];
    if (type === 8) return textAt(buffer, offset).end;
    if ([7,11,12].includes(type)) {
        const length = buffer.readInt32LE(offset);
        if (length < 0) throw Error('Invalid NBT array length');
        return offset + 4 + length * ({7:1,11:4,12:8}[type]);
    }
    if (type === 9) {
        const subtype = buffer[offset++]; const count = buffer.readInt32LE(offset); offset += 4;
        if (count < 0 || count > buffer.length) throw Error('Invalid NBT list length');
        for (let i = 0; i < count; i++) offset = skip(buffer, subtype, offset);
        return offset;
    }
    if (type === 10) return entries(buffer, offset).end;
    throw Error(`Unsupported NBT type ${type}`);
}
function entries(buffer, offset) {
    const tags = [];
    while (offset < buffer.length && buffer[offset] !== 0) {
        const start = offset; const type = buffer[offset++]; const name = textAt(buffer, offset);
        const data = name.end; offset = skip(buffer, type, data);
        if (offset > buffer.length) throw Error('Truncated NBT payload');
        tags.push({ start, end: offset, type, name: name.text, data });
    }
    if (buffer[offset] !== 0) throw Error('Missing NBT compound terminator');
    return { tags, terminator: offset, end: offset + 1 };
}
function nbtString(value) {
    const data = Buffer.from(value); const length = Buffer.alloc(2); length.writeUInt16LE(data.length);
    return Buffer.concat([length, data]);
}
export function setCustomBiomes(buffer) {
    if (buffer.length < 12 || buffer.readUInt32LE(4) !== buffer.length - 8 || buffer[8] !== 10) throw Error('Invalid Bedrock level.dat header');
    const root = entries(buffer, textAt(buffer, 9).end);
    if (root.end !== buffer.length) throw Error('Unexpected trailing NBT data');
    const experimentTag = root.tags.find(tag => tag.name === 'experiments');
    if (experimentTag && experimentTag.type !== 10) throw Error('Invalid experiments compound');
    const experiment = experimentTag ? entries(buffer, experimentTag.data) : { tags: [] };
    const required = ['data_driven_biomes', 'experiments_ever_used', 'saved_with_toggled_experiments'];
    const changed = required.filter(name => {
        const tag = experiment.tags.find(tag => tag.name === name);
        return !tag || tag.type !== 1 || buffer[tag.data] !== 1;
    });
    if (!changed.length) return { buffer, changed };
    const preserved = experiment.tags.filter(tag => !required.includes(tag.name)).map(tag => buffer.subarray(tag.start, tag.end));
    const compound = Buffer.concat([Buffer.from([10]), nbtString('experiments'), ...preserved,
        ...required.map(name => Buffer.concat([Buffer.from([1]), nbtString(name), Buffer.from([1])])), Buffer.from([0])]);
    const result = experimentTag
        ? Buffer.concat([buffer.subarray(0, experimentTag.start), compound, buffer.subarray(experimentTag.end)])
        : Buffer.concat([buffer.subarray(0, root.terminator), compound, buffer.subarray(root.terminator)]);
    result.writeUInt32LE(result.length - 8, 4);
    return { buffer: result, changed };
}
