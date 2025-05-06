
import { Handle, Position } from '@xyflow/react';

export function ModalNode({ data, isConnectable }) {
  const milestones = data.milestones || [];
  const milestonesCount = milestones.length;
  const nodeBackground = data.styling?.background || 'bg-white dark:bg-gray-800';
  const nodeBorder = data.styling?.border || 'border-purple-200 dark:border-purple-900';
  const textColor = data.styling?.textColor || 'text-foreground';
  
  return (
    <div className={`modal-node px-4 py-3 ${nodeBackground} border ${nodeBorder} rounded-md shadow-sm`}>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="!bg-quickstartify-purple !border-purple-400"
      />
      <div className={`font-medium ${textColor}`}>{data.label}</div>
      {milestonesCount > 0 ? (
        <div className={`text-xs ${textColor} opacity-75`}>
          {milestonesCount} milestone{milestonesCount > 1 ? 's' : ''}
          {milestones[0]?.title && (
            <span className="block truncate max-w-[140px]">• {milestones[0].title}</span>
          )}
        </div>
      ) : (
        <div className={`text-xs ${textColor} opacity-75 truncate max-w-[140px]`}>{data.content}</div>
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
