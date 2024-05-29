import React from 'react';
import { ReactFlowProvider } from 'reactflow';
import ReactFlowMain from './ReactFlowMain';

const Main = () => (
    <ReactFlowProvider>
        <ReactFlowMain />
    </ReactFlowProvider>
);

export default Main;
