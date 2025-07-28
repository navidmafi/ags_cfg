import { createBinding, createComputed } from "ags";
import { Gtk } from "ags/gtk4";
import AstalNetwork from "gi://AstalNetwork?version=0.1";

export default function () {
  const { wifi, wired } = AstalNetwork.get_default();

  return (
    <menubutton class={"BarItemContainer traymenubtn"}>
      {/* <popover>
        <box widthRequest={200} heightRequest={400}>
          <label
            label={createBinding(wifi, "bandwidth").as((s) => s.toString())}
          />
        </box>
      </popover> */}
      <box spacing={2}>
        <image name="network" iconName={createBinding(wired, "iconName")} />
        <image name="network" iconName={createBinding(wifi, "iconName")} />
      </box>
    </menubutton>
  );
}
