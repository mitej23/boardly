import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { users, boards, users_boards } from "../db/schema.js";

// Fetch all boards for a user
const getUserBoards = async (req, res) => {
  try {
    const userId = req.user.id;

    const userBoards = await db
      .select()
      .from(boards)
      .innerJoin(users_boards, eq(users_boards.boardId, boards.id))
      .where(eq(users_boards.userId, userId));

    return res.status(200).json(userBoards);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Fetch a single board by ID
const getBoardById = async (req, res) => {
  try {
    const { id } = req.params;

    const board = await db
      .select()
      .from(boards)
      .where(eq(boards.id, id));

    if (board.length === 0) {
      return res.status(404).json({ message: 'Board not found' });
    }

    return res.status(200).json(board[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Create a new board
const createBoard = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.id;

    const newBoard = await db
      .insert(boards)
      .values({
        name,
        createdBy: userId,
      })
      .returning();

    // Add the user to the users_boards table
    await db.insert(users_boards).values({
      userId,
      boardId: newBoard[0].id,
    });

    return res.status(201).json(newBoard[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Update an existing board
const updateBoard = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const updatedBoard = await db
      .update(boards)
      .set({ name })
      .where(eq(boards.id, id))
      .returning();

    if (updatedBoard.length === 0) {
      return res.status(404).json({ message: 'Board not found' });
    }

    return res.status(200).json(updatedBoard[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a board
const deleteBoard = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedBoard = await db
      .delete(boards)
      .where(eq(boards.id, id))
      .returning();

    if (deletedBoard.length === 0) {
      return res.status(404).json({ message: 'Board not found' });
    }

    return res.status(200).json({ message: 'Board deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export { getUserBoards, getBoardById, createBoard, updateBoard, deleteBoard };
