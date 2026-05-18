interface ModalProps {
    title: string;
    onClose: () => void;
    children: React.ReactNode;
    maxWidth?: string;
  }
  
  export function Modal({ title, onClose, children, maxWidth = "600px" }: ModalProps) {
    return (
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-[4px] z-[2000] flex items-center justify-center p-5"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <div 
          className="glass-card w-full max-h-[90vh] overflow-y-auto" 
          style={{ maxWidth }}
        >
          <div className="flex justify-between items-center mb-7">
            <h2 className="text-[1.2rem] font-black tracking-tight">{title}</h2>
            <button 
              onClick={onClose} 
              className="text-[var(--text-dim)] text-[1.2rem] hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
          {children}
        </div>
      </div>
    );
  }