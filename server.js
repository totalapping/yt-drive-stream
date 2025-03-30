const { spawn } = require('child_process');
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

// Google Drive Downloadable Link
const videoURL = "https://drive.google.com/uc?export=download&id=1E312l5AF5Obg8oVn6HCZ_uAmjHUuUwYu";

app.get('/', (req, res) => {
  res.send('Streaming is live!');
});

function startStream() {
  console.log('Starting Stream...');

  const ffmpeg = spawn('ffmpeg', [
    '-re',
    '-i', videoURL,
    '-c:v', 'libx264',
    '-preset', 'ultrafast',
    '-b:v', '4500k',
    '-maxrate', '4500k',
    '-bufsize', '9000k',
    '-c:a', 'aac',
    '-b:a', '128k',
    '-f', 'flv',
    'rtmp://a.rtmp.youtube.com/live2/YOUR_STREAM_KEY'
  ]);

  ffmpeg.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  ffmpeg.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  ffmpeg.on('close', (code) => {
    console.log(`FFmpeg exited with code ${code}`);
    if (code !== 0) {
      console.error('Stream crashed. Restarting...');
      setTimeout(startStream, 5000); // 5 second delay before restart
    }
  });
}

// Start the stream
startStream();

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

