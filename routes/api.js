const express = require("express");
const router = express.Router();

const apiController = require("../controllers/ApiController");
const permisstionController = require("../controllers/PermisstionController");


router.get("/newsfeed", permisstionController.checkLogin, apiController.newsfeed);
router.get("/like/:id/:username", permisstionController.checkLogin, apiController.like);
router.get("/comment/:id", permisstionController.checkLogin, apiController.getComment);
router.post("/comment/:id/:username", permisstionController.checkLogin, apiController.comment);


module.exports = router;