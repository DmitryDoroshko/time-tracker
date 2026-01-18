import { Router } from "express";
import { EntriesController } from "../controllers/entries.controller";

const router = Router();

router.get("/", EntriesController.getEntries);

router.post("/", EntriesController.createEntry);

export default router;
