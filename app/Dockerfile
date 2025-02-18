FROM node:22-alpine

WORKDIR /

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy transpiled files
COPY ./build ./build

EXPOSE 80

CMD ["node", "build/index.js"]
