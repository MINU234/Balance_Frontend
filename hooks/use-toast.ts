import { toast as sonnerToast } from 'sonner';

export const useToast = () => {
  return {
    toast: (options: { title?: string; description?: string; variant?: 'default' | 'destructive' }) => {
      if (options.variant === 'destructive') {
        sonnerToast.error(options.title || options.description || 'Error');
      } else {
        sonnerToast.success(options.title || options.description || 'Success');
      }
    }
  };
};

export const toast = (options: { title?: string; description?: string; variant?: 'default' | 'destructive' }) => {
  if (options.variant === 'destructive') {
    sonnerToast.error(options.title || options.description || 'Error');
  } else {
    sonnerToast.success(options.title || options.description || 'Success');
  }
};