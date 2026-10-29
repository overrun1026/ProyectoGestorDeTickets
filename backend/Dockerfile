
# Este archivo define la imagen del backend e instala sus dependencias
# para ejecutar la API de HelpDesk en un contenedor.
FROM node:24-alpine

ENV NODE_ENV=production
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY src ./src

USER node

EXPOSE 3000

CMD ["node", "src/server.js"]
