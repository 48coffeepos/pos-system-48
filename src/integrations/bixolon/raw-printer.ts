import { EscposBuffer } from "./escpos-buffer";

const AGENT_URL = "http://127.0.0.1:3001";
const USB_PRINTER_CLASS = 7;
const DEFAULT_PRINTER_IP = "192.168.1.100";
const DEFAULT_PRINTER_PORT = 9100;

type Platform = "mac" | "windows" | "linux" | "ios" | "android" | "unknown";

function detectPlatform(): Platform {
	try {
		const ua = navigator.userAgent;
		if (/iPhone|iPad|iPod/.test(ua) || (ua.includes("Mac") && "ontouchend" in document))
			return "ios";
		if (/Android/.test(ua)) return "android";
		if (/Mac/.test(ua)) return "mac";
		if (/Win/.test(ua)) return "windows";
		if (/Linux/.test(ua)) return "linux";
		return "unknown";
	} catch {
		return "unknown";
	}
}

function isMacOS(): boolean {
	return detectPlatform() === "mac";
}

function getConfigIP(): string {
	try {
		return localStorage.getItem("48coffee-printer-ip") || DEFAULT_PRINTER_IP;
	} catch {
		return DEFAULT_PRINTER_IP;
	}
}

function getConfigPort(): number {
	try {
		const raw = localStorage.getItem("48coffee-printer-port");
		return raw ? Number(raw) || DEFAULT_PRINTER_PORT : DEFAULT_PRINTER_PORT;
	} catch {
		return DEFAULT_PRINTER_PORT;
	}
}

function isWebUSBSupported(): boolean {
	try {
		return "usb" in navigator && typeof navigator.usb === "object" && navigator.usb !== null;
	} catch {
		return false;
	}
}

async function getUSBDevice(): Promise<USBDevice | null> {
	if (!isWebUSBSupported()) return null;

	try {
		const devices = await navigator.usb.getDevices();
		const printer = devices.find((d) =>
			d.configurations?.some((c) =>
				c.interfaces?.some(
					(i) => i.alternate?.interfaceClass === USB_PRINTER_CLASS,
				),
			),
		);
		if (printer) return printer;
	} catch {
		// no previously authorized device
	}

	try {
		const device = await navigator.usb.requestDevice({
			filters: [{ classCode: USB_PRINTER_CLASS }],
		});
		return device;
	} catch {
		return null;
	}
}

async function sendViaWebUSB(data: Uint8Array): Promise<void> {
	if (!isWebUSBSupported()) {
		throw new Error("WebUSB not available in this browser.");
	}

	const device = await getUSBDevice();
	if (!device) {
		throw new Error("No USB printer selected.");
	}

	try {
		await device.open();
		if (device.configuration === null) {
			await device.selectConfiguration(1);
		}

		const iface = device.configuration?.interfaces?.find(
			(i) => i.alternate?.interfaceClass === USB_PRINTER_CLASS,
		);
		if (!iface) {
			await device.close();
			throw new Error("Printer interface not found.");
		}

		await device.claimInterface(iface.interfaceNumber);

		const endpoint = iface.alternate?.endpoints?.find(
			(e) => e.direction === "out",
		);
		if (!endpoint) {
			await device.close();
			throw new Error("No output endpoint found.");
		}

		await device.transferOut(
			endpoint.endpointNumber,
			data.buffer as ArrayBuffer,
		);
		await device.close();
	} catch (err) {
		try {
			await device.close();
		} catch {
			// ignore
		}
		const message = err instanceof Error ? err.message : String(err);

		if (message.toLowerCase().includes("access denied")) {
			if (isMacOS()) {
				throw new Error(
					"macOS doesn't allow direct USB printing from browsers.\n" +
						"Use the 'Print' button instead (uses the system printer driver).",
				);
			}
			throw new Error(
				"USB printer is in use by another program.\n" +
					"Close any printer software and try again, or use the 'Print' button.",
			);
		}
		throw new Error(`USB print failed: ${message}`);
	}
}

async function sendViaAgent(data: Uint8Array): Promise<void> {
	const ip = getConfigIP();
	const port = getConfigPort();
	const ac = new AbortController();
	const timer = setTimeout(() => ac.abort(), 5000);

	try {
		const res = await fetch(`${AGENT_URL}/print`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				bytes: Array.from(data),
				printerIP: ip,
				printerPort: port,
			}),
			signal: ac.signal,
		});

		if (!res.ok) {
			throw new Error(`Agent error (status ${res.status})`);
		}

		const result = await res.json();
		if (!result.success) {
			throw new Error(result.error || "Agent print failed");
		}
	} catch (err) {
		if (err instanceof Error && err.name === "AbortError") {
			throw new Error("Agent not responding (timeout)");
		}
		if (err instanceof TypeError && err.message.includes("fetch")) {
			throw new Error("Agent not running");
		}
		throw err;
	} finally {
		clearTimeout(timer);
	}
}

async function checkAgentAvailable(): Promise<boolean> {
	const ac = new AbortController();
	const timer = setTimeout(() => ac.abort(), 1000);
	try {
		const res = await fetch(`${AGENT_URL}/health`, { signal: ac.signal });
		return res.ok;
	} catch {
		return false;
	} finally {
		clearTimeout(timer);
	}
}

export async function checkAvailableMethods(): Promise<{
	webusb: boolean;
	agent: boolean;
}> {
	const platform = detectPlatform();
	const webusb = isWebUSBSupported() && platform !== "mac" && platform !== "ios";
	return {
		webusb,
		agent: await checkAgentAvailable(),
	};
}

export interface RawPrintResult {
	success: boolean;
	method: "webusb" | "agent";
}

export async function sendBufferToPrinter(
	buffer: EscposBuffer,
): Promise<RawPrintResult> {
	const data = buffer.toUint8Array();

	// 1. Try local agent (fastest, any browser)
	const agentRunning = await checkAgentAvailable();
	if (agentRunning) {
		try {
			await sendViaAgent(data);
			return { success: true, method: "agent" };
		} catch (err) {
			throw new Error(err instanceof Error ? err.message : "Agent print failed");
		}
	}

	// 2. Try WebUSB (USB printers on Chrome/Edge, Windows/Linux/ChromeOS)
	if (isWebUSBSupported()) {
		if (isMacOS()) {
			throw new Error(
				"Direct USB printing isn't supported on macOS.\n" +
					"Use the 'Print' button above — it works with your USB printer via the system driver.",
			);
		}
		try {
			await sendViaWebUSB(data);
			return { success: true, method: "webusb" };
		} catch (err) {
			throw err;
		}
	}

	// 3. Nothing available — give per-platform guidance
	const platform = detectPlatform();
	const msgs: Record<Platform, string> = {
		mac: "Use the 'Print' button above — it works via the system printer driver.",
		windows:
			"Use Chrome/Edge for direct USB printing, or the 'Print' button above.",
		linux:
			"Use Chrome/Edge for direct USB printing, or the 'Print' button above.",
		ios: "Use the 'Print' button above (AirPrint / Share sheet).",
		android:
			"Use Chrome for direct USB printing, or the 'Print' button above.",
		unknown:
			"Use the 'Print' button above — it works on every browser and OS.",
	};
	throw new Error(msgs[platform]);
}
