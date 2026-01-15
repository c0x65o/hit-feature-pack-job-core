import { NextRequest } from 'next/server';
import { extractUserFromRequest, type User } from '../auth';

export type AuthContext =
  | { kind: 'user'; user: User };

export function getAuthContext(request: NextRequest): AuthContext | null {
  const user = extractUserFromRequest(request);
  if (user) return { kind: 'user', user };

  return null;
}
