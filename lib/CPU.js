// @flow

import SFR from './SFR';
import Utils from './Utils';

const MEMORY_SIZE = 512;

export default class CPU {

    constructor(rom: Uint8Array) {
        this.rom = rom;
        this.ram = new Uint8Array(MEMORY_SIZE);

        this.PC = 0;
        this.cycles = 0;

        this.put(SFR.SP, 0x7F);
    }

    /**
     * Fetch a byte from ROM.
     * @param {number} addr - The 16-bit address in ROM to fetch a byte from.
     */
    fetch(addr: number) {
        return this.rom[addr];
    }

    /**
     * Fetch a byte from RAM.
     * @param {number} addr - The 9-bit address in RAM to fetch a byte from.
     */
    get(addr: number) {
        return this.ram[addr];
    }

    /**
     * Set a byte in RAM.
     * @param {number} addr - The 9-bit address in RAM to place the byte at.
     * @param {number} byte - The value of the byte to set.
     */
    put(addr: number, byte: number) {
        this.ram[addr] = byte;
    }

    /**
     * Look up an indirect register value.
     * @param {number} insn - The instruction to extract the register number from.
     */
    Ri(insn: number) {
        const reg = insn & 0x3;
        const addr = this.get(reg);
        const mask = reg & 0x2 ? 0x100 : 0;

        return this.get(addr | mask);
    }

    /**
     * Execute the instruction referenced by the PC register.
     */
    step() {
        const insn = this.fetch(this.PC++);
        let r8, d9, Ri, a12, addr, SP, PC;

        switch (insn) {
            // NOP
            case 0x00:
                this.cycles += 1;
                break;

            // BR r8
            case 0x01:
                r8 = this.fetch(this.PC++);
                this.PC += Utils.signed(r8);
                this.cycles += 2;
                break;

            // LD d9
            case 0x02:
            case 0x03:
                d9 = this.fetch(this.PC++);
                this.put(SFR.ACC, Utils.d9(insn, d9));
                this.cycles += 1;
                break;

            // LD @Ri
            case 0x04:
            case 0x05:
            case 0x06:
            case 0x07:
                Ri = this.Ri(insn);
                this.put(SFR.ACC, Ri);
                this.cycles += 1;
                break;

            // CALL a12
            case 0x08:
            case 0x09:
            case 0x0a:
            case 0x0b:
            case 0x0c:
            case 0x0d:
            case 0x0e:
            case 0x0f:
                a12 = this.fetch(this.PC++);
                addr = Utils.a12(insn, a12);

                SP = this.get(SFR.SP);
                this.put(SP, this.PC & 0xff);
                this.put(SP + 1, this.PC >> 8);
                this.put(SFR.SP, SP + 2);

                this.PC = addr;
                this.cycles += 2;
                break;
        }
    }
}
