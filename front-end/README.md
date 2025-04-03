# Front-end Tutorial
The folder "front-end" contains the UI codebase written in ReactJS script.

## Local Setup:

### Docker Way

#### Requirements:

- Docker
- back-end

The assumption is that you are in the "front-end" folder already.

#### Steps:

1. Create a .env file based from .env.example:
   Ensure that values are correct.

2. Run Docker build:
```
docker compose up -d --build
```

3. Check browser in localhost:5173

4. Other commands:
```
#Typscript linter
docker compose exec -it nodejs npm run lint:tsc

#Logs
docker compose logs -f nodejs
```

### Direct Way:

1. Create a .env file based from .env.example:
   Ensure that values are correct.

2. Install NodeJS dependencies:
```
npm install
```

3. Run local server:
```
npm run dev
```

3. Check browser in http://localhost:5173

4. Other commands:
```
#Typscript linter
docker compose exec -it nodejs npm run lint:tsc
```

## Production Setup

1. Ensure that .env file is correct. Particulary, the value of VITE_API_URL should be pointed to the URL in the production setup created in the "back-end" folder.

2. In your local, run build:
```
#direct:
npm run build

#docker:
docker compose exec -it nodejs npm run build
```

3. Go to Amazon S3 dashboard. Click "Create bucket".

4. Select "General purpose" as bucket type and input a bucket name.

5. Uncheck "Block all public access". Click "Create bucket".

6. Inside the newly created bucket, go to "Properties" tab and Edit "Static website hosting".

7. Enable "Static website hosting". Index document is "index.html". Click "Save changes".

8. The "Bucket website endpoint" is the URL for the frontend.

9. In the Objects tab, upload the local files and folders inside the dist folder that was created from step 2.

10. Go to Permissions tab and enter this in the Bucket policy:
```
{
    "Version":"2012–10–17",
    "Statement": [{
            "Sid":"PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": ["s3:GetObject"],
            "Resource": ["arn:aws:s3:::cmp4tasks/*"]
        }]
    }
```

11. Check the URL as refered in step 8.

## Notes

- Implement delete confirmation modal.
- Due to time constraint, I was not able to write tests, but it is something I will usually implement right after I'm able to submit, if not during the development.
- I wanted to include status and a title/description search in filter but it seems like in DynamoDB, only "scan" can use "contain()" and not "query" which I used. Will need to investigate this more, specifically indexing.


