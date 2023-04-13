/** Declaration file generated by dts-gen */

export class BitStream {
    constructor(stream: any);

    readBits(n: any): any;

    writeBits(n: any, value: any): void;

    static EOF: number;

}

export class Context1Model {
    constructor(modelFactory: any, contextSize: any, alphabetSize: any);

    decode(context: any): any;

    encode(ch: any, context: any): void;

    static MAGIC: string;

    static compressFile(inStream: any, outStream: any, props: any): any;

    static decompressFile(inStream: any, outStream: any): any;

}

export class DefSumModel {
    constructor(coder: any, size: any, isDecoder: any);

    decode(): any;

    encode(symbol: any): any;

    static MAGIC: string;

    static compressFile(inStream: any, outStream: any, props: any): any;

    static decompressFile(inStream: any, outStream: any): any;

    static factory(coder: any, isDecoder: any): any;

}

export class FenwickModel {
    constructor(coder: any, size: any, max_prob: any, increment: any);

    clone(): any;

    decode(): any;

    encode(symbol: any): void;

    static MAGIC: string;

    static compressFile(inStream: any, outStream: any, props: any): any;

    static decompressFile(inStream: any, outStream: any): any;

    static factory(coder: any, max_prob: any, increment: any): any;

}

export class Huffman {
    constructor(size: any, root: any, bitstream: any, max_weight: any);

    decode(): any;

    encode(symbol: any): void;

    increment(node: any): void;

    leader(node: any): any;

    readid(): any;

    scale(bits: any): void;

    sendid(symbol: any): void;

    slide(node: any): any;

    split(symbol: any): any;

    static MAGIC: string;

    static compressFile(inStream: any, outStream: any, props: any): any;

    static decompressFile(inStream: any, outStream: any): any;

    static factory(bitstream: any, max_weight: any): any;

}

export class MTFModel {
    constructor(coder: any, size: any, max_prob: any, increment: any, betterEscape: any);

    clone(): any;

    decode(): any;

    encode(symbol: any): any;

    static MAGIC: string;

    static compressFile(inStream: any, outStream: any, props: any): any;

    static decompressFile(inStream: any, outStream: any): any;

    static factory(coder: any, max_prob: any, increment: any, betterEscape: any): any;

}

export class NoModel {
    constructor(bitstream: any, size: any);

    decode(): any;

    encode(symbol: any): void;

    static MAGIC: string;

    static compressFile(inStream: any, outStream: any, props: any): any;

    static decompressFile(inStream: any, outStream: any): any;

    static factory(bitstream: any): any;

}

export class PPM {
    constructor(coder: any, size: any);

    decode(): any;

    encode(symbol: any): void;

    update(symbol: any, contextString: any, matchLevel: any): void;

    static MAGIC: string;

    static compressFile(inStream: any, outStream: any, props: any): any;

    static decompressFile(inStream: any, outStream: any): any;

}

export class RangeCoder {
    constructor(stream: any);

    decodeBit(): any;

    decodeByte(): any;

    decodeCulFreq(tot_f: any): any;

    decodeCulShift(shift: any): any;

    decodeFinish(): void;

    decodeShort(): any;

    decodeStart(skipInitialRead: any): any;

    decodeUpdate(sy_f: any, lt_f: any, tot_f: any): void;

    encodeBit(b: any): void;

    encodeByte(b: any): void;

    encodeFinish(): any;

    encodeFreq(sy_f: any, lt_f: any, tot_f: any): void;

    encodeShift(sy_f: any, lt_f: any, shift: any): void;

    encodeShort(s: any): void;

    encodeStart(c: any, initlength: any): void;

    readBit(): any;

    readByte(): any;

    writeBit(b: any): void;

    writeByte(b: any): void;

}

export class Stream {
    constructor();

    eof(): any;

    flush(): void;

    read(buf: any, bufOffset: any, length: any): any;

    readByte(): any;

    seek(pos: any): void;

    tell(): void;

    write(buf: any, bufOffset: any, length: any): any;

    writeByte(_byte: any): void;

    static EOF: number;

}

export const version: string;

export namespace BWT {
    function bwtransform(T: any, U: any, A: any, n: any, alphabetSize: any): any;

    function bwtransform2(T: any, U: any, n: any, alphabetSize: any): any;

    function suffixsort(T: any, SA: any, n: any, alphabetSize: any): any;

    function unbwtransform(T: any, U: any, LF: any, n: any, pidx: any): void;

}

export namespace BWTC {
    const MAGIC: string;

    function compressFile(inStream: any, outStream: any, props: any): any;

    function decompressFile(inStream: any, outStream: any): any;

}

export namespace Bzip2 {
    function compressFile(inStream: any, outStream: any, props: any): any;

    function decompressBlock(input: any, pos: any, output: any): any;

    function decompressFile(input: any, output: any, multistream: any): any;

    function table(input: any, callback: any, multistream: any): any;

}

export namespace Dmc {
    const MAGIC: string;

    function compressFile(inStream: any, outStream: any, props: any): any;

    function decompressFile(inStream: any, outStream: any): any;

}

export namespace Lzjb {
    const MAGIC: string;

    function compressFile(inStream: any, outStream: any, props: any): any;

    function decompressFile(inStream: any, outStream: any): any;

}

export namespace LzjbR {
    const MAGIC: string;

    function compressFile(inStream: any, outStream: any, props: any): any;

    function decompressFile(inStream: any, outStream: any): any;

}

export namespace Lzp3 {
    const MAGIC: string;

    function compressFile(inStream: any, outStream: any, props: any): any;

    function decompressFile(inStream: any, outStream: any): any;

}

export namespace Simple {
    const MAGIC: string;

    function compressFile(inStream: any, outStream: any, props: any): any;

    function decompressFile(inStream: any, outStream: any): any;

}

