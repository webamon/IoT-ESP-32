FROM node:20-alpine
WORKDIR /server
COPY . .
RUN npm install
CMD npx tsx watch src/index.ts