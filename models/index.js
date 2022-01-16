const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user");
db.role = require("./roles");
db.book = require("./book");

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;