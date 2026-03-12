/** @typedef {import("@minecraft/server").Vector3} Vector3 */

export class Vec3 {
    constructor (x = 0, y = 0, z = 0) {
        this.x = Number(x);
        this.y = Number(y);
        this.z = Number(z);
        this.object = { x: x, y: y, z: z };
    }

    static ZERO = Vec3.fill(0);

    object: any;
    x: any;
    y: any;
    z: any;

    static magnitude (vec: any) {
        return Math.sqrt(Vec3.dot(vec, vec));
    }

    static normalize (vec: any) {
        const l = Vec3.magnitude(vec);
        return new Vec3(vec.x / l, vec.y / l, vec.z / l);
    }

    static cross (a: any, b: any) {
        return new Vec3(a.y * b.z - a.z * b.y, a.x * b.z - a.z * b.x, a.x * b.y - a.y * b.x);
    }

    static dot (a: any, b: any) {
        return a.x * b.x + a.y * b.y + a.z * b.z;
    }

    static angleBetween (a: any, b: any) {
        return Math.acos(Vec3.dot(a, b) / (Vec3.magnitude(a) * Vec3.magnitude(b)));
    }

    static subtract (a: any, b: any) {
        return new Vec3(a.x - b.x, a.y - b.y, a.z - b.z);
    }

    static sum (a: any, b: any) {
        return new Vec3(a.x + b.x, a.y + b.y, a.z + b.z);
    }

    static add (a: any, b: any) {
        let result = { x: 0, y: 0, z: 0 };
        for (let vec of Array.isArray(a) ? [ ...a ] : [ a, b ]) {
            result.x += vec.x;
            result.y += vec.y;
            result.z += vec.z;
        }
        return Vec3.from(result);
    }

    static multiply (vec: any, num: any) {
        return new Vec3(vec.x * (typeof num === "number" ? num : num.x), vec.y * (typeof num === "number" ? num : num.y), vec.z * (typeof num === "number" ? num : num.z));
    }

    static isVec3 (vec: any) {
        return vec instanceof Vec3;
    }

    static ceil (vec: any) {
        return new Vec3(Math.ceil(vec.x), Math.ceil(vec.y), Math.ceil(vec.z));
    }

    static round (vec: any) {
        return new Vec3(Math.round(vec.x), Math.round(vec.y), Math.round(vec.z));
    }

    static floor (vec: any) {
        return new Vec3(Math.floor(vec.x), Math.floor(vec.y), Math.floor(vec.z));
    }

    static projection (a: any, b: any) {
        return Vec3.multiply(b, Vec3.dot(a, b) / (Vec3.dot(b, b) ** 2));
    }

    static rejection (a: any, b: any) {
        return Vec3.subtract(a, Vec3.projection(a, b));
    }

    static reflect (v: any, n: any) {
        return Vec3.subtract(v, Vec3.multiply(n, 2 * Vec3.dot(v, n)));
    }

    static lerp (a: any, b: any, t: any) {
        // @ts-ignore TS(2576): Property 'add' does not exist on type 'Vec3'. Did ... Remove this comment to see the full error message
        return Vec3.multiply(a, 1 - t).add(Vec3.multiply(b, t));
    }

    static distance (a: any, b: any) {
        return Vec3.magnitude(Vec3.subtract(a, b));
    }

    static fill (num: any) {
        return new Vec3(num, num, num)
    }

    /** @returns {Vec3} */
    static from (object: any) {
        if (Vec3.isVec3(object)) return object;
        if (typeof object === "string") object = object.split(/ +/);
        if (Array.isArray(object)) return new Vec3(object[0], object[1], object[2]);
        const { x = 0, y = 0, z = 0 } = object ?? {};
        return new Vec3(Number(x), Number(y), Number(z));
    }

    static between (start: any, end: any, step = 1) {
        let result = [];
        start = Vec3.from(start), end = Vec3.from(end);
        if (start.equal(end)) return [ start ];
        let dx = end.x - start.x, dy = end.y - start.y, dz = end.z - start.z;
        let max = Math.max(Math.abs(dx), Math.abs(dy), Math.abs(dz));
        for (let i = 0; i <= max; i += step) {
            const [ nx, ny, nz ] = [ i * dx / max, i * dy / max, i * dz / max ];
            result.push(new Vec3(start.x + nx, start.y + ny, start.z + nz));
        }
        return result;
    }

    ceil () {
        return new Vec3(Math.ceil(this.x), Math.ceil(this.y), Math.ceil(this.z));
    }

    round () {
        return new Vec3(Math.round(this.x), Math.round(this.y), Math.round(this.z));
    }

    floor () {
        return new Vec3(Math.floor(this.x), Math.floor(this.y), Math.floor(this.z));
    }

    offsetScalar (x = 0, y = 0, z = 0, direction: any) {
        const zVec = direction;
        const xVec = Vec3.normalize(new Vec3(zVec.z, 0, -zVec.x));
        const cross = Vec3.cross(xVec, zVec);
        const yVec = Vec3.normalize(new Vec3(-cross.x, cross.y, -cross.z));
        // @ts-ignore TS(2554): Expected 2 arguments, but got 1.
        return Vec3.add(this, Vec3.add([ Vec3.multiply(xVec, x), Vec3.multiply(yVec, y), Vec3.multiply(zVec, z) ]));
    }

    offset (x: any, y: any, z: any) {
        return Vec3.add(this, new Vec3(x, y, z));
    }

    set (x: any, y: any, z: any) {
        return new Vec3(x === false ? this.x : x, y === false ? this.y : y, z === false ? this.z : 0);
    }

    equal (pos: any) {
        return this.x === pos.x && this.y === pos.y && this.z === pos.z;
    }

    toString () {
        return `${this.x} ${this.y} ${this.z}`;
    }
}

