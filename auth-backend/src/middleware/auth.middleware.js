import jwt from 'jsonwebtoken'
import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { generateAccessToken } from '../utils/tokenGenerator.js';

export const verifyJWT = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    if (!token) {
      return res.status(401).json({ "message": "Unauthorized request" })
    }

    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
      let temp = await db.select({ id: users.id, name: users.name, email: users.email }).from(users).where(eq(users.id, decodedToken.id))
      req.user = temp[0]
      next()
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        // Token has expired, attempt to refresh
        const refreshToken = req.cookies?.refreshToken
        console.log(refreshToken)
        if (!refreshToken) {
          return res.status(401).json({ "message": "Refresh token not found" })
        }

        try {
          const decodedRefreshToken = jwt.verify(refreshToken, process.env.JWT_SECRET)
          const newAccessToken = await generateAccessToken({ id: decodedRefreshToken.id })

          // Set new access token in cookie
          res.cookie('accessToken', newAccessToken, { httpOnly: true, secure: true })

          // Fetch user data and proceed with the request
          let temp = await db.select({ id: users.id, name: users.name, email: users.email }).from(users).where(eq(users.id, decodedRefreshToken.id))
          req.user = temp[0]
          next()
        } catch (refreshError) {
          console.log(refreshError)
          return res.status(401).json({ "message": "Invalid refresh token" })
        }
      } else {
        throw error
      }
    }

  } catch (error) {
    console.log(error)
    return res.status(401).json({ "message": "Invalid Access Token" })
  }
}