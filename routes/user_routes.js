const { authJWT } = require("../middlewares");
const controller = require("../controllers/user_controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/all", controller.allAccess);
  app.get("/api/user", [authJWT.verifyToken], controller.userBoard);

  app.get(
    "/api/mod",
    [authJWT.verifyToken, authJWT.isModerator],
    controller.moderatorBoard
  );

  app.get(
    "/api/admin",
    [authJWT.verifyToken, authJWT.isAdmin],
    controller.adminBoard
  );
  
  
};