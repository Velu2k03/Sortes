import { z } from "zod";

export const CardSchema = z.object({
  id: z.string(),
  name: z.string(),
  arcana: z.enum(["Major", "Minor"]),
  suit: z.enum(["Wands", "Cups", "Swords", "Pentacles"]).nullable(),
  number: z.number().nullable(),
  keywords: z.object({
    upright: z.array(z.string()),
    reversed: z.array(z.string()),
  }),
  meaning: z.object({
    upright: z.string(),
    reversed: z.string(),
  }),
  image: z.string(),
});

export type Card = z.infer<typeof CardSchema>;

export const DeckSchema = z.array(CardSchema);
