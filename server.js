// Renderなどのサーバーで24時間起動し続けるためのエントリーポイント
import { spawn } from 'child_process';
import http from 'http';

// Renderのスリープ防止用ヘルスチェックサーバー（Port 10000）
const PORT = process.env.PORT || 10000;
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Misaki Bot is running 24/7!\n');
}).listen(PORT, () => {
  console.log(`[HealthCheck] Server listening on port ${PORT}`);
});

console.log("[Bot Server] Starting Misaki Bot process...");

// ボットプロセスが万が一クラッシュしても自動再起動するループ処理
function startBot() {
  const botProcess = spawn('npm', ['run', 'dev'], { stdio: 'inherit', shell: true });

  botProcess.on('close', (code) => {
    console.log(`[Bot Server] Process exited with code ${code}. Restarting in 5 seconds...`);
    setTimeout(startBot, 5000);
  });
}

startBot();
