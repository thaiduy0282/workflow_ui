import React, { createContext, useState } from 'react';

export const WorkflowContext = createContext<any>(null);

export const WorkflowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [workflowData, setWorkflowData] = useState({
        workflowName: '',
        folder: '',
        triggerType: '',
    });

    return (
        <WorkflowContext.Provider value={{ workflowData, setWorkflowData }}>
            {children}
        </WorkflowContext.Provider>
    );
};
