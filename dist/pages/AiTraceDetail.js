'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useUi } from '@hit/ui-kit';
import { useAiTrace } from '../hooks/useAiTraces';
import { ArrowLeft, RefreshCw } from 'lucide-react';
function JsonBlock({ value }) {
    const s = JSON.stringify(value, null, 2);
    return (_jsx("pre", { className: "text-xs whitespace-pre-wrap break-words bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded p-3 overflow-auto max-h-[60vh]", children: s }));
}
export function AiTraceDetail({ requestId, onNavigate }) {
    const { Page, Card, Button, Alert } = useUi();
    const { trace, loading, error, refresh } = useAiTrace(requestId);
    const navigate = (path) => {
        if (onNavigate)
            onNavigate(path);
        else if (typeof window !== 'undefined')
            window.location.href = path;
    };
    const events = trace?.events;
    const meta = trace?.meta;
    return (_jsxs(Page, { title: "AI Trace", description: requestId, actions: _jsxs("div", { className: "flex gap-2 items-center", children: [_jsxs(Button, { variant: "secondary", onClick: () => navigate('/admin/ai/traces'), children: [_jsx(ArrowLeft, { size: 16, className: "mr-2" }), "Back"] }), _jsxs(Button, { variant: "primary", onClick: refresh, disabled: loading, children: [_jsx(RefreshCw, { size: 16, className: "mr-2" }), "Refresh"] })] }), children: [error && (_jsx(Alert, { variant: "error", title: "Error loading AI trace", children: error.message })), _jsx(Card, { children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("div", { className: "text-sm font-medium mb-2", children: "Meta" }), _jsx(JsonBlock, { value: meta ?? {} })] }), _jsxs("div", { children: [_jsx("div", { className: "text-sm font-medium mb-2", children: "Events" }), _jsx(JsonBlock, { value: events ?? [] })] })] }) })] }));
}
export default AiTraceDetail;
//# sourceMappingURL=AiTraceDetail.js.map