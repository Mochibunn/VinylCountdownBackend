const { usersWithId } = require("../testdata");
const dbPool = require("../db/pgClient");

const getAllUsers = async (req, res) => {
    try {
        const { rows } = await dbPool.query("SELECT * FROM users;");
        // Actual query for our database (with password):
        // const { rows } = await dbPool.query(
        //   `SELECT duck_name, img_src as imgSrc, quote, to_json(owner.*) as owner FROM duck JOIN owner on owner.id=duck.owner_id;`
        // );
        // Actual query for our database (without password):
        // const { rows } = await dbPool.query(`SELECT duck_name as duckName, img_src as imgSrc, quote, json_build_object('id', owner.id, 'first_name', owner.first_name, 'last_name', owner.last_name, 'email', owner.email) as owner FROM duck JOIN owner ON owner.id=duck.owner_id`);
        res.json(rows);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
};

const makeNewUser = async (req, res) => {
    try {
        //in this way we'd just push the new user onto usersWithId, but that doesn't really translate to the database way, so no point in writing it
        return res.json(usersWithId);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
};

const getSingleUser = async (req, res) => {
    try {
        if (!usersWithId[req.params.id - 1])
            return res.status(404).send("User not found!");
        return res.json(usersWithId[req.params.id - 1]);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
};

const editUser = async (req, res) => {
    try {
        //will be needed to add/remove to wishlist (I think)-not sure how this works with the intermediary table
        return res.json(usersWithId);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
};

const deactivateUser = async (req, res) => {
    try {
        //will update active boolean to false rather than actually deleting
        return res.json({});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllUsers,
    makeNewUser,
    getSingleUser,
    editUser,
    deactivateUser,
};
