import { Router } from 'express';
import { getUserBoards, getBoardById, createBoard, updateBoard, deleteBoard } from '../controller/board.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';

const router = Router();

// Fetch all boards for the authenticated user
router.get('/', verifyJWT, getUserBoards);

// Fetch a single board by ID
router.get('/:id', verifyJWT, getBoardById);

// Create a new board
router.post('/createNewBoard', verifyJWT, createBoard);

// Update an existing board
router.post('/updateBoard/:id', verifyJWT, updateBoard);

// Delete a board
router.post('/deleteBoard/:id', verifyJWT, deleteBoard);

export default router;
