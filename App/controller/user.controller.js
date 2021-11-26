const db = require('../config/db.config.js');
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const env = require('../config/env.js');
const constValues = require('../utils/constants.js');

const User = db.users;
const Modules = db.modules;

exports.signin = (req, res) => {
	//Check user
	User.findOne({
	  where: {
		username: req.body.username
	  }
	})
	  .then(user => {
		if (!user) {
		  return res.status(404).send({ message: "User Not found." });
		}else{
			//Compare password
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
			var token = jwt.sign({ id: user.user_id, role:user.role }, env.JWT_ENCRYPTION, {
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

exports.viewModules = async (req, res) => {
	//Check user is a admin or instructor
	if (req.userDetails.role === constValues.userRoles.ADMIN || req.userDetails.role === constValues.userRoles.INSTRUCTOR) {
	  res.status(200).send({ 
		  modules: [constValues.moduleNames.FACE_DETECT, constValues.moduleNames.IMAGE_PROCESSING, constValues.moduleNames.VOICE_REC],
	  });
	} else {
	  try {
		//Get student modules
		const result = await db.sequelize.query(`select module_name from users 
		join classes on users.class_id = classes.class_id 
		join class_module on classes.class_id = class_module.class_id
		join modules on class_module.module_id = modules.module_id 
		where user_id = ${req.userDetails.id};`, null, { raw: true })
		console.log(result);
		const modules = result[0].map(res => {
			return res.module_name
		})
		
		res.status(200).send({ 
			modules,
		  });
	  } catch (e) {
		  res.status(500).send({ 
			  success: false,
			  message: e.toString()
	  });
	  }
	  
	}
};

exports.executeModule = async (req, res) => {
    const result = await Modules.findAll({})
    const modules = result.map(res => {
        return res.module_name
    })
    for (let i = 0; i < modules.length; i++) {
        const module = modules[i];
        if(req.params.moduleName === module){
            res.status(200).send(`Hello Module ${req.params.moduleName}`);
        }
    }
    res.status(400).send("Module not found!");
    
};