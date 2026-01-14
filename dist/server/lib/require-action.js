import { checkActionPermission, requireActionPermission, } from '@hit/feature-pack-auth-core/server/lib/action-check';
export async function checkJobCoreAction(request, actionKey) {
    return checkActionPermission(request, actionKey, { logPrefix: 'Job-Core' });
}
export async function requireJobCoreAction(request, actionKey) {
    return requireActionPermission(request, actionKey, { logPrefix: 'Job-Core' });
}
//# sourceMappingURL=require-action.js.map