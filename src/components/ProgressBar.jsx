import './ProgressBar.css';

function ProgressBar({
    progress = 0,
    label = "Прогресс",
    color = "#4ecdc4",
    height = 20,
    showLabel = true,
    showPercentage = true
}) {
    return (
        <div className="progress-bar-wrapper">
            {showLabel && (
                <div className="progress-bar-label">
                    <span>{label}</span>
                    {showPercentage && <span>{progress}%</span>}
                </div>
            )}
            <div
                className="progress-bar-container"
                style={{ height: `${height}px` }}
            >
                <div
                    className="progress-bar-fill"
                    style={{
                        width: `${progress}%`,
                        backgroundColor: color
                    }}
                />
            </div>
        </div>
    );
}

export default ProgressBar;