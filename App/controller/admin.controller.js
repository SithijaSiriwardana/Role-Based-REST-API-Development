const db = require('../config/db.config.js');
var bcrypt = require("bcryptjs");
const constValues = require('../utils/constants.js');
const User = db.users;

var generator = require('generate-password');


exports.instrcutorCreate = (req, res) => {
	//Check Username
    User.findOne({
		where: {
		  username: req.body.username
		}
	  }).then(user => {
		if (user) {
		  res.status(400).send({message: "Failed! Username is already in use!"});
		}else{
			//Random password generator
			var password = generator.generate({
				length: 10,
				numbers: true
			});

            //create User
			User.create({
				username: req.body.username,
				role: constValues.userRoles.Instrctor,
				password: bcrypt.hashSync(password, 8)
			})
			.then(user => {
				res.status(200).send({ instrutorPassword: password, message: "Instructor was created successfully!" });
			})
			.catch(err => {
				res.status(500).send({ message: err.message });
			});
		}
	});	
};