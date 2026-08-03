(function(s,n){typeof exports=="object"&&typeof module<"u"?module.exports=n():typeof define=="function"&&define.amd?define(n):(s=typeof globalThis<"u"?globalThis:s||self,s.MyBot=n())})(this,function(){"use strict";return{run:async n=>{const p=WA.room.hashParameters.difyApiKey??"",h=WA.room.hashParameters.difyBaseUrl||"https://u3coc7ypdwct9ysn.ai-plugin.io",u=`あなたは仮想オフィス「じむしょ村」の受付AI、もちもち美咲です。
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

返答は2〜4文程度、簡潔にまとめてください。`;let a=[];async function l(){var i,c,y;const e=await fetch(`${h}/chat/completions`,{method:"POST",headers:{Authorization:`Bearer ${p}`,"Content-Type":"application/json"},body:JSON.stringify({model:"dify",messages:a})});if(!e.ok)throw new Error(`Dify API error: ${e.status}`);const t=await e.json(),o=(y=(c=(i=t==null?void 0:t.choices)==null?void 0:i[0])==null?void 0:c.message)==null?void 0:y.content;if(!o)throw new Error("Dify returned no content: "+JSON.stringify(t));return o}async function r(){WA.chat.startTyping({scope:"bubble"});try{const e=await l();return a.push({role:"assistant",content:e}),e}finally{WA.chat.stopTyping({scope:"bubble"})}}WA.player.proximityMeeting.onJoin().subscribe(()=>{(async()=>{a=[{role:"system",content:u}];const e=await r();WA.chat.sendChatMessage(e,{scope:"bubble"})})().catch(e=>console.error("misaki bot: failed to start chat",e))}),WA.chat.onChatMessage((e,t)=>{(async()=>{if(!t.author)return;a.push({role:"user",content:`${t.author.name}: ${e}`});const o=await r();WA.chat.sendChatMessage(o,{scope:"bubble"})})().catch(o=>console.error("misaki bot: failed to reply",o))},{scope:"bubble"})}}});
