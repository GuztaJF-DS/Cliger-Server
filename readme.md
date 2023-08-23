<h1 align="center"><h1 align="center"><img src="src/assets/Cliger_Logo.png" height="400"></h1></h1>
<h2 align="center">📉 Welcome to the Client Manager 📈</h2>
<h3 align="center"><img src="https://img.shields.io/github/issues/GuztaJF-DS/Cliger-Server"/> <img src="https://img.shields.io/github/stars/GuztaJF-DS/Cliger-Server"/> <img src="https://img.shields.io/github/license/GuztaJF-DS/Cliger-Server"/>  <img src="https://img.shields.io/twitter/url?style=social&url=https%3A%2F%2Ftwitter.com%2FIGotaMellowship"/></h3>

# Summary

<!--ts-->

-   [About](#about)
-   [Technologies](#technologies)
-   [Setup](#setup)
    -   [Requirements](#requirements)
    -   [Installing and configuring](#installing-and-configuring)
-   [License](#license)
<!--te-->

# About

The Cliger is a management application for micro, small, and medium companies, the idea behind the Cliger would be to help these entrepreneurs to plan better since in Brazil most companies close in less than a year because of stupid decisions and a really bad administration.<br>
But how will the cliger help me, you ask me, well we will expose numbers, data, graphs, predictions among other things that most of these small entrepreneurs don't even know about the existence<br>
Lastly, it is necessary to say that this is only the first part of the project, the server, after that first step we will work on the Mobile version and then if time helps with a little thing for the desktop

# Technologies

-   [Node.js](https://nodejs.org/en/)
-   [MySql](https://www.mysql.com/)
-   [Sequelize](https://sequelize.org/)
-   [Express](https://expressjs.com/pt-br/)
-   [JWT-token](https://jwt.io/)
-   [Bcrypt](https://github.com/kelektiv/node.bcrypt.js/)
-   [Body-parser](https://github.com/expressjs/body-parser)
-   [Dotenv-safe](https://github.com/rolodato/dotenv-safe)

# Setup

### Requirements

-   [Node.js](https://nodejs.org/en/)
-   [Yarn](https://classic.yarnpkg.com/) or [NPM](https://www.npmjs.com/)
-   You also need to set up a [MySql server](https://www.mysql.com/)

### Installing and configuring

_Clone the project and access the folder_

```bash
$ git clone https://github.com/GuztaJF-DS/Cliger-Server/ && cd Cliger-Server
```

_Then Follow these steps_

```bash
# Install the dependencies
$ yarn install
# Or
$ npm install


# copy '.env.example' to '.env'
# and set with your environment variables.
$ cp .env.example .env

# Start the MySql server

# And then you run the API service in a development environment
$ npm run start
# or
$ yarn start

# Well done, server-side has started!
```
# License

This project is licensed under the GPL 3.0 License - see the [LICENSE](LICENSE) file for details.
