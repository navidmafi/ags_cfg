import { createBinding, createComputed } from "ags";
import { Gtk } from "ags/gtk4";
import AstalNetwork from "gi://AstalNetwork?version=0.1";

export default function () {
  const { wifi, wired } = AstalNetwork.get_default();

  return (
    <box spacing={2} class={"BarItemContainer"}>
      <image name="network" iconName={createBinding(wired, "iconName")} />
      <image name="network" iconName={createBinding(wifi, "iconName")} />
    </box>
  );
}
