import qz from "qz-tray";

export const QZ_PRINTER_NAME = "BIXOLON SRP-E302";

let _connected = false;
let _printerName: string | null = null;

export function isQZConnected(): boolean {
  return _connected;
}

export async function connectQZ(
  printerQuery: string = QZ_PRINTER_NAME,
): Promise<boolean> {
  if (_connected) return true;
  try {
    await qz.websocket.connect();
    _connected = true;
    const result = await qz.printers.find(printerQuery);
    _printerName = Array.isArray(result) ? result[0] : result;
    return true;
  } catch (err) {
    console.error("QZ Tray connection failed:", err);
    _connected = false;
    _printerName = null;
    return false;
  }
}

export async function disconnectQZ(): Promise<void> {
  try {
    await qz.websocket.disconnect();
  } catch {
    // ignore
  }
  _connected = false;
  _printerName = null;
}

export function getQZPrinterName(): string | null {
  return _printerName;
}
