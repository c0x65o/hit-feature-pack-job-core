'use client';

import React, { useState, useMemo } from 'react';
import { useUi } from '@hit/ui-kit';
import { useAiTrace } from '../hooks/useAiTraces';
import { formatDateTime, formatRelativeTime } from '@hit/sdk';
import {
  ArrowLeft,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  MessageSquare,
  Zap,
  CheckCircle,
  Clock,
  User,
  Brain,
  Settings,
  PlayCircle,
  FileText,
} from 'lucide-react';

interface AiTraceDetailProps {
  requestId: string;
  onNavigate?: (path: string) => void;
}

type TraceEvent = {
  t_ms: number;
  name: string;
  data?: Record<string, unknown>;
};

function JsonBlock({ value }: { value: unknown }) {
  const s = JSON.stringify(value, null, 2);
  return (
    <pre className="text-xs whitespace-pre-wrap break-words bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded p-3 overflow-auto max-h-[60vh]">
      {s}
    </pre>
  );
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

function getEventIcon(name: string) {
  if (name.startsWith('agent.')) return <User size={16} />;
  if (name.startsWith('llm.')) return <Brain size={16} />;
  if (name.startsWith('dashboard.')) return <Zap size={16} />;
  if (name.startsWith('planning.')) return <Settings size={16} />;
  if (name.startsWith('final.')) return <CheckCircle size={16} />;
  return <FileText size={16} />;
}

function getEventVariant(name: string): 'default' | 'success' | 'warning' | 'error' | 'info' {
  if (name.includes('error') || name.includes('Error')) return 'error';
  if (name.includes('response') || name.includes('success') || name.includes('finish')) return 'success';
  if (name.includes('warning') || name.includes('healed')) return 'warning';
  if (name.startsWith('llm.')) return 'info';
  return 'default';
}

function getEventColor(name: string): string {
  if (name.startsWith('agent.')) return 'text-blue-600 dark:text-blue-400';
  if (name.startsWith('llm.')) return 'text-purple-600 dark:text-purple-400';
  if (name.startsWith('dashboard.')) return 'text-green-600 dark:text-green-400';
  if (name.startsWith('planning.')) return 'text-orange-600 dark:text-orange-400';
  if (name.startsWith('final.')) return 'text-emerald-600 dark:text-emerald-400';
  return 'text-gray-600 dark:text-gray-400';
}

function formatEventName(name: string): string {
  return name
    .split('.')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' → ');
}

function EventStep({
  event,
  index,
  prevEvent,
  isExpanded,
  onToggle,
}: {
  event: TraceEvent;
  index: number;
  prevEvent: TraceEvent | null;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const { Badge } = useUi();
  const duration = prevEvent ? event.t_ms - prevEvent.t_ms : null;
  const variant = getEventVariant(event.name);
  const color = getEventColor(event.name);

  const hasPrompt = event.name === 'llm.request' && event.data?.messages != null;
  const hasResponse = event.name === 'llm.response' && event.data?.content != null;
  const hasToolCall = event.name === 'dashboard.execute.request' && event.data?.toolName != null;
  const hasToolResult = event.name === 'dashboard.execute.response' && event.data?.result != null;

  return (
    <div className="relative">
      {/* Timeline line */}
      {index > 0 && (
        <div className="absolute left-5 top-0 w-0.5 h-6 bg-gray-200 dark:bg-gray-700 -translate-y-full" />
      )}

      <div className="relative flex gap-4 group">
        {/* Icon circle */}
        <div
          className={`flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors ${
            isExpanded
              ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 dark:border-blue-400'
              : 'bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 group-hover:border-gray-400 dark:group-hover:border-gray-500'
          }`}
        >
          <div className={color}>{getEventIcon(event.name)}</div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pb-6">
          {/* Header - always visible */}
          <button
            onClick={onToggle}
            className="w-full text-left flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg p-2 -m-2 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={variant as any}>{formatEventName(event.name)}</Badge>
                {duration !== null && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Clock size={12} />
                    {formatDuration(duration)}
                  </span>
                )}
                <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">
                  {new Date(event.t_ms).toLocaleTimeString()}
                </span>
              </div>
              <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                {hasPrompt && (
                  <span className="flex items-center gap-1">
                    <MessageSquare size={14} />
                    LLM Request ({Array.isArray(event.data?.messages) ? event.data.messages.length : 0} messages)
                  </span>
                )}
                {hasResponse && (
                  <span className="flex items-center gap-1">
                    <Brain size={14} />
                    LLM Response
                    {event.data?.durationMs != null && (
                      <span className="text-xs text-gray-500">
                        ({formatDuration(event.data.durationMs as number)})
                      </span>
                    )}
                  </span>
                )}
                {hasToolCall && (
                  <span className="flex items-center gap-1">
                    <PlayCircle size={14} />
                    Execute: <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 rounded">
                      {String(event.data?.toolName || '')}
                    </code>
                  </span>
                )}
                {hasToolResult && (
                  <span className="flex items-center gap-1">
                    <CheckCircle size={14} />
                    Tool Result
                    {event.data?.status != null && (
                      <Badge
                        variant={
                          (event.data.status as number) >= 400
                            ? 'error'
                            : (event.data.status as number) >= 300
                            ? 'warning'
                            : 'success'
                        }
                        className="ml-1"
                      >
                        HTTP {String(event.data.status)}
                      </Badge>
                    )}
                  </span>
                )}
                {event.name === 'agent.start' && event.data?.effectiveText != null && (
                  <span className="flex items-center gap-1">
                    <User size={14} />
                    "{String(event.data.effectiveText || '').slice(0, 100)}
                    {String(event.data.effectiveText || '').length > 100 ? '...' : ''}"
                  </span>
                )}
              </div>
            </div>
            <div className="flex-shrink-0 text-gray-400 dark:text-gray-500">
              {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </div>
          </button>

          {/* Expanded content */}
          {isExpanded && (
            <div className="mt-3 space-y-4 pl-2 border-l-2 border-gray-200 dark:border-gray-700">
              {/* Prompt display for LLM requests */}
              {hasPrompt && (
                <div className="bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Brain size={16} className="text-purple-600 dark:text-purple-400" />
                    <h4 className="font-semibold text-purple-900 dark:text-purple-100">Prompt Messages</h4>
                    {event.data?.model != null && (
                      <Badge variant="info" className="ml-auto">
                        {String(event.data.model || '')}
                      </Badge>
                    )}
                    {event.data?.jsonMode != null && (
                      <Badge variant="info">JSON Mode</Badge>
                    )}
                  </div>
                  <div className="space-y-3">
                    {Array.isArray(event.data?.messages) ? (
                      (event.data?.messages as Array<{ role?: string; content?: string }>).map(
                        (msg, idx) => (
                          <div
                            key={idx}
                            className="bg-white dark:bg-gray-900 rounded border border-purple-100 dark:border-purple-900 p-3"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <Badge
                                variant={
                                  msg.role === 'user'
                                    ? 'info'
                                    : msg.role === 'assistant'
                                    ? 'success'
                                    : 'default'
                                }
                              >
                                {msg.role || 'unknown'}
                              </Badge>
                            </div>
                            <pre className="text-sm whitespace-pre-wrap break-words text-gray-800 dark:text-gray-200">
                              {String(msg.content || '').slice(0, 5000)}
                              {String(msg.content || '').length > 5000 ? '\n\n...(truncated)' : ''}
                            </pre>
                          </div>
                        )
                      )
                    ) : null}
                  </div>
                </div>
              )}

              {/* LLM Response */}
              {hasResponse && (
                <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle size={16} className="text-emerald-600 dark:text-emerald-400" />
                    <h4 className="font-semibold text-emerald-900 dark:text-emerald-100">LLM Response</h4>
                    {event.data?.usage != null && typeof event.data.usage === 'object' && event.data.usage !== null ? (
                      <div className="ml-auto flex gap-2">
                        {(event.data.usage as Record<string, unknown>).prompt_tokens != null ? (
                          <Badge variant="info">
                            {String((event.data.usage as Record<string, unknown>).prompt_tokens)} prompt tokens
                          </Badge>
                        ) : null}
                        {(event.data.usage as Record<string, unknown>).completion_tokens != null ? (
                          <Badge variant="info">
                            {String((event.data.usage as Record<string, unknown>).completion_tokens)} completion tokens
                          </Badge>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                  <pre className="text-sm whitespace-pre-wrap break-words text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-900 rounded border border-emerald-100 dark:border-emerald-900 p-3">
                    {String(event.data?.content || '').slice(0, 10000)}
                    {String(event.data?.content || '').length > 10000 ? '\n\n...(truncated)' : ''}
                  </pre>
                </div>
              )}

              {/* Tool execution */}
              {hasToolCall && (
                <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <PlayCircle size={16} className="text-blue-600 dark:text-blue-400" />
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100">Tool Execution</h4>
                    <Badge variant="info" className="ml-auto">
                      {String(event.data?.toolName || '')}
                    </Badge>
                  </div>
                  {event.data?.input != null && (
                    <div>
                      <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Input:</div>
                      <JsonBlock value={event.data.input} />
                    </div>
                  )}
                </div>
              )}

              {/* Tool result */}
              {hasToolResult && (
                <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle size={16} className="text-green-600 dark:text-green-400" />
                    <h4 className="font-semibold text-green-900 dark:text-green-100">Tool Result</h4>
                    {event.data?.durationMs != null && (
                      <Badge variant="info" className="ml-auto">
                        {formatDuration(event.data.durationMs as number)}
                      </Badge>
                    )}
                  </div>
                  {event.data?.result !== undefined && event.data?.result !== null && (
                    <div>
                      <JsonBlock value={event.data.result} />
                    </div>
                  )}
                </div>
              )}

              {/* Generic data display */}
              {!hasPrompt && !hasResponse && !hasToolCall && !hasToolResult && event.data && (
                <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Event Data</h4>
                  <JsonBlock value={event.data} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function AiTraceDetail({ requestId, onNavigate }: AiTraceDetailProps) {
  const { Page, Card, Button, Alert, Badge } = useUi();
  const { trace, loading, error, refresh } = useAiTrace(requestId);
  const [expandedEvents, setExpandedEvents] = useState<Set<number>>(new Set([0])); // Expand first event by default

  const navigate = (path: string) => {
    if (onNavigate) onNavigate(path);
    else if (typeof window !== 'undefined') window.location.href = path;
  };

  const events = (trace as any)?.events as TraceEvent[] | undefined;
  const meta = (trace as any)?.meta;
  const startedAtMs = (trace as any)?.startedAtMs as number | undefined;
  const endedAtMs = (trace as any)?.endedAtMs as number | undefined;
  const durationMs = (trace as any)?.durationMs as number | undefined;
  const outcome = (trace as any)?.outcome as Record<string, unknown> | undefined;

  const toggleEvent = (index: number) => {
    setExpandedEvents((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
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
    if (!events) return null;
    const stats = {
      llmRequests: 0,
      llmResponses: 0,
      toolCalls: 0,
      errors: 0,
    };
    events.forEach((e) => {
      if (e.name === 'llm.request') stats.llmRequests++;
      if (e.name === 'llm.response') stats.llmResponses++;
      if (e.name === 'dashboard.execute.request') stats.toolCalls++;
      if (e.name.includes('error') || e.name.includes('Error')) stats.errors++;
    });
    return stats;
  }, [events]);

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

      {/* Summary Card */}
      {trace && (
        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {startedAtMs && (
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Started</div>
                <div className="font-medium">{formatDateTime(new Date(startedAtMs).toISOString())}</div>
                <div className="text-xs text-gray-500">{formatRelativeTime(new Date(startedAtMs).toISOString())}</div>
              </div>
            )}
            {durationMs !== undefined && (
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Duration</div>
                <div className="font-medium">{formatDuration(durationMs)}</div>
              </div>
            )}
            {outcome && (
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Outcome</div>
                <div className="flex items-center gap-2">
                  {outcome.handled ? (
                    <Badge variant="success">Handled</Badge>
                  ) : (
                    <Badge variant="warning">Not Handled</Badge>
                  )}
                  {outcome.steps != null && (
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {String(outcome.steps)} step{Number(outcome.steps) === 1 ? '' : 's'}
                    </span>
                  )}
                </div>
              </div>
            )}
            {eventStats && (
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Events</div>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="info">{events?.length || 0} total</Badge>
                  {eventStats.llmRequests > 0 && (
                    <Badge variant="info">{eventStats.llmRequests} LLM</Badge>
                  )}
                  {eventStats.toolCalls > 0 && (
                    <Badge variant="info">{eventStats.toolCalls} tools</Badge>
                  )}
                  {eventStats.errors > 0 && (
                    <Badge variant="error">{eventStats.errors} errors</Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Meta Card */}
      {meta && (
        <Card className="mb-6">
          <details className="group">
            <summary className="cursor-pointer flex items-center gap-2 font-medium text-gray-900 dark:text-gray-100 mb-3">
              <ChevronRight size={16} className="group-open:rotate-90 transition-transform" />
              Trace Metadata
            </summary>
            <JsonBlock value={meta} />
          </details>
        </Card>
      )}

      {/* Events Timeline */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Event Timeline</h2>
          {events && events.length > 0 && (
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={expandAll}>
                Expand All
              </Button>
              <Button variant="secondary" size="sm" onClick={collapseAll}>
                Collapse All
              </Button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading trace...</div>
        ) : !events || events.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No events found in this trace.</div>
        ) : (
          <div className="space-y-0">
            {events.map((event, index) => (
              <EventStep
                key={index}
                event={event}
                index={index}
                prevEvent={index > 0 ? events[index - 1] : null}
                isExpanded={expandedEvents.has(index)}
                onToggle={() => toggleEvent(index)}
              />
            ))}
          </div>
        )}
      </Card>
    </Page>
  );
}

export default AiTraceDetail;

