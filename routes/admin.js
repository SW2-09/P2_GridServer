export { adminRouter };

import express from "express";

const adminRouter = express.Router();

adminRouter.get("/", (req, res) => {
  res.send("DAMN");
});

const button = document.getElementById('purge');
const collection = document.getElementById('collection');

    button.addEventListener('click', () => {
        console.log(collection.value);
        fetch('/admin/purge', {
             method: 'POST',
             
         })
    })
