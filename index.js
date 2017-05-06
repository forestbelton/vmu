// @flow
import CPU from './lib/CPU';
import Utils from './lib/Utils';

fetch('rom.vms')
    .then(resp => resp.arrayBuffer())
    .then(buf => {
        const rom = new Uint8Array(buf);
        const cpu = new CPU(rom);

        let good = 0;
        let total = 0;
        const unimplemented = [];

        for (let i = 0; i <= 0xff; ++i) {
            const rom = new Uint8Array([i, 0, 0]);
            const cpu = new CPU(rom);

            try {
                cpu.step();
                ++good;
            } catch (e) {
                unimplemented.push(Utils.hex_d9(i));
            }
            ++total;
        }

        console.log(`${good / total * 100}% instructions implemented.`);
        console.log(`Missing instructions: ${unimplemented.join(', ')}`);

        function tick() {
            cpu.step();
            setTimeout(tick, 100);
        }

        setTimeout(tick, 100);
    });