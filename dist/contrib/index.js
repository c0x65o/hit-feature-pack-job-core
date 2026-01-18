'use client';
export const contrib = {
    actionHandlers: {
        'job-core.task.run': async ({ record }) => {
            const name = String(record?.id || record?.name || '').trim();
            if (!name)
                throw new Error('Missing task id');
            const res = await fetch(`/api/job-core/tasks/${encodeURIComponent(name)}/run`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({}),
            });
            const json = await res.json().catch(() => ({}));
            if (!res.ok)
                throw new Error(String(json?.error || `Failed to run task (${res.status})`));
        },
        'job-core.task.toggleSchedule': async ({ record }) => {
            const name = String(record?.id || record?.name || '').trim();
            if (!name)
                throw new Error('Missing task id');
            const next = !Boolean(record?.enabled);
            const res = await fetch(`/api/job-core/tasks/${encodeURIComponent(name)}/schedule`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ enabled: next }),
            });
            const json = await res.json().catch(() => ({}));
            if (!res.ok)
                throw new Error(String(json?.error || `Failed to update schedule (${res.status})`));
        },
    },
};
export default contrib;
//# sourceMappingURL=index.js.map