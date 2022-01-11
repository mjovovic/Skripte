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
