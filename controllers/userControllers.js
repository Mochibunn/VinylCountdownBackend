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
        const { first_name, last_name, email, password, profile_pic } =
            req.body;
        if (!first_name || !last_name || !email || !password)
            return res.status(400).json({ error: "Missing fields" });
        const {
            rows: [newUser],
        } = await dbPool.query(
            "INSERT INTO users (first_name, last_name, email, password, profile_pic) VALUES ($1, $2, $3, $4, $5) RETURNING *;",
            [first_name, last_name, email, password, profile_pic || null]
        );

        return res.status(201).json(newUser);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
};

const getSingleUser = async (req, res) => {
    try {
        const { id } = req.params;
        if (!+id) return res.status(400).json({ error: "Id must be a number" });
        const {
            rows: [user],
        } = await dbPool.query(
            `SELECT * FROM users WHERE id=$1 AND active=true`,
            [id]
        );
        if (!user) return res.status(404).json({ error: "User not found" });
        return res.json(user);
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
