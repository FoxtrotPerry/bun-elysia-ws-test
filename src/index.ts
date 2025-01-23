import { Elysia } from "elysia";
import { tMessageBody, tMessageQuery } from "~/types/message";

// key is socket id, value is room subscribed to
const chatRoomLedger: Map<string, string> = new Map();

const app = new Elysia()
  .get("/", () => "Waddup council")
  .ws("/room", {
    // validate incoming message
    body: tMessageBody,
    query: tMessageQuery,
    message(socket, { message, action }) {
      // Get schema from `ws.data`
      const { chatRoomId } = socket.data.query;
      switch (action) {
        case "join":
          chatRoomLedger.set(socket.id, chatRoomId);
          socket.subscribe(chatRoomId);
          app.server?.publish(chatRoomId, `${socket.id} has joined the room!`);
          break;
        case "say":
          app.server?.publish(chatRoomId, `${socket.id}: ${message}`);
          break;
        case "leave":
          app.server?.publish(chatRoomId, `${socket.id} has left the room`);
          socket.unsubscribe(chatRoomId);
          break;
        case "whisper":
          break;
        default:
          console.error(`Unknown socket action: ${action}`);
      }
    },
    open(socket) {},
    close(socket) {
      const roomId = chatRoomLedger.get(socket.id);
      if (roomId) {
        app.server?.publish(roomId, `${socket.id} has left the room.`);
        chatRoomLedger.delete(socket.id);
      }
    },
  })
  .listen(3000);

console.log(
  `🧾 Server is running at ${app.server?.hostname}:${app.server?.port}`
);
