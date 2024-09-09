import jwt from 'jsonwebtoken'
import { db } from '../db/index.js';
import { users, users_boards } from '../db/schema.js';
import { and, eq } from 'drizzle-orm';

export const checkUserBoardAccess = async (req, res, next) => {
  const userId = req.user.id; // Assuming user ID is available in the req.user object
  const boardId = req.body.id || req.params.id; // Assuming board ID is passed as a URL parameter

  try {
    const result = await db.select().from(users_boards)
      .where(and(eq(userId, users_boards.userId), eq(boardId, users_boards.boardId)))

    if (result.length > 0) {
      next();
    } else {
      res.status(403).json({ message: 'Forbidden: You do not have access to this board' });
    }
  } catch (error) {
    console.error('Error checking board access:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}