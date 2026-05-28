import { toast } from 'react-toastify';

export function useToast() {
  const show = ({ title, description, type = 'info', options = {} }) => {
    const content = (
      <div className="toast-content">
        {title && <div style={{ fontWeight: 600 }}>{title}</div>}
        {description && <div style={{ marginTop: 4 }}>{description}</div>}
      </div>
    );

    try {
      switch (type) {
        case 'success':
          toast.success(content, options);
          break;
        case 'error':
          toast.error(content, options);
          break;
        case 'warn':
        case 'warning':
          toast.warn(content, options);
          break;
        default:
          toast.info(content, options);
      }
    } catch (e) {
      // Fallback to alert if toast fails for any reason
      if (typeof window !== 'undefined') {
        window.alert(`${title}\n${description || ''}`);
      } else {
        // eslint-disable-next-line no-console
        console.log(title, description);
      }
    }
  };

  return { show };
}
