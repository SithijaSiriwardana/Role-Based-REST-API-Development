module.exports = function(app) {

    const users = require('../controller/user.controller.js');
    const admin = require('../controller/admin.controller.js');
    const instructor = require('../controller/instructor.controller.js');
    const authJwt = require('../middleware/auth.js');

    /**
     * @swagger
     * /api/user/signin:
     *  post:
     *    description: User signin
     *    parameters:
     *      - name: Username and Password
     *        description: username and password
     *        in: body
     *        required: true
     *        type: string
     *    responses:
     *      200:
     *        description: Success
     */
    app.post('/api/user/signin', users.signin);

    /**
     * @swagger
     * /api/user/admin/instructor-create:
     *  post:
     *    description: Create instructor
     *    parameters:
     *      - name: x-access-token
     *        description: x-access-token of the admin
     *        in: header
     *        required: true
     *        type: string
     *      - name: Instructor name
     *        description: Instructor name
     *        in: body
     *        required: true
     *        type: string
     *    responses:
     *      200:
     *        description: Success
     */
    app.post('/api/user/admin/instructor-create', authJwt.verifyToken, authJwt.isAdmin, admin.instrcutorCreate);

    /**
     * @swagger
     * /api/user/instructor/class-create:
     *  post:
     *    description: Create class
     *    parameters:
     *      - name: x-access-token
     *        description: x-access-token of the instructor
     *        in: header
     *        required: true
     *        type: string
     *      - name: Class details
     *        description: Class details as className, moduleList, and studentNameList
     *        in: body
     *        required: true
     *        type: string
     *    responses:
     *      200:
     *        description: Success
     */
    app.post('/api/user/instructor/class-create', authJwt.verifyToken, authJwt.isInstructor, instructor.classCreate);

    /**
     * @swagger
     * /api/user/view-modules:
     *  get:
     *    description: Get modules by the user role
     *    responses:
     *      200:
     *        description: Success
     */
    app.get('/api/user/view-modules', authJwt.verifyToken, users.viewModules);

    /**
     * @swagger
     * /api/user/execute-modules/{moduleName}:
     *  get:
     *    description: Executes modules by the user role
     *    parameters:
     *      - name: x-access-token
     *        description: x-access-token of the user
     *        in: header
     *        required: true
     *        type: string
     *      - name: moduleName
     *        description: Module name that want to execute
     *        in: path
     *        required: true
     *        type: string
     *    responses:
     *      200:
     *        description: Success
     */
    app.get("/api/user/execute-modules/:moduleName", authJwt.verifyToken, authJwt.verifyModelExecutePermission, users.executeModule)
}