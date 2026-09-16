import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  variant?: 'destructive' | 'primary';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  loading = false,
  variant = 'destructive'
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="sm">
      <div className="flex flex-col items-center text-center space-y-4 pt-2">
        <div className={`p-3 rounded-full ${variant === 'destructive' ? 'bg-destructive/15 text-destructive' : 'bg-primary/15 text-primary'}`}>
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div>
          <h4 className="text-base font-bold text-foreground">{title}</h4>
          <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{message}</p>
        </div>
        <div className="flex items-center justify-end gap-3 w-full pt-4 border-t border-border">
          <Button variant="outline" size="sm" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button variant={variant} size="sm" onClick={onConfirm} loading={loading}>
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
