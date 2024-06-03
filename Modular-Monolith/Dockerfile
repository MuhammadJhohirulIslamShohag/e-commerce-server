FROM node:20-alpine
WORKDIR /app
COPY . .
RUN yarn install
RUN yarn build
EXPOSE 9000
RUN ["chmod", "+x", "./entrypoint.sh"]
ENTRYPOINT [ "sh", "./entrypoint.sh" ]