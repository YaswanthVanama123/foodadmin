import React from 'react';
import { AlertCircle } from 'lucide-react';
import Button from '../ui/Button';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  message,
  onRetry,
  retryLabel = 'Try Again',
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="text-red-500 mb-4">
        <AlertCircle className="h-16 w-16" />
      </div>
      <p className="text-gray-700 text-center text-lg mb-6">{message}</p>
      {onRetry && (
        <Button variant="primary" onClick={onRetry}>
          {retryLabel}
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
