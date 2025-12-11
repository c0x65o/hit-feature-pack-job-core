'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { PlayCircle } from 'lucide-react';
import { useUi } from '@hit/ui-kit';
import { formatDate } from '@hit/sdk';
import { useTask, useTaskExecutions, useTaskMutations } from '../hooks/useTasks';
export function TaskDetail({ taskName, onNavigate }) {
    const { Page, Card, Button, Badge, DataTable, Alert, Spinner } = useUi();
    const { task, loading: taskLoading, error: taskError, refresh: refreshTask } = useTask(taskName);
    const { executions, total, loading: executionsLoading, refresh: refreshExecutions } = useTaskExecutions(taskName, { limit: 20 });
    const { executeTask, updateSchedule, loading: mutating } = useTaskMutations();
    const navigate = (path) => {
        if (onNavigate) {
            onNavigate(path);
        }
        else if (typeof window !== 'undefined') {
            window.location.href = path;
        }
    };
    const handleExecute = async () => {
        try {
            await executeTask(taskName);
            refreshExecutions();
        }
        catch (err) {
            // Error handled by hook
        }
    };
    const handleToggleSchedule = async (enabled) => {
        try {
            await updateSchedule(taskName, enabled);
            refreshTask();
        }
        catch (err) {
            // Error handled by hook
        }
    };
    if (taskLoading) {
        return (_jsx(Page, { title: "Task Details", children: _jsx(Spinner, {}) }));
    }
    if (taskError || !task) {
        return (_jsx(Page, { title: "Task Details", children: _jsx(Alert, { variant: "error", title: "Error loading task", children: taskError?.message || 'Task not found' }) }));
    }
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
    return (_jsxs(Page, { title: task.name, description: task.description || undefined, actions: _jsxs("div", { className: "flex gap-2", children: [task.cron && (_jsx(Button, { variant: task.enabled ? "secondary" : "primary", onClick: () => handleToggleSchedule(!task.enabled), loading: mutating, children: task.enabled ? 'Disable Schedule' : 'Enable Schedule' })), _jsxs(Button, { variant: "primary", onClick: handleExecute, loading: mutating, children: [_jsx(PlayCircle, { size: 16, className: "mr-2" }), "Execute Now"] })] }), children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-6", children: [_jsxs(Card, { children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Task Information" }), _jsxs("dl", { className: "space-y-2", children: [_jsxs("div", { children: [_jsx("dt", { className: "text-sm text-gray-500", children: "Name" }), _jsx("dd", { className: "text-sm font-medium", children: task.name })] }), task.description && (_jsxs("div", { children: [_jsx("dt", { className: "text-sm text-gray-500", children: "Description" }), _jsx("dd", { className: "text-sm", children: task.description })] })), _jsxs("div", { children: [_jsx("dt", { className: "text-sm text-gray-500", children: "Execution Type" }), _jsx("dd", { children: _jsx(Badge, { variant: task.execution_type === 'simple' ? 'info' : 'warning', children: task.execution_type }) })] }), _jsxs("div", { children: [_jsx("dt", { className: "text-sm text-gray-500", children: "Status" }), _jsx("dd", { children: _jsx(Badge, { variant: task.enabled ? 'success' : 'default', children: task.enabled ? 'Enabled' : 'Disabled' }) })] }), task.cron && (_jsxs("div", { children: [_jsx("dt", { className: "text-sm text-gray-500", children: "Schedule" }), _jsx("dd", { className: "text-sm font-mono", children: task.cron })] })), task.service_name && (_jsxs("div", { children: [_jsx("dt", { className: "text-sm text-gray-500", children: "Service" }), _jsx("dd", { className: "text-sm", children: task.service_name })] }))] })] }), _jsxs(Card, { children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Configuration" }), task.sql && (_jsxs("div", { className: "mb-4", children: [_jsx("dt", { className: "text-sm text-gray-500 mb-2", children: "SQL Query" }), _jsx("pre", { className: "bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm font-mono overflow-x-auto", children: _jsx("code", { children: task.sql }) })] })), task.command && (_jsxs("div", { className: "mb-4", children: [_jsx("dt", { className: "text-sm text-gray-500 mb-2", children: "Command" }), _jsx("pre", { className: "bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm font-mono overflow-x-auto", children: _jsx("code", { children: task.command }) })] })), task.script && (_jsxs("div", { children: [_jsx("dt", { className: "text-sm text-gray-500 mb-2", children: "Script" }), _jsx("pre", { className: "bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm font-mono overflow-x-auto", children: _jsx("code", { children: task.script }) })] }))] })] }), _jsxs(Card, { children: [_jsxs("h3", { className: "text-lg font-semibold mb-4", children: ["Execution History (", total, ")"] }), _jsx(DataTable, { columns: [
                            {
                                key: 'status',
                                label: 'Status',
                                render: (value) => getStatusBadge(String(value)),
                            },
                            {
                                key: 'triggered_by',
                                label: 'Triggered By',
                                render: (value) => (value ? String(value) : 'system'),
                            },
                            {
                                key: 'started_at',
                                label: 'Started',
                                render: (value) => value ? formatDate(String(value)) : '—',
                            },
                            {
                                key: 'completed_at',
                                label: 'Completed',
                                render: (value) => value ? formatDate(String(value)) : '—',
                            },
                            {
                                key: 'duration_ms',
                                label: 'Duration',
                                render: (value) => {
                                    if (!value)
                                        return '—';
                                    const ms = Number(value);
                                    if (ms < 1000)
                                        return `${ms}ms`;
                                    return `${(ms / 1000).toFixed(2)}s`;
                                },
                            },
                            {
                                key: 'actions',
                                label: '',
                                align: 'right',
                                render: (_, row) => (_jsx(Button, { variant: "ghost", size: "sm", onClick: () => navigate(`/admin/tasks/${encodeURIComponent(taskName)}/executions/${row.id}`), children: "View" })),
                            },
                        ], data: executions.map((ex) => ({
                            id: ex.id,
                            status: ex.status,
                            triggered_by: ex.triggered_by,
                            started_at: ex.started_at,
                            completed_at: ex.completed_at,
                            duration_ms: ex.duration_ms,
                        })), emptyMessage: "No executions yet", loading: executionsLoading })] })] }));
}
export default TaskDetail;
//# sourceMappingURL=TaskDetail.js.map