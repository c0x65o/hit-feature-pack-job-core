'use client';

import React from 'react';
import { AlertCircle, CheckCircle, Clock, ListChecks, CirclePlay, RefreshCw, XCircle } from 'lucide-react';
import type { BreadcrumbItem } from '@hit/ui-kit';
import { useThemeTokens, useUi } from '@hit/ui-kit';
import { formatDateTime } from '@hit/sdk';
import { useTaskExecution } from '../hooks/useTasks';

interface TaskExecutionProps {
  name: string;
  id: string;
  onNavigate?: (path: string) => void;
}

export function TaskExecution({ name, id, onNavigate }: TaskExecutionProps) {
  const taskName = name;
  const executionId = id;
  const { Page, Card, Button, Badge, Alert, Spinner } = useUi();
  const { colors, spacing, radius, textStyles: ts } = useThemeTokens();
  const { execution, loading, error, refresh } = useTaskExecution(taskName, executionId);

  const navigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else if (typeof window !== 'undefined') {
      window.location.href = path;
    }
  };

  if (loading) {
    return (
      <Page title="Execution Details">
        <Spinner />
      </Page>
    );
  }

  if (error || !execution) {
    return (
      <Page title="Execution Details">
        <Alert variant="error" title="Error loading execution">
          {error?.message || 'Execution not found'}
        </Alert>
      </Page>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'failed':
        return <XCircle className="text-red-500" size={20} />;
      case 'running':
        return <Clock className="text-yellow-500" size={20} />;
      default:
        return <AlertCircle className="text-gray-500" size={20} />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge variant="success">Success</Badge>;
      case 'failed':
        return <Badge variant="error">Failed</Badge>;
      case 'running':
        return <Badge variant="warning">Running</Badge>;
      case 'pending':
        return <Badge variant="default">Pending</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Jobs', href: '/admin/jobs', icon: <ListChecks size={14} /> },
    { label: taskName, href: `/admin/jobs/${encodeURIComponent(taskName)}`, icon: <CirclePlay size={14} /> },
    { label: `Execution ${execution.id.slice(0, 8)}` },
  ];

  return (
    <Page
      title="Execution Details"
      breadcrumbs={breadcrumbs}
      onNavigate={navigate}
      actions={
        <Button variant="secondary" onClick={refresh} disabled={loading}>
          <RefreshCw size={16} style={{ marginRight: spacing.sm }} />
          Refresh
        </Button>
      }
    >
      {/* Status Card */}
      <div style={{ marginBottom: spacing.lg }}>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
            {getStatusIcon(execution.status)}
            <div style={{ flex: 1 }}>
              <h3
                style={{
                  fontSize: ts.heading3.fontSize,
                  fontWeight: ts.heading3.fontWeight,
                  color: colors.text.primary,
                  margin: 0,
                }}
              >
                Execution {execution.id.slice(0, 8)}
              </h3>
              <p
                style={{
                  fontSize: ts.bodySmall.fontSize,
                  color: colors.text.secondary,
                  margin: `${spacing.xs} 0 0 0`,
                }}
              >
                Task: {execution.task_name}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>{getStatusBadge(execution.status)}</div>
          </div>
        </Card>
      </div>

      {/* Details Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: spacing.md,
          marginBottom: spacing.lg,
        }}
      >
        <Card>
          <h3
            style={{
              fontSize: ts.heading3.fontSize,
              fontWeight: ts.heading3.fontWeight,
              color: colors.text.primary,
              marginBottom: spacing.md,
            }}
          >
            Execution Information
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
            <div>
              <div
                style={{
                  fontSize: ts.bodySmall.fontSize,
                  color: colors.text.secondary,
                  marginBottom: spacing.xs,
                }}
              >
                Status
              </div>
              <div>{getStatusBadge(execution.status)}</div>
            </div>
            <div>
              <div
                style={{
                  fontSize: ts.bodySmall.fontSize,
                  color: colors.text.secondary,
                  marginBottom: spacing.xs,
                }}
              >
                Execution Type
              </div>
              <div>
                <Badge variant={execution.execution_type === 'simple' ? 'info' : 'warning'}>
                  {execution.execution_type}
                </Badge>
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: ts.bodySmall.fontSize,
                  color: colors.text.secondary,
                  marginBottom: spacing.xs,
                }}
              >
                Triggered By
              </div>
              <div style={{ fontSize: ts.bodySmall.fontSize }}>
                {execution.triggered_by === 'cron' ? (
                  <Badge variant="info">Cron Schedule</Badge>
                ) : execution.triggered_by === 'system' || execution.triggered_by === 'manual' ? (
                  <Badge variant="default">Manual</Badge>
                ) : execution.triggered_by ? (
                  <span>{execution.triggered_by}</span>
                ) : (
                  <Badge variant="default">System</Badge>
                )}
              </div>
            </div>
            {execution.k8s_job_name && (
              <div>
                <div
                  style={{
                    fontSize: ts.bodySmall.fontSize,
                    color: colors.text.secondary,
                    marginBottom: spacing.xs,
                  }}
                >
                  K8s Job
                </div>
                <div style={{ fontSize: ts.bodySmall.fontSize, fontFamily: 'monospace' }}>
                  {execution.k8s_job_name}
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card>
          <h3
            style={{
              fontSize: ts.heading3.fontSize,
              fontWeight: ts.heading3.fontWeight,
              color: colors.text.primary,
              marginBottom: spacing.md,
            }}
          >
            Timing
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
            <div>
              <div
                style={{
                  fontSize: ts.bodySmall.fontSize,
                  color: colors.text.secondary,
                  marginBottom: spacing.xs,
                }}
              >
                Started
              </div>
              <div style={{ fontSize: ts.bodySmall.fontSize, color: colors.text.primary }}>
                {execution.started_at ? formatDateTime(execution.started_at) : '—'}
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: ts.bodySmall.fontSize,
                  color: colors.text.secondary,
                  marginBottom: spacing.xs,
                }}
              >
                Completed
              </div>
              <div style={{ fontSize: ts.bodySmall.fontSize, color: colors.text.primary }}>
                {execution.completed_at ? formatDateTime(execution.completed_at) : '—'}
              </div>
            </div>
            {execution.duration_ms && (
              <div>
                <div
                  style={{
                    fontSize: ts.bodySmall.fontSize,
                    color: colors.text.secondary,
                    marginBottom: spacing.xs,
                  }}
                >
                  Duration
                </div>
                <div style={{ fontSize: ts.bodySmall.fontSize, color: colors.text.primary }}>
                  {execution.duration_ms < 1000
                    ? `${execution.duration_ms}ms`
                    : `${(execution.duration_ms / 1000).toFixed(2)}s`}
                </div>
              </div>
            )}
            {execution.exit_code !== null && (
              <div>
                <div
                  style={{
                    fontSize: ts.bodySmall.fontSize,
                    color: colors.text.secondary,
                    marginBottom: spacing.xs,
                  }}
                >
                  Exit Code
                </div>
                <div
                  style={{
                    fontSize: ts.bodySmall.fontSize,
                    fontFamily: 'monospace',
                    color: execution.exit_code === 0 ? colors.success.default : colors.error.default,
                  }}
                >
                  {execution.exit_code}
                </div>
              </div>
            )}
            {execution.rows_affected !== null && (
              <div>
                <div
                  style={{
                    fontSize: ts.bodySmall.fontSize,
                    color: colors.text.secondary,
                    marginBottom: spacing.xs,
                  }}
                >
                  Rows Affected
                </div>
                <div style={{ fontSize: ts.bodySmall.fontSize, color: colors.text.primary }}>
                  {execution.rows_affected}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Error */}
      {execution.error && (
        <div style={{ marginBottom: spacing.lg }}>
          <Card>
            <h3
              style={{
                fontSize: ts.heading3.fontSize,
                fontWeight: ts.heading3.fontWeight,
                color: colors.error.default,
                marginBottom: spacing.md,
              }}
            >
              Error
            </h3>
            <pre
              style={{
                backgroundColor: colors.bg.muted,
                padding: spacing.md,
                borderRadius: radius.md,
                fontSize: ts.bodySmall.fontSize,
                fontFamily: 'monospace',
                overflowX: 'auto',
                whiteSpace: 'pre-wrap',
                margin: 0,
                color: colors.text.primary,
              }}
            >
              <code>{execution.error}</code>
            </pre>
          </Card>
        </div>
      )}

      {/* Output */}
      {execution.output && (
        <div style={{ marginBottom: spacing.lg }}>
          <Card>
            <h3
              style={{
                fontSize: ts.heading3.fontSize,
                fontWeight: ts.heading3.fontWeight,
                color: colors.text.primary,
                marginBottom: spacing.md,
              }}
            >
              Output
            </h3>
            <pre
              style={{
                backgroundColor: colors.bg.muted,
                padding: spacing.md,
                borderRadius: radius.md,
                fontSize: ts.bodySmall.fontSize,
                fontFamily: 'monospace',
                overflowX: 'auto',
                whiteSpace: 'pre-wrap',
                margin: 0,
                color: colors.text.primary,
              }}
            >
              <code>{execution.output}</code>
            </pre>
          </Card>
        </div>
      )}

      {/* Logs */}
      {execution.logs && (
        <Card>
          <h3
            style={{
              fontSize: ts.heading3.fontSize,
              fontWeight: ts.heading3.fontWeight,
              color: colors.text.primary,
              marginBottom: spacing.md,
            }}
          >
            Logs
          </h3>
          <pre
            style={{
              backgroundColor: colors.bg.muted,
              padding: spacing.md,
              borderRadius: radius.md,
              fontSize: ts.bodySmall.fontSize,
              fontFamily: 'monospace',
              overflowX: 'auto',
              whiteSpace: 'pre-wrap',
              margin: 0,
              color: colors.text.primary,
            }}
          >
            <code>{execution.logs}</code>
          </pre>
        </Card>
      )}
    </Page>
  );
}

export default TaskExecution;

