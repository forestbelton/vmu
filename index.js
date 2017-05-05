// @flow
import CPU from './lib/CPU';

fetch('rom.vms')
    .then(resp => resp.arrayBuffer())
    .then(buf => {
        const rom = new Uint8Array(buf);
        const cpu = new CPU(rom);

        while (true) {
            cpu.step();
        }
    });