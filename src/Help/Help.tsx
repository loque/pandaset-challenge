import { useState } from "react";
import classes from "./Help.module.css";

export function Help() {
  const [showHelp, setShowHelp] = useState(false);
  return (
    <>
      <div className={classes.helpButtonWrapper}>
        <button
          className={classes.helpButton}
          onClick={() => setShowHelp(true)}
        >
          ? Help
        </button>
      </div>
      {showHelp && (
        <>
          <div
            className={classes.helpBackground}
            onClick={() => setShowHelp(false)}
          />
          <div className={classes.helpWrapper}>
            <h3>Help</h3>
            <p>
              Use the arrow keys to move the camera around the scene. The camera
              moves forward and backward with the up and down arrow keys, and
              rotates left and right with the left and right arrow keys.
            </p>
            <p>
              You can also use the W, A, S, and D keys to move the camera
              forward, left, backward, and right, respectively.
            </p>
          </div>
        </>
      )}
    </>
  );
}
