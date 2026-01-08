import React from 'react';
import { Package } from 'lucide-react';
import Button from '../ui/Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  message,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="text-gray-400 mb-4">
        {icon || <Package className="h-16 w-16" />}
      </div>
      <p className="text-gray-500 text-center text-lg mb-6">{message}</p>
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
