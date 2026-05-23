import { useEffect, useRef } from "react";
import Pusher from "pusher-js";

let pusherClient: Pusher | null = null;

function getPusherClient(): Pusher {
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

  useEffect(() => {
    const pusher = getPusherClient();
    const channel = pusher.subscribe(channelName);

    const wrappedHandler = (data: unknown) => {
      handlerRef.current(data);
    };
    channel.bind(eventName, wrappedHandler);

    return () => {
      channel.unbind(eventName, wrappedHandler);
      pusher.unsubscribe(channelName);
    };
  }, [channelName, eventName]);
}
