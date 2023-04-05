const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require('../config/authentication')


router.get('/',(req,res)=>{
    res.render('welcome')
})

router.get('/worker', ensureAuthenticated,(req,res)=>{
    res.render('worker',{
        name: req.user.name,
        tasks_computed: req.user.tasks_computed,
    })
})
module.exports = router;