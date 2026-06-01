import { createServer } from "http";
import { Socket } from "net";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const PORT = Number(process.env.AGENT_PORT) || 3001;
const CONFIG_PATH = join(
	dirname(fileURLToPath(import.meta.url)),
	"..",
	"printer-config.json",
);

interface AppConfig {
	printerIP: string;
	printerPort: number;
}

let config: AppConfig = {
	printerIP: process.env.PRINTER_IP || "192.168.1.100",
	printerPort: Number(process.env.PRINTER_PORT) || 9100,
};

function loadConfig(): void {
	try {
		if (existsSync(CONFIG_PATH)) {
			const data = readFileSync(CONFIG_PATH, "utf-8");
			const saved = JSON.parse(data) as Partial<AppConfig>;
			if (saved.printerIP) config.printerIP = saved.printerIP;
			if (saved.printerPort) config.printerPort = saved.printerPort;
		}
	} catch {
		// ignore
	}
}

function saveConfig(): void {
	try {
		writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
	} catch {
		// ignore
	}
}

loadConfig();

function parseJsonBody(
	req: import("http").IncomingMessage,
): Promise<unknown> {
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
	const ip = config.printerIP;
	const port = config.printerPort;

	return new Promise((resolve, reject) => {
		const socket = new Socket();
		let done = false;

		socket.connect(port, ip, () => {
			socket.write(Buffer.from(bytes));
			socket.end();
			done = true;
			resolve();
		});

		socket.on("error", (err) => {
			if (!done) {
				done = true;
				reject(new Error(`Cannot reach printer at ${ip}:${port} — ${err.message}`));
			}
		});

		socket.setTimeout(5000, () => {
			if (!done) {
				socket.destroy();
				done = true;
				reject(
					new Error(`Printer at ${ip}:${port} did not respond (timeout)`),
				);
			}
		});
	});
}

function cors(res: import("http").ServerResponse): void {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function json(
	res: import("http").ServerResponse,
	status: number,
	data: unknown,
): void {
	res.writeHead(status, { "Content-Type": "application/json" });
	res.end(JSON.stringify(data));
}

const server = createServer(async (req, res) => {
	cors(res);

	if (req.method === "OPTIONS") {
		res.writeHead(204);
		res.end();
		return;
	}

	if (req.method === "GET" && req.url === "/health") {
		json(res, 200, {
			status: "ok",
			printerIP: config.printerIP,
			printerPort: config.printerPort,
		});
		return;
	}

	if (req.method === "GET" && req.url === "/config") {
		json(res, 200, { printerIP: config.printerIP, printerPort: config.printerPort });
		return;
	}

	if (req.method === "POST" && req.url === "/config") {
		try {
			const body = (await parseJsonBody(req)) as Partial<AppConfig>;
			if (typeof body.printerIP === "string") {
				config.printerIP = body.printerIP;
			}
			if (typeof body.printerPort === "number") {
				config.printerPort = body.printerPort;
			}
			saveConfig();
			json(res, 200, {
				success: true,
				printerIP: config.printerIP,
				printerPort: config.printerPort,
			});
		} catch (err) {
			json(res, 400, {
				success: false,
				error: err instanceof Error ? err.message : "Invalid request",
			});
		}
		return;
	}

	if (req.method !== "POST" || req.url !== "/print") {
		json(res, 404, { success: false, error: "Not found" });
		return;
	}

	try {
		const body = (await parseJsonBody(req)) as {
			bytes: number[];
			printerIP?: string;
			printerPort?: number;
		};

		// Override config per-request if provided
		const originalIP = config.printerIP;
		const originalPort = config.printerPort;

		if (typeof body.printerIP === "string") {
			config.printerIP = body.printerIP;
		}
		if (typeof body.printerPort === "number") {
			config.printerPort = body.printerPort;
		}

		if (body.bytes.length > 0) {
			await sendToPrinter(body.bytes);
		}

		// Restore original config
		config.printerIP = originalIP;
		config.printerPort = originalPort;

		json(res, 200, { success: true });
	} catch (err) {
		const message = err instanceof Error ? err.message : "Unknown error";
		json(res, 500, { success: false, error: message });
	}
});

server.listen(PORT, "127.0.0.1", () => {
	console.log(`\n  48 Coffee POS — Printer Agent`);
	console.log(`  ─────────────────────────────`);
	console.log(`  Agent URL  : http://127.0.0.1:${PORT}`);
	console.log(`  Printer    : ${config.printerIP}:${config.printerPort}`);
	console.log(`  Config file: ${CONFIG_PATH}`);
	console.log(``);
	console.log(`  Set via env vars:`);
	console.log(`    PRINTER_IP=192.168.1.100 PRINTER_PORT=9100 npx tsx local-printer-agent/index.ts`);
	console.log(`\n  Or configure from the POS app — changes save to printer-config.json\n`);
});
