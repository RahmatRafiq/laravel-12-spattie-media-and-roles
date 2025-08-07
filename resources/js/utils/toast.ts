import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export interface ToastOptions {
    text: string;
    type?: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
}

export function showToast({ text, type = 'info', duration = 3000 }: ToastOptions) {
    const className = type === 'success' ? 'success' : 
                     type === 'error' ? 'error' : 
                     type === 'warning' ? 'warning' : 
                     'info';

    Toastify({
        text,
        className,
        duration,
        gravity: 'top',
        position: 'right',
        style: {
            background: type === 'success' ? '#10b981' :
                       type === 'error' ? '#ef4444' :
                       type === 'warning' ? '#f59e0b' :
                       '#3b82f6'
        }
    }).showToast();
}

export const toast = {
    success: (text: string, duration?: number) => showToast({ text, type: 'success', duration }),
    error: (text: string, duration?: number) => showToast({ text, type: 'error', duration }),
    warning: (text: string, duration?: number) => showToast({ text, type: 'warning', duration }),
    info: (text: string, duration?: number) => showToast({ text, type: 'info', duration }),
};
