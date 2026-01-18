import { z } from "zod";

export const entrySchema = z.object({
  date: z.string().datetime(),
  project: z.string().min(1),
  hours: z.number().positive(),
  description: z.string().min(1),
});
