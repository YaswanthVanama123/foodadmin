import React from 'react';
import KitchenColumn from './KitchenColumn';
import { Order, OrderStatus } from '../../types';
import { Clock, ChefHat, CheckCircle } from 'lucide-react';

interface KitchenBoardProps {
  receivedOrders: Order[];
  preparingOrders: Order[];
  readyOrders: Order[];
  onStatusChange: (orderId: string, newStatus: OrderStatus) => Promise<void>;
  onOrderClick?: (order: Order) => void;
}

const KitchenBoard: React.FC<KitchenBoardProps> = ({
  receivedOrders,
  preparingOrders,
  readyOrders,
  onStatusChange,
  onOrderClick,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <KitchenColumn
        title="Received"
        status="received"
        orders={receivedOrders}
        icon={<Clock className="h-5 w-5" />}
        color="blue"
        onStatusChange={onStatusChange}
        onOrderClick={onOrderClick}
      />
      <KitchenColumn
        title="Preparing"
        status="preparing"
        orders={preparingOrders}
        icon={<ChefHat className="h-5 w-5" />}
        color="yellow"
        onStatusChange={onStatusChange}
        onOrderClick={onOrderClick}
      />
      <KitchenColumn
        title="Ready"
        status="ready"
        orders={readyOrders}
        icon={<CheckCircle className="h-5 w-5" />}
        color="green"
        onStatusChange={onStatusChange}
        onOrderClick={onOrderClick}
      />
    </div>
  );
};

export default KitchenBoard;
