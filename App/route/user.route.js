module.exports = function(app) {

    const users = require('../controller/user.controller.js');
    const admin = require('../controller/admin.controller.js');
    const instructor = require('../controller/instructor.controller.js');
    const authJwt = require('../middleware/auth.js');

    /**
     * @swagger
     * components:
     *  schemas:
     *    userLogin:
     *      type: object
     *      required:
     *        - username
     *        - password
     *      properties:
     *        username:
     *          type: string
     *          description: Username of the user
     *        password:
     *          type: string
     *          description: Password of the user 
     *      example:
     *        username: admin
     *        password: '123456'
     *    
     *    instructorCreate:
     *      type: object
     *      required:
     *        - username
     *      properties:
     *        username:
     *          type: string
     *          description: Username of the user
     *      example:
     *        username: Instructor A
     * 
     *    classCreate:
     *      type: object
     *      required:
     *        - className
     *        - moduleList
     *        - studentNameList
     *      properties:
     *        username:
     *          type: string
     *          description: Username of the user
     *        moduleList:
     *          type: Array
     *          description: Array of selected modules
     *        studentNameList:
     *          type: Array
     *          description: Array of student names
     *      example:
     *        className: class1
     *        moduleList: [IMAGE_PROCESSING, FACE_DETECT]
     *        studentNameList: [Student A, Student B, Student C, Student D]
     *    
     */ 

    /**
     * @swagger
     * /api/user/signin:
     *   post:
     *     summary: User Login
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/userLogin'
     *     responses:
     *       200:
     *         description: Returning the JWT token
     *       500:
     *         description: Error response
     */
    app.post('/api/user/signin', users.signin);

    /**
     * @swagger
     * /api/user/admin/instructor-create:
     *  post:
     *    description: Create instructor
     *    requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/instructorCreate'
     *    parameters:
     *      - name: x-access-token
     *        description: JWT token of the admin
     *        in: header
     *        required: true
     *        type: string
     *    responses:
     *      200:
     *        description: Return instructor password
     *      500:
     *         description: Error response
     */
    app.post('/api/user/admin/instructor-create', authJwt.verifyToken, authJwt.isAdmin, admin.instrcutorCreate);

    /**
     * @swagger
     * /api/user/instructor/class-create:
     *  post:
     *    description: Create class
     *    requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/classCreate'
     *    parameters:
     *      - name: x-access-token
     *        description: JWT token of the instructor
     *        in: header
     *        required: true
     *        type: string
     *    responses:
     *      200:
     *        description: Return one password for all the students
     *      500:
     *         description: Error response
     */
    app.post('/api/user/instructor/class-create', authJwt.verifyToken, authJwt.isInstructor, instructor.classCreate);

    /**
     * @swagger
     * /api/user/view-modules:
     *  get:
     *    description: Get modules by the user role
     *    parameters:
     *      - name: x-access-token
     *        description: x-access-token of the user
     *        in: header
     *        required: true
     *        type: string
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