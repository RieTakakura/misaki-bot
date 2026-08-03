const u = {
  run: async (p) => {
    const i = WA.room.hashParameters.difyApiKey ?? "", y = WA.room.hashParameters.difyBaseUrl || "https://u3coc7ypdwct9ysn.ai-plugin.io", h = `あなたは仮想オフィス「じむしょ村」の受付AI、もちもち美咲です。
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
    let o = [];
    async function l() {
      var n, r, c;
      const t = await fetch(`${y}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${i}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ model: "dify", messages: o })
      });
      if (!t.ok) throw new Error(`Dify API error: ${t.status}`);
      const e = await t.json(), s = (c = (r = (n = e == null ? void 0 : e.choices) == null ? void 0 : n[0]) == null ? void 0 : r.message) == null ? void 0 : c.content;
      if (!s) throw new Error("Dify returned no content: " + JSON.stringify(e));
      return s;
    }
    async function a() {
      WA.chat.startTyping({ scope: "bubble" });
      try {
        const t = await l();
        return o.push({ role: "assistant", content: t }), t;
      } finally {
        WA.chat.stopTyping({ scope: "bubble" });
      }
    }
    WA.player.proximityMeeting.onJoin().subscribe(() => {
      (async () => {
        o = [{ role: "system", content: h }];
        const t = await a();
        WA.chat.sendChatMessage(t, { scope: "bubble" });
      })().catch((t) => console.error("misaki bot: failed to start chat", t));
    }), WA.chat.onChatMessage(
      (t, e) => {
        (async () => {
          if (!e.author) return;
          o.push({
            role: "user",
            content: `${e.author.name}: ${t}`
          });
          const s = await a();
          WA.chat.sendChatMessage(s, { scope: "bubble" });
        })().catch((s) => console.error("misaki bot: failed to reply", s));
      },
      { scope: "bubble" }
    );
  }
};
export {
  u as default
};
