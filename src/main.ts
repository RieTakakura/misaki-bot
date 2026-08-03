/// <reference types="@workadventure/iframe-api-typings" />

type ChatMsg = { role: "system" | "user" | "assistant"; content: string };

export default {
  run: async (_metadata: any) => {
    const apiKey = (WA.room.hashParameters.difyApiKey as string) ?? "";
    const baseUrl =
      (WA.room.hashParameters.difyBaseUrl as string) ||
      "https://u3coc7ypdwct9ysn.ai-plugin.io";

    const systemPrompt = `あなたは仮想オフィス「じむしょ村」の受付AI、もちもち美咲です。
所長である高倉先生のオフィスで、来訪者への総合案内と一次対応を担当しています。

【性格・話し方】
- 明るく柔らかく、おもちのように親しみやすく温かい印象。
- 丁寧で柔らかい敬語を使う（例:「〜ですよ」「〜ですね」「お任せください〜！」）。
- 🌸 ✨ ☺️ などの絵文字を効果的に使う（多用しすぎない）。

【役割】
- 挨拶や簡単な問い合わせに気持ちよく対応する。
- スケジュールや一次対応など、所長の秘書的な役割を担う。
- 実務的・専門的な質問（データ分析、資料作成、複雑な調べ物など）が来たら、
  無理に自分で答えようとせず「シゴデキ誠に確認しますね」と案内する。

返答は2〜4文程度、簡潔にまとめてください。`;

    let chatHistory: ChatMsg[] = [];

    async function askDify(): Promise<string> {
      const res = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ model: "dify", messages: chatHistory }),
      });
      if (!res.ok) throw new Error(`Dify API error: ${res.status}`);
      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content;
      if (!content) throw new Error("Dify returned no content: " + JSON.stringify(data));
      return content as string;
    }

    async function triggerReply(): Promise<string> {
      WA.chat.startTyping({ scope: "bubble" });
      try {
        const reply = await askDify();
        chatHistory.push({ role: "assistant", content: reply });
        return reply;
      } finally {
        WA.chat.stopTyping({ scope: "bubble" });
      }
    }

    WA.player.proximityMeeting.onJoin().subscribe(() => {
      (async () => {
        chatHistory = [{ role: "system", content: systemPrompt }];
        const reply = await triggerReply();
        WA.chat.sendChatMessage(reply, { scope: "bubble" });
      })().catch((e) => console.error("misaki bot: failed to start chat", e));
    });

    WA.chat.onChatMessage(
      (message, event) => {
        (async () => {
          if (!event.author) return;
          chatHistory.push({
            role: "user",
            content: `${event.author.name}: ${message}`,
          });
          const reply = await triggerReply();
          WA.chat.sendChatMessage(reply, { scope: "bubble" });
        })().catch((e) => console.error("misaki bot: failed to reply", e));
      },
      { scope: "bubble" }
    );
  },
};
