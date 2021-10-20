<h1 align="center"><h1 align="center"><img src="src/assets/Cliger_Logo.png" height="400"></h1></h1>
<h2 align="center">📉 Welcome to the Client Manager 📈</h2>
<h3 align="center"><img src="https://img.shields.io/github/issues/GuztaJF-DS/Cliger-Server"/> <img src="https://img.shields.io/github/stars/GuztaJF-DS/Cliger-Server"/> <img src="https://img.shields.io/github/license/GuztaJF-DS/Cliger-Server"/>  <img src="https://img.shields.io/twitter/url?style=social&url=https%3A%2F%2Ftwitter.com%2FIGotaMellowship"/></h3>


# Summary 📋

<!--ts-->
   * [About](#about)
   * [Technologies](#technologies)
   * [Setup](#setup)
      * [Requirements](#requirements)
      * [Intalling and configuring](#intalling-and-configuring)
   * [To Do](#to-do)
   * [License](#license)
<!--te-->

# About 👀

The Cliger is a management application for micro, small and medium companies, the idea behind the Cliger would be to help these entrepreneurs to plan better since in Brazil most companies close in less than a year because of stupid decisions and a really bad administration.<br>
but how will the cliger help me, you ask me, well we will expose numbers, data, graphs, predictions among other things that most of these small entrepreneurs  don't even know about the existence<br>
Lastly, it is necessary to say that this is only the first part of the project, the server, after that first step we will work on the Mobile version and then if time helps with a little thing for the desktop

# Technologies 🚀

- [Node.js ](https://nodejs.org/en/)
- [MySql](https://www.mysql.com/)
- [Sequelize](https://sequelize.org/)
- [Express](https://expressjs.com/pt-br/)
- [JWT-token](https://jwt.io/)
- [Bcrypt](https://github.com/kelektiv/node.bcrypt.js/)
- [Body-parser](https://github.com/expressjs/body-parser)
- [Dotenv-safe](https://github.com/rolodato/dotenv-safe)

# Setup 💻
### Requirements

- [Node.js](https://nodejs.org/en/)
- [Yarn](https://classic.yarnpkg.com/) or [NPM](https://www.npmjs.com/)
- [MySql](https://www.mysql.com/)
<br>Run Some Type of MySql server for the Database, particularly i use the
- [Xampp](https://www.apachefriends.org/pt_br/index.html)

### Intalling and configuring

*Clone the project and access the folder*

```bash
$ git clone https://github.com/GuztaJF-DS/Cliger-Server/ && cd Cliger-Server
```
*Then Follow these steps*

```bash
# Install the dependencies
$ yarn install
# Or
$ npm install


# copy '.env.example' to '.env'
# and set with your environment variables.
$ cp .env.example .env

# Start the MySql server

# And then you run the api service in a development environment
$ npm run build

# Well done, project is started!
```

# To Do 📝

- [X] Create the basic DB Structure
- [X] Create a basic Register Structure
- [X] Plan the MER
- [X] Apply the MER
- [X] Create the Login With token Auth
- [X] Create the Forgot-Password
- [X] Create the Change Password
- [X] Create the Delete User
- [X] fix some parts of the code
- [ ] Think what else i will add to this list

# License 🎓

This project is licensed under the GPL 3.0 License - see the [LICENSE](LICENSE) file for details.
