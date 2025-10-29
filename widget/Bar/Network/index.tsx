import { Gtk } from "ags/gtk4";

import { Accessor, createBinding } from "ags";
import AstalNetwork from "gi://AstalNetwork?version=0.1";

export default function () {
  const { wifi, wired } = AstalNetwork.get_default();
  const wifiIcon =
    createBinding(wifi, "iconName")?.as((i) => i) ||
    "network-wireless-disabled-symbolic";
  const wifiFreq =
    createBinding(wifi, "frequency")?.as((f) => `${f}MHz`) || "0MHz";
  const wifiSSID = createBinding(wifi, "ssid") || "Disconnected";
  const wifiBW =
    createBinding(wifi, "bandwidth")?.as((b) => `${b}Mbps`) || "0Mbps";
  const wifiDev = createBinding(wifi, "device") || "Unknown";
  const wifiDevName = wifiDev?.as((w) => w?.product) || "Unknown";
  const wifiGW =
    wifiDev?.as((d) => d?.ip4_config)?.as((iface) => iface?.gateway) ||
    "No Gateway";

  const wiredIcon =
    createBinding(wired, "iconName") || "network-wired-disconnected-symbolic";
  const wiredDev = createBinding(wired, "device");
  const wiredMac = wiredDev?.as((w) => w?.perm_hw_address) || "No MAC";
  const wiredGW =
    wiredDev
      ?.as((w) => w?.ip4_config)
      ?.as((iface) => iface?.gateway || "No GW") || "No GW";
  const wiredDevName = wiredDev?.as((w) => w?.interface) || "Unknown";
  // const wiredConn = createBinding(wired, "connection");
  // const wiredInet = createBinding(wired, "internet");
  const wiredSpeed =
    createBinding(wired, "speed")?.as((b) => `${b}Mbps`) || "0Mbps";

  return (
    <Gtk.MenuButton class={"BarItemContainer traymenubtn"}>
      <popover hasArrow={false} widthRequest={300}>
        <Gtk.Box orientation={Gtk.Orientation.VERTICAL} spacing={5}>
          <Gtk.Box orientation={Gtk.Orientation.HORIZONTAL} spacing={2}>
            <Gtk.Image pixelSize={50} iconName={wifiIcon} />
            <Gtk.Box orientation={Gtk.Orientation.VERTICAL} spacing={4}>
              <Gtk.Label
                css={"font-size:20px;"}
                label={wifiSSID}
                halign={Gtk.Align.START}
              />
              <Gtk.Label halign={Gtk.Align.START} label={wifiFreq} />
              <Gtk.Label halign={Gtk.Align.START} label={wifiBW} />
              <Gtk.Label halign={Gtk.Align.START} label={wifiGW} />
              {/*<Gtk.Label*/}
              {/*    halign={Gtk.Align.START}*/}
              {/*    label={wifiDevName}/>*/}
            </Gtk.Box>
          </Gtk.Box>
          <Gtk.Separator
            css={`
              background-color: #fff;
            `}
          />
          <Gtk.Box orientation={Gtk.Orientation.HORIZONTAL} spacing={2}>
            <Gtk.Image pixelSize={50} iconName={wiredIcon} />
            <Gtk.Box orientation={Gtk.Orientation.VERTICAL} spacing={4}>
              <Gtk.Label
                css={"font-size:20px;"}
                label={wiredDevName}
                halign={Gtk.Align.START}
              />
              <Gtk.Label halign={Gtk.Align.START} label={wiredSpeed} />
              <Gtk.Label halign={Gtk.Align.START} label={wiredGW} />
              <Gtk.Label halign={Gtk.Align.START} label={wiredMac} />
            </Gtk.Box>
          </Gtk.Box>
        </Gtk.Box>
      </popover>
      <Gtk.Box hexpand vexpand spacing={4}>
        <Gtk.Image hexpand iconName={wifiIcon} />
        <Gtk.Label label={wifiSSID} />
      </Gtk.Box>
    </Gtk.MenuButton>
  );
}
