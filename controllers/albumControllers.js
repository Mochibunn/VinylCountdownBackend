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
    return res.status(500).json({ "🛑🐰 Error!": error.message });
  }
};

// const { albumsWithId } = require("../testdata");

const getAllAlbums = async (req, res) => {
  try {
    console.log(` `);
    console.log("👀🐰 Requesting album data from database");
    const { rows } = await dbPool.query("SELECT * FROM albums;");
		console.log("🟢🐰 Album data fetched successfully")
    return res.status(200).json(rows);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ "🛑🐰 Error!": error.message });
  }
};

// const getAllAlbums = (req, res) => {
//     return res.json(albumsWithId);
// };

const getSingleAlbum = async (req, res) => {
  try {
    console.log(` `);
    console.log("👀🐰 Requesting single album data from database");
    console.log(`👀🐰 A client requested ID of ${req.params.id}`);
    const { id } = req.params;
    if (!+id) {
      console.log(`🛑🐰 ID of ${id} is not an integer value`);
      return res
        .status(400)
        .json({ "🛑🐰 Error!": "ID must only contain numbers 0-9" });
    }
    const {
      rows: [album],
    } = await dbPool.query("SELECT * FROM albums WHERE id=$1", [id]);
    if (!album) {
      console.log(`⚠️ 🐰 Database could not find ID of ${req.params.id}`);
      return res
        .status(404)
        .json({
          "🛑🐰 Error!":
            "Sorry, there is no such album ID in our collection :(",
        });
    }
    console.log(
      `🟢🐰 Database returned response of ${album.title} by ${album.artist}`
    );
    return res.json(album);
  } catch (error) {
    console.log(`🛑🐰 Internal server error! ${error.message}`);
    return res.status(500).json({ "🛑🐰 Error!": error.message });
  }
};

// const getSingleAlbum = (req, res) => {
//   console.log(req.params.id);
//   if (!albumsWithId[req.params.id - 1])
//     return res.status(404).send("Album not found!");
//   return res.json(albumsWithId[req.params.id - 1]);
// };

module.exports = { getAllAlbums, getSingleAlbum, migrateAlbums };
