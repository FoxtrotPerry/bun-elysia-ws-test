import { t, type Static } from "elysia";

export const tMessageBody = t.Object({
  message: t.String(),
  // action: t.Union(actions.map((action) => t.Literal(action))),
  action: t.Union([
    t.Literal("say"),
    t.Literal("whisper"),
    t.Literal("join"),
    t.Literal("leave"),
  ]),
});

export const tMessageQuery = t.Object({
  chatRoomId: t.String(),
});

export type MessageBody = Static<typeof tMessageBody>;

export type MessageQuery = Static<typeof tMessageQuery>;
