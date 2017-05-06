// @flow
import Utils from './Utils';

const DISPLAY_WIDTH = 48;
const DISPLAY_HEIGHT = 32;

const BANK_SIZE = 96;

const WHITE = 0x00000000;
const BLACK = 0xffffffff;

export default class Video {

    constructor() {
        this.buf = new Uint8Array(BANK_SIZE * 2);
        this.icons = new Uint8Array(BANK_SIZE);
    }

    /**
     * Get a pixel chunk from the video framebuffer.
     */
    get(bank: number, offset: number) {
        const idx = bank * BANK_SIZE + offset;
        return this.buf[idx];
    }

    /**
     * Set a pixel chunk in the video framebuffer.
     * @param {number} bank - The bank number (0 or 1) to use.
     * @param {number} offset - The offset into the bank.
     * @param {number} value - The 8-bit chunk of pixels.
     */
    set(bank: number, offset: number, value: number) {
        const idx = bank * BANK_SIZE + offset;
        this.buf[idx] = value;
    }

    /**
     * Render the display to a canvas.
     * @param {CanvasRenderingContext2D} ctx - The canvas to draw to.
     */
    draw(ctx: CanvasRenderingContext2D) {
        ctx.clearRect(0, 0, 48, 32);
        const img = ctx.createImageData(DISPLAY_WIDTH, DISPLAY_HEIGHT);

        let i = 0;
        for (let y = 0; y < 32; ++y) {
            for (let chunk = 0; chunk < 6; ++chunk) {
                const byte = this.buf[y * 6 + chunk];

                for (let i = 0; i < 8; ++i) {
                    const x = chunk * 6 + i;
                    const fill = Utils.bittest(byte, i) ? 0x00 : 0xff;

                    if (fill == 0x00) {
                        console.log(`setting ${x}, ${y}`);
                    }

                    img.data[y * DISPLAY_WIDTH + x * 4 + 0] = fill;
                    img.data[y * DISPLAY_WIDTH + x * 4 + 1] = fill;
                    img.data[y * DISPLAY_WIDTH + x * 4 + 2] = fill;
                    img.data[y * DISPLAY_WIDTH + x * 4 + 3] = 0xff;
                }
            }
        }

        ctx.putImageData(img, 0, 0);
    }
}