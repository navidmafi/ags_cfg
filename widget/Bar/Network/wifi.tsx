import { createBinding, For } from "ags";
import { Gtk } from "ags/gtk4";
import AstalNetwork from "gi://AstalNetwork?version=0.1";
import { bindIP } from "./util";

export function WifiPopover() {
  const astalNetwork = AstalNetwork.get_default();
  const wifi = astalNetwork.wifi;
  const wifiAPs = createBinding(wifi, "accessPoints");
  const activeAP = createBinding(wifi, "activeAccessPoint");
  const scanning = createBinding(wifi, "scanning");
  const enabled = createBinding(wifi, "enabled");

  const ip = bindIP(wifi.device);

  return (
    <Gtk.Box class={"p-4"} orientation={Gtk.Orientation.VERTICAL} spacing={6}>
      <Gtk.Label class={"text-3xl font-bold"} label={"Wi-Fi"} />

      <Gtk.Label
        wrap
        widthChars={20}
        maxWidthChars={20}
        wrapMode={Gtk.WrapMode.WORD}
        halign={Gtk.Align.CENTER}
        label={wifi.device.product}
      />

      {/* Device IP info */}
      <Gtk.Label label={ip.gateway4.as((g) => `Gateway: ${g}`)} />
      <Gtk.Label label={ip.ipv4Addresses.as((a) => `IPv4: ${a}`)} />
      <Gtk.Label label={ip.ipv6Addresses.as((a) => `IPv6: ${a}`)} />
      <Gtk.Label label={ip.dns4.as((d) => `DNS: ${d}`)} />

      <Gtk.Box hexpand>
        <Gtk.Label
          halign={Gtk.Align.START}
          label={enabled.as((v) => (v ? "On" : "Off"))}
          hexpand
        />
        <Gtk.Switch
          active={enabled}
          onNotifyActive={(sw) => wifi.set_enabled(sw.active)}
        />
      </Gtk.Box>

      <Gtk.ScrolledWindow
        vexpand
        hexpand
        minContentHeight={200} // optional, choose whatever height you want
      >
        <Gtk.Box orientation={Gtk.Orientation.VERTICAL} spacing={4}>
          <For
            each={wifiAPs.as<AstalNetwork.AccessPoint[]>((aps) =>
              aps.sort((a, b) => b.strength - a.strength)
            )}
          >
            {(ap) => (
              <Gtk.Box
                spacing={10}
                class={activeAP.as((wap) => {
                  const base = "rounded-lg p-2 hover:brightness-125";
                  const color =
                    wap?.ssid === ap.ssid
                      ? "bg-primary text-on_primary"
                      : "bg-surface text-on_surface";
                  return `${base} ${color}`;
                })}
              >
                <Gtk.GestureClick
                  onPressed={() => ap.activate(null, () => {})}
                />
                <Gtk.Image pixelSize={32} iconName={ap.iconName} />
                <Gtk.Box orientation={Gtk.Orientation.VERTICAL}>
                  <Gtk.Label
                    class={"text-lg font-bold"}
                    halign={Gtk.Align.START}
                    label={ap.ssid}
                  />
                  <Gtk.Label
                    halign={Gtk.Align.START}
                    label={`${ap.strength} dBm`}
                  />
                  <Gtk.Label
                    halign={Gtk.Align.START}
                    label={`${ap.frequency} MHz`}
                  />
                </Gtk.Box>
              </Gtk.Box>
            )}
          </For>
        </Gtk.Box>
      </Gtk.ScrolledWindow>
      <Gtk.Label label={"Scanning..."} visible={scanning} />

      <Gtk.Button class={"text-white"} onClicked={() => wifi.scan()}>
        Scan
      </Gtk.Button>
    </Gtk.Box>
  );
}
