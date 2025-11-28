import NM from "gi://NM?version=1.0";

export const wiredDeviceStateIconMap: Record<NM.DeviceState, string> = {
  [NM.DeviceState.UNKNOWN]: "network-wired-unavailable-symbolic",
  [NM.DeviceState.UNMANAGED]: "network-wired-unavailable-symbolic",
  [NM.DeviceState.UNAVAILABLE]: "network-wired-unavailable-symbolic",
  [NM.DeviceState.DISCONNECTED]: "network-wired-disconnected-symbolic",
  [NM.DeviceState.PREPARE]: "network-wired-acquiring-symbolic",
  [NM.DeviceState.CONFIG]: "network-wired-acquiring-symbolic",
  [NM.DeviceState.NEED_AUTH]: "network-wired-error-symbolic",
  [NM.DeviceState.IP_CONFIG]: "network-wired-acquiring-symbolic",
  [NM.DeviceState.IP_CHECK]: "network-wired-acquiring-symbolic",
  [NM.DeviceState.SECONDARIES]: "network-wired-acquiring-symbolic",
  [NM.DeviceState.ACTIVATED]: "network-wired-activated-symbolic",
  [NM.DeviceState.DEACTIVATING]: "network-wired-acquiring-symbolic",
  [NM.DeviceState.FAILED]: "network-wired-error-symbolic",
} as const;

export const getStrengthIconPrefix = (strength: number) => {
  const bins = [0, 20, 40, 60, 80, 100];
  // nearest-bin rounding
  const nearest = bins.reduce((prev, curr) =>
    Math.abs(curr - strength) < Math.abs(prev - strength) ? curr : prev
  );
  return nearest;
};

export const getWirelessIcon = (state: NM.DeviceState, strength: number) => {
  if (
    state !== NM.DeviceState.ACTIVATED &&
    state !== NM.DeviceState.NEED_AUTH
  ) {
    return wirelessDeviceStateIconMap[state];
  }

  const nearest = getStrengthIconPrefix(strength);
  if (state === NM.DeviceState.NEED_AUTH) {
    return `network-wireless-${nearest}-limited-symbolic`;
  }
  return `network-wireless-connected-${nearest}-symbolic`;
};

export const wirelessDeviceStateIconMap: Record<NM.DeviceState, string> = {
  [NM.DeviceState.UNKNOWN]: "network-wireless-disabled-symbolic",
  [NM.DeviceState.UNMANAGED]: "network-wireless-disabled-symbolic",
  [NM.DeviceState.UNAVAILABLE]: "network-wireless-disabled-symbolic",
  [NM.DeviceState.DISCONNECTED]: "network-wireless-disconnected-symbolic",
  [NM.DeviceState.PREPARE]: "network-wireless-acquiring-symbolic",
  [NM.DeviceState.CONFIG]: "network-wireless-acquiring-symbolic",
  [NM.DeviceState.IP_CONFIG]: "network-wireless-acquiring-symbolic",
  [NM.DeviceState.IP_CHECK]: "network-wireless-acquiring-symbolic",
  [NM.DeviceState.SECONDARIES]: "network-wireless-acquiring-symbolic",
  [NM.DeviceState.DEACTIVATING]: "network-wireless-acquiring-symbolic",
  [NM.DeviceState.FAILED]: "network-wireless-error-symbolic",
} as const;
