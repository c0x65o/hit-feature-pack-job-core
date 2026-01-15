import { resolveScopeMode } from '@hit/feature-pack-auth-core/server/lib/scope-mode';
/**
 * Resolve effective scope mode using a tree:
 * - job-core default: job-core.{verb}.scope.{mode}
 * - entity override: job-core.{entity}.{verb}.scope.{mode}
 * - fallback: own
 *
 * Precedence if multiple are granted: most restrictive wins.
 */
export async function resolveJobCoreScopeMode(request, args) {
    const m = await resolveScopeMode(request, {
        pack: 'job-core',
        verb: args.verb,
        entity: args.entity,
        supportedModes: ['none', 'all'],
        // If nothing is configured, lock system entities down by default.
        // Admins will still get access via auth-core template defaults in action evaluation.
        fallbackMode: 'none',
        logPrefix: 'Job-Core',
    });
    return (m === 'all' ? 'all' : 'none');
}
//# sourceMappingURL=scope-mode.js.map