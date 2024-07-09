import { useCallback, useEffect, useState } from "react";
import * as Device from "expo-device";

import * as ScreenOrientation from "expo-screen-orientation";

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

  const changeScreenOrientation = useCallback(
    async (device: Device.DeviceType) => {
      switch (Device.DeviceType[device]) {
        case "PHONE":
          ScreenOrientation.lockAsync(
            ScreenOrientation.OrientationLock.PORTRAIT_UP
          );
          break;

        default:
          ScreenOrientation.lockAsync(
            ScreenOrientation.OrientationLock.LANDSCAPE_LEFT
          );
          break;
      }
    },
    []
  );
  useEffect(() => {
    if (device) changeScreenOrientation(device);
  }, [device]);

  return {
    type: (device ? Device.DeviceType[device] : null) as Devices,
  };
};
