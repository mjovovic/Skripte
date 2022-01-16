const config = require("../config/auth_config");
const db = require("../models");
const User = db.user;
const Role = db.role;
var jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs/dist/bcrypt");
const validator = require("email-validator");

exports.signup = (req, res) => {
   
    if(!(req.body.password === req.body.pass_con)){
        
        res.status(400).send({message: `Passwords do not match ${req.body.password} ${req.body.pass_con}`});
        return;
    }
    if(!validator.validate(req.body.email)){
        res.status(400).send({message: `Invalid Email format ${req.body.email}`});
        return;
    }
   /* if(res.body.password.lenght < 5){
        res.status(400).send({message: `Password to weak`});
        return;
    }*/
    const user = new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
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
}

exports.signin = (req, res) => {
    User.findOne({
        email: req.body.email
    })
    .populate("roles", "-_v")
    .exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err});
            return;
        }
        if( !user ) {
            return res.status(404).send({ message: "User not found"});
        }

        var passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );

        if( !passwordIsValid ) {
            return res.status(401).send({message: "Invalid Password!"});
        }

        var token = jwt.sign({id: user.id}, config.secret, {
            expiresIn: 86400 //24h
        });

        // var authorities = [];
        // console.log(`im here`);
        // for (let i = 0; i < user.roles.lenght; i++) {
        //     authorities.push( user.roles[i].name);
        //     console.log(`${user.role[i].name}`);
        // }
        // console.log(`im here`);
        req.session.token = token;

        res.status(200).send({
            id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            roles: user.roles
        });
    });
}
exports.signout = async(req, res) => {
    try {
        req.session = null;
        return res.status(200).send({message: "Youre signed out"});
    } catch (err) {
        this.next(err);
    }
}