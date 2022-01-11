const { verifySignUp } = require("../middlewares");
const controller  = require("../controllers/auth_controller");
const res = require("express/lib/response");
const path = require('path');

module.exports = function(app) {
    app.use(function(req, res, next){
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    
    
    app.post(
        "/api/auth/signup",
        [
            verifySignUp.checkDuplicateUsernameOrEmail,
            verifySignUp.checkRolesExisted
        ],
        controller.signup
        );
    
    app.post("/api/auth/signin", controller.signin);
    
    app.get("/api/auth/signin", (req, res) => {
        res.sendFile(path.join(__dirname, '../static/login.html'));
    });

    app.get("/api/auth/signup", (req, res) => {
        res.sendFile(path.join(__dirname, '../static/register.html'));
    });
    
            
}