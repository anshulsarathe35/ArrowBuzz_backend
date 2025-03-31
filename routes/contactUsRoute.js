const express = require("express");
const contactRouter = express.Router();
const { addContact, getContacts } = require("../controllers/contactUsController");

// POST: Add a new contact message
contactRouter.post("/", addContact);

// GET: Get all contact messages
contactRouter.get("/", getContacts);

module.exports = contactRouter;
