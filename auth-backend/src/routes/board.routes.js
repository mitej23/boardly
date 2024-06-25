import { Router } from 'express';
import { getUserBoards, getBoardById, createBoard, updateBoard, deleteBoard, addUserToBoard } from '../controller/board.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';
import { checkUserBoardAccess } from "../middleware/board.middleware.js"

const router = Router();

// Fetch all boards for the authenticated user
router.get('/', verifyJWT, getUserBoards);

// Fetch a single board by ID
router.get('/:id', verifyJWT, checkUserBoardAccess, getBoardById);

// Create a new board
router.post('/createNewBoard', verifyJWT, createBoard);

// Update an existing board
router.post('/updateBoard', verifyJWT, checkUserBoardAccess, updateBoard);

// Delete a board
router.post('/deleteBoard', verifyJWT, checkUserBoardAccess, deleteBoard);

// Join board to collab
// get board id -> if not a user then send him to signup or login and redirect him to board
router.post("/share", verifyJWT, addUserToBoard)

export default router;