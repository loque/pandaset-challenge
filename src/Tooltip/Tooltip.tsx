import { Cuboid } from "../types";
import * as classes from "./Tooltip.module.css";

interface TooltipProps {
  content?: Cuboid;
}

export function Tooltip({ content }: TooltipProps) {
  if (!content) {
    return null;
  }

  return (
    <div className={classes.tooltipScreen}>
      <div className={classes.tooltipWrapper}>
        {content && (
          <>
            <h3>Cuboid {content.label}</h3>
            <table>
              <tbody>
                <tr>
                  <td>
                    <label>UUID</label>
                  </td>
                  <td>{content.uuid}</td>
                </tr>
                <tr>
                  <td>
                    <label>Position</label>
                  </td>
                  <td className={classes.grid3}>
                    <span>{content["position.x"]}</span>
                    <span>{content["position.y"]}</span>
                    <span>{content["position.z"]}</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <label>Dimensions</label>
                  </td>
                  <td className={classes.grid3}>
                    <span>{content["dimensions.x"]}</span>
                    <span>{content["dimensions.y"]}</span>
                    <span>{content["dimensions.z"]}</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <label>Yaw</label>
                  </td>
                  <td>{content.yaw}</td>
                </tr>
                <tr>
                  <td>
                    <label>Camera Used</label>
                  </td>
                  <td>{content.camera_used}</td>
                </tr>
                <tr>
                  <td>
                    <label>Stationary</label>
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={content.stationary}
                      readOnly
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}
