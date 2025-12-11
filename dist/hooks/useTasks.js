'use client';
/**
 * Tasks Admin API hooks
 */
import { useState, useEffect, useCallback } from 'react';
// Get the tasks module URL from environment or defaults
function getTasksUrl() {
    if (typeof window !== 'undefined') {
        const win = window;
        return win.NEXT_PUBLIC_HIT_TASKS_URL || '/api/proxy/tasks';
    }
    return '/api/proxy/tasks';
}
function getAuthHeaders() {
    if (typeof window === 'undefined')
        return {};
    // Try to get token from localStorage (consistent with other feature packs)
    const token = localStorage.getItem('hit_token');
    if (token) {
        return { 'Authorization': `Bearer ${token}` };
    }
    // Also check for cookies (httpOnly tokens)
    // The proxy endpoint should handle auth via cookies automatically
    // So we can return empty headers and let the proxy handle it
    return {};
}
class TasksError extends Error {
    constructor(status, detail) {
        super(detail);
        this.name = 'TasksError';
        this.status = status;
        this.detail = detail;
    }
}
async function fetchWithAuth(endpoint, options) {
    const tasksUrl = getTasksUrl();
    const url = `${tasksUrl}${endpoint}`;
    const res = await fetch(url, {
        ...options,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
            ...options?.headers,
        },
    });
    if (!res.ok) {
        const errorBody = await res.json().catch(() => ({ detail: res.statusText }));
        const detail = errorBody.detail || errorBody.message || `Request failed: ${res.status}`;
        throw new TasksError(res.status, detail);
    }
    return res.json();
}
export function useTasks() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const refresh = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchWithAuth('/hit/tasks');
            setTasks(data.tasks);
        }
        catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch tasks'));
        }
        finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        refresh();
    }, [refresh]);
    return { tasks, loading, error, refresh };
}
export function useTask(taskName) {
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const refresh = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchWithAuth(`/hit/tasks/${encodeURIComponent(taskName)}`);
            setTask(data);
        }
        catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch task'));
        }
        finally {
            setLoading(false);
        }
    }, [taskName]);
    useEffect(() => {
        refresh();
    }, [refresh]);
    return { task, loading, error, refresh };
}
export function useTaskExecutions(taskName, options) {
    const [executions, setExecutions] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const refresh = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const params = new URLSearchParams();
            if (options?.limit)
                params.append('limit', options.limit.toString());
            if (options?.offset)
                params.append('offset', options.offset.toString());
            const query = params.toString();
            const url = `/hit/tasks/${encodeURIComponent(taskName)}/executions${query ? `?${query}` : ''}`;
            const data = await fetchWithAuth(url);
            setExecutions(data.executions);
            setTotal(data.total);
        }
        catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch executions'));
        }
        finally {
            setLoading(false);
        }
    }, [taskName, options?.limit, options?.offset]);
    useEffect(() => {
        refresh();
    }, [refresh]);
    return { executions, total, loading, error, refresh };
}
export function useTaskExecution(taskName, executionId) {
    const [execution, setExecution] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const refresh = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchWithAuth(`/hit/tasks/${encodeURIComponent(taskName)}/executions/${encodeURIComponent(executionId)}`);
            setExecution(data);
        }
        catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch execution'));
        }
        finally {
            setLoading(false);
        }
    }, [taskName, executionId]);
    useEffect(() => {
        refresh();
    }, [refresh]);
    return { execution, loading, error, refresh };
}
export function useTaskMutations() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const executeTask = useCallback(async (taskName, triggeredBy) => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchWithAuth(`/hit/tasks/${encodeURIComponent(taskName)}/execute`, {
                method: 'POST',
                body: JSON.stringify({ triggered_by: triggeredBy }),
            });
            return data;
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to execute task');
            setError(error);
            throw error;
        }
        finally {
            setLoading(false);
        }
    }, []);
    const updateSchedule = useCallback(async (taskName, enabled) => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchWithAuth(`/hit/tasks/${encodeURIComponent(taskName)}/schedule`, {
                method: 'POST',
                body: JSON.stringify({ enabled }),
            });
            return data;
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to update schedule');
            setError(error);
            throw error;
        }
        finally {
            setLoading(false);
        }
    }, []);
    return { executeTask, updateSchedule, loading, error };
}
export function useSchedules() {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const refresh = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchWithAuth('/hit/tasks/schedules');
            setSchedules(data.schedules);
        }
        catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch schedules'));
        }
        finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        refresh();
    }, [refresh]);
    return { schedules, loading, error, refresh };
}
//# sourceMappingURL=useTasks.js.map