FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=development

COPY package.json package-lock.json ./
RUN npm install

COPY . .

EXPOSE 3000

# Make sure your dev script in package.json sets host to 0.0.0.0
CMD ["npm", "run", "dev"]
