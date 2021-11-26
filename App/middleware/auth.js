const jwt = require("jsonwebtoken");
const env = require('../config/env.js');
const constValues = require('../utils/constants.js');
const db = require('../config/db.config.js');


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
	//verify JWT token
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

//check user has admin privillages
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

//check user has instructor privillages
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

//check user has student privillages
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


//check user privillages for executing modules
verifyModelExecutePermission = async (req, res, next) => {
    if (req.userDetails.role === constValues.userRoles.ADMIN || req.userDetails.role === constValues.userRoles.INSTRUCTOR){
        next();
        return;
    }
    try {
        var flag = false;
        const result = await db.sequelize.query(`select module_name from users 
        join classes on users.class_id = classes.class_id
        join class_module on classes.class_id = class_module.class_id
        join modules on class_module.module_id = modules.module_id
        where user_id = ${req.userDetails.id};`, null, { raw: true })
        const modules = result[0].map(res => {
            return res.module_name
        })
        for (let i = 0; i < modules.length; i++) {
            const module = modules[i];
            if(req.params.moduleName === module){
                flag = true;
                break;
            }
        };
        if (!flag) {
            res.status(401).send({
              message: "Unauthorized!"
            });
          }
        next()
    }catch(e) {
        res.status(500).send({ 
            success: false,
            message: e.toString()
        });
    }
};

const authJwt = {
	verifyToken: verifyToken,
	isAdmin: isAdmin,
	isInstructor: isInstructor,
	isStudent: isStudent,
	verifyModelExecutePermission: verifyModelExecutePermission
};

module.exports = authJwt;