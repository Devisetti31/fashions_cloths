import React from 'react';
import { Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import './Toast.css';

export default function Toast() {
  const { toastMessage } = useShop();

  if (!toastMessage) return null;

  return (
    <div className="boutique-toast" role="status" aria-live="polite">
      <Sparkles size={16} className="toast-sparkle" aria-hidden="true" />
      <span>{toastMessage}</span>
    </div>
  );
}
