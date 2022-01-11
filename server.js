const express = require("express");
const cors = require("cors");
const { append } = require("joi/lib/types/object");
const db_config = require("./config/db_config");
const app = express();

var corsOptions = {
    origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true}));

const db = require("./models");
const Role = db.role;

db.mongoose.connect(
    `mongodb://${db_config.HOST}:${db_config.PORT}/${db_config.DB}`,{
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log("Successfully connected");
        init();
    }).catch(err => {
        console.error("Con error", err);
        process.exit();
    });

function init() {
    Role.estimatedDocumentCount((err, count) => {
        if( !err && count === 0) {
            new Role({
                name: "user"
            }).save(err => {
                if(err) {
                    console.log("error user", err);
                }
                console.log("added user role");
            });
            new Role({
                name: "moderator"
            }).save(err => {
                if(err) {
                    console.log("error moderator", err);
                }
                console.log("added moderator role");
            });

            new Role({
                name: "admin"
            }).save(err => {
                if(err) {
                    console.log("error admin", err);
                }
                console.log("added admin role");
            });
        }
    });
}

app.get("/", (req, res) => {
    res.json({ message: "Welcome to bookstore"});
});

require('./routes/auth_routes')(app);
require('./routes/user_routes')(app);


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});