// src/validators.js
import { z } from 'zod';

// Šema za pojedinačno ime igrača (koristi se prije početka meča)
export const playerNameSchema = z.string()
  .trim()
  .min(2, "Ime mora imati najmanje 2 znaka.")
  .max(12, "Ime može imati najviše 12 znakova.");

// Šema za cijeli profil igrača u localStorageu
export const profileSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(1, "Ime ne smije biti prazno.").max(12, "Maksimalno 12 znakova."),
  avatar: z.string().min(1),
  bio: z.string().max(40, "Status može imati najviše 40 znakova.").optional().default(''),
  points: z.number().min(0, "Bodovi ne mogu biti negativni."),
  wins: z.number().int().min(0),
  losses: z.number().int().min(0),
  achievements: z.array(z.string()).optional().default([]),
  unlockedAvatars: z.array(z.string()).optional().default([]),
  matchHistory: z.array(z.any()).optional().default([]),
  activeBoard: z.string().optional(),
  unlockedBoards: z.array(z.string()).optional()
}).passthrough(); // passthrough() čuva ostala polja da ih Zod ne izbriše

// Šema za provjeru unosa kod prijave i registracije
export const authSchema = z.object({
  email: z.string().email("Unesite valjanu e-mail adresu."),
  password: z.string().min(6, "Lozinka mora imati najmanje 6 znakova.")
});