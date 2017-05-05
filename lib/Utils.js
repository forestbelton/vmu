// @flow

/**
 * Select an inclusive range of bits from a value.
 * @param {number} byte - The value to select from.
 * @param {number} start - The (zero-indexed) bit index to start from.
 * @param {number} end - The bit index to end at.
 */
function bitrange(value: number, start: number, end: number) {
    return (value >> start) & ((1 << (end - start + 1)) - 1);
}

/**
 * Clear a bit from a byte.
 * @param {number} byte - The byte to clear a bit from.
 * @param {number} bit - The (zero-indexed) bit to clear.
 */
function bitclear(byte: number, bit: number) {
    const mask = ~(1 << bit) & 0xff;
    return byte & mask;
}

/**
 * Interpret an unsigned 8-bit value as if it were signed.
 * @param {number} byte - The byte to convert.
 */
function signed(byte: number) {
    return byte & (1 << 7)
        ? (byte & 0x7f) - 128
        : byte;
}

/**
 * Extract a 9-bit RAM address from an instruction.
 * @param {number} hi - The first byte of the instruction.
 * @param {number} lo - The second byte of the instruction.
 */
function d9(hi: number, lo: number) {
    return ((hi & 1) << 8) | (lo & 0xff);
}

/**
 * Extract a 12-bit ROM address from an instruction.
 * @param {number} hi - The first byte of the instruction.
 * @param {number} lo - The second byte of the instruction.
 */
function a12(hi: number, lo: number) {
    return ((hi & 0xf) << 8) | (lo & 0xff);
}

/**
 * Get the hex representation of a 9-bit address.
 * @param {number} d9 - The 9-bit address.
 */
function hex_d9(d9: number) {
    const h = '0123456789abcdef';
    const lead = insn > 0xff ? '1' : '';
    return lead + h[(insn >> 4) & 0xf] + h[insn & 0xf];
}

export default {
    bitrange,
    bitclear,
    signed,
    d9,
    a12,
    hex_d9
};