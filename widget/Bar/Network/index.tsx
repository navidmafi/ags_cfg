// The padding you add via CSS (class="p-5") does not expand the clickable area of a menubutton.

// https://valadoc.org/libnm-glib/NM.Device.html

// popover only shows one item and can confuse you for hours

// AstalNetwork.wired is a pointer that is assigned once at startup. Thus changing networks would not change it, and even set a "notify" on wired.connect() as you'd expect
//  https://github.com/Aylur/astal/issues/424
// Thus, the reliable way would be to logically pick your own devices to show from client.devices or client.allDevices which do notify when new devices (RNDIS) appear and disappear

// Note that setting line wrapping to True does not make the label wrap at its parent container's width, because GTK+ widgets conceptually can't make their requisition depend on the parent container's size. For a label that wraps at a specific position, set the label's width using Gtk.Widget.Set_Size_Request. "wrap": the setting
// https://docs.adacore.com/gtkada-docs/gtkada_rm/gtkada_rm/docs/gtk__label___spec.html

/*
            Raw GObject property changes on the same NM.Device instance won’t automatically re-render the JSX children unless you either: - bind the widget props to the device’s GObject properties (so the framework observes them), - or cause the children to be recreated (change the key), - or replace the array with a new snapshot of plain values (so the framework sees new identities/values).

            Array.map should be used minimally
            */

/*
This is an anti-pattern
 <For each={devices}>
        {d =>
          d instanceof NM.DeviceEthernet ? X : Y }
</For>

Your should instead filter using devices.as<>(...) and then no conditionals in loop 
*/

/* 

Always move the bindings into a subcomponent and use stable keys on your For loops:
<For id={...} each={...}>
  {(d) => <EthernetItem d={d} />}
</For>

DO NOT bind inline
<For each={...} > {(d) => {
const icon = createBinding(d,"...")
}
*/

import { Gdk, Gtk } from "ags/gtk4";
import { Accessor, createBinding, createState, For, With } from "ags";
import AstalNetwork from "gi://AstalNetwork?version=0.1";
import NM from "gi://NM?version=1.0";
import AstalBluetooth from "gi://AstalBluetooth?version=0.1";
import { WifiPopover } from "./wifi";
import { wiredDeviceStateIconMap } from "./icons";
import { EthernetPopover } from "./eth";

export default function () {
  const astalNetwork = AstalNetwork.get_default();
  const wifiActiveAP = createBinding(astalNetwork.wifi, "activeAccessPoint");
  const devices = createBinding(astalNetwork.client, "devices");
  // devices.subscribe(() => console.log(devices.get().length));
  const ethernetDevices = devices.as((ds) =>
    ds.filter((d): d is NM.DeviceEthernet => d instanceof NM.DeviceEthernet)
  );

  return (
    <Gtk.Box spacing={1}>
      <Gtk.MenuButton>
        <popover widthRequest={300} heightRequest={750}>
          <WifiPopover />
        </popover>

        <Gtk.Box spacing={4}>
          <Gtk.Image
            iconName={wifiActiveAP(
              (wap) => wap?.iconName || "network-wireless-disconnected-symbolic"
            )}
          />
          <With value={wifiActiveAP.as<string | null>((ssid) => ssid?.ssid)}>
            {(ssid) => ssid && <Gtk.Label label={ssid} />}
          </With>
        </Gtk.Box>
      </Gtk.MenuButton>

      <For each={ethernetDevices}>{(d) => <EthernetItem device={d} />}</For>
    </Gtk.Box>
  );
}

function EthernetItem({ device }: { device: NM.DeviceEthernet }) {
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
