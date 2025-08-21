import {Gtk} from "ags/gtk4";

import {createBinding} from "ags";
import AstalNetwork from "gi://AstalNetwork?version=0.1";

export default function () {
    const {wifi, wired} = AstalNetwork.get_default();
    const wifiIcon = createBinding(wifi, "iconName").as(
        (i) => i || "network-wireless-disabled-symbolic"
    );
    const wiredIcon = createBinding(wired, "iconName").as(
        (i) => i || "network-wired-offline-symbolic"
    );
    return (
        <Gtk.MenuButton class={"BarItemContainer traymenubtn"}>
            {/* <popover>
        <Gtk.Box widthRequest={200} heightRequest={400}>
          <label
            label={createBinding(wifi, "bandwidth").as((s) => s.toString())}
          />
        </box>
      </popover> */}
            <Gtk.Box spacing={4}>
                <Gtk.Image
                    tooltipText={createBinding(wifi, "ssid").as(String)}
                    iconName={wifiIcon}
                />
                <Gtk.Image iconName={wiredIcon}/>
            </Gtk.Box>
        </Gtk.MenuButton>
    );
}
