const express = require("express");
const https = require("https");
const cors = require("cors");
const fs = require("fs");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT;

app.post("/api/downloadImage", async (req, res) => {
  try {
    const imageUrl = req.query.imageUrl;
    const imageName = req.query.imageName;

    const file = fs.createWriteStream(`data/downloads/images/${imageName}.jpg`);

    https
      .get(imageUrl, (response) => {
        response.pipe(file);

        file.on("finish", () => {
          file.close();
          console.log(`Image downloaded as ${imageName}`);
          res.status(200).send({ message: `Image downloaded as ${imageName}` });
        });
      })
      .on("error", (err) => {
        fs.unlink(imageName, () => {
          console.error(`Error downloading image: ${err.message}`);
          res
            .status(500)
            .send({ error: `Error downloading image: ${err.message}` });
        });
      });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log("Server Listening on PORT:", port);
});
