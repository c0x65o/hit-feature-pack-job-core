'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo } from 'react';
import { useUi } from '@hit/ui-kit';
import { useAiTrace } from '../hooks/useAiTraces';
import { formatDateTime, formatRelativeTime } from '@hit/sdk';
import { ArrowLeft, RefreshCw, ChevronDown, ChevronRight, MessageSquare, Zap, CheckCircle, Clock, User, Brain, Settings, PlayCircle, FileText, } from 'lucide-react';
function JsonBlock({ value }) {
    const s = JSON.stringify(value, null, 2);
    return (_jsx("pre", { className: "text-xs whitespace-pre-wrap break-words bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded p-3 overflow-auto max-h-[60vh]", children: s }));
}
function formatDuration(ms) {
    if (ms < 1000)
        return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
}
function getEventIcon(name) {
    if (name.startsWith('agent.'))
        return _jsx(User, { size: 16 });
    if (name.startsWith('llm.'))
        return _jsx(Brain, { size: 16 });
    if (name.startsWith('dashboard.'))
        return _jsx(Zap, { size: 16 });
    if (name.startsWith('planning.'))
        return _jsx(Settings, { size: 16 });
    if (name.startsWith('final.'))
        return _jsx(CheckCircle, { size: 16 });
    return _jsx(FileText, { size: 16 });
}
function getEventVariant(name) {
    if (name.includes('error') || name.includes('Error'))
        return 'error';
    if (name.includes('response') || name.includes('success') || name.includes('finish'))
        return 'success';
    if (name.includes('warning') || name.includes('healed'))
        return 'warning';
    if (name.startsWith('llm.'))
        return 'info';
    return 'default';
}
function getEventColor(name) {
    if (name.startsWith('agent.'))
        return 'text-blue-600 dark:text-blue-400';
    if (name.startsWith('llm.'))
        return 'text-purple-600 dark:text-purple-400';
    if (name.startsWith('dashboard.'))
        return 'text-green-600 dark:text-green-400';
    if (name.startsWith('planning.'))
        return 'text-orange-600 dark:text-orange-400';
    if (name.startsWith('final.'))
        return 'text-emerald-600 dark:text-emerald-400';
    return 'text-gray-600 dark:text-gray-400';
}
function formatEventName(name) {
    return name
        .split('.')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' → ');
}
function EventStep({ event, index, prevEvent, isExpanded, onToggle, }) {
    const { Badge } = useUi();
    const duration = prevEvent ? event.t_ms - prevEvent.t_ms : null;
    const variant = getEventVariant(event.name);
    const color = getEventColor(event.name);
    const hasPrompt = event.name === 'llm.request' && event.data?.messages != null;
    const hasResponse = event.name === 'llm.response' && event.data?.content != null;
    const hasToolCall = event.name === 'dashboard.execute.request' && event.data?.toolName != null;
    const hasToolResult = event.name === 'dashboard.execute.response' && event.data?.result != null;
    return (_jsxs("div", { className: "relative", children: [index > 0 && (_jsx("div", { className: "absolute left-5 top-0 w-0.5 h-6 bg-gray-200 dark:bg-gray-700 -translate-y-full" })), _jsxs("div", { className: "relative flex gap-4 group", children: [_jsx("div", { className: `flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors ${isExpanded
                            ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 dark:border-blue-400'
                            : 'bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 group-hover:border-gray-400 dark:group-hover:border-gray-500'}`, children: _jsx("div", { className: color, children: getEventIcon(event.name) }) }), _jsxs("div", { className: "flex-1 min-w-0 pb-6", children: [_jsxs("button", { onClick: onToggle, className: "w-full text-left flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg p-2 -m-2 transition-colors", children: [_jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [_jsx(Badge, { variant: variant, children: formatEventName(event.name) }), duration !== null && (_jsxs("span", { className: "text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1", children: [_jsx(Clock, { size: 12 }), formatDuration(duration)] })), _jsx("span", { className: "text-xs text-gray-400 dark:text-gray-500 font-mono", children: new Date(event.t_ms).toLocaleTimeString() })] }), _jsxs("div", { className: "mt-1 text-sm text-gray-600 dark:text-gray-300", children: [hasPrompt && (_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(MessageSquare, { size: 14 }), "LLM Request (", Array.isArray(event.data?.messages) ? event.data.messages.length : 0, " messages)"] })), hasResponse && (_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Brain, { size: 14 }), "LLM Response", event.data?.durationMs != null && (_jsxs("span", { className: "text-xs text-gray-500", children: ["(", formatDuration(event.data.durationMs), ")"] }))] })), hasToolCall && (_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(PlayCircle, { size: 14 }), "Execute: ", _jsx("code", { className: "text-xs bg-gray-100 dark:bg-gray-800 px-1 rounded", children: String(event.data?.toolName || '') })] })), hasToolResult && (_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(CheckCircle, { size: 14 }), "Tool Result", event.data?.status != null && (_jsxs(Badge, { variant: event.data.status >= 400
                                                                    ? 'error'
                                                                    : event.data.status >= 300
                                                                        ? 'warning'
                                                                        : 'success', className: "ml-1", children: ["HTTP ", String(event.data.status)] }))] })), event.name === 'agent.start' && event.data?.effectiveText != null && (_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(User, { size: 14 }), "\"", String(event.data.effectiveText || '').slice(0, 100), String(event.data.effectiveText || '').length > 100 ? '...' : '', "\""] }))] })] }), _jsx("div", { className: "flex-shrink-0 text-gray-400 dark:text-gray-500", children: isExpanded ? _jsx(ChevronDown, { size: 20 }) : _jsx(ChevronRight, { size: 20 }) })] }), isExpanded && (_jsxs("div", { className: "mt-3 space-y-4 pl-2 border-l-2 border-gray-200 dark:border-gray-700", children: [hasPrompt && (_jsxs("div", { className: "bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800 rounded-lg p-4", children: [_jsxs("div", { className: "flex items-center gap-2 mb-3", children: [_jsx(Brain, { size: 16, className: "text-purple-600 dark:text-purple-400" }), _jsx("h4", { className: "font-semibold text-purple-900 dark:text-purple-100", children: "Prompt Messages" }), event.data?.model != null && (_jsx(Badge, { variant: "info", className: "ml-auto", children: String(event.data.model || '') })), event.data?.jsonMode != null && (_jsx(Badge, { variant: "info", children: "JSON Mode" }))] }), _jsx("div", { className: "space-y-3", children: Array.isArray(event.data?.messages) ? ((event.data?.messages).map((msg, idx) => (_jsxs("div", { className: "bg-white dark:bg-gray-900 rounded border border-purple-100 dark:border-purple-900 p-3", children: [_jsx("div", { className: "flex items-center gap-2 mb-2", children: _jsx(Badge, { variant: msg.role === 'user'
                                                                    ? 'info'
                                                                    : msg.role === 'assistant'
                                                                        ? 'success'
                                                                        : 'default', children: msg.role || 'unknown' }) }), _jsxs("pre", { className: "text-sm whitespace-pre-wrap break-words text-gray-800 dark:text-gray-200", children: [String(msg.content || '').slice(0, 5000), String(msg.content || '').length > 5000 ? '\n\n...(truncated)' : ''] })] }, idx)))) : null })] })), hasResponse && (_jsxs("div", { className: "bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4", children: [_jsxs("div", { className: "flex items-center gap-2 mb-3", children: [_jsx(CheckCircle, { size: 16, className: "text-emerald-600 dark:text-emerald-400" }), _jsx("h4", { className: "font-semibold text-emerald-900 dark:text-emerald-100", children: "LLM Response" }), event.data?.usage != null && typeof event.data.usage === 'object' && event.data.usage !== null ? (_jsxs("div", { className: "ml-auto flex gap-2", children: [event.data.usage.prompt_tokens != null ? (_jsxs(Badge, { variant: "info", children: [String(event.data.usage.prompt_tokens), " prompt tokens"] })) : null, event.data.usage.completion_tokens != null ? (_jsxs(Badge, { variant: "info", children: [String(event.data.usage.completion_tokens), " completion tokens"] })) : null] })) : null] }), _jsxs("pre", { className: "text-sm whitespace-pre-wrap break-words text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-900 rounded border border-emerald-100 dark:border-emerald-900 p-3", children: [String(event.data?.content || '').slice(0, 10000), String(event.data?.content || '').length > 10000 ? '\n\n...(truncated)' : ''] })] })), hasToolCall && (_jsxs("div", { className: "bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg p-4", children: [_jsxs("div", { className: "flex items-center gap-2 mb-3", children: [_jsx(PlayCircle, { size: 16, className: "text-blue-600 dark:text-blue-400" }), _jsx("h4", { className: "font-semibold text-blue-900 dark:text-blue-100", children: "Tool Execution" }), _jsx(Badge, { variant: "info", className: "ml-auto", children: String(event.data?.toolName || '') })] }), event.data?.input != null && (_jsxs("div", { children: [_jsx("div", { className: "text-xs font-medium text-gray-600 dark:text-gray-400 mb-1", children: "Input:" }), _jsx(JsonBlock, { value: event.data.input })] }))] })), hasToolResult && (_jsxs("div", { className: "bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg p-4", children: [_jsxs("div", { className: "flex items-center gap-2 mb-3", children: [_jsx(CheckCircle, { size: 16, className: "text-green-600 dark:text-green-400" }), _jsx("h4", { className: "font-semibold text-green-900 dark:text-green-100", children: "Tool Result" }), event.data?.durationMs != null && (_jsx(Badge, { variant: "info", className: "ml-auto", children: formatDuration(event.data.durationMs) }))] }), event.data?.result !== undefined && event.data?.result !== null && (_jsx("div", { children: _jsx(JsonBlock, { value: event.data.result }) }))] })), !hasPrompt && !hasResponse && !hasToolCall && !hasToolResult && event.data && (_jsxs("div", { className: "bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4", children: [_jsx("h4", { className: "font-semibold text-gray-900 dark:text-gray-100 mb-2", children: "Event Data" }), _jsx(JsonBlock, { value: event.data })] }))] }))] })] })] }));
}
export function AiTraceDetail({ requestId, onNavigate }) {
    const { Page, Card, Button, Alert, Badge } = useUi();
    const { trace, loading, error, refresh } = useAiTrace(requestId);
    const [expandedEvents, setExpandedEvents] = useState(new Set([0])); // Expand first event by default
    const navigate = (path) => {
        if (onNavigate)
            onNavigate(path);
        else if (typeof window !== 'undefined')
            window.location.href = path;
    };
    const events = trace?.events;
    const meta = trace?.meta;
    const startedAtMs = trace?.startedAtMs;
    const endedAtMs = trace?.endedAtMs;
    const durationMs = trace?.durationMs;
    const outcome = trace?.outcome;
    const toggleEvent = (index) => {
        setExpandedEvents((prev) => {
            const next = new Set(prev);
            if (next.has(index)) {
                next.delete(index);
            }
            else {
                next.add(index);
            }
            return next;
        });
    };
    const expandAll = () => {
        if (events) {
            setExpandedEvents(new Set(events.map((_, i) => i)));
        }
    };
    const collapseAll = () => {
        setExpandedEvents(new Set());
    };
    const eventStats = useMemo(() => {
        if (!events)
            return null;
        const stats = {
            llmRequests: 0,
            llmResponses: 0,
            toolCalls: 0,
            errors: 0,
        };
        events.forEach((e) => {
            if (e.name === 'llm.request')
                stats.llmRequests++;
            if (e.name === 'llm.response')
                stats.llmResponses++;
            if (e.name === 'dashboard.execute.request')
                stats.toolCalls++;
            if (e.name.includes('error') || e.name.includes('Error'))
                stats.errors++;
        });
        return stats;
    }, [events]);
    return (_jsxs(Page, { title: "AI Trace", description: requestId, actions: _jsxs("div", { className: "flex gap-2 items-center", children: [_jsxs(Button, { variant: "secondary", onClick: () => navigate('/admin/ai/traces'), children: [_jsx(ArrowLeft, { size: 16, className: "mr-2" }), "Back"] }), _jsxs(Button, { variant: "primary", onClick: refresh, disabled: loading, children: [_jsx(RefreshCw, { size: 16, className: "mr-2" }), "Refresh"] })] }), children: [error && (_jsx(Alert, { variant: "error", title: "Error loading AI trace", children: error.message })), trace && (_jsx(Card, { className: "mb-6", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [startedAtMs && (_jsxs("div", { children: [_jsx("div", { className: "text-xs text-gray-500 dark:text-gray-400 mb-1", children: "Started" }), _jsx("div", { className: "font-medium", children: formatDateTime(new Date(startedAtMs).toISOString()) }), _jsx("div", { className: "text-xs text-gray-500", children: formatRelativeTime(new Date(startedAtMs).toISOString()) })] })), durationMs !== undefined && (_jsxs("div", { children: [_jsx("div", { className: "text-xs text-gray-500 dark:text-gray-400 mb-1", children: "Duration" }), _jsx("div", { className: "font-medium", children: formatDuration(durationMs) })] })), outcome && (_jsxs("div", { children: [_jsx("div", { className: "text-xs text-gray-500 dark:text-gray-400 mb-1", children: "Outcome" }), _jsxs("div", { className: "flex items-center gap-2", children: [outcome.handled ? (_jsx(Badge, { variant: "success", children: "Handled" })) : (_jsx(Badge, { variant: "warning", children: "Not Handled" })), outcome.steps != null && (_jsxs("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: [String(outcome.steps), " step", Number(outcome.steps) === 1 ? '' : 's'] }))] })] })), eventStats && (_jsxs("div", { children: [_jsx("div", { className: "text-xs text-gray-500 dark:text-gray-400 mb-1", children: "Events" }), _jsxs("div", { className: "flex flex-wrap gap-1", children: [_jsxs(Badge, { variant: "info", children: [events?.length || 0, " total"] }), eventStats.llmRequests > 0 && (_jsxs(Badge, { variant: "info", children: [eventStats.llmRequests, " LLM"] })), eventStats.toolCalls > 0 && (_jsxs(Badge, { variant: "info", children: [eventStats.toolCalls, " tools"] })), eventStats.errors > 0 && (_jsxs(Badge, { variant: "error", children: [eventStats.errors, " errors"] }))] })] }))] }) })), meta && (_jsx(Card, { className: "mb-6", children: _jsxs("details", { className: "group", children: [_jsxs("summary", { className: "cursor-pointer flex items-center gap-2 font-medium text-gray-900 dark:text-gray-100 mb-3", children: [_jsx(ChevronRight, { size: 16, className: "group-open:rotate-90 transition-transform" }), "Trace Metadata"] }), _jsx(JsonBlock, { value: meta })] }) })), _jsxs(Card, { children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900 dark:text-gray-100", children: "Event Timeline" }), events && events.length > 0 && (_jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { variant: "secondary", size: "sm", onClick: expandAll, children: "Expand All" }), _jsx(Button, { variant: "secondary", size: "sm", onClick: collapseAll, children: "Collapse All" })] }))] }), loading ? (_jsx("div", { className: "text-center py-8 text-gray-500", children: "Loading trace..." })) : !events || events.length === 0 ? (_jsx("div", { className: "text-center py-8 text-gray-500", children: "No events found in this trace." })) : (_jsx("div", { className: "space-y-0", children: events.map((event, index) => (_jsx(EventStep, { event: event, index: index, prevEvent: index > 0 ? events[index - 1] : null, isExpanded: expandedEvents.has(index), onToggle: () => toggleEvent(index) }, index))) }))] })] }));
}
export default AiTraceDetail;
//# sourceMappingURL=AiTraceDetail.js.map