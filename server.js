const express = require('express');
const { spawn } = require('child_process');
const app = express();
const port = process.env.PORT || 3000;

// Direct link to your Google Drive video (replace with your link)
const videoUrl = "https://drive.google.com/uc?export=download&id=1E312l5AF5Obg8oVn6HCZ_uAmjHUuUwYu";

app.get('/', (req, res) => {
  res.send('YouTube Live Stream from Google Drive');
});

app.get('/stream', (req, res) => {
  console.log('Starting Stream...');
  
  const ffmpeg = spawn('ffmpeg', [
    '-re',
    '-i', videoUrl,
    '-c:v', 'libx264',
    '-preset', 'ultrafast',
    '-tune', 'zerolatency',
    '-b:v', '2500k',
    '-maxrate', '2500k',
    '-bufsize', '5000k',
    '-pix_fmt', 'yuv420p',
    '-g', '60',
    '-c:a', 'aac',
    '-b:a', '128k',
    '-ar', '44100',
    '-f', 'flv',
    process.env.RTMP_URL
  ]);

  ffmpeg.stdout.on('data', (data) => console.log(`stdout: ${data}`));
  ffmpeg.stderr.on('data', (data) => console.error(`stderr: ${data}`));
  ffmpeg.on('close', (code) => console.log(`FFmpeg exited with code ${code}`));

  res.send('Streaming started!');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
