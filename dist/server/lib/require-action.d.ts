import type { ActionCheckResult } from '@hit/feature-pack-auth-core/server/lib/action-check';
export declare function checkJobCoreAction(request: Request, actionKey: string): Promise<ActionCheckResult>;
export declare function requireJobCoreAction(request: Request, actionKey: string): Promise<Response | null>;
//# sourceMappingURL=require-action.d.ts.map