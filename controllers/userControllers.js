const { usersWithId } = require("../testdata");

const getAllUsers = (req, res) => {
    return res.json(usersWithId);
};

const makeNewUser = (req, res) => {
    //in this way we'd just push the new user onto usersWithId, but that doesn't really translate to the database way, so no point in writing it
    return res.json(usersWithId);
};

const getSingleUser = (req, res) => {
    if (!usersWithId[req.params.id - 1])
        return res.status(404).send("User not found!");
    return res.json(usersWithId[req.params.id - 1]);
};

const editUser = (req, res) => {
    //will be needed to add/remove to wishlist (I think)-not sure how this works with the intermediary table
    return res.json(usersWithId);
};

const deactivateUser = (req, res) => {
    //will update active boolean to false rather than actually deleting
};

module.exports = {
    getAllUsers,
    makeNewUser,
    getSingleUser,
    editUser,
    deactivateUser,
};
