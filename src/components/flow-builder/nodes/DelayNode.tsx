
import { Handle, Position } from '@xyflow/react';
import { Clock } from 'lucide-react';

export function DelayNode({ data, isConnectable }) {
  return (
    <div className="delay-node px-4 py-3 bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-900 rounded-md shadow-sm">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="!bg-quickstartify-purple !border-purple-400"
      />
      <div className="font-medium flex items-center gap-2">
        <Clock className="h-4 w-4" />
        {data.label}
      </div>
      <div className="text-xs text-muted-foreground">{data.content || "Delay for 5s"}</div>
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="!bg-quickstartify-purple !border-purple-400"
      />
    </div>
  );
}
