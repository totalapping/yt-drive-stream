FROM node:16

# Install FFmpeg
RUN apt-get update && apt-get install -y ffmpeg

WORKDIR /app
COPY . .
CMD ["npm", "start"]
