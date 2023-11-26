const express = require('express');
const {
  getAllContacts,
  getOneContact,
  createContact,
  deleteContact,
  upContact } = require('../../controlers/contactsControlers');
  
const isEmptyBody = require('../../utils/middlewares/isEmptyBody');


const router = express.Router()

router.get('/', getAllContacts)

router.get('/:contactId', getOneContact)

router.post('/', isEmptyBody, createContact)

router.delete('/:contactId', deleteContact)

router.put('/:contactId', isEmptyBody, upContact)

module.exports = router