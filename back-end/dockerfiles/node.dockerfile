FROM node:22.14-alpine3.20

ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN mkdir /root/.aws
RUN touch /root/.aws/credentials
RUN echo [default] >> /root/.aws/credentials
RUN echo aws_access_key_id=${AWS_ACCESS_KEY_ID} >> /root/.aws/credentials
RUN echo aws_secret_access_key=${AWS_SECRET_ACCESS_KEY} >> /root/.aws/credentials

EXPOSE 3000

CMD ["npm", "run", "dev"]
