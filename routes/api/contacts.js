const express = require('express');
const {
  getAllContacts,
  getOneContact,
  createContact,
  deleteContact,
  upContact, 
} = require('../../controlers/contactsControlers');
const { schemas } = require('../../models/contacts');
const validateBody = require('../../utils/decorators/validateBody');
const { isValidId } = require('../../utils/middlewares/isVallidId');

const router = express.Router()

router.get('/', getAllContacts)

router.get('/:contactId', isValidId, getOneContact)

router.post('/', validateBody(schemas.createContactValidationSchema), createContact)

router.delete('/:contactId', isValidId, deleteContact)

router.put('/:contactId', isValidId, validateBody(schemas.updateContactValidationSchema), upContact)

router.patch('/:contactId/favorite', isValidId, validateBody(schemas.contactFavoriteSchema), upContact);

module.exports = router