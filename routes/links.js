const express = require("express");
const router = express.Router();

const linksController = require("../controllers/links");

router.get("/", linksController.get);
router.get("/:id", linksController.redirect);
router.post("/", linksController.post);

module.exports = router;
