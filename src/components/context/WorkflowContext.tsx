import React, { createContext, useState, ReactNode } from 'react';

interface WorkflowData {
    workflowName: string;
    folder: string;
    triggerType: string;
}

interface WorkflowContextProps {
    workflowData: WorkflowData;
    setWorkflowData: React.Dispatch<React.SetStateAction<WorkflowData>>;
}

export const WorkflowContext = createContext<WorkflowContextProps | null>(null);

export const WorkflowProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [workflowData, setWorkflowData] = useState<WorkflowData>({
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