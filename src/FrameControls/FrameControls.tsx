import classes from "./FrameControls.module.css";

interface FrameControlsProps {
  currentFrame: number;
  isLoading: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onFrameChange: (frame: number) => void;
}

export function FrameControls({
  currentFrame,
  isLoading,
  onPrevious,
  onNext,
  onFrameChange,
}: FrameControlsProps) {
  return (
    <div className={classes.frameControls}>
      <button
        onClick={onPrevious}
        disabled={currentFrame === 0 || isLoading}
        className={classes.button}
      >
        Previous
      </button>
      <div className={classes.rangeWrapper}>
        <span className={classes.rangeLabel}>
          {currentFrame.toString().padStart(2, "0")}/49
        </span>
        <input
          type="range"
          min="0"
          max="49"
          value={currentFrame}
          onChange={(e) => onFrameChange(Number(e.target.value))}
          disabled={isLoading}
          className={classes.rangeInput}
        />
      </div>
      <button
        onClick={onNext}
        disabled={currentFrame === 49 || isLoading}
        className={classes.button}
      >
        Next
      </button>
    </div>
  );
}
