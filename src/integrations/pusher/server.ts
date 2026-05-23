import Pusher from "pusher";

let pusherInstance: Pusher | null = null;

function hasPusherCredentials(): boolean {
	return Boolean(
		process.env.PUSHER_APP_ID &&
		process.env.VITE_PUSHER_KEY &&
		process.env.PUSHER_SECRET &&
		process.env.VITE_PUSHER_CLUSTER,
	);
}

export function getPusher(): Pusher | null {
	if (!hasPusherCredentials()) {
		return null;
	}

	if (!pusherInstance) {
		pusherInstance = new Pusher({
			appId: process.env.PUSHER_APP_ID!,
			key: process.env.VITE_PUSHER_KEY!,
			secret: process.env.PUSHER_SECRET!,
			cluster: process.env.VITE_PUSHER_CLUSTER!,
			useTLS: true,
		});
	}
	return pusherInstance;
}
