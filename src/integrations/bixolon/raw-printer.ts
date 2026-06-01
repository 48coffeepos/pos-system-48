import { EscposBuffer } from "./escpos-buffer";

const AGENT_URL = "http://127.0.0.1:3001/print";
const USB_PRINTER_CLASS = 7;

function isWebUSBSupported(): boolean {
	return (
		typeof navigator !== "undefined" &&
		"usb" in navigator &&
		typeof navigator.usb === "object" &&
		navigator.usb !== null
	);
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
		throw new Error("WebUSB not available. Use Chrome/Edge.");
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
			throw new Error("Printer interface not found on the selected device.");
		}

		await device.claimInterface(iface.interfaceNumber);

		const endpoint = iface.alternate?.endpoints?.find(
			(e) => e.direction === "out",
		);
		if (!endpoint) {
			await device.close();
			throw new Error("No output endpoint found on the printer.");
		}

		await device.transferOut(endpoint.endpointNumber, data.buffer as ArrayBuffer);
		await device.close();
	} catch (err) {
		try {
			await device.close();
		} catch {
			// ignore close errors
		}
		throw err;
	}
}

async function sendViaAgent(data: Uint8Array): Promise<void> {
	const res = await fetch(AGENT_URL, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ bytes: Array.from(data) }),
		signal: AbortSignal.timeout(5000),
	});

	if (!res.ok) {
		throw new Error(`Agent returned status ${res.status}`);
	}

	const result = await res.json();
	if (!result.success) {
		throw new Error(result.error ?? "Agent print failed");
	}
}

async function checkAgentAvailable(): Promise<boolean> {
	try {
		const res = await fetch("http://127.0.0.1:3001/health", {
			signal: AbortSignal.timeout(1000),
		});
		return res.ok;
	} catch {
		return false;
	}
}

export async function checkAvailableMethods(): Promise<{
	webusb: boolean;
	agent: boolean;
}> {
	const webusb = isWebUSBSupported();
	const agent = await checkAgentAvailable();
	return { webusb, agent };
}

export interface RawPrintResult {
	success: boolean;
	method: "webusb" | "agent";
}

export async function sendBufferToPrinter(
	buffer: EscposBuffer,
): Promise<RawPrintResult> {
	const data = buffer.toUint8Array();
	const errors: string[] = [];

	if (isWebUSBSupported()) {
		try {
			await sendViaWebUSB(data);
			return { success: true, method: "webusb" };
		} catch (err) {
			errors.push(
				`USB: ${err instanceof Error ? err.message : "unknown error"}`,
			);
		}
	}

	try {
		await sendViaAgent(data);
		return { success: true, method: "agent" };
	} catch (err) {
		errors.push(
			`Agent: ${err instanceof Error ? err.message : "connection failed"}`,
		);
	}

	throw new Error(errors.join("\n"));
}

export function canUseDirectPrint(): boolean {
	return isWebUSBSupported();
}
