import fs from "fs/promises";

try {
    const data = await fetch();
    //this is where the URL with our access tokens was, but we don't need to run this function again
    const parsedData = await data.json();
    const trimData = parsedData.items.map((item) => item.fields);
    await fs.writeFile(
        "contentfulAlbumsData.json",
        JSON.stringify(trimData),
        "utf8"
    );
} catch (err) {
    console.log(err.message);
}
