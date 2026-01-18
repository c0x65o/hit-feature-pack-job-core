'use client';

/**
 * Job-core contrib
 *
 * Job-core is now schema-driven. No custom list/detail widgets are needed.
 * Action handlers are provided for the headerActions defined in the entity schema.
 */

export type PackContrib = {
  actionHandlers?: Record<string, (args: any) => Promise<void> | void>;
};

export const contrib: PackContrib = {
  actionHandlers: {
    'job-core.task.run': async ({ record }: any): Promise<void> => {
      const name = String(record?.id || record?.name || '').trim();
      if (!name) throw new Error('Missing task id');
      const res = await fetch(`/api/job-core/tasks/${encodeURIComponent(name)}/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({}),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(String(json?.error || `Failed to run task (${res.status})`));
    },
    'job-core.task.toggleSchedule': async ({ record }: any): Promise<void> => {
      const name = String(record?.id || record?.name || '').trim();
      if (!name) throw new Error('Missing task id');
      const next = !Boolean(record?.enabled);
      const res = await fetch(`/api/job-core/tasks/${encodeURIComponent(name)}/schedule`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ enabled: next }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(String(json?.error || `Failed to update schedule (${res.status})`));
    },
  },
};

export default contrib;
