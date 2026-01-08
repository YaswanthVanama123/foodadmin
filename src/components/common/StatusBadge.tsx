import React from 'react';
import { OrderStatus } from '../../types';
import { ORDER_STATUS_CONFIG } from '../../utils/constants';
import {
  Clock,
  ChefHat,
  CheckCircle,
  Coffee,
  XCircle
} from 'lucide-react';

interface StatusBadgeProps {
  status: OrderStatus;
  showIcon?: boolean;
}

const statusIcons = {
  received: Clock,
  preparing: ChefHat,
  ready: CheckCircle,
  served: Coffee,
  cancelled: XCircle,
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, showIcon = true }) => {
  const config = ORDER_STATUS_CONFIG[status];
  const Icon = statusIcons[status];

  if (!config) return null;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${config.bgColor} ${config.textColor}`}
    >
      {showIcon && Icon && <Icon className="h-3.5 w-3.5 mr-1.5" />}
      {config.label}
    </span>
  );
};

export default StatusBadge;
