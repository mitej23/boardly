import { Router } from 'express'
import { googleOAuthHandler, loginUser, logoutUser, refreshAccessToken, registerUser } from '../controller/user.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';

const router = Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/logout', verifyJWT, logoutUser)
router.post("/refresh-token", refreshAccessToken)
router.get("/google/callback", googleOAuthHandler)

export default router