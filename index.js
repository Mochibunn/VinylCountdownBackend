const express = require("express");
const path = require("path");
const {
    getAllAlbums,
    getSingleAlbum,
    migrateAlbums,
    getRecs,
} = require("./controllers/albumControllers");
const {
    signInUser,
    makeNewUser,
    getSingleUser,
    editUser,
    deactivateUser,
    addToWishlist,
    removeFromWishlist,
} = require("./controllers/userControllers");
const { migrateUsers } = require("./controllers/migrateControllers");
//for testing before connection to our database is established
const { usersWithId, albumsWithId, newUser } = require("./testdata");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 24601;

app.use(express.json());
// app.use(express.static(path.join(__dirname, "public")));
app.use(
    cors({
        origin: "*",
    })
);

app.route("/").get((req, res) => {
    return res.json([usersWithId, albumsWithId]);
});

app.route("/albums").get(getAllAlbums);

app.route("/albums/:id").get(getSingleAlbum);

app.route("/albums/:id/recommendations").get(getRecs);

app.route("/albums/migrate").post(migrateAlbums);

app.route("/users").get(signInUser).post(makeNewUser);

app.route("/users/:id")
    .get(getSingleUser)
    .patch(editUser)
    .delete(deactivateUser);

app.route("/wishlist/:userId/:albumId")
    .post(addToWishlist)
    .delete(removeFromWishlist);
app.route("/users/migrate").post(migrateUsers);

app.listen(port, () => console.log(`\n🟢🐰 Server up on port ${port}!`));