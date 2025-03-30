const express = require('express');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;
const VIDEO_URL = process.env.VIDEO_URL; // Google Drive Video Link

if (!VIDEO_URL) {
  console.error('Error: VIDEO_URL is not set!');
  process.exit(1);
}

app.get('/', (req, res) => {
  res.send('Video Stream is Live!');
});

app.get('/stream', (req, res) => {
  const ffmpegCommand = `ffmpeg -re -i "${VIDEO_URL}" -c:v libx264 -preset ultrafast -b:v 1000k -f flv rtmp://a.rtmp.youtube.com/live2/YOUR_YOUTUBE_STREAM_KEY`;

  const ffmpegProcess = exec(ffmpegCommand);

  ffmpegProcess.stdout.pipe(process.stdout);
  ffmpegProcess.stderr.pipe(process.stderr);

  ffmpegProcess.on('close', (code) => {
    console.log(`FFmpeg process exited with code ${code}`);
  });

  res.send('Streaming started!');
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
