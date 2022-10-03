import express from "express";
import bodyParser from "body-parser";
import { checkUrl, filterImageFromURL, deleteLocalFiles } from "./util/util";
import { utimes } from "fs";
import { nextTick } from "process";

(async () => {
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */
  app.get("/filteredimage", async (req, res) => {
    try {
      const { image_url } = req.query;

      if (checkUrl(image_url)) {
        const iamge_path = await filterImageFromURL(image_url);
        // res.send("image is filtered");
        res.sendFile(iamge_path, (err) => {
          if (err) {
            console.log(err);
          } else {
            deleteLocalFiles([iamge_path]);
          }
        });
      } else {
        res.status(422).send("invalid image_url provided");
      }
    } catch (error) {
      console.log(error);
      res.status(422).send("no image found  at this url or malformed url");
    }
  });
  //! END @TODO1

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("welcome to the main endpoint ");
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
