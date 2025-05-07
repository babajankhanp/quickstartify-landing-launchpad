
import { Handle, Position } from '@xyflow/react';
import { Database } from 'lucide-react';

export function ApiTriggerNode({ data, isConnectable }) {
  const milestones = data.milestones || [];
  const milestonesCount = milestones.length;
  const nodeBackground = data.styling?.background || 'bg-white dark:bg-gray-800';
  const nodeBorder = data.styling?.border || 'border-purple-200 dark:border-purple-900';
  const textColor = data.styling?.textColor || 'text-foreground';
  
  return (
    <div className={`api-trigger-node px-4 py-3 ${nodeBackground} border ${nodeBorder} rounded-md shadow-sm`}>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="!bg-quickstartify-purple !border-purple-400"
      />
      <div className={`font-medium flex items-center gap-2 ${textColor}`}>
        <Database className="h-4 w-4" />
        {data.label}
      </div>
      
      {milestonesCount > 0 ? (
        <div className={`text-xs ${textColor}`}>
          {milestonesCount} milestone{milestonesCount > 1 ? 's' : ''}
          <div className="flex gap-1 mt-1 overflow-x-auto pb-1">
            {milestones.map((milestone, idx) => (
              <div 
                key={idx} 
                className="h-1.5 rounded-full bg-quickstartify-purple flex-grow" 
                title={milestone.title}
              />
            ))}
          </div>
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
