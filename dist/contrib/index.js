'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { TaskList } from '../pack-pages/TaskList';
import { AllExecutions } from '../pack-pages/AllExecutions';
import { TaskDetail } from '../pack-pages/TaskDetail';
import { TaskExecution } from '../pack-pages/TaskExecution';
function resolveParam(params, key) {
    const raw = params?.[key];
    return raw ? String(raw) : '';
}
export const contrib = {
    listWidgets: {
        jobTaskList: ({ navigate }) => _jsx(TaskList, { onNavigate: navigate }),
        jobAllExecutionsList: ({ navigate }) => _jsx(AllExecutions, { onNavigate: navigate }),
    },
    detailWidgets: {
        jobTaskDetail: ({ navigate, params }) => (_jsx(TaskDetail, { name: resolveParam(params, 'name') || resolveParam(params, 'id'), onNavigate: navigate })),
        jobTaskExecutionDetail: ({ navigate, params }) => (_jsx(TaskExecution, { name: resolveParam(params, 'name'), id: resolveParam(params, 'id'), onNavigate: navigate })),
    },
};
export default contrib;
//# sourceMappingURL=index.js.map