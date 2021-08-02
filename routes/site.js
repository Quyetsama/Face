const express = require("express");
const jwt = require('jsonwebtoken');
const router = express.Router();

const AccountSchema = require("../models/account");

const newsFeedController = require("../controllers/NewsFeedController");
const siteController = require("../controllers/SiteController");
const permisstionController = require("../controllers/PermisstionController");



router.get("/register", siteController.register);
router.post("/register", siteController.registerSubmit);
router.get("/login", siteController.login);
// router.post("/login", siteController.loginSubmit);
router.post('/login', siteController.loginPassport);
router.get("/logout", siteController.logout);


router.post("/poststatus", permisstionController.checkLogin, newsFeedController.postStatus);
router.get("/", permisstionController.checkLogin, newsFeedController.home);




module.exports = router;