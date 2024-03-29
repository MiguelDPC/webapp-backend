FROM node:10-alpine
RUN mkdir -p /home/node/webapp-backend/node_modules && chown -R node:node /home/node/webapp-backend
WORKDIR /webapp-backend
RUN npm install
COPY --chown=node:node . .
EXPOSE 3000
USER node
CMD ["node", "server.js"]

