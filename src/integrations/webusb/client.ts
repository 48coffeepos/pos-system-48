const BIXOLON_VENDOR_ID = 0x1504;

let _permitted = false;

export function usbSupported(): boolean {
  return typeof navigator !== "undefined" && "usb" in navigator;
}

export function hasUsbPermission(): boolean {
  return _permitted;
}

export async function requestPrinter(): Promise<USBDevice | null> {
  if (!usbSupported() || !navigator.usb) return null;
  try {
    const device = await navigator.usb.requestDevice({
      filters: [{ vendorId: BIXOLON_VENDOR_ID }],
    });
    _permitted = true;
    return device;
  } catch {
    return null;
  }
}

export async function getPrinter(): Promise<USBDevice | null> {
  if (!usbSupported() || !navigator.usb) return null;
  const devices = await navigator.usb.getDevices();
  const printer = devices.find((d) => d.vendorId === BIXOLON_VENDOR_ID);
  if (printer) _permitted = true;
  return printer ?? null;
}

function findOutEndpoint(device: USBDevice): number | null {
  for (const iface of device.configuration?.interfaces ?? []) {
    for (const alt of iface.alternates) {
      for (const ep of alt.endpoints) {
        if (ep.direction === "out" && ep.type === "bulk") {
          return ep.endpointNumber;
        }
      }
    }
  }
  return null;
}

export async function printRaw(
  device: USBDevice,
  data: Uint8Array,
): Promise<void> {
  await device.open();
  await device.selectConfiguration(1);
  await device.claimInterface(0);

  const endpoint = findOutEndpoint(device);
  if (!endpoint) {
    throw new Error("No bulk OUT endpoint found on printer");
  }

  await device.transferOut(endpoint, data.buffer as ArrayBuffer);
  await device.close();
}
