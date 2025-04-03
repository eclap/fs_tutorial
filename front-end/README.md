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

TO FOLLOW

## Notes

- Implement delete confirmation modal.
- Due to time constraint, I was not able to write tests, but it is something I will usually implement right after I'm able to submit, if not during the development.
- I wanted to include status and a title/description search in filter but it seems like in DynamoDB, only "scan" can use "contain()" and not "query" which I used. Will need to investigate this more, specifically indexing.


