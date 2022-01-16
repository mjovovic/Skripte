const config = require("../config/auth_config");
const db = require("../models");
const User = db.user;
const Role = db.role;
const Book = db.book;
var jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs/dist/bcrypt");
const validator = require("email-validator");
const { user } = require("../models");

exports.allAccess = (req, res) => {
    res.status(200).send("Public cont");
};

exports.userBoard = (req, res) => {
    res.status(200).send("User cont");
};

exports.adminBoard = (req, res) => {
    res.status(200).send("Admin cont");
};

exports.moderatorBoard = (req, res) => {
    res.status(200).send("Moderator cont");
};

exports.adminCreateUser = (req, res) => {
    if(!(req.body.password === req.body.pass_con)){
        res.status(400).send({message: `Passwords do not match ${req.body.password} ${req.body.pass_con}`});
        return;
    }
    if(!validator.validate(req.body.email)){
        res.status(400).send({message: `Invalid Email format ${req.body.email}`});
        return;
    }
    const user = new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        roles: req.body.roles,
        password: bcrypt.hashSync(req.body.password, 8)
    });
  
    user.save((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
  
        if (req.body.roles) {
            Role.find(
            {
                name: { $in: req.body.roles }
            },
            (err, roles) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
  
                user.roles = roles.map(role => role._id);
                user.save(err => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                res.send({ message: "User was registered successfully!" });
                });
            }
            );
        } else {
            Role.findOne({ name: "user" }, (err, role) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                user.roles = [role._id];
                user.save(err => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }
                    res.send({ message: "User was registered successfully!" });
                });
            });
        }
    });
};

exports.adminDeleteUser = (req, res) => {
    User.findOne({email: req.body.email}, (err, user) => {
        if(err){
            res.status(404).send({message: "User not found"});
            return;
        }
        User.deleteOne({email: req.body.email});
        res.status(200).send({message: `user with ${req.body.email} has been deleted`});
    });
};

exports.adminUpdateUser = (req, res) => {
    User.findOne({email: req.body.email}, (err, user) => {
        if(err){
            res.status(404).send({message: "User not found"});
            return;
        }
        user.first_name = req.body.first_name;
        user.last_name = req.body.last_name;
    });
};

exports.adminReadUser = (req, res) => {
    
    User.findOne({email: req.body.email}, (err, user) => {
        if(err){
            res.status(404).send({message: "User not found"});
            return;
        }
        res.send(user);
    });
};

exports.moderatorAddBook = (req, res) => {

};

exports.moderatorDeleteBook = (req, res) => {
    
};

exports.moderatorUpdateBook = (req, res) => {

};


