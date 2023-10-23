const express = require("express");
const path = require("path");
const { getAlbums } = require("./controllers/albumControllers");
//for testing before connection to our database is established
const { usersWithId, albumsWithId, newUser } = require("./testdata");

const app = express();
const port = process.env.PORT || 24601;

app.route("/").get((req, res) => {
    return res.json([usersWithId, albumsWithId]);
});

app.route("/albums").get(getAlbums);

app.route("/albums/:id").get((req, res) => {
    if (!albumsWithId[req.params.id - 1])
        return res.status(404).send("Album not found!");
    return res.json(albumsWithId[req.params.id - 1]);
});

app.route("/users")
    .get((req, res) => {
        return res.json(usersWithId);
    })
    .post((req, res) => {
        //in this way we'd just push the new user onto usersWithId, but that doesn't really translate to the database way, so no point in writing it
        return res.json(usersWithId);
    });

app.route("/users/:id")
    .get((req, res) => {
        if (!usersWithId[req.params.id - 1])
            return res.status(404).send("User not found!");
        return res.json(usersWithId[req.params.id - 1]);
    })
    .patch((req, res) => {
        //will be needed to add/remove to wishlist (I think)-not sure how this works with the intermediary table
        return res.json(usersWithId);
    })
    .delete((req, res) => {
        //will update active boolean to false rather than actually deleting
    });

app.listen(port, () => console.log(`Server up on port ${port}`));
