const express = require("express");
const router = express.Router();

const resetPasswordController = require("../controllers/ResetPasswordController");


router.get("/forgot_password", resetPasswordController.render_forgot_password_template);
router.post('/send_mail', resetPasswordController.send_gmail);
router.get("/reset_password", resetPasswordController.render_reset_password_template);
router.post("/reset_password/:token", resetPasswordController.reset_password);


module.exports = router;