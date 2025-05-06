
import { Handle, Position } from '@xyflow/react';

export function ModalNode({ data, isConnectable }) {
  const milestones = data.milestones || [];
  const milestonesCount = milestones.length;
  
  return (
    <div className="modal-node px-4 py-3 bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-900 rounded-md shadow-sm">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="!bg-quickstartify-purple !border-purple-400"
      />
      <div className="font-medium">{data.label}</div>
      {milestonesCount > 0 ? (
        <div className="text-xs text-muted-foreground">
          {milestonesCount} milestone{milestonesCount > 1 ? 's' : ''}
        </div>
      ) : (
        <div className="text-xs text-muted-foreground truncate max-w-[140px]">{data.content}</div>
      )}
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="!bg-quickstartify-purple !border-purple-400"
      />
    </div>
  );
}
