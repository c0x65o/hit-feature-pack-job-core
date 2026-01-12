import type { NextRequest } from 'next/server';
import { checkJobCoreAction } from './require-action';

export type ScopeMode = 'none' | 'own' | 'ldd' | 'any';
export type ScopeVerb = 'read' | 'write' | 'delete';
export type ScopeEntity = 'tasks' | 'executions';

/**
 * Resolve effective scope mode using a tree:
 * - job-core default: job-core.{verb}.scope.{mode}
 * - entity override: job-core.{entity}.{verb}.scope.{mode}
 * - fallback: own
 *
 * Precedence if multiple are granted: most restrictive wins.
 */
export async function resolveJobCoreScopeMode(
  request: NextRequest,
  args: { verb: ScopeVerb; entity?: ScopeEntity }
): Promise<ScopeMode> {
  const { verb, entity } = args;
  
  // Try entity-specific override first (if provided)
  if (entity) {
    const entityPrefix = `job-core.${entity}.${verb}.scope`;
    const modes: ScopeMode[] = ['none', 'own', 'ldd', 'any'];
    
    for (const m of modes) {
      const res = await checkJobCoreAction(request, `${entityPrefix}.${m}`);
      if (res.ok) return m;
    }
  }
  
  // Fall back to global job-core scope
  const globalPrefix = `job-core.${verb}.scope`;
  const modes: ScopeMode[] = ['none', 'own', 'ldd', 'any'];

  for (const m of modes) {
    const res = await checkJobCoreAction(request, `${globalPrefix}.${m}`);
    if (res.ok) return m;
  }

  return 'own';
}
