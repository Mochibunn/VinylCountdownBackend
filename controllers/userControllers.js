const dbPool = require("../db/pgClient");

//huh, don't actually need this for our frontend
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

//don't have a reference to the id if you sign in with a form, so select all users, then use queries to filter
const signInUser = async (req, res) => {
    try {
        const { email, password } = req.query;
        console.log(email, password);
        if (!email || !password)
            return res.status(400).json({
                error: "Must enter email and password",
            });
        const { rows } = await dbPool.query(
            `SELECT users.*, array_agg(to_json(albums.*)) as wishlist FROM users
            LEFT JOIN wishlist ON wishlist.user_id = users.id
            LEFT JOIN albums ON albums.id = wishlist.album_id
            WHERE email=$1 AND password=$2 AND active=true
            GROUP BY users.*, users.id`,

            // `SELECT * FROM users
            // JOIN wishlist ON wishlist.user_id = users.id
            // JOIN albums ON albums.id = wishlist.album_id
            // WHERE email=$1 AND password=$2 AND active=true`,

            // `SELECT * FROM users WHERE email=$1 AND password=$2 AND active=true`,
            [email, password]
        );
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
        const {
            params: { id },
            body: { first_name, last_name, email, password, profile_pic },
        } = req;

        if (!+id) return res.status(400).json({ error: "Id must be a number" });

        if (!first_name || !last_name || !email || !password)
            return res.status(400).json({ error: "Missing fields" });

        const {
            rows: [updatedUser],
        } = await dbPool.query(
            "UPDATE users SET first_name=$1, last_name=$2, email=$3, password=$4, profile_pic=$5, updated_at=NOW() WHERE id=$6 RETURNING *;",
            [first_name, last_name, email, password, profile_pic, id]
        );

        return res.json(updatedUser);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
};

const deactivateUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (!+id) return res.status(400).json({ error: "Id must be a number" });

        const {
            rows: [deactivatedUser],
        } = await dbPool.query(
            "UPDATE users SET active=false, updated_at=NOW() WHERE id=$1 RETURNING *;",
            [id]
        );

        return res.json(deactivatedUser);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
};
const addToWishlist = async (req, res) => {
    try {
        const { userId, albumId } = req.params;
        const {
            rows: [newItem],
        } = await dbPool.query(
            "INSERT INTO wishlist (user_id, album_id) VALUES ($1, $2) RETURNING *;",
            [userId, albumId]
        );

        return res.status(201).json(newItem);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
};
const removeFromWishlist = async (req, res) => {
    try {
        const { userId, albumId } = req.params;
        const {
            rows: [newItem],
        } = await dbPool.query(
            "DELETE FROM wishlist WHERE user_id=$1 AND album_id=$2 RETURNING *;",
            [userId, albumId]
        );

        return res.status(201).json(newItem);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
};

module.exports = {
    signInUser,
    makeNewUser,
    getSingleUser,
    editUser,
    deactivateUser,
    addToWishlist,
    removeFromWishlist,
};
