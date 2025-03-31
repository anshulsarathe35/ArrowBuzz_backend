const Contact = require("../model/contactUsModel");

const addContact = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newContact = new Contact({ name, email, phone, message });

    await newContact.save();

    res.status(201).json({ message: "Message received successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Error saving message to the database" });
  }
};


const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ error: "Error fetching contact messages" });
  }
};

module.exports = { addContact, getContacts };
