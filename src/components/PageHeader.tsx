import React from 'react';
import Button from './ui/Button';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, action }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-lg text-gray-600">{subtitle}</p>
          )}
        </div>
        {action && (
          <Button onClick={action.onClick} size="lg">
            {action.icon && <span className="mr-2">{action.icon}</span>}
            {action.label}
          </Button>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
