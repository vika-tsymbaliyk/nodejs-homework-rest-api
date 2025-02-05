const express = require('express');
const authControler = require('../../controlers/usersControlers');

const validateBody = require('../../utils/decorators/validateBody');
const userValidationSchemas = require('../../utils/validation/userValidationSchemas')
const authenticate = require('../../utils/middlewares/authenticate')
const upload = require('../../utils/middlewares/upload')

const authRouter = express.Router()

authRouter.post("/register",  validateBody(userValidationSchemas.registerSchema), authControler.signup)
authRouter.get("/verify/:verificationToken", authControler.verifyEmail)
authRouter.post('/verify', validateBody(userValidationSchemas.emailSchema), authControler.resendVerifyEmail)
authRouter.post("/login", validateBody(userValidationSchemas.loginSchema), authControler.signin)
authRouter.get("/current", authenticate, authControler.getCurrent )
authRouter.post('/logout', authenticate, authControler.logout)
authRouter.patch('/avatars', authenticate, upload.single('avatar'), authControler.updateAvatar)


module.exports = authRouter