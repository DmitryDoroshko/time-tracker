import { Request, Response } from "express";
import { EntriesService } from "../services/entries.service";
import { entrySchema } from "../validators/entry.schema";

export class EntriesController {
  static getEntries = async (_req: Request, res: Response) => {
    const entries = await EntriesService.getEntries();
    res.json(entries);
  };

  static createEntry = async (req: Request, res: Response) => {
    const parsed = entrySchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json(parsed.error);
    }

    try {
      const entry = await EntriesService.createEntry({
        ...parsed.data,
        date: new Date(parsed.data.date),
      });

      res.status(201).json(entry);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  };
}