import { createServer } from "http";
import { Socket } from "net";

const PORT = Number(process.env.AGENT_PORT) || 3001;
const PRINTER_IP = process.env.PRINTER_IP || "192.168.1.100";
const PRINTER_PORT = Number(process.env.PRINTER_PORT) || 9100;

function parseJsonBody(
	req: import("http").IncomingMessage,
): Promise<{ bytes: number[] }> {
	return new Promise((resolve, reject) => {
		let body = "";
		req.on("data", (chunk: string) => (body += chunk));
		req.on("end", () => {
			try {
				resolve(JSON.parse(body));
			} catch {
				reject(new Error("Invalid JSON"));
			}
		});
		req.on("error", reject);
	});
}

function sendToPrinter(bytes: number[]): Promise<void> {
	return new Promise((resolve, reject) => {
		const socket = new Socket();
		let done = false;

		socket.connect(PRINTER_PORT, PRINTER_IP, () => {
			socket.write(Buffer.from(bytes));
			socket.end();
			done = true;
			resolve();
		});

		socket.on("error", (err) => {
			if (!done) {
				done = true;
				reject(new Error(`Printer connection failed: ${err.message}`));
			}
		});

		socket.setTimeout(5000, () => {
			if (!done) {
				socket.destroy();
				done = true;
				reject(new Error("Printer connection timed out"));
			}
		});
	});
}

const server = createServer(async (req, res) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type");

	if (req.method === "OPTIONS") {
		res.writeHead(204);
		res.end();
		return;
	}

	if (req.method === "GET" && req.url === "/health") {
		res.writeHead(200, { "Content-Type": "application/json" });
		res.end(JSON.stringify({ status: "ok" }));
		return;
	}

	if (req.method !== "POST" || req.url !== "/print") {
		res.writeHead(404);
		res.end("Not found");
		return;
	}

	try {
		const data = await parseJsonBody(req);
		if (data.bytes.length > 0) {
			await sendToPrinter(data.bytes);
		}
		res.writeHead(200, { "Content-Type": "application/json" });
		res.end(JSON.stringify({ success: true }));
	} catch (err) {
		const message = err instanceof Error ? err.message : "Unknown error";
		res.writeHead(500, { "Content-Type": "application/json" });
		res.end(JSON.stringify({ success: false, error: message }));
	}
});

server.listen(PORT, "127.0.0.1", () => {
	console.log(`48 Coffee POS Printer Agent running on http://127.0.0.1:${PORT}`);
	console.log(`Targeting printer at ${PRINTER_IP}:${PRINTER_PORT}`);
	console.log("\nSet these environment variables to configure:");
	console.log("  AGENT_PORT  - Port to listen on (default: 3001)");
	console.log("  PRINTER_IP  - Printer IP address (default: 192.168.1.100)");
	console.log("  PRINTER_PORT - Printer TCP port (default: 9100)");
	console.log("\nReady to receive print jobs.\n");
});
