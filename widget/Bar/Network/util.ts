import { createBinding } from "ags";
import NM from "gi://NM?version=1.0";

export function bindIP(d: NM.Device) {
  const ip4 = createBinding(d, "ip4Config");
  const ip6 = createBinding(d, "ip6Config");

  const ipv4Addresses = ip4.as(
    (cfg) =>
      cfg
        ?.get_addresses()
        ?.map((a) => a.get_address())
        .join(", ") || "-"
  );

  const ipv6Addresses = ip6.as(
    (cfg) =>
      cfg
        ?.get_addresses()
        ?.map((a) => a.get_address())
        .join(", ") || "-"
  );

  const gateway4 = ip4.as((cfg) => cfg?.gateway || "-");

  const dns4 = ip4.as((cfg) => cfg?.get_nameservers()?.join(", ") || "-");

  return { ip4, ip6, ipv4Addresses, ipv6Addresses, gateway4, dns4 };
}
