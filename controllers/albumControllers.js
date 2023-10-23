const { usersWithId, albumsWithId, newUser } = require("../testdata");

const getAlbums = () => {
    (req, res) => {
        return res.json(albumsWithId);
    };
};

module.exports = { getAlbums };
