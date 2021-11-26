const db = require('../config/db.config.js');
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const env = require('../config/env.js');

const User = db.users;

exports.signin = (req, res) => {
	User.findOne({
	  where: {
		username: req.body.username
	  }
	})
	  .then(user => {
		if (!user) {
		  return res.status(404).send({ message: "User Not found." });
		}else{
			var passwordIsValid = bcrypt.compareSync(
			req.body.password,
			user.password
			);
	
			if (!passwordIsValid) {
				return res.status(401).send({
					accessToken: null,
					message: "Invalid Password!"
				});
			}
			var token = jwt.sign({ id: user.id, role:user.role }, env.JWT_ENCRYPTION, {
				expiresIn:60 * 60 * 24 // 24 hours
			});
			
			res.status(200).send({
				accessToken: token
			});
		}
		
	  })
	  .catch(err => {
		res.status(500).send({ message: err.message });
	  });
};