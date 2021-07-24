# Production-Large-Project-Group-24

OPEN ME IN VSCODE OR ANY OTHER EDITOR TO SEE INSTRUCTIONS!

<!---

Steps on setting up environment

Things you should already have
- nodejs
- nodemon
- react-app
- heroku

<double check> heroku --version 

==================================
Connecting to the mongoDB database
==================================

<go to> From the terminal/commandLine > navigate to project folder 

<terminal cmd> touch .gitignore
    <contents> 
    node_modules
    .env

<terminal cmd> touch .env
    <contents>
    MONGODB_URI="mongodb+srv://Admin:COP4331@cluster0.4b2nn.mongodb.net/Dev_Large_Project_DB?retryWrites=true&w=majority"

<terminal cmd> npm install

<terminal cmd> sudo npm start
    <caution> running the command may throw some errors
        <what if> Error: Cannot find module 'express'
            <terminal cmd> npm install express
        
        <what if> Error: Cannot find module 'dotenv'
            <terminal cmd> npm install dotenv

<you can now test api endpoints locally!>
    <URL> http://localhost:5000/api/< replace w/ api endpoint>

===============================
Connecting to the Heroku Server
===============================

<terminal cmd> sudo npm install -g heroku

<terminal cmd> sudo npm install dotenv

<terminal cmd> heroku login

<go to> frontend folder
    <temrinal cmd> touch .gitignore
        <contents>
        # See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

        # dependencies
        /node_modules
        /.pnp
        .pnp.js

        # testing
        /coverage

        # production
        # /build

        # misc
        .DS_Store
        .env.local
        .env.development.local
        .env.test.local
        .env.production.local

        npm-debug.log*
        yarn-debug.log*
        yarn-error.log*

<terminal cmd> git config --global user.email "rick.jsventures.com"

<terminal cmd> git config --global user.name "Rick Leinecker"

<terminal cmd> heroku git:remote -a health-n-wellness-dev

<terminal cmd> sudo git add -A

<terminal cmd> sudo git commit -am "Your Message Here"

<terminal cmd> git push heroku master 

========================
COMMANDS NEEDED FOR JWT
========================

<terminal cmd> sudo npm install jsonwebtoken

<terminal cmd> sudo npm install dotenv 
   (you may have done this previously. Also do this in the server directory and the Frontend directory)

<go to> .env file and add: ACCESS_TOKEN_SECRET=secret

<create file> createJWT.js


--->


