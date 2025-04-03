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

### Requirements:

- IAM user with necessary permissions in Lambda, DynamoDB and API Gateway.

### Steps:

0. Ensure that .env values are correct. Specifically, ENV value should be "lambda".

1. [Create DynamoDB table named "tasks"](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/getting-started-step-1.html).

2. [Create GSI partition key for "tasks.userid" and sort key for "tasks.created_at". Name it "user_id-created_at-index"](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GSI.html).

3. Ensure that the IAM user has appropriate policy acess to DynamoDB like "AmazonDynamoDBFullAccess".

4. Create Lambda function with NodeJS 22 as run time.

5. ZIP the contents of back-end folder in your local.

6. In Lambda function dashboard, select "Upload from" and ".zip file".

7. Go to API Gateway dashboard.

8. Select Create API.

9. Select REST API.

10. Select NEW API and fill up the appropriate fields.

11. In the created API, select "Create Resource".

12. Enable Proxy resource.

13. Input `{proxy+}` in Resource name. Click "Create resource".

14. Next is, select Create Method to the resource that was created.

15. Select method type "Any" and Integration type as "Lambda function" and enable "Lambda proxy integration".o

16. In the Lambda function, select appropriate region and select the Lambda function we created in step 4. Press Create method.

17. Go to "stages" and click "Create stage".

18. Enter appropriate values in the Stage details. Select Create Stage.

19. In the created stage, You will now see the API URL in the "Invoke URL". Test by accessing the tasks resource, e.g. "https://rlgu9y6t80.execute-api.ap-southeast-1.amazonaws.com/dev/tasks".


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
- I was not able to implement Swagger. I have JSDocs in controllers that can be extended to Swagger.
