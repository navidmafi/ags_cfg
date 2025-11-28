// Your labels cause the anchor width to change, so GTK closes the popover correctly from its perspective. Popovers must remain visually anchored; if the anchor moves, GTK hides them so they don't point at empty space.
import { createBinding, createComputed, With } from "ags";
import { Gtk } from "ags/gtk4";
import AstalNetwork from "gi://AstalNetwork?version=0.1";
import { WifiPopover } from "./wifiPopover";
import NM from "gi://NM?version=1.0";
import { getWirelessIcon } from "./icons";
import { decodeSSID } from "./utils";
import { createPoll } from "ags/time";
import app from "ags/gtk4/app";

export default function WifiIndicator({ device }: { device: NM.DeviceWifi }) {
  const wifiActiveAP = createBinding(device, "activeAccessPoint");
  const wifiState = createBinding(device, "state");
  const wifiIcon = createComputed([wifiState, wifiActiveAP], (st, ap) =>
    st && ap
      ? getWirelessIcon(st, ap.strength)
      : "network-wireless-disconnected-symbolic"
  );
  return (
    <Gtk.MenuButton>
      <Gtk.Popover widthRequest={350} heightRequest={750}>
        <WifiPopover device={device} />
      </Gtk.Popover>
      <Gtk.Box spacing={4}>
        <Gtk.Image iconName={wifiIcon} />
        {/* You need to prevent the indicator’s width from changing. if a popover's anchor moves, GTK will hide it */}
        <With
          value={wifiActiveAP.as<string | null>((ap) => decodeSSID(ap?.ssid))}
        >
          {(ssid) => ssid && <Gtk.Label label={ssid} />}
        </With>
      </Gtk.Box>
    </Gtk.MenuButton>
  );

  //   const time = createPoll("", 100, "date +%s%N");
  //   let wd: Gtk.Widget;
  //   return (
  //     <Gtk.Box>
  //       <Gtk.MenuButton label={time}>
  //         <Gtk.Popover onMap={(ref) => ref.set_parent(wd)}>
  //           <Gtk.Label
  //             css={`
  //               padding: 50px;
  //             `}
  //             label={"Hallo"}
  //           />
  //         </Gtk.Popover>
  //       </Gtk.MenuButton>
  //       <Gtk.Fixed
  //         widthRequest={10}
  //         heightRequest={10}
  //         class={"bg-red-200"}
  //         $={(ref) => (wd = ref)}
  //       />
  //     </Gtk.Box>
  //   );
}
