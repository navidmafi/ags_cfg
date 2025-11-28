import { createBinding, For, With } from "ags";
import { Gtk } from "ags/gtk4";
import AstalNetwork from "gi://AstalNetwork?version=0.1";
import { IPInfo } from "./ip";
import NM from "gi://NM?version=1.0";
import GLib from "gi://GLib?version=2.0";
import { getStrengthIconPrefix } from "./icons";
import { decodeSSID } from "./utils";

export function WifiPopover({ device }: { device: NM.DeviceWifi }) {
  const astalNetwork = AstalNetwork.get_default();
  const wifiAPs = createBinding(device, "accessPoints");
  const activeAP = createBinding(device, "activeAccessPoint");
  const activeConn = createBinding(device, "activeConnection");
  const state = createBinding(device, "state");

  // const scanning = createBinding(device, "scanning");
  const enabled = createBinding(astalNetwork.wifi, "enabled");
  const enabledLabel = enabled.as((v) => (v ? "On" : "Off"));

  let scanStateLabel: Gtk.Label;
  return (
    <Gtk.Box class={"p-4"} orientation={Gtk.Orientation.VERTICAL} spacing={6}>
      <Gtk.Label class={"text-3xl font-bold"} label={"Wi-Fi"} />

      <Gtk.Label
        wrap
        widthChars={20}
        maxWidthChars={20}
        wrapMode={Gtk.WrapMode.WORD}
        halign={Gtk.Align.CENTER}
        label={device.product}
      />

      <Gtk.Box hexpand>
        <Gtk.Label halign={Gtk.Align.START} label={enabledLabel} hexpand />
        <Gtk.Switch
          active={astalNetwork.wifi.enabled}
          onNotifyActive={(ws) => astalNetwork.wifi.set_enabled(ws.state)}
        />
      </Gtk.Box>

      <Gtk.ScrolledWindow
        vexpand
        hexpand
        minContentHeight={200} // optional, choose whatever height you want
      >
        <Gtk.Box orientation={Gtk.Orientation.VERTICAL} spacing={4}>
          <For
            id={(ap) => ap.bssid}
            each={wifiAPs.as<NM.AccessPoint[]>((aps) =>
              aps.sort((a, b) => b.strength - a.strength)
            )}
          >
            {(ap) => (
              <Gtk.Box
                spacing={10}
                class={activeAP.as((ws) => {
                  const base = "rounded-lg p-2 hover:brightness-125";
                  const color =
                    decodeSSID(ws?.ssid) === decodeSSID(ap.ssid)
                      ? "bg-primary text-on_primary"
                      : "bg-surface text-on_surface";
                  return `${base} ${color}`;
                })}
              >
                <Gtk.GestureClick
                  onPressed={() => {
                    console.log(ap.path);
                    console.log(device.client.connections.map((c) => c.path));
                    device.client.activate_connection_async(
                      device.client.connections.find((c) => c.path === ap.path),
                      device,
                      null,
                      null,
                      null
                    );
                  }}
                />
                <Gtk.Overlay>
                  <Gtk.Image
                    pixelSize={32}
                    iconName={`network-wireless-connected-${getStrengthIconPrefix(ap.strength)}-symbolic`}
                  />
                  <Gtk.Image
                    pixelSize={22}
                    $type={"overlay"}
                    visible={ap.rsnFlags > 0x0}
                    valign={Gtk.Align.CENTER}
                    halign={Gtk.Align.CENTER}
                    class={"ml-7 mt-5 text-on_surface rounded-sm"}
                    iconName={"lock-symbolic"}
                  />
                </Gtk.Overlay>
                <Gtk.Box orientation={Gtk.Orientation.VERTICAL}>
                  <Gtk.Label
                    class={"text-lg font-bold"}
                    halign={Gtk.Align.START}
                    label={decodeSSID(ap.ssid) || "<NO SSID>"}
                  />

                  <Gtk.Label
                    halign={Gtk.Align.START}
                    label={`${ap.frequency} MHz - ${ap.strength}%`}
                  />

                  <IPInfo
                    visible={activeAP.as(
                      (aap) => decodeSSID(aap?.ssid) === decodeSSID(ap.ssid)
                    )}
                    d={device}
                  />
                </Gtk.Box>
              </Gtk.Box>
            )}
          </For>
        </Gtk.Box>
      </Gtk.ScrolledWindow>
      <Gtk.Label
        visible={createBinding(astalNetwork.wifi, "scanning")}
        label={"Scanning..."}
        $={(ref) => (scanStateLabel = ref)}
      />

      <Gtk.Button
        class={"text-white"}
        onClicked={() => {
          astalNetwork.wifi.scan();
          //   scanStateLabel.set_label(`Scanning...`);
          //   scanStateLabel.set_visible(true);

          //   device.request_scan_async(null, (dev, res) => {
          //     try {
          //       device.request_scan_finish(res);
          //       scanStateLabel.set_visible(false);
          //     } catch (e) {
          //       scanStateLabel.set_label(`Scan error: ${e}`);
          //       print(`Scan error: ${e}`);
          //     }
          //   });
        }}
      >
        Scan
      </Gtk.Button>
    </Gtk.Box>
  );
}
