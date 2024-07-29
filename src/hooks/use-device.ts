import { useCallback, useEffect, useState } from "react";
import * as Device from "expo-device";

export type Devices =
  /**
   * An unrecognized device type.
   */
  | "UNKNOWN"
  /**
   * Mobile phone handsets, typically with a touch screen and held in one hand.
   */
  | "PHONE"
  /**
   * Tablet computers, typically with a touch screen that is larger than a usual phone.
   */
  | "TABLET"
  /**
   * Desktop or laptop computers, typically with a keyboard and mouse.
   */
  | "DESKTOP"
  /**
   * Device with TV-based interfaces.
   */
  | "TV";

export const useDevice = () => {
  const [device, setDevice] = useState<Device.DeviceType>();

  useEffect(() => {
    Device.getDeviceTypeAsync().then((deviceType) => setDevice(deviceType));
  }, []);

  return {
    type: (device ? Device.DeviceType[device] : null) as Devices,
  };
};
