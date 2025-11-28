import { createBinding, With } from "ags";
import NM from "gi://NM?version=1.0";
import { wiredDeviceStateIconMap } from "./icons";
import { Gtk } from "ags/gtk4";
import { EthernetPopover } from "./ethPopover";

export default function EthIndicator({
  device,
}: {
  device: NM.DeviceEthernet;
}) {
  const icon = createBinding(device, "state").as(
    (s) => wiredDeviceStateIconMap[s]
  );

  const id = createBinding(device, "activeConnection").as((c) => c?.id || null);
  return (
    <Gtk.MenuButton>
      <popover>
        <EthernetPopover d={device} />
      </popover>
      <Gtk.Box spacing={4}>
        <Gtk.Image hexpand iconName={icon} />
        <With value={id}>{(v) => v && <Gtk.Label label={v} />}</With>
      </Gtk.Box>
    </Gtk.MenuButton>
  );
}
