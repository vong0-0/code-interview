import type { Socket } from "socket.io";
import { auth } from "../lib/auth.js";

export async function attachSession(
  socket: Socket,
  next: (err?: Error) => void,
) {
  try {
    const cookie = socket.handshake.headers.cookie ?? "";
    const header = new Headers({ cookie });

    const session = await auth.api.getSession({ headers: header });

    if (session?.user) {
      socket.data.user = {
        id: session.user.id,
        name: session.user.name,
      };
    } else {
      socket.data.user = null;
    }

    next();
  } catch {
    socket.data.user = null;
    next();
  }
}
