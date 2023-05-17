export { adminRouter };

import mongoose from "mongoose";
import express from "express";
import { serverdata } from "../server.js";

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
            "Purged '" + req.body.collection + "' collection from database: ",
    });
});


adminRouter.post("/updateone", (req, res) => {
    updateone(req.body.collection, req.body.name);
});

/**
 * Deletes a specifiedd collection from the MongoDB database
 *
 * @param {string} collection - The name of the collection to be deleted
 * @throws Will throw an error if the deletion fails.
 */
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

/**
 * Uses MongoDB deleteOne to delete a specific target in the collection.
 *
 * @param {string} collection - The name of the collection to delete from.
 * @param {string} name - If collection is `workers` the workerID should be specified.
 * Else this refers to the name of the target to be deleted.
 * @throws Logs an error if the deletion fails.
 */
async function deleteone(collection, name) {
    console.log("Deleting:" + name + " from " + collection);
    const collections = mongoose.connection.db.collection(collection);

    if (collection === "workers") {
        await collections.deleteOne({ workerId: name }, function (err, result) {
            if (err) {
                console.log(err);
            }
        });
    } else {
        await collections.deleteOne({ name: name }, function (err, result) {
            if (err) {
                console.log(err);
            }
        });
    }
}




adminRouter.get("/sessiondata", async (req, res) => {
    console.log("Sending session data to client");
    res.json({ serverdata });
});

adminRouter.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
});


adminRouter.post("/clearjobs", async (req, res) => {
    console.log("Clearing jobs");
    await getItemJobArray(req.body.collection, req.body.name);
    res.json({ message: "Jobs cleared" });
}
);

adminRouter.post("/resetWork", async (req, res) => {
    console.log("Resetting work");
    await resetWork();
    res.json({ message: "Work reset" });
} );


/**
 * Gets all data from a collection in the MongoDB database.
 *
 * @param {string} collection - The name of the collection to retrieve data.
 * @returns {array} array of items from the collection.
 */
async function getItems(collection) {
    const Items = await mongoose.connection.db
        .collection(collection)
        .find({})
        .toArray();
    return Items;
}

async function getItemJobArray(collection, name) {
    const Items = await mongoose.connection.db
        .collection(collection)
        .updateMany(
            {name: name},
            {$set: {jobs_array: []}})
    return Items;
}

async function resetWork() {
    await mongoose.connection.db
        .collection("users")
        .updateMany(
            {},
            {$set: {tasks_computed: 0}})
    await mongoose.connection.db
        .collection("workers")
        .updateMany(
            {},
            {$set: {jobs_computed: 0}})
}

