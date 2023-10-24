const userData = require("./migration/contentfulUserData.json");
const albumData = require("./migration/contentfulAlbumsData.json");

const usersWithId = userData.map((user, i) => ({ ...user, id: i + 1 }));
const albumsWithId = albumData.map((album, i) => ({ ...album, id: i + 1 }));
const newUser = {
    firstName: "Iroh",
    lastName: "Fire",
    email: "iroh@fire.com",
    password: "irohpass",
    profilePic:
        "https://upload.wikimedia.org/wikipedia/en/b/bb/General_Iroh.jpg",
};

module.exports = { usersWithId, albumsWithId, newUser };
