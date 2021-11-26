const auth = require('../middleware/auth.js');
module.exports = function(app) {

    const users = require('../controller/user.controller.js');
    
    // User signin
    app.post('/api/user/signin', users.signin);
}