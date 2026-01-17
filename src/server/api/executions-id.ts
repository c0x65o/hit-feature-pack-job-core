/**
 * GET /api/job-core/executions/[id]
 */

import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { hitTaskExecutions } from '@/lib/feature-pack-schemas';
import { requireJobCoreEntityAuthz } from '../lib/authz';

type RouteParams = { params: Promise<{ id: string }> };

function toExecutionRow(row: any) {
  if (!row || typeof row !== 'object') return row;
  const item: any = row;
  return {
    id: item.id ?? null,
    task_name: item.taskName ?? item.task_name ?? null,
    service_name: item.serviceName ?? item.service_name ?? null,
    triggered_by: item.triggeredBy ?? item.triggered_by ?? null,
    status: item.status ?? null,
    enqueued_at: item.enqueuedAt ?? item.enqueued_at ?? null,
    started_at: item.startedAt ?? item.started_at ?? null,
    completed_at: item.completedAt ?? item.completed_at ?? null,
    exit_code: item.exitCode ?? item.exit_code ?? null,
    duration_ms: item.durationMs ?? item.duration_ms ?? null,
    error: item.error ?? null,
    logs: item.logs ?? '',
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const authz = await requireJobCoreEntityAuthz(request, {
      entityKey: 'job-core.execution',
      op: 'detail',
    });
    if (authz instanceof Response) return authz;

    const { id } = await params;
    const execId = String(id || '').trim();
    if (!execId) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const db = getDb();
    const [row] = await db
      .select()
      .from(hitTaskExecutions)
      .where(eq(hitTaskExecutions.id as any, execId as any) as any)
      .limit(1);

    if (!row) return NextResponse.json({ error: 'Execution not found' }, { status: 404 });
    return NextResponse.json(toExecutionRow(row));
  } catch (error: any) {
    const msg = String(error?.message || error || 'Failed to fetch execution');
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

