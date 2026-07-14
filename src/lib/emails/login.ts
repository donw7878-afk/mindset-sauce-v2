import { vaultEmail, overline, heading, p, codeSeal, firstNameOf } from "./template";

/**
 * Sent from vault@ when a Builder asks The Door for their combination.
 * Ten-minute, single-use six-digit code.
 */
export function combinationEmail(opts: {
  name: string;
  code: string;
}): { subject: string; html: string } {
  const first = firstNameOf(opts.name || "Builder");
  const spaced = `${opts.code.slice(0, 3)} ${opts.code.slice(3)}`;

  const body = [
    overline("The Door"),
    heading(`${first}, the vault recognizes you.`),
    p(`Enter this combination at The Door. It turns once, and it expires in ten minutes.`),
    codeSeal(spaced),
    p(
      `If you didn't request this, no action is needed — the combination expires on its own and the vault stays sealed.`
    ),
  ].join("");

  return {
    subject: `Your combination — The Door is open`,
    html: vaultEmail({
      preheader: "Six digits, ten minutes, one turn.",
      body,
      footerNote: "Sent because this address asked to enter the Builder Portal.",
    }),
  };
}
