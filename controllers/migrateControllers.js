const contentfulUserData = require("../migration/contentfulUserData.json");
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

module.exports = { migrateUsers, migrateAlbums };
