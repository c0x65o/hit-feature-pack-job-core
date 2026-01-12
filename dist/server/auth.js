function base64UrlDecode(input) {
    let s = input.replace(/-/g, '+').replace(/_/g, '/');
    const pad = s.length % 4;
    if (pad) {
        if (pad === 1) {
            throw new Error('Invalid base64url string!');
        }
        s += new Array(5 - pad).join('=');
    }
    return atob(s + pad);
}
/**
 * Extract user from JWT token in cookies or Authorization header
 * Also checks x-user-id header (set by proxy/middleware in production)
 */
export function extractUserFromRequest(request) {
    // Check for token in cookie first
    let token = request.cookies.get('hit_token')?.value;
    // Fall back to Authorization header
    if (!token) {
        const authHeader = request.headers.get('authorization');
        if (authHeader?.startsWith('Bearer ')) {
            token = authHeader.slice(7);
        }
    }
    // Always try to extract from JWT first (so we keep roles/groups/email when present)
    if (token) {
        try {
            const parts = token.split('.');
            if (parts.length !== 3)
                return null;
            const payload = JSON.parse(base64UrlDecode(parts[1]));
            // Check expiration
            if (payload.exp && payload.exp * 1000 < Date.now()) {
                return null;
            }
            const groupIdsRaw = payload.groupIds ?? payload.group_ids ?? payload.group_ids_list ?? payload.groups ?? payload.group_ids_csv;
            const groups = Array.isArray(groupIdsRaw)
                ? groupIdsRaw.map((g) => String(g)).map((g) => g.trim()).filter(Boolean)
                : typeof groupIdsRaw === 'string'
                    ? groupIdsRaw
                        .split(',')
                        .map((g) => g.trim())
                        .filter(Boolean)
                    : [];
            const email = payload.email ||
                payload.preferred_username ||
                payload.upn ||
                payload.unique_name ||
                '';
            // Normalize roles (string | list | undefined)
            const rolesRaw = payload.roles ?? payload.role ?? [];
            const roles = Array.isArray(rolesRaw)
                ? rolesRaw.map((r) => String(r)).map((r) => r.trim()).filter(Boolean)
                : typeof rolesRaw === 'string'
                    ? [rolesRaw.trim()].filter(Boolean)
                    : [];
            return {
                sub: payload.sub || email || '',
                email: email || '',
                roles: roles.length > 0 ? roles : undefined,
            };
        }
        catch (e) {
            // Invalid token format
            console.warn('[job-core] Failed to parse JWT token:', e);
        }
    }
    // Fallback: check x-user-id header (set by proxy/middleware)
    const userId = request.headers.get('x-user-id');
    const userEmail = request.headers.get('x-user-email');
    if (userId || userEmail) {
        return {
            sub: userId || userEmail || '',
            email: userEmail || userId || '',
        };
    }
    return null;
}
//# sourceMappingURL=auth.js.map