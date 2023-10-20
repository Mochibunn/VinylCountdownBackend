import fs from "fs/promises";

try {
    const data = await fetch(
        " https://cdn.contentful.com/spaces/<spaceID>/environments/master/entries?access_token=<accessToken>&content_type=user"
    );
    //this is where the URL with our access tokens was, but we don't need to run this function again
    const parsedData = await data.json();
    const trimData = parsedData.items.map((item) => {
        const { wishlist, ...rest } = item.fields;
        return rest;
    });
    await fs.writeFile(
        "contentfulUserData.json",
        JSON.stringify(trimData),
        "utf8"
    );
} catch (err) {
    console.log(err.message);
}
