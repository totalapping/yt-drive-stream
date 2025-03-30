# Step 1: Base Image
FROM node:18-alpine

# Step 2: Working Directory
WORKDIR /app

# Step 3: Install FFmpeg
RUN apk add --no-cache ffmpeg

# Step 4: Copy Files
COPY package.json ./
COPY server.js ./

# Step 5: Install Dependencies
RUN npm install

# Step 6: Expose Port
EXPOSE 3000

# Step 7: Start the Server
CMD ["npm", "start"]
