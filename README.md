# Node - Express REST Server (Typescript)(Sockets)

    This is the backend that has been used for my personal portfolio. It has connection with database, api endpoints (HTTP) and Sockets connection.

# Steps:
    First time:
    npm install (rebuild dependencies)
    Add .env:
        PORT=yourporthere
        DB_CNN=db connection here
        SECRET_JWT_SEED=jsonwebtoken seed here
        EMAIL_SERVICE=Your email service here (Hotmail, Gmail...)
        EMAIL_USER=Your Email account goes here
        EMAIL_PASS=Your Email account password goes here
        EMAIL_DESTINATION=Destination Email
    Work with:
    tsc --watch (live ts compilator)
    npm run dev (nodemon)

# Server configuration 
    Base endpoints URLs, express app middlewares, routes and sockets:
    index.ts
    server/

# API Endpoints
    https://documenter.getpostman.com/view/7455569/TzJx8bqh
    
# Sockets
    Chat Domain sockets: message login-user logout-user
    Server Domain sockets: disconnect
