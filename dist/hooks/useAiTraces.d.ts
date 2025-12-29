export type AiTraceSummary = {
    requestId: string;
    startedAtMs?: number | null;
    endedAtMs?: number | null;
    durationMs?: number | null;
    pathname?: string | null;
    user?: {
        userId: string;
        email: string;
        roles: string[];
    } | null;
    health?: {
        status?: 'ok' | 'auto_healed' | 'error';
        hadErrors?: boolean;
        non2xxCount?: number;
        http4xxCount?: number;
        http5xxCount?: number;
        llmErrorCount?: number;
        lastHttpStatus?: number | null;
    } | null;
};
export type AiTraceDetail = Record<string, unknown>;
export declare function useAiTraces(opts?: {
    limit?: number;
    offset?: number;
}): {
    traces: AiTraceSummary[];
    loading: boolean;
    error: Error | null;
    refresh: () => Promise<void>;
};
export declare function useAiTrace(requestId: string | null): {
    trace: AiTraceDetail | null;
    loading: boolean;
    error: Error | null;
    refresh: () => Promise<void>;
};
//# sourceMappingURL=useAiTraces.d.ts.map