import {
  Accessor,
  createBinding,
  createComputed,
  createConnection,
  createState,
  For,
  onCleanup,
} from "ags";
import { Gtk } from "ags/gtk4";
import NM from "gi://NM?version=1.0";

export function IPInfo({
  d,
  visible,
}: {
  d: NM.Device;
  visible?: Accessor<boolean>;
}) {
  const [info, setInfo] = createState("");

  function collect() {
    const ipv4 = d.ip4Config;
    const ipv6 = d.ip6Config;

    const addrs4 = ipv4?.get_addresses()?.map((a) => a.get_address()) ?? [];
    const addrs6 = ipv6?.get_addresses()?.map((a) => a.get_address()) ?? [];

    const ns4 = ipv4?.nameservers ?? [];
    const ns6 = ipv6?.nameservers ?? [];

    const gw4 = ipv4?.gateway || "-";
    const gw6 = ipv6?.gateway || "-";

    const lines = [
      ...addrs4.map((a) => `Addr4: ${a}`),
      ...addrs6.map((a) => `Addr6: ${a}`),
      ...ns4.map((n) => `NS4: ${n}`),
      ...ns6.map((n) => `NS6: ${n}`),
      `GW4: ${gw4}`,
      `GW6: ${gw6}`,
    ];

    setInfo(lines.join("\n"));
  }

  collect();

  const h1 = d.ip4Config.connect("notify::addresses", collect);
  const h2 = d.ip6Config.connect("notify::addresses", collect);
  const h3 = d.ip4Config.connect("notify::nameservers", collect);
  const h4 = d.ip6Config.connect("notify::nameservers", collect);
  const h5 = d.ip4Config.connect("notify::gateway", collect);
  const h6 = d.ip6Config.connect("notify::gateway", collect);

  onCleanup(() => {
    d.ip4Config.disconnect(h1);
    d.ip6Config.disconnect(h2);
    d.ip4Config.disconnect(h3);
    d.ip6Config.disconnect(h4);
    d.ip4Config.disconnect(h5);
    d.ip6Config.disconnect(h6);
  });

  return (
    <Gtk.Label
      visible={visible}
      halign={Gtk.Align.START}
      justify={Gtk.Justification.LEFT}
      xalign={0}
      wrap={false}
      label={info}
    />
  );
}
