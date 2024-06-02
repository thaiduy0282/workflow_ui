import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/WorkflowSetup.css';
import { WorkflowContext } from '../components/context/WorkflowContext';

const WorkflowSetup: React.FC = () => {
    const context = useContext(WorkflowContext);
    const { workflowData, setWorkflowData } = context!;
    const [workflowName, setWorkflowName] = useState(workflowData.workflowName);
    const [folder, setFolder] = useState(workflowData.folder);
    const [triggerType, setTriggerType] = useState(workflowData.triggerType);
    const navigate = useNavigate();

    const handleSubmit = () => {
        if (!workflowName || !folder || !triggerType) {
            alert('Please fill in all fields');
            return;
        }
        setWorkflowData({ workflowName, folder, triggerType });
        navigate('/main');
    };

    const triggers = [
        { label: 'By event', symbol: 'E' },
        { label: 'By scheduler', symbol: 'S' },
        { label: 'By manual', symbol: 'M' },
        { label: 'By ...', symbol: '...' }
    ];

    return (
        <div className="workflow-setup">
            <div className="form-group">
                <label>Workflow Name</label>
                <input type="text" value={workflowName} onChange={(e) => setWorkflowName(e.target.value)} />
            </div>
            <div className="form-group">
                <label>Folder</label>
                <input type="text" value={folder} onChange={(e) => setFolder(e.target.value)} />
            </div>
            <div className="form-group">
                <label>Trigger Type</label>
                <div className="trigger-options">
                    {triggers.map((trigger, index) => (
                        <button key={index}
                                className={`trigger-button ${triggerType === trigger.label ? 'active' : ''}`}
                                onClick={() => setTriggerType(trigger.label)}>
                            {trigger.symbol}
                        </button>
                    ))}
                </div>
            </div>
            <div className="form-actions">
                <button className="button-secondary" onClick={() => navigate('/')}>Cancel</button>
                <button className="button-primary" onClick={handleSubmit}>Create</button>
            </div>
        </div>
    );
};

export default WorkflowSetup;