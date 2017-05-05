// @flow

import Flag from './Flag';
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

        // TODO: Incorporate IRBK
        return this.get(addr | mask);
    }

    /**
     * Set or unset a flag.
     * @param {number} flag - The index of the flag in PSW.
     * @param {number} bit - Whether the flag should be set or not.
     */
    flag(flag: number, bit: number) {
        const PSW = this.get(SFR.PSW);
        this.put(SFR.PSW, PSW & (bit << flag));
    }

    /**
     * Execute the instruction referenced by the PC register.
     */
    step() {
        const insn = this.fetch(this.PC++);
        let r8, d9, Ri, a12, addr, SP, PC, val, imm, sum;

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

                this.PC = (this.PC & 0xf000) | addr;
                this.cycles += 2;
                break;

            // CALLR r16
            case 0x10:
                break;

            // BRF r16
            case 0x11:
                break;

            // ST r9
            case 0x12:
            case 0x13:
                break;

            // ST @Ri
            case 0x14:
            case 0x15:
            case 0x16:
            case 0x17:
                break;

            // CALL a12
            case 0x18:
            case 0x19:
            case 0x1a:
            case 0x1b:
            case 0x1c:
            case 0x1d:
            case 0x1e:
            case 0x1f:
                break;

            // CALLF a16
            case 0x20:
                break;

            // JMPF a16
            case 0x21:
                break;

            // MOV #i8, d9
            case 0x22:
            case 0x23:
                d9 = this.fetch(this.PC++);
                addr = Utils.d9(insn, d9);
                val = this.fetch(this.PC++);

                this.put(addr, val);
                this.cycles += 2;
                break;

            // MOV #i8, @Ri
            case 0x24:
            case 0x25:
            case 0x26:
            case 0x27:
                break;

            // JMP a12
            case 0x28:
            case 0x29:
            case 0x2a:
            case 0x2b:
            case 0x2c:
            case 0x2d:
            case 0x2e:
            case 0x2f:
                a12 = this.fetch(this.PC++);
                addr = Utils.a12(insn, a12);

                this.PC = (this.PC & 0xf000) | addr;
                this.PC--;
                if (this.PC < 0) {
                    this.PC = 0xffff;
                }

                this.cycles += 2;
                break;

            // MUL
            case 0x30:
                break;

            // BE #i8, r8
            case 0x31:
                break;

            // BE d9, r8
            case 0x32:
            case 0x33:
                break;

            // BE @Ri, #i8, r8
            case 0x34:
            case 0x35:
            case 0x36:
            case 0x37:
                break;

            // JMP a12
            case 0x38:
            case 0x39:
            case 0x3a:
            case 0x3b:
            case 0x3c:
            case 0x3d:
            case 0x3e:
            case 0x3f:
                a12 = this.fetch(this.PC++);
                addr = Utils.a12(insn, a12);

                this.PC = (this.PC & 0xf000) | addr;
                this.PC--;
                if (this.PC < 0) {
                    this.PC = 0xffff;
                }

                this.cycles += 2;
                break;

            // ADD d9
            case 0x82:
            case 0x83:
                d9 = this.fetch(this.PC++);
                addr = Utils.d9(insn, d9);
                imm = this.get(addr);
                val = this.get(SFR.ACC);

                sum = imm + val;

                this.put(SFR.ACC, sum & 0xff);
                this.flag(Flag.CY, (sum >> 8) & 1);
                this.flag(Flag.AC, ((imm & 0xf + val & 0xf) >> 4) & 1);
                this.flag(Flag.OV, ((imm & val & 0x80) >> 7) & (+!((sum & 0x80) >> 7)));

                this.cycles += 1;
                break;

            // CLR1 d9, b3
            case 0xc8:
            case 0xc9:
            case 0xca:
            case 0xcb:
            case 0xcc:
            case 0xcd:
            case 0xce:
            case 0xcf:
                d9 = this.fetch(this.PC++);
                addr = Utils.d9(insn, d9);
                val = this.get(addr);

                this.put(addr, Utils.bitclear(val, (insn >> 1) & 0x7));
                this.cycles += 1;
                break;

            // CLR1 d9, b3
            case 0xd8:
            case 0xd9:
            case 0xda:
            case 0xdb:
            case 0xdc:
            case 0xdd:
            case 0xde:
            case 0xdf:
                d9 = this.fetch(this.PC++);
                addr = Utils.d9(insn, d9);
                val = this.get(addr);

                this.put(addr, Utils.bitclear(val, (insn >> 1) & 0x7));
                this.cycles += 1;
                break;

            // SET1 d9, b3
            case 0xe8:
            case 0xe9:
            case 0xea:
            case 0xeb:
            case 0xec:
            case 0xed:
            case 0xee:
            case 0xef:
                d9 = this.fetch(this.PC++);
                addr = Utils.d9(insn, d9);
                val = this.get(addr);

                this.put(addr, Utils.bitset(val, (insn >> 1) & 0x7));
                this.cycles += 1;
                break;

            // SET1 d9, b3
            case 0xf8:
            case 0xf9:
            case 0xfa:
            case 0xfb:
            case 0xfc:
            case 0xfd:
            case 0xfe:
            case 0xff:
                d9 = this.fetch(this.PC++);
                addr = Utils.d9(insn, d9);
                val = this.get(addr);

                this.put(addr, Utils.bitset(val, (insn >> 1) & 0x7));
                this.cycles += 1;
                break;

            default:
                throw new Error(`unknown opcode 0x${Utils.hex_d9(insn)}`);
        }
    }
}
