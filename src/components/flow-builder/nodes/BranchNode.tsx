
import { Handle, Position } from '@xyflow/react';

export function BranchNode({ data, isConnectable }) {
  return (
    <div className="branch-node px-4 py-3 bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-900 rounded-md shadow-sm">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="!bg-quickstartify-purple !border-purple-400"
      />
      <div className="font-medium">{data.label}</div>
      <div className="text-xs text-muted-foreground truncate max-w-[140px]">{data.content}</div>
      
      <div className="flex justify-between mt-2">
        <Handle
          type="source"
          position={Position.Bottom}
          id="a"
          style={{ left: '25%' }}
          isConnectable={isConnectable}
          className="!bg-quickstartify-purple !border-purple-400"
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id="b"
          style={{ left: '75%' }}
          isConnectable={isConnectable}
          className="!bg-quickstartify-purple !border-purple-400"
        />
      </div>
    </div>
  );
}
