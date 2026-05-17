import express from "express";
import {
createSession,
getActiveSessions,
getMyRecentSessions,
getSessionById,
joinSession,
endSession
} from "../controllers/sessionController.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router(); 

// Create a new session
router.post("/", protectRoute, createSession);

// Get active sessions
router.get("/active", protectRoute, getActiveSessions);

// Get past sessions
router.get("/my-recent", protectRoute, getMyRecentSessions);

// Get specific session by ID
router.get("/:id", protectRoute, getSessionById);

// Join a session
router.post("/:id/join", protectRoute, joinSession);

// End a session
router.post("/:id/end", protectRoute, endSession);

export default router;