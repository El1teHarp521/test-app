import './Modal.css';

function Modal({
    isOpen,
    onClose,
    title,
    children,
    size = 'medium',
    showFooter = false,
    footerContent
}) {
    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="modal-backdrop" onClick={handleBackdropClick}>
            <div className={`modal-content modal-${size}`}>
                <div className="modal-header">
                    <h3>{title}</h3>
                    <button className="modal-close" onClick={onClose}>
                        ×
                    </button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
                {showFooter && footerContent && (
                    <div className="modal-footer">
                        {footerContent}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Modal;