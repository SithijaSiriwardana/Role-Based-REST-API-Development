const db = require('../config/db.config.js');
var bcrypt = require("bcryptjs");
const constValues = require('../utils/constants.js');
const User = db.users;
const Classes = db.classes;
const Modules = db.modules;

var generator = require('generate-password');


exports.classCreate = async (req, res) => {

    try {
        // Get all the students username 
        const users = await User.findAll({
            where: {
                role: constValues.userRoles.STUDENT
            },
        })
      
        const similarStudents = users.filter(value => {
            return req.body.studentNameList.includes(value.username)
        });

        // If student exists return error
        if (similarStudents.length !== 0) {
            res.status(400).send({
                message: "Send unique student names!",
                users: users,
                list: req.body.studentNameList
            });
            return;
        }
            
        // Get class by the class name
        const className = await Classes.findOne({
            where: {
            class_name: req.body.className
            }
        })

        // If class exists return error
        if (className) {
            res.status(400).send({
            message: "Class name already exists!"
            });
            return;
        }
        
        // Create new class
        const createClass = await  Classes.create({
            class_name: req.body.className,
        })

        // Genereate random passowrd
        const password = generator.generate({
            length: 10,
            numbers: true
        });

        //Create new student user
        for (let i = 0; i < req.body.studentNameList.length; i++) {
            //const student = req.body.studentNameList[i];
            await User.create({
                username: req.body.studentNameList[i],
                password: bcrypt.hashSync(password, 8),
                role: constValues.userRoles.STUDENT,
                class_id: createClass.class_id
            })
        }
        //Get modules
        const modules = await Modules.findAll({
            where: {
                module_name: [req.body.moduleList]
            },
        })
        
        //Create classes with modules
        for (let i = 0; i < modules.length; i++) {
            //const mod = modules[i];
            await createClass.addModule(modules[i])
        }

        res.status(200).send({ 
            studentsPassword: password,
        });

    } catch (e) {
        res.status(500).send({ 
                success: false,
                message: e.toString()
        });
    }    
};