const contentfulUserData = require("../migration/contentfulUserData.json");
const dbPool = require("../db/pgClient");

const migrateUsers = async (req, res) => {
    try {
        let queryString = "";
        contentfulUserData.forEach((user, index) => {
            if (index === contentfulUserData.length - 1)
                queryString += `('${user.firstName}', '${user.lastName}', '${
                    user.email
                }', '${user.password}', ${
                    user.profilePic ? `'${user.profilePic}'` : null
                })`;
            else
                queryString += `('${user.firstName}', '${user.lastName}', '${
                    user.email
                }', '${user.password}', ${
                    user.profilePic ? `'${user.profilePic}'` : null
                }), `;
        });
        console.log(queryString);
        await dbPool.query(
            `INSERT INTO users (first_name, last_name, email, password, profile_pic) VALUES ${queryString}`
        );
        return res.json("Something happened!");
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
};

module.exports = { migrateUsers };
