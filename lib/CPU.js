const MEMORY_SIZE = 512;

export default class CPU {

    constructor(rom: Uint8Array) {
        this.rom = rom;
        this.ram = new Uint8Array(MEMORY_SIZE);
    }

    /**
     * Fetch a byte from memory.
     * @param {number} addr - The address in memory to fetch a byte from.
     */
    get(addr: number) {
        return this.ram[addr];
    }

    /**
     * Set a byte in memory.
     * @param {number} addr - The address in memory to place the byte at.
     * @param {number} byte - The value of the byte to set.
     */
    put(addr: number, byte: number) {
        this.ram[addr] = byte;
    }
}
