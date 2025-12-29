'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useUi } from '@hit/ui-kit';
import { formatDateTime, formatRelativeTime } from '@hit/sdk';
import { History, RefreshCw } from 'lucide-react';
import { useAiTraces } from '../hooks/useAiTraces';
export function AiTraces({ onNavigate }) {
    const { Page, Card, Button, DataTable, Alert, Badge } = useUi();
    const { traces, loading, error, refresh } = useAiTraces({ limit: 100 });
    const navigate = (path) => {
        if (onNavigate)
            onNavigate(path);
        else if (typeof window !== 'undefined')
            window.location.href = path;
    };
    return (_jsxs(Page, { title: "AI Traces", description: "Admin-only per-run telemetry for the AI agent (60-day retention)", actions: _jsx("div", { className: "flex gap-2 items-center", children: _jsxs(Button, { variant: "primary", onClick: refresh, disabled: loading, children: [_jsx(RefreshCw, { size: 16, className: "mr-2" }), "Refresh"] }) }), children: [error && (_jsx(Alert, { variant: "error", title: "Error loading AI traces", children: error.message })), _jsx(Card, { children: _jsx(DataTable, { loading: loading, data: traces, emptyState: {
                        icon: _jsx(History, { size: 48 }),
                        title: 'No traces yet',
                        description: 'Traces will appear here as the AI agent is used.',
                    }, columns: [
                        {
                            key: 'startedAtMs',
                            label: 'When',
                            render: (value) => {
                                const ms = typeof value === 'number' ? value : null;
                                if (!ms)
                                    return _jsx("span", { className: "text-gray-500", children: "\u2014" });
                                const iso = new Date(ms).toISOString();
                                return (_jsxs("div", { className: "flex flex-col", children: [_jsx("span", { className: "font-medium", children: formatRelativeTime(iso) }), _jsx("span", { className: "text-xs text-gray-500", children: formatDateTime(iso) })] }));
                            },
                        },
                        {
                            key: 'requestId',
                            label: 'Request ID',
                            sortable: true,
                            render: (value) => (_jsx("span", { role: "button", tabIndex: 0, className: "font-mono text-blue-600 dark:text-blue-400 hover:underline", onClick: () => navigate(`/admin/ai/traces/${encodeURIComponent(String(value))}`), onKeyDown: (e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        navigate(`/admin/ai/traces/${encodeURIComponent(String(value))}`);
                                    }
                                }, children: String(value) })),
                        },
                        {
                            key: 'user',
                            label: 'User',
                            render: (_, row) => {
                                const u = row?.user;
                                const email = u?.email ? String(u.email) : null;
                                return email ? _jsx("span", { className: "font-medium", children: email }) : _jsx("span", { className: "text-gray-500", children: "\u2014" });
                            },
                        },
                        {
                            key: 'pathname',
                            label: 'Path',
                            render: (value) => value ? _jsx("span", { className: "font-mono text-xs", children: String(value) }) : _jsx("span", { className: "text-gray-500", children: "\u2014" }),
                        },
                        {
                            key: 'durationMs',
                            label: 'Duration',
                            sortable: true,
                            render: (value) => {
                                const ms = typeof value === 'number' ? value : null;
                                if (ms == null)
                                    return _jsx("span", { className: "text-gray-500", children: "\u2014" });
                                const secs = Math.round(ms / 100) / 10;
                                const variant = ms > 30000 ? 'error' : ms > 15000 ? 'warning' : 'success';
                                return _jsxs(Badge, { variant: variant, children: [secs, "s"] });
                            },
                        },
                    ] }) })] }));
}
export default AiTraces;
//# sourceMappingURL=AiTraces.js.map