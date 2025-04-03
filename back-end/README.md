# Back-end Tutorial
The folder "back-end" handles the REST API aspect including routing, validations and database connections.

## Local Setup:

### Docker Way

#### Requirements:

- Docker
- remote DynamoDB access

The assumption is that you are in the back-end folder already.

#### Steps

1. Create a .env file based from .env.example:
   Ensure that values are correct.

2. Run Docker build:
```
docker compose up -d --build
```

3. If everything is OK, you may check the GET tasks API in http://localhost:3000/tasks

### Direct

#### Requirements

- NodeJS (NVM)
- remote DynamoDB access

#### Steps

1. Create a .env file based from .env.example:
   Ensure that values are correct.

2. install NPM dependencies:
```
npm install
```

3. Run NodeJS server:
```
npm run dev
```

## Production

TO FOLLOW

## Other Commands

```
# Testing Docker
docker compose exec -it nodejs npm run test

# Testing host
npm run test
```

## Notes:

- I would prefer to use Typescript or ES Module but I'm not sure if it will work seamlessly in Lambda so I'm  hesitant because of time constraint.
- If I have extended time, I would want to setup a local DynamoDB.
- Investigate Dynamoose if it is a good ORM.
- To be honest, I'm not sure about hosting an ExpressJS server to Lambda function as Express is a continous running process.
- Testing is currently limited to responses, it would be great to include DB assertions in testing.
- Testing is currently limited to error validations as normal flow might incur costs in DynamoDB. We need to setup local DynamoDB for this.
- Create global Try Catch error handler for controllers.
