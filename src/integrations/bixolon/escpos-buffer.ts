const ESC = 0x1b;
const GS = 0x1d;

export class EscposBuffer {
	private bytes: number[] = [];

	init(): void {
		this.bytes = [];
		this.bytes.push(ESC, 0x40);
	}

	align(pos: "left" | "center" | "right"): void {
		const map = { left: 0x00, center: 0x01, right: 0x02 };
		this.bytes.push(ESC, 0x61, map[pos]);
	}

	setPrintMode(dw: boolean, dh: boolean): void {
		let val = 0;
		if (dw) val |= 0x10;
		if (dh) val |= 0x20;
		this.bytes.push(GS, 0x21, val);
	}

	resetPrintMode(): void {
		this.bytes.push(GS, 0x21, 0x00);
	}

	setBold(on: boolean): void {
		this.bytes.push(ESC, 0x45, on ? 0x01 : 0x00);
	}

	setUnderline(on: boolean): void {
		this.bytes.push(ESC, 0x2d, on ? 0x01 : 0x00);
	}

	writeText(text: string): void {
		const encoded = new TextEncoder().encode(text);
		for (const b of encoded) {
			this.bytes.push(b);
		}
	}

	writeTextLine(text: string): void {
		this.writeText(text);
		this.bytes.push(0x0a);
	}

	feed(lines: number): void {
		if (lines <= 1) {
			this.bytes.push(0x0a);
		} else {
			this.bytes.push(ESC, 0x64, Math.min(lines, 255));
		}
	}

	cut(): void {
		this.bytes.push(GS, 0x56, 0x42, 3);
	}

	drawerKick(pin: 2 | 5): void {
		const p = pin === 5 ? 0x01 : 0x00;
		this.bytes.push(ESC, 0x70, p, 0x19, 0xfa);
	}

	buzzer(): void {
		this.bytes.push(ESC, 0x42, 0x03, 0x03);
	}

	toUint8Array(): Uint8Array {
		return new Uint8Array(this.bytes);
	}

	getBuffer(): number[] {
		return [...this.bytes];
	}
}
