'use client';

import React from 'react';
import { TaskList } from '../pack-pages/TaskList';
import { AllExecutions } from '../pack-pages/AllExecutions';
import { TaskDetail } from '../pack-pages/TaskDetail';
import { TaskExecution } from '../pack-pages/TaskExecution';

export type PackListWidgetRendererArgs = {
  entityKey: string;
  uiSpec: any;
  listSpec: any;
  navigate?: (path: string) => void;
  ui: any;
  platform: string;
};

export type PackDetailWidgetRendererArgs = {
  entityKey: string;
  uiSpec: any;
  detailSpec: any;
  navigate?: (path: string) => void;
  ui: any;
  platform: string;
  params: Record<string, string>;
};

export type PackContrib = {
  listWidgets?: Record<string, (args: PackListWidgetRendererArgs) => React.ReactNode>;
  detailWidgets?: Record<string, (args: PackDetailWidgetRendererArgs) => React.ReactNode>;
};

function resolveParam(params: Record<string, string>, key: string): string {
  const raw = params?.[key];
  return raw ? String(raw) : '';
}

export const contrib: PackContrib = {
  listWidgets: {
    jobTaskList: ({ navigate }) => <TaskList onNavigate={navigate} />,
    jobAllExecutionsList: ({ navigate }) => <AllExecutions onNavigate={navigate} />,
  },
  detailWidgets: {
    jobTaskDetail: ({ navigate, params }) => (
      <TaskDetail name={resolveParam(params, 'name') || resolveParam(params, 'id')} onNavigate={navigate} />
    ),
    jobTaskExecutionDetail: ({ navigate, params }) => (
      <TaskExecution
        name={resolveParam(params, 'name')}
        id={resolveParam(params, 'id')}
        onNavigate={navigate}
      />
    ),
  },
};

export default contrib;
