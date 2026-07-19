/**
 * The seeded coach account `/demo` signs into.
 *
 * Single source of truth so the auto-login route and the hint printed on the
 * sign-in form can't drift apart. Matches a credential in mockSeed.
 */
export const DEMO_COACH = {
  email: 'jordan@uplate.dev',
  password: 'coachdemo',
} as const;
