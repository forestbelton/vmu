// @flow
import CPU from './lib/CPU';

fetch('rom.vms')
    .then(resp => resp.arrayBuffer())
    .then(buf => {
        const rom = new Uint8Array(buf);
        const cpu = new CPU(rom);

        /*function tick() {
            cpu.step();
            setTimeout(tick, 1);
        }

        setTimeout(tick, 1);*/

        while(true) {
            cpu.step();
        }
    });