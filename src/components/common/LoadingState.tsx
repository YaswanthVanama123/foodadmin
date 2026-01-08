import React from 'react';
import Spinner from '../ui/Spinner';

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading...',
  size = 'lg',
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <Spinner size={size} />
      {message && (
        <p className="mt-4 text-gray-500 text-center">{message}</p>
      )}
    </div>
  );
};

export default LoadingState;
