const jwt = require("jsonwebtoken");
const env = require('../config/env.js');
const constValues = require('../utils/constants.js');

let userRole;

verifyToken = (req, res, next) => {
	let token = req.headers['x-access-token'] || req.headers['authorization'];
    
	if(token && token.startsWith('Bearer ')){
		token = token.slice(7, token.length)
	}
	if (!token) {
	  return res.status(403).send({
		message: "A token is required for authentication"
	  });
	}

	jwt.verify(token, env.JWT_ENCRYPTION, (err, decoded) => {
	  if(err){
		console.log(err);
		return res.status(401).send({
		  message: "Invalid Token!"
		});
	  }else{
        req.userDetails = decoded;
		next();
		//res.status(200).send({ message: "successs" });
	  }
	});
};

isAdmin = (req, res,next) => {
	if(req.userDetails.role !==constValues.userRoles.ADMIN){
		res.status(401).send({
			message: "Unauthorized Access"
		});
		return;
	}
	next();
	return;	
};

isInstructor = (req, res,next) => {
    if(req.userDetails.role!==constValues.userRoles.INSTRUCTOR){
		res.status(401).send({
			message: "Unauthorized Access"
		});
		return;
	}
	next();
	return;
};

isStudent = (req, res,next) => {
    if(req.userDetails.role !==constValues.userRoles.STUDENT){
		res.status(401).send({
			message: "Unauthorized Access"
		});
		return;
	}
	next();
	return;
};

const authJwt = {
	verifyToken: verifyToken,
	isAdmin: isAdmin,
	isInstructor: isInstructor,
	isStudent: isStudent
};

module.exports = authJwt;