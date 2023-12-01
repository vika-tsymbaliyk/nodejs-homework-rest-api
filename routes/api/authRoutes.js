const express = require('express');
const authControler = require('../../controlers/usersControlers');

const validateBody = require('../../utils/decorators/validateBody');
const userValidationSchemas = require('../../utils/validation/userValidationSchemas')

const authRouter = express.Router()

authRouter.post("/register", validateBody(userValidationSchemas.registerSchema), authControler.signup)

module.exports = authRouter