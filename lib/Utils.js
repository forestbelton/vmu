/**
 * Select an inclusive range of bits from a value.
 * @param {number} byte - The value to select from.
 * @param {number} start - The (zero-indexed) bit index to start from.
 * @param {number} end - The bit index to end at.
 */
function bitrange(value, start, end) {
    return (value >> start) & ((1 << (end - start + 1)) - 1);
}

export default {
    bitrange
};