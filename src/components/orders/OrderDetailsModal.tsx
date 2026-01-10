import React from 'react';
import Modal, { ModalBody, ModalFooter } from '../ui/Modal';
import Button from '../ui/Button';
import StatusBadge from '../common/StatusBadge';
import { Order } from '../../types';
import { formatCurrency, formatDate, getRelativeTime } from '../../utils';
import { Clock, MapPin, FileText, Receipt } from 'lucide-react';

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  isOpen,
  onClose,
  order,
}) => {
  if (!order) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Order ${order.orderNumber}`}
      size="lg"
    >
      <ModalBody>
        <div className="space-y-6">
          {/* Order Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Table</p>
                <p className="font-semibold text-gray-900">Table {order.tableNumber}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Order Time</p>
                <p className="font-semibold text-gray-900">{formatDate(order.createdAt)}</p>
                <p className="text-xs text-gray-500">{getRelativeTime(order.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <p className="text-sm text-gray-500 mb-2">Status</p>
            <StatusBadge status={order.status} />
          </div>

          {/* Items */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Receipt className="h-5 w-5 text-gray-400" />
              <h3 className="font-semibold text-gray-900">Order Items</h3>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-start pb-3 border-b border-gray-200 last:border-0 last:pb-0"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {item.quantity}x {item.name}
                    </p>
                    {item.customizations && item.customizations.length > 0 && (
                      <div className="mt-1 space-y-1">
                        {item.customizations.map((customization, idx) => (
                          <p key={idx} className="text-sm text-gray-600">
                            {customization.name}: {customization.options.join(', ')}
                          </p>
                        ))}
                      </div>
                    )}
                    {item.specialInstructions && (
                      <p className="text-sm text-gray-600 mt-1 italic">
                        Note: {item.specialInstructions}
                      </p>
                    )}
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(item.subtotal)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatCurrency(item.price)} each
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(order.subtotal)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(order.tax)}
              </span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-300">
              <span className="text-gray-900">Total</span>
              <span className="text-indigo-600">
                {formatCurrency(order.total)}
              </span>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <FileText className="h-5 w-5 text-gray-400" />
                <h3 className="font-semibold text-gray-900">Notes</h3>
              </div>
              <p className="text-gray-700 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                {order.notes}
              </p>
            </div>
          )}

          {/* Status History */}
          {order.statusHistory && order.statusHistory.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Status History</h3>
              <div className="space-y-2">
                {order.statusHistory.map((history, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-sm py-2 px-3 bg-gray-50 rounded"
                  >
                    <StatusBadge status={history.status} />
                    <span className="text-gray-600">{formatDate(history.timestamp)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </ModalBody>
      <ModalFooter>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default OrderDetailsModal;
