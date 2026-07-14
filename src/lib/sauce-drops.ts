/**
 * The Sauce Drop™ — one line of the house philosophy per day,
 * chosen deterministically by date so every Builder sees the same
 * drop on the same day and it refreshes at midnight.
 */

export const SAUCE_DROPS: string[] = [
  "Everything worth having is on the other side of seeing it through.",
  "Motivation is weather. Systems are climate.",
  "The wall you keep hitting is not in your way. It is the way.",
  "What is recorded, persists. What persists, compounds.",
  "You don't rise to the goal. You settle to the identity.",
  "Repetition is not review. Repetition is installation.",
  "The soil determines the harvest — prepare the ground first.",
  "Discipline is remembering what you want most, not what you want now.",
  "A kept promise to yourself is worth more than a perfect plan.",
  "Change the soil. Everything changes.",
  "The body believes before the world confirms.",
  "Your words are not describing your life. They are creating it.",
  "Environment beats willpower every day it's allowed to.",
  "Small, kept promises compound into a different person.",
  "If you want to be somewhere on time, leave. — Papa",
  "You've collected pieces your whole life. This is where they interlock.",
  "The vault doesn't need you to be different. It was built to make you different.",
  "Information decays in days. Structure you walk through becomes yours.",
  "Starting proves nothing. The Close is where identity is minted.",
  "Don't count the days you missed. Mark the one in front of you.",
  "Feel the future until the present adjusts.",
  "The obstacle is always the exact skill your next identity requires.",
  "Nobody drifts into the person they meant to become.",
  "One chapter, fully done, beats three chapters skimmed.",
  "The streak is not the point. The person who keeps it is.",
  "Assume it. See it. Feel it. Live it.",
  "Your mind is always rehearsing something. Choose the script.",
  "Builders don't find time. They attach the work to a life in motion.",
  "The fire that survives doubt becomes destiny.",
  "Seeing it through — to the end. That was always the secret.",
];

/** Deterministic pick by calendar day. */
export function sauceDropFor(date = new Date()): string {
  const start = Date.UTC(date.getFullYear(), 0, 0);
  const day = Math.floor((Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - start) / 86400000);
  return SAUCE_DROPS[(day + date.getFullYear()) % SAUCE_DROPS.length];
}
