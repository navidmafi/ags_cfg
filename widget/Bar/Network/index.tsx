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


DO NOT render popovers as children of unstable widgets (move it out of the reactive subtree that gets reconstructed)
*/

import { Gdk, Gtk } from "ags/gtk4";
import {
  Accessor,
  createBinding,
  createMemo,
  createState,
  For,
  With,
} from "ags";
import AstalNetwork from "gi://AstalNetwork?version=0.1";
import NM from "gi://NM?version=1.0";
import EthIndicator from "./ethIndicator";
import WifiIndicator from "./wifiIndicator";

// const NMDeviceMemoizer = (prev: NM.Device[], next: NM.Device[]): boolean => {
//   console.log(prev.length === next.length);
//   return prev.length === next.length;
// };
export default function () {
  const astalNetwork = AstalNetwork.get_default();
  const devices = createBinding(astalNetwork.client, "devices");
  // devices.subscribe(() => console.log(devices.get().length));

  const ethernetDevices = devices.as((ds) =>
    ds.filter((d): d is NM.DeviceEthernet => d instanceof NM.DeviceEthernet)
  );

  const wifiDevices = devices.as((ds) =>
    ds.filter((d): d is NM.DeviceWifi => d instanceof NM.DeviceWifi)
  );

  return (
    <Gtk.Box spacing={1}>
      <For id={(d) => d.interface} each={ethernetDevices}>
        {(d) => <EthIndicator device={d} />}
      </For>
      <For id={(d) => d.interface} each={wifiDevices}>
        {(d) => <WifiIndicator device={d} />}
      </For>
    </Gtk.Box>
  );
}
