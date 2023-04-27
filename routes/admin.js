export { adminRouter };

import mongoose from "mongoose";
import express from "express";
import { serverdata } from "../server.js";
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
        res.json({ message: items });
    });
});

adminRouter.post("/deleteone", (req, res) => {
    deleteone(req.body.collection, req.body.name);
    res.json({
        message:
            "Purged '" + req.body.collection + "' collection from database: ",  });});

adminRouter.post("/updateone", (req, res) => {
    updateone(req.body.collection, req.body.name);
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

async function deleteone(collection, name) {
    console.log("Deleting:" + name + " from " + collection);
    const collections = mongoose.connection.db.collection(collection);
    await collections.deleteOne(
        {name: name},
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

adminRouter.get("/sessiondata", async (req, res) => {
    console.log("Sending session data to client")
    res.json({ serverdata });
    
});