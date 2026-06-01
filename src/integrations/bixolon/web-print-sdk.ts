import { BIXOLON_DEFAULT_SETTINGS } from "./printer";
import { sendBufferToPrinter } from "./raw-printer";
import { EscposBuffer } from "./escpos-buffer";
import type {
	BixolonAlignOptions,
	BixolonBarcodeOptions,
	BixolonConnectionConfig,
	BixolonDrawerKickOptions,
	BixolonPaperCutOptions,
	BixolonPaperFeedOptions,
	BixolonSDKInstance,
	BixolonTextOptions,
} from "./types";

let sdkInstance: BixolonSDKInstance | null = null;
let loaded = false;

function createShim(): BixolonSDKInstance {
	const buf = new EscposBuffer();
	buf.init();

	return {
		makeAlign(opts: BixolonAlignOptions): void {
			buf.align(opts.pos);
		},

		makeText(opts: BixolonTextOptions): void {
			buf.setPrintMode(opts.wd === "2", opts.ht === "2");
			buf.setBold(opts.bold === "true");
			buf.setUnderline(opts.uline === "true");
			buf.writeTextLine(opts.data);
		},

		makePaperFeed(opts: BixolonPaperFeedOptions): void {
			const lines = Number.parseInt(opts.value ?? "1", 10) || 1;
			buf.feed(lines);
		},

		makePaperCut(_opts: BixolonPaperCutOptions): void {
			buf.cut();
		},

		makeDKout(opts: BixolonDrawerKickOptions): void {
			buf.drawerKick(opts.connector === "pin5" ? 5 : 2);
		},

		makeBuzzer(): void {
			buf.buzzer();
		},

		makeReinit(): void {
			buf.init();
		},

		makeBarcode12(_opts: BixolonBarcodeOptions): void {
			// barcode not implemented in ESC/POS fallback
		},

		async sendData(
			_ipAddr: string,
			_shopID: string,
			_devID: string,
		): Promise<void> {
			const result = await sendBufferToPrinter(buf);
			if (!result.success) {
				throw new Error("Print failed");
			}
		},

		getDeviceList(_ipAddr: string, _shopID: string, _listInputBoxID: string): void {
			// no-op
		},

		getShopList(_ipAddr: string, _listInputBoxID: string): void {
			// no-op
		},
	};
}

export async function loadBixolonSDK(): Promise<boolean> {
	if (loaded && sdkInstance) return true;

	const shim = createShim();
	sdkInstance = shim;
	loaded = true;
	return true;
}

export function getBixolonSDK(): BixolonSDKInstance | null {
	return sdkInstance;
}

export function isBixolonSDKLoaded(): boolean {
	return loaded && sdkInstance !== null;
}

export async function sendToPrinter(
	config?: Partial<BixolonConnectionConfig>,
): Promise<void> {
	const sdk = getBixolonSDK();
	if (!sdk) throw new Error("Printer SDK not loaded");

	const { ipAddr, shopID, devID } = {
		...BIXOLON_DEFAULT_SETTINGS,
		...config,
	};

	await sdk.sendData(ipAddr, shopID, devID);
}

export async function resetPrinter(
	config?: Partial<BixolonConnectionConfig>,
): Promise<void> {
	const sdk = getBixolonSDK();
	if (!sdk) throw new Error("Printer SDK not loaded");

	sdk.makeReinit();
	await sendToPrinter(config);
}

export function cutPaper(feed: boolean = true): void {
	const sdk = getBixolonSDK();
	if (!sdk) throw new Error("Printer SDK not loaded");

	sdk.makePaperCut({ cuttype: feed ? "feed" : "nofeed" });
}

export function openCashDrawer(): void {
	const sdk = getBixolonSDK();
	if (!sdk) throw new Error("Printer SDK not loaded");

	sdk.makeDKout({ connector: "pin2", duration: "200" });
}

export function buzzPrinter(): void {
	const sdk = getBixolonSDK();
	if (!sdk) throw new Error("Printer SDK not loaded");

	sdk.makeBuzzer();
}
