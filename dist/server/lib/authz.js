import { extractUserFromRequest } from '../auth';
export function getAuthContext(request) {
    const user = extractUserFromRequest(request);
    if (user)
        return { kind: 'user', user };
    return null;
}
//# sourceMappingURL=authz.js.map