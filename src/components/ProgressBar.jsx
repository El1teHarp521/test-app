import './ProgressBar.css';

function ProgressBar({
    progress = 0,
    label = "Прогресс",
    color = "default",
    height = "medium",
    showLabel = true,
    showPercentage = true,
    className = ""
}) {
    const progressClass = color !== "default" ? color : "";
    const heightClass = height;
    const hasText = showPercentage && progress > 0;

    return (
        <div className={`progress-bar-wrapper ${className}`}>
            {showLabel && (
                <div className="progress-bar-label">
                    <span>{label}</span>
                    {showPercentage && <span>{Math.min(100, Math.max(0, progress))}%</span>}
                </div>
            )}
            <div className={`progress-bar-container ${heightClass}`}>
                <div
                    className={`progress-bar-fill ${progressClass} ${hasText ? 'has-text' : ''}`}
                    style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                >
                    {hasText && `${Math.min(100, Math.max(0, progress))}%`}
                </div>
            </div>
        </div>
    );
}

export default ProgressBar;