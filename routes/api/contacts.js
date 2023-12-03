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
const authenticate = require('../../utils/middlewares/authenticate')

const contactsRouter = express.Router()

contactsRouter.use(authenticate)

contactsRouter.get('/', getAllContacts)

contactsRouter.get('/:contactId', isValidId, getOneContact)

contactsRouter.post('/', validateBody(schemas.createContactValidationSchema), createContact)

contactsRouter.delete('/:contactId', isValidId, deleteContact)

contactsRouter.put('/:contactId', isValidId, validateBody(schemas.updateContactValidationSchema), upContact)

contactsRouter.patch('/:contactId/favorite', isValidId, validateBody(schemas.contactFavoriteSchema), upContact);

module.exports = contactsRouter