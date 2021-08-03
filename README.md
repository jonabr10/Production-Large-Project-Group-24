# Production-Large-Project-Group-24

OPEN ME IN VSCODE OR ANY OTHER EDITOR TO SEE INSTRUCTIONS!

<!---
Steps on setting up environment

Things you should already have
- nodejs
- nodemon

<double check> node --version / nodemon --version

*** Make sure to create and checkout a new branch based off of main before proceeding!!! ***

==================================
Connecting to the mongoDB database
==================================

<go to> From the terminal/commandLine > navigate to project folder

<if> You do not have a .gitignore with the following content
    <terminal cmd> touch .gitignore
        <contents>
        node_modules
        .env
        .DS_Store

<terminal cmd> touch .env
    <contents>
    MONGODB_URI="mongodb+srv://group24:COP4331@cluster0.5zgrn.mongodb.net/COP4331?retryWrites=true&w=majority"

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

<if> You do not have a frontend/.gitignore with the following content
    <go to> frontend folder
        <terminal cmd> touch .gitignore
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

<terminal cmd> git config --global user.email "<your email>"

<terminal cmd> git config --global user.name "<your name>"

=======================
Starting Local Testing!
=======================

<please note> open two terminals!

    <terminal one> navigate to root project directory

    <terminal two> navigate to frontend directory

<terminal two cmd> npm install -g react-scripts

<terminal two cmd> npm install

<terminal one cmd> sudo npm start

<terminal two cmd> sudo npm start


Packages installed Danny:
npm install bootstrap --save
npm install react-web-tabs --save
npm install --save react-router-dom
npm install antd
npm install react-table
npm install --save @ant-design/icons
sudo npm install react-bootstrap
npm install @restart/context
npm install @restart/hooks
npm install @types/invariant
npm install @types/prop-types
npm install --save prop-types
sudo npm i react-bootstrap
npm install @types/react
npm install @types/react-transition-group
npm install @types/warning

===============================
Email Verification Dependencies
===============================

Source: https://nodemailer.com/about/

<terminal cmd> npm install nodemailer

<go to> .env file
    <add content>
    EMAIL_USER="health.n.wellness.service@gmail.com"
    EMAIL_PASSWORD="COP4331@24"

<IMPORTANT> you MUST change the html link (line 19 sendEmail.js) based on the environment are currently working on!

================
JWT Dependencies
================

<terminal cmd> sudo npm install jsonwebtoken

<terminal cmd> sudo npm install dotenv
   (you may have done this previously. Also do this in the server directory and the Frontend directory)

<go to> .env file
    <add content>
    ACCESS_TOKEN_SECRET=secret

--->
