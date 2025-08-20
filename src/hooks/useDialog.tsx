import { useState } from "react";

type Props = {
  onConfirm: () => void;
  onClose?: () => void;
};

type Dialog = {
  open: boolean;
  loading: boolean;
  setOpen: (open: boolean) => void;
  locked: boolean;
  toggleDialog: () => void;
  closeDialog: () => void;
  confirmDialog: () => void;
  startLoading: () => void;
  stopLoading: () => void;
  lockDialog: () => void;
  unlockDialog: () => void;
};

export default function useDialog({ onConfirm, onClose }: Props): Dialog {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [locked, setLocked] = useState<boolean>(false);

  const toggleDialog = () => {
    setOpen((prev) => !prev);
  };

  const closeDialog = () => {
    setOpen(false);
    setLoading(false);
    setLocked(false);
    onClose?.();
  };

  const confirmDialog = () => {
    onConfirm();
  };

  const startLoading = () => {
    setLoading(true);
  };

  const stopLoading = () => {
    setLoading(false);
  };

  const lockDialog = () => {
    setLocked(true);
  };

  const unlockDialog = () => {
    setLocked(false);
  };

  return {
    open,
    setOpen,
    loading,
    locked,
    toggleDialog,
    closeDialog,
    confirmDialog,
    startLoading,
    stopLoading,
    lockDialog,
    unlockDialog,
  };
}
