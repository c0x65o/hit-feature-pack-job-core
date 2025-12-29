'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CheckCircle, XCircle, Clock, AlertCircle, ListChecks, CirclePlay, RefreshCw } from 'lucide-react';
import { useUi, useThemeTokens } from '@hit/ui-kit';
import { formatDateTime } from '@hit/sdk';
import { useTaskExecution } from '../hooks/useTasks';
export function TaskExecution({ name, id, onNavigate }) {
    const taskName = name;
    const executionId = id;
    const { Page, Card, Button, Badge, Alert, Spinner } = useUi();
    const { colors, spacing, radius, textStyles: ts } = useThemeTokens();
    const { execution, loading, error, refresh } = useTaskExecution(taskName, executionId);
    const navigate = (path) => {
        if (onNavigate) {
            onNavigate(path);
        }
        else if (typeof window !== 'undefined') {
            window.location.href = path;
        }
    };
    if (loading) {
        return (_jsx(Page, { title: "Execution Details", children: _jsx(Spinner, {}) }));
    }
    if (error || !execution) {
        return (_jsx(Page, { title: "Execution Details", children: _jsx(Alert, { variant: "error", title: "Error loading execution", children: error?.message || 'Execution not found' }) }));
    }
    const getStatusIcon = (status) => {
        switch (status) {
            case 'success':
                return _jsx(CheckCircle, { className: "text-green-500", size: 20 });
            case 'failed':
                return _jsx(XCircle, { className: "text-red-500", size: 20 });
            case 'running':
                return _jsx(Clock, { className: "text-yellow-500", size: 20 });
            default:
                return _jsx(AlertCircle, { className: "text-gray-500", size: 20 });
        }
    };
    const getStatusBadge = (status) => {
        switch (status) {
            case 'success':
                return _jsx(Badge, { variant: "success", children: "Success" });
            case 'failed':
                return _jsx(Badge, { variant: "error", children: "Failed" });
            case 'running':
                return _jsx(Badge, { variant: "warning", children: "Running" });
            case 'pending':
                return _jsx(Badge, { variant: "default", children: "Pending" });
            default:
                return _jsx(Badge, { variant: "default", children: status });
        }
    };
    const breadcrumbs = [
        { label: 'Jobs', href: '/admin/tasks', icon: _jsx(ListChecks, { size: 14 }) },
        { label: taskName, href: `/admin/tasks/${encodeURIComponent(taskName)}`, icon: _jsx(CirclePlay, { size: 14 }) },
        { label: `Execution ${execution.id.slice(0, 8)}` },
    ];
    return (_jsxs(Page, { title: "Execution Details", breadcrumbs: breadcrumbs, onNavigate: navigate, actions: _jsxs(Button, { variant: "secondary", onClick: refresh, disabled: loading, children: [_jsx(RefreshCw, { size: 16, style: { marginRight: spacing.sm } }), "Refresh"] }), children: [_jsx("div", { style: { marginBottom: spacing.lg }, children: _jsx(Card, { children: _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: spacing.md }, children: [getStatusIcon(execution.status), _jsxs("div", { style: { flex: 1 }, children: [_jsxs("h3", { style: { fontSize: ts.heading3.fontSize, fontWeight: ts.heading3.fontWeight, color: colors.text.primary, margin: 0 }, children: ["Execution ", execution.id.slice(0, 8)] }), _jsxs("p", { style: { fontSize: ts.bodySmall.fontSize, color: colors.text.secondary, margin: `${spacing.xs} 0 0 0` }, children: ["Task: ", execution.task_name] })] }), _jsx("div", { style: { textAlign: 'right' }, children: getStatusBadge(execution.status) })] }) }) }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: spacing.md, marginBottom: spacing.lg }, children: [_jsxs(Card, { children: [_jsx("h3", { style: { fontSize: ts.heading3.fontSize, fontWeight: ts.heading3.fontWeight, color: colors.text.primary, marginBottom: spacing.md }, children: "Execution Information" }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: spacing.md }, children: [_jsxs("div", { children: [_jsx("div", { style: { fontSize: ts.bodySmall.fontSize, color: colors.text.secondary, marginBottom: spacing.xs }, children: "Status" }), _jsx("div", { children: getStatusBadge(execution.status) })] }), _jsxs("div", { children: [_jsx("div", { style: { fontSize: ts.bodySmall.fontSize, color: colors.text.secondary, marginBottom: spacing.xs }, children: "Execution Type" }), _jsx("div", { children: _jsx(Badge, { variant: execution.execution_type === 'simple' ? 'info' : 'warning', children: execution.execution_type }) })] }), _jsxs("div", { children: [_jsx("div", { style: { fontSize: ts.bodySmall.fontSize, color: colors.text.secondary, marginBottom: spacing.xs }, children: "Triggered By" }), _jsx("div", { style: { fontSize: ts.bodySmall.fontSize }, children: execution.triggered_by === 'cron' ? (_jsx(Badge, { variant: "info", children: "Cron Schedule" })) : execution.triggered_by === 'system' || execution.triggered_by === 'manual' ? (_jsx(Badge, { variant: "default", children: "Manual" })) : execution.triggered_by ? (_jsx("span", { children: execution.triggered_by })) : (_jsx(Badge, { variant: "default", children: "System" })) })] }), execution.k8s_job_name && (_jsxs("div", { children: [_jsx("div", { style: { fontSize: ts.bodySmall.fontSize, color: colors.text.secondary, marginBottom: spacing.xs }, children: "K8s Job" }), _jsx("div", { style: { fontSize: ts.bodySmall.fontSize, fontFamily: 'monospace' }, children: execution.k8s_job_name })] }))] })] }), _jsxs(Card, { children: [_jsx("h3", { style: { fontSize: ts.heading3.fontSize, fontWeight: ts.heading3.fontWeight, color: colors.text.primary, marginBottom: spacing.md }, children: "Timing" }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: spacing.md }, children: [_jsxs("div", { children: [_jsx("div", { style: { fontSize: ts.bodySmall.fontSize, color: colors.text.secondary, marginBottom: spacing.xs }, children: "Started" }), _jsx("div", { style: { fontSize: ts.bodySmall.fontSize, color: colors.text.primary }, children: execution.started_at ? formatDateTime(execution.started_at) : '—' })] }), _jsxs("div", { children: [_jsx("div", { style: { fontSize: ts.bodySmall.fontSize, color: colors.text.secondary, marginBottom: spacing.xs }, children: "Completed" }), _jsx("div", { style: { fontSize: ts.bodySmall.fontSize, color: colors.text.primary }, children: execution.completed_at ? formatDateTime(execution.completed_at) : '—' })] }), execution.duration_ms && (_jsxs("div", { children: [_jsx("div", { style: { fontSize: ts.bodySmall.fontSize, color: colors.text.secondary, marginBottom: spacing.xs }, children: "Duration" }), _jsx("div", { style: { fontSize: ts.bodySmall.fontSize, color: colors.text.primary }, children: execution.duration_ms < 1000
                                                    ? `${execution.duration_ms}ms`
                                                    : `${(execution.duration_ms / 1000).toFixed(2)}s` })] })), execution.exit_code !== null && (_jsxs("div", { children: [_jsx("div", { style: { fontSize: ts.bodySmall.fontSize, color: colors.text.secondary, marginBottom: spacing.xs }, children: "Exit Code" }), _jsx("div", { style: { fontSize: ts.bodySmall.fontSize, fontFamily: 'monospace', color: execution.exit_code === 0 ? colors.success.default : colors.error.default }, children: execution.exit_code })] })), execution.rows_affected !== null && (_jsxs("div", { children: [_jsx("div", { style: { fontSize: ts.bodySmall.fontSize, color: colors.text.secondary, marginBottom: spacing.xs }, children: "Rows Affected" }), _jsx("div", { style: { fontSize: ts.bodySmall.fontSize, color: colors.text.primary }, children: execution.rows_affected })] }))] })] })] }), execution.error && (_jsx("div", { style: { marginBottom: spacing.lg }, children: _jsxs(Card, { children: [_jsx("h3", { style: { fontSize: ts.heading3.fontSize, fontWeight: ts.heading3.fontWeight, color: colors.error.default, marginBottom: spacing.md }, children: "Error" }), _jsx("pre", { style: {
                                backgroundColor: colors.bg.muted,
                                padding: spacing.md,
                                borderRadius: radius.md,
                                fontSize: ts.bodySmall.fontSize,
                                fontFamily: 'monospace',
                                overflowX: 'auto',
                                whiteSpace: 'pre-wrap',
                                margin: 0,
                                color: colors.text.primary,
                            }, children: _jsx("code", { children: execution.error }) })] }) })), execution.output && (_jsx("div", { style: { marginBottom: spacing.lg }, children: _jsxs(Card, { children: [_jsx("h3", { style: { fontSize: ts.heading3.fontSize, fontWeight: ts.heading3.fontWeight, color: colors.text.primary, marginBottom: spacing.md }, children: "Output" }), _jsx("pre", { style: {
                                backgroundColor: colors.bg.muted,
                                padding: spacing.md,
                                borderRadius: radius.md,
                                fontSize: ts.bodySmall.fontSize,
                                fontFamily: 'monospace',
                                overflowX: 'auto',
                                whiteSpace: 'pre-wrap',
                                margin: 0,
                                color: colors.text.primary,
                            }, children: _jsx("code", { children: execution.output }) })] }) })), execution.logs && (_jsxs(Card, { children: [_jsx("h3", { style: { fontSize: ts.heading3.fontSize, fontWeight: ts.heading3.fontWeight, color: colors.text.primary, marginBottom: spacing.md }, children: "Logs" }), _jsx("pre", { style: {
                            backgroundColor: colors.bg.muted,
                            padding: spacing.md,
                            borderRadius: radius.md,
                            fontSize: ts.bodySmall.fontSize,
                            fontFamily: 'monospace',
                            overflowX: 'auto',
                            whiteSpace: 'pre-wrap',
                            margin: 0,
                            color: colors.text.primary,
                        }, children: _jsx("code", { children: execution.logs }) })] }))] }));
}
export default TaskExecution;
//# sourceMappingURL=TaskExecution.js.map