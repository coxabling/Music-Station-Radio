import React, { useEffect, useState, useRef } from 'react';
import type { ToastData } from '../types';

interface ToastProps extends ToastData {
  onRemove: () => void;
}

const Toast: React.FC<ToastProps> = ({ title, message, icon: Icon, type = 'achievement', onRemove }) => {
    const [isExiting, setIsExiting] = useState(false);
    const onRemoveRef = useRef(onRemove);
    onRemoveRef.current = onRemove;

    useEffect(() => {
        const exitTimer = setTimeout(() => {
            setIsExiting(true);
            setTimeout(() => onRemoveRef.current(), 300); 
        }, 4000);

        return () => {
            clearTimeout(exitTimer);
        };
    }, []);

    const getBaseStyle = () => {
        switch(type) {
            case 'milestone':
                return 'bg-gradient-to-br from-yellow-800/80 to-yellow-900/80 border-yellow-500/50';
            case 'theme_unlocked':
                return 'bg-gradient-to-br from-purple-800/80 to-indigo-900/80 border-purple-500/50';
            default:
                return 'bg-gray-800/80 border-gray-600/50';
        }
    }

    const titleText = type === 'achievement' ? 'Achievement Unlocked!' : title;
    const messageText = type === 'achievement' ? title : message;

    return (
        <div 
            className={`flex items-center gap-4 w-full max-w-xs p-4 text-gray-200 backdrop-blur-lg border rounded-lg shadow-2xl transition-all duration-300 ease-in-out ${getBaseStyle()} ${isExiting ? 'animate-slide-out-right' : 'animate-slide-in-right'}`}
            role="alert"
        >
            <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 accent-color-text bg-gray-900 rounded-lg">
                <Icon className="w-5 h-5" />
            </div>
            <div className="text-sm">
                <p className="font-semibold">{titleText}</p>
                {messageText && <p className="text-xs text-gray-400">{messageText}</p>}
            </div>
        </div>
    );
};

interface ToastContainerProps {
    toasts: ToastData[];
    setToasts: React.Dispatch<React.SetStateAction<ToastData[]>>;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, setToasts }) => {
    const handleRemoveToast = (id: number) => {
        setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    };

    return (
        <div className="fixed bottom-4 right-4 z-[200] w-full max-w-xs space-y-3">
            {toasts.map(toast => (
                <Toast key={toast.id} {...toast} onRemove={() => handleRemoveToast(toast.id)} />
            ))}
            <style>{`
                @keyframes slide-in-right {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                .animate-slide-in-right {
                    animation: slide-in-right 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
                }
                @keyframes slide-out-right {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
                .animate-slide-out-right {
                    animation: slide-out-right 0.5s cubic-bezier(0.55, 0.085, 0.68, 0.53) both;
                }
            `}</style>
        </div>
    );
};
