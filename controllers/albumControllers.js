const contentfulAlbumsData = require("../migration/contentfulAlbumsData.json");
const dbPool = require("../db/pgClient");

const migrateAlbums = async (req, res) => {
  try {
    let queryString = "";
    contentfulAlbumsData.forEach((album, index) => {
      if (index === contentfulAlbumsData.length - 1)
        queryString += `(
					'${album.title}',
					'${album.artist}',
					'${album.year}',
					'${album.imgUrl}',
					'${album.format}',
					'${album.price}',
					'${album.media}',
					'${album.sleeve}',
					'${album.spotifyUrl}',
					'${album.comment}',
					'${album.genre}')`;
      else
        queryString += `(
				'${album.title}',
				'${album.artist}',
				'${album.year}',
				'${album.imgUrl}',
				'${album.format}',
				'${album.price}',
				'${album.media}',
				'${album.sleeve}',
				'${album.spotifyUrl}',
				'${album.comment}',
				'${album.genre}'),`;
    });
    console.log(queryString);
    await dbPool.query(
      `INSERT INTO albums (title, artist, year, img_url, format, price, media, sleeve, spotify_url, comment, genre) VALUES ${queryString} RETURNING *;`
    );
    return res.json("Oh, something happened, exciting!");
  } catch (error) {
    console.log(error);
    console.log(error.stack);
    return res.status(500).json({ ":( Oh no, an error!": error.message });
  }
};

const { albumsWithId } = require("../testdata");

const getAllAlbums = async (req, res) => {
	try {
		const { rows } = await dbPool.query("SELECT * FROM albums;");
		return	res.status(200).json(rows);
	} catch (error) {
		console.log(error);
		return	res.status(500).json({"Oh no, an error?": error.message});
	}
};

// const getAllAlbums = (req, res) => {
//     return res.json(albumsWithId);
// };

const getSingleAlbum = (req, res) => {
  console.log(req.params.id);
  if (!albumsWithId[req.params.id - 1])
    return res.status(404).send("Album not found!");
  return res.json(albumsWithId[req.params.id - 1]);
};

module.exports = { getAllAlbums, getSingleAlbum, migrateAlbums };
