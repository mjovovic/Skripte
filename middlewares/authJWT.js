const jwt = require("jsonwebtoken");
const config = require("../config/auth_config.js");
const db = require("../models");
const User = db.user;
const Role = db.role;

verifyToken = (req, res, next) => {
    //let token = req.headers["x-access-token"];
    let token = req.session.token;
    if (!token) {
        return res.status(403).send({ message : "No teken provided!" });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "Unauthorized!" });
        }
        req.userId = decoded.id;
        next();
    });
};

isAdmin = (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        Role.find(
            { 
            _id: { $in: user.roles }
            },
            (err, roles) => {
                if (err) {
                    res.status(500).send({ message: err});
                    return;
                }
                for( let i = 0; i < 3 && roles[i]!=null; i++) {
                    if( roles[i].name === "admin" ){
                        next();
                        return;
                    }
                }
                res.status(403).send({message: "Require Admin Permission!"});
                return;
            } 
        );
    });
};

isModerator = (req, res, next) => {
    User.findById(req.userId).exec((err, user) =>{
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        Role.find(
            {
                _id: { $in: user.roles }
            },
            (err, roles) => {
                if(err) {
                    res.status(500).send({message: err});
                    return;
                }

                for( let i = 0; i < 3 && roles[i]!=null; i++){
                    if(roles[i].name === "moderator" || roles[i].name === "admin"){
                        next();
                        return;
                    }
                }
                res.status(403).send({ message: "Require Moderator Permision!" });
            return;
            }
        );
    });
};

const authJWT = {
    verifyToken,
    isAdmin,
    isModerator
};

module.exports = authJWT;
