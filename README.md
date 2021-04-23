# Node - Express REST Server (Typescript)(Sockets)

# Steps:
    First time:
    npm install (rebuild dependencies)
    Add .env: PORT=yourporthere
    Work with:
    tsc --watch (live ts compilator)
    npm run dev (nodemon)

# Server configuration 
    Base endpoints URLs and express app middlewares:
    index.ts
    server/

# API Endpoints
    https://documenter.getpostman.com/view/7455569/TzJx8bqh
    
    Auth domain:
        (POST)  /api/auth/new       (body: name, email, password)
        (POST)  /api/auth/login     (body: email, password)
        (GET)   /api/auth/renew     (headers: token)
    Messages domain:
        (GET)   /api/msg/
        (POST)  /api/msg/           (body: from, body)
        (POST)  /api/msg/:id        (body: from, body; params: id)
