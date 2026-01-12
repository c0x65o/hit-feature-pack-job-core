import type { NextRequest } from 'next/server';
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
export declare function resolveJobCoreScopeMode(request: NextRequest, args: {
    verb: ScopeVerb;
    entity?: ScopeEntity;
}): Promise<ScopeMode>;
//# sourceMappingURL=scope-mode.d.ts.map