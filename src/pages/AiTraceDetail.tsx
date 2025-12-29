'use client';

import React from 'react';
import { useUi } from '@hit/ui-kit';
import { useAiTrace } from '../hooks/useAiTraces';
import { ArrowLeft, RefreshCw } from 'lucide-react';

interface AiTraceDetailProps {
  requestId: string;
  onNavigate?: (path: string) => void;
}

function JsonBlock({ value }: { value: unknown }) {
  const s = JSON.stringify(value, null, 2);
  return (
    <pre className="text-xs whitespace-pre-wrap break-words bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded p-3 overflow-auto max-h-[60vh]">
      {s}
    </pre>
  );
}

export function AiTraceDetail({ requestId, onNavigate }: AiTraceDetailProps) {
  const { Page, Card, Button, Alert } = useUi();
  const { trace, loading, error, refresh } = useAiTrace(requestId);

  const navigate = (path: string) => {
    if (onNavigate) onNavigate(path);
    else if (typeof window !== 'undefined') window.location.href = path;
  };

  const events = (trace as any)?.events as any[] | undefined;
  const meta = (trace as any)?.meta;

  return (
    <Page
      title="AI Trace"
      description={requestId}
      actions={
        <div className="flex gap-2 items-center">
          <Button variant="secondary" onClick={() => navigate('/admin/ai/traces')}>
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>
          <Button variant="primary" onClick={refresh} disabled={loading}>
            <RefreshCw size={16} className="mr-2" />
            Refresh
          </Button>
        </div>
      }
    >
      {error && (
        <Alert variant="error" title="Error loading AI trace">
          {error.message}
        </Alert>
      )}

      <Card>
        <div className="space-y-4">
          <div>
            <div className="text-sm font-medium mb-2">Meta</div>
            <JsonBlock value={meta ?? {}} />
          </div>
          <div>
            <div className="text-sm font-medium mb-2">Events</div>
            <JsonBlock value={events ?? []} />
          </div>
        </div>
      </Card>
    </Page>
  );
}

export default AiTraceDetail;

