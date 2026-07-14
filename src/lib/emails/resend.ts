import { Resend } from "resend";

/**
 * Resend client + the Institute's three sending identities.
 *
 *  - vault@      → transactional & ceremony (Builder Report, access granted)
 *  - institute@  → the nurture sequence
 *  - don@        → the personal letters inside the nurture sequence
 */
export const resend = new Resend(process.env.RESEND_API_KEY ?? "");

export const FROM = {
  vault:
    process.env.EMAIL_FROM_VAULT ??
    "The Mindset Sauce Institute™ <vault@themindsetsauce.com>",
  institute:
    process.env.EMAIL_FROM_INSTITUTE ??
    "The Mindset Sauce Institute™ <institute@themindsetsauce.com>",
  don: process.env.EMAIL_FROM_DON ?? "Don <don@themindsetsauce.com>",
} as const;

export type Sender = keyof typeof FROM;

/** Replies from any Institute address land on Don's desk. */
export const REPLY_TO = "don@themindsetsauce.com";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
