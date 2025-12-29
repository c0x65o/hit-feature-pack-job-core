'use client';
import { useCallback, useEffect, useState } from 'react';
function getAuthHeaders() {
    if (typeof window === 'undefined')
        return {};
    const token = localStorage.getItem('hit_token');
    if (token)
        return { Authorization: `Bearer ${token}` };
    return {};
}
class AiTraceError extends Error {
    constructor(status, detail) {
        super(detail);
        this.name = 'AiTraceError';
        this.status = status;
        this.detail = detail;
    }
}
function getAiProxyBase() {
    // Proxies to the AI module with auth enforced by the dashboard
    return '/api/proxy/ai';
}
async function fetchAi(path) {
    const url = `${getAiProxyBase()}${path}`;
    const res = await fetch(url, {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
        },
    });
    if (!res.ok) {
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('text/html')) {
            throw new AiTraceError(res.status, `Endpoint not found: ${path}`);
        }
        const body = await res.json().catch(() => ({ detail: res.statusText }));
        const detail = body.detail || body.message || `Request failed: ${res.status}`;
        throw new AiTraceError(res.status, detail);
    }
    return res.json();
}
export function useAiTraces(opts = {}) {
    const [traces, setTraces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const refresh = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const limit = opts.limit ?? 50;
            const offset = opts.offset ?? 0;
            const data = await fetchAi(`/hit/ai/traces?limit=${encodeURIComponent(String(limit))}&offset=${encodeURIComponent(String(offset))}`);
            setTraces(Array.isArray(data?.traces) ? data.traces : []);
        }
        catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to load AI traces'));
        }
        finally {
            setLoading(false);
        }
    }, [opts.limit, opts.offset]);
    useEffect(() => {
        refresh();
    }, [refresh]);
    return { traces, loading, error, refresh };
}
export function useAiTrace(requestId) {
    const [trace, setTrace] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const refresh = useCallback(async () => {
        if (!requestId)
            return;
        try {
            setLoading(true);
            setError(null);
            const data = await fetchAi(`/hit/ai/traces/${encodeURIComponent(requestId)}`);
            setTrace(data?.trace ?? null);
        }
        catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to load AI trace'));
        }
        finally {
            setLoading(false);
        }
    }, [requestId]);
    useEffect(() => {
        refresh();
    }, [refresh]);
    return { trace, loading, error, refresh };
}
//# sourceMappingURL=useAiTraces.js.map