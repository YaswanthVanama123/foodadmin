import React, { useState } from 'react';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { OrderStatus } from '../../types';
import { ORDER_STATUS_CONFIG } from '../../utils/constants';
import { Loader2 } from 'lucide-react';

interface OrderStatusDropdownProps {
  currentStatus: OrderStatus;
  orderId: string;
  onStatusChange: (orderId: string, status: OrderStatus) => Promise<void>;
}

const OrderStatusDropdown: React.FC<OrderStatusDropdownProps> = ({
  currentStatus,
  orderId,
  onStatusChange,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const statusOptions = Object.entries(ORDER_STATUS_CONFIG).map(([value, config]) => ({
    value,
    label: config.label,
  }));

  const handleUpdate = async () => {
    if (selectedStatus === currentStatus) return;

    setIsUpdating(true);
    try {
      await onStatusChange(orderId, selectedStatus);
    } catch (error) {
      console.error('Failed to update status:', error);
      setSelectedStatus(currentStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  const hasChanged = selectedStatus !== currentStatus;

  return (
    <div className="flex items-center space-x-2">
      <Select
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
        options={statusOptions}
        className="min-w-[150px]"
        disabled={isUpdating}
      />
      {hasChanged && (
        <Button
          size="sm"
          onClick={handleUpdate}
          isLoading={isUpdating}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Updating...
            </>
          ) : (
            'Update'
          )}
        </Button>
      )}
    </div>
  );
};

export default OrderStatusDropdown;
