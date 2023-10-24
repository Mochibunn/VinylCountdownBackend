const express = require("express");
const path = require("path");
const {
    getAllAlbums,
    getSingleAlbum,
} = require("./controllers/albumControllers");
const {
    getAllUsers,
    makeNewUser,
    getSingleUser,
    editUser,
    deactivateUser,
} = require("./controllers/userControllers");
const { migrateUsers } = require("./controllers/migrateControllers");
//for testing before connection to our database is established
const { usersWithId, albumsWithId, newUser } = require("./testdata");

const app = express();
const port = process.env.PORT || 24601;

app.route("/").get((req, res) => {
    return res.json([usersWithId, albumsWithId]);
});

app.route("/albums").get(getAllAlbums);

app.route("/albums/:id").get(getSingleAlbum);

app.route("/users").get(getAllUsers).post(makeNewUser);

app.route("/users/:id")
    .get(getSingleUser)
    .patch(editUser)
    .delete(deactivateUser);

app.route("/users/migrate").post(migrateUsers);

app.listen(port, () => console.log(`Server up on port ${port}`));
