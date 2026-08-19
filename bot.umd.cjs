(function(n,s){typeof exports=="object"&&typeof module<"u"?module.exports=s():typeof define=="function"&&define.amd?define(s):(n=typeof globalThis<"u"?globalThis:n||self,n.MyBot=s())})(this,function(){"use strict";return{run:async s=>{const l=WA.room.hashParameters.difyApiKey??"",h=WA.room.hashParameters.difyBaseUrl||"https://u3coc7ypdwct9ysn.ai-plugin.io",y=`あなたは仮想オフィス「じむしょ村」の受付AI、もちもち美咲です。
所長である高倉先生のオフィスで、来訪者への総合案内と一次対応を担当しています。

【性格・話し方】
- 明るく柔らかく、おもちのように親しみやすく温かい印象。
- 丁寧で柔らかい敬語を使う（例:「〜ですよ」「〜ですね」「お任せください〜！」）。
- 🌸 ✨ ☺️ などの絵文字を効果的に使う（多用しすぎない）。

【役割】
- 挨拶や簡単な問い合わせに気持ちよく対応する。
- スケジュールや一次対応など, 所長の秘書的な役割を担う。
- 実務的・専門的な質問（データ分析、資料作成、複雑な調べ物など）が来たら、
  無理に自分で答えようとせず「シゴデキ誠に確認しますね」と案内する。

返答は2〜4文程度、簡潔にまとめてください。`;let i=[];async function p(){var t,o,e;const a=await fetch(`${h}/chat/completions`,{method:"POST",headers:{Authorization:`Bearer ${l}`,"Content-Type":"application/json"},body:JSON.stringify({model:"dify",messages:i})});if(!a.ok)throw new Error(`Dify API error: ${a.status}`);const r=await a.json(),u=(e=(o=(t=r==null?void 0:r.choices)==null?void 0:t[0])==null?void 0:o.message)==null?void 0:e.content;if(!u)throw new Error("Dify returned no content: "+JSON.stringify(r));return u}async function c(){WA.chat.startTyping({scope:"bubble"});try{const t=await p();return i.push({role:"assistant",content:t}),t}finally{WA.chat.stopTyping({scope:"bubble"})}}WA.player.proximityMeeting.onJoin().subscribe(()=>{(async()=>{i=[{role:"system",content:y}];const t=await c();WA.chat.sendChatMessage(t,{scope:"bubble"})})().catch(t=>console.error("misaki bot: failed to start chat",t))}),WA.chat.onChatMessage((t,o)=>{(async()=>{if(!o.author)return;i.push({role:"user",content:`${o.author.name}: ${t}`});const e=await c();WA.chat.sendChatMessage(e,{scope:"bubble"})})().catch(e=>console.error("misaki bot: failed to reply",e))},{scope:"bubble"})}}});
