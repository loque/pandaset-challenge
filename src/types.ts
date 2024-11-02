export interface Cuboid {
  uuid: string;
  label: string;
  yaw: number;
  stationary: boolean;
  camera_used: number;
  "position.x": number;
  "position.y": number;
  "position.z": number;
  "dimensions.x": number;
  "dimensions.y": number;
  "dimensions.z": number;
  "cuboids.sibling_id": string;
  "cuboids.sensor_id": number;
}
