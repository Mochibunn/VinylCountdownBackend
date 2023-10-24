const { albumsWithId } = require("../testdata");

const getAllAlbums = (req, res) => {
    return res.json(albumsWithId);
};

const getSingleAlbum = (req, res) => {
    console.log(req.params.id);
    if (!albumsWithId[req.params.id - 1])
        return res.status(404).send("Album not found!");
    return res.json(albumsWithId[req.params.id - 1]);
};

module.exports = { getAllAlbums, getSingleAlbum };
