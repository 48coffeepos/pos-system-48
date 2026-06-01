import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const printViaTcpInput = z.object({
	bytes: z.array(z.number().int().min(0).max(255)),
	ip: z.string().min(1),
	port: z.number().int().min(1).max(65535).default(9100),
});

export const printViaTcp = createServerFn({ method: "POST" })
	.inputValidator(printViaTcpInput)
	.handler(async ({ data }) => {
		const net = await import("net");

		return new Promise<{ success: boolean; error?: string }>((resolve) => {
			const socket = new net.Socket();
			let resolved = false;

			socket.connect(data.port, data.ip, () => {
				const buffer = Buffer.from(data.bytes);
				socket.write(buffer);
				socket.end();
				resolved = true;
				resolve({ success: true });
			});

			socket.on("error", (err) => {
				if (!resolved) {
					resolved = true;
					resolve({ success: false, error: err.message });
				}
			});

			socket.setTimeout(5000, () => {
				if (!resolved) {
					socket.destroy();
					resolved = true;
					resolve({
						success: false,
						error: "Printer connection timed out",
					});
				}
			});
		});
	});
