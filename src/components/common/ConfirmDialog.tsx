import React from 'react';
import Modal, { ModalBody, ModalFooter } from '../ui/Modal';
import Button from '../ui/Button';
import { AlertCircle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary';
  isLoading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'primary',
  isLoading = false,
}) => {
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <ModalBody>
        <div className="flex items-start space-x-4">
          {variant === 'danger' && (
            <div className="flex-shrink-0">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
          )}
          <p className="text-gray-700">{message}</p>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button
          variant="ghost"
          onClick={onClose}
          disabled={isLoading}
        >
          {cancelLabel}
        </Button>
        <Button
          variant={variant}
          onClick={handleConfirm}
          isLoading={isLoading}
        >
          {confirmLabel}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ConfirmDialog;
