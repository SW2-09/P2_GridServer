export { adminRouter };

import mongoose from "mongoose";
import express from "express";
import { Buyer } from "../models/Buyer.js";

const adminRouter = express.Router();

adminRouter.post("/purge", (req, res) => {
    deleteCollection(req.body.collection);
    res.json({
        message:
            "Purged '" + req.body.collection + "' collection from database: ",
    });
});

adminRouter.post("/lookup", (req, res) => {
    getItems(req.body.collection).then((items) => {
        console.log(items);
        res.json({ message: items });
    });
});

async function deleteCollection(collection) {
    console.log("Deleting all '" + collection + "' from database");

    await mongoose.connection.db.dropCollection(
        collection,
        function (err, result) {
            if (err) {
                console.log(err);
            } else {
                console.log("Collection deleted");
            }
        }
    );
}

async function getItems(collection) {
    const Items = await mongoose.connection.db
        .collection(collection)
        .find({})
        .toArray();
    return Items;
}
