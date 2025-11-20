import { createBinding, For, With } from "ags";
import { Gtk } from "ags/gtk4";
import { bindIP } from "./util";
import NM from "gi://NM?version=1.0";

export function EthernetPopover({ d }: { d: NM.DeviceEthernet }) {
  const iface = createBinding(d, "interface");
  const vendor = createBinding(d, "vendor");
  const product = createBinding(d, "product");
  const driver = createBinding(d, "driver");
  const firmware = createBinding(d, "firmwareVersion");
  const activeConn = createBinding(d, "activeConnection");
  const available = createBinding(d, "availableConnections");
  const state = createBinding(d, "state");

  const ip = bindIP(d);

  return (
    <Gtk.Box class={"p-4"} orientation={Gtk.Orientation.VERTICAL} spacing={6}>
      <Gtk.Label class={"text-2xl font-bold"} label={iface} />

      <With value={vendor}>{(v) => v && <Gtk.Label label={v} />}</With>

      <Gtk.Label label={product.as((p) => p || "Unknown product")} />
      <Gtk.Label label={driver.as((dr) => `Driver: ${dr || "-"}`)} />
      <Gtk.Label label={firmware.as((fw) => `Firmware: ${fw || "-"}`)} />

      <Gtk.Label label={ip.gateway4.as((g) => `Gateway: ${g}`)} />
      <Gtk.Label label={ip.ipv4Addresses.as((a) => `IPv4: ${a}`)} />
      <Gtk.Label label={ip.ipv6Addresses.as((a) => `IPv6: ${a}`)} />
      <Gtk.Label label={ip.dns4.as((d) => `DNS: ${d}`)} />

      <Gtk.Box spacing={4} hexpand>
        <For each={available}>
          {(c) => (
            <Gtk.Box
              hexpand
              spacing={10}
              class={activeConn.as((ac) => {
                const base = "rounded-lg p-2";
                const color =
                  ac?.uuid === c.get_uuid()
                    ? "bg-primary text-on_primary"
                    : "bg-surface text-on_surface";
                return `${base} ${color}`;
              })}
            >
              <Gtk.GestureClick
                onPressed={() =>
                  // https://valadoc.org/libnm/NM.Client.activate_connection_async.html
                  d.client?.activate_connection_async(c, d, null, null, null)
                }
              />
              <Gtk.Image pixelSize={32} iconName={"network-wired-symbolic"} />
              <Gtk.Label class={"text-lg font-bold"} label={c.get_id()} />
            </Gtk.Box>
          )}
        </For>
      </Gtk.Box>

      <Gtk.Button
        onClicked={() => d.disconnect(null)}
        visible={state.as((s) => s > NM.DeviceState.DISCONNECTED)}
      >
        Disconnect
      </Gtk.Button>
    </Gtk.Box>
  );
}
