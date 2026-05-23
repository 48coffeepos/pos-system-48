import Pusher from "pusher";

let pusherInstance: Pusher | null = null;

export function getPusher() {
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
