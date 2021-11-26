const express = require("express");
const cors = require("cors");
const bodyParser   = require('body-parser');
const app = express();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const constValues = require('./app/utils/constants.js');

const db = require('./app/config/db.config.js');
const User = db.users;
	//force: true will drop the table if it already exists
	db.sequelize.sync({force: true}).then(() => {
    console.log('Drop and Resync with { force: true }');
    initial();
});

// api routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Our App." });
});

require('./app/route/user.route.js')(app);

// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

var bcrypt = require("bcryptjs");

function initial() {
    User.create({
      username: "admin",
      password: bcrypt.hashSync("123456", 8),
      role: constValues.userRoles.Admin
    });
}

