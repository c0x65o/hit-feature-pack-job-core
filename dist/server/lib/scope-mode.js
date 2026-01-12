import { checkJobCoreAction } from './require-action';
/**
 * Resolve effective scope mode using a tree:
 * - job-core default: job-core.{verb}.scope.{mode}
 * - entity override: job-core.{entity}.{verb}.scope.{mode}
 * - fallback: own
 *
 * Precedence if multiple are granted: most restrictive wins.
 */
export async function resolveJobCoreScopeMode(request, args) {
    const { verb, entity } = args;
    // Try entity-specific override first (if provided)
    if (entity) {
        const entityPrefix = `job-core.${entity}.${verb}.scope`;
        const modes = ['none', 'own', 'ldd', 'any'];
        for (const m of modes) {
            const res = await checkJobCoreAction(request, `${entityPrefix}.${m}`);
            if (res.ok)
                return m;
        }
    }
    // Fall back to global job-core scope
    const globalPrefix = `job-core.${verb}.scope`;
    const modes = ['none', 'own', 'ldd', 'any'];
    for (const m of modes) {
        const res = await checkJobCoreAction(request, `${globalPrefix}.${m}`);
        if (res.ok)
            return m;
    }
    return 'own';
}
//# sourceMappingURL=scope-mode.js.map