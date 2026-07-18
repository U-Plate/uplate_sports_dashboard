export function makeId(prefix: string, rand: () => number = Math.random): string {
  return `${prefix}_${rand().toString(36).slice(2, 10)}`;
}

export function makeInviteCode(rand: () => number = Math.random): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += alphabet[Math.floor(rand() * alphabet.length)];
  }
  return code;
}
