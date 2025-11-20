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
