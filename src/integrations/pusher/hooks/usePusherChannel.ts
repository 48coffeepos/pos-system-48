import { useCallback, useEffect, useRef } from "react";
import Pusher from "pusher-js";

let pusherClient: Pusher | null = null;

function hasPusherCredentials(): boolean {
	return Boolean(
		typeof import.meta !== "undefined" &&
			import.meta.env?.VITE_PUSHER_KEY &&
			import.meta.env?.VITE_PUSHER_CLUSTER,
	);
}

function getPusherClient(): Pusher | null {
	if (!hasPusherCredentials()) {
		return null;
	}

	if (!pusherClient) {
		pusherClient = new Pusher(import.meta.env.VITE_PUSHER_KEY as string, {
			cluster: import.meta.env.VITE_PUSHER_CLUSTER as string,
		});
	}
	return pusherClient;
}

export function usePusherChannel(
	channelName: string,
	eventName: string,
	handler: (data: unknown) => void,
) {
	const handlerRef = useRef(handler);
	handlerRef.current = handler;

	const isEnabled = hasPusherCredentials();

	const wrappedHandler = useCallback((data: unknown) => {
		handlerRef.current(data);
	}, []);

	useEffect(() => {
		if (!isEnabled) return;

		const pusher = getPusherClient();
		if (!pusher) return;

		const channel = pusher.subscribe(channelName);
		channel.bind(eventName, wrappedHandler);

		return () => {
			channel.unbind(eventName, wrappedHandler);
			pusher.unsubscribe(channelName);
		};
	}, [channelName, eventName, wrappedHandler, isEnabled]);
}
