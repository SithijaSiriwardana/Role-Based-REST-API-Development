const authJwt = require('../middleware/auth.js');
module.exports = function(app) {

    const users = require('../controller/user.controller.js');
    const admin = require('../controller/admin.controller.js');

    // User signin
    app.post('/api/user/signin', users.signin);

    // Admin instructor create
    app.post('/api/user/admin/instructor-create', authJwt.verifyToken, authJwt.isAdmin, admin.instrcutorCreate);
}