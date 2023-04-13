export { adminRouter };

import mongoose from "mongoose";
import express from "express";

const adminRouter = express.Router();

adminRouter.post("/purge", (req, res) => {
  deleteCollection(req.body.collection);
  res.json({ message: "Purged '" + req.body.collection + "' collection from database: "});
  
  
});

async function deleteCollection(collection) {
  console.log("Deleting all '" + collection  + "' from database");
  
  await mongoose.connection.db.dropCollection(collection, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log("Collection deleted");
    }
  });
}


