import Tray from "gi://AstalTray";
import { Gdk, Gtk } from "ags/gtk4";
import { createBinding, For } from "ags";

export default function () {
  const tray = Tray.get_default();
  const trayItems = createBinding(tray, "items");

  return (
    <box spacing={2}>
      <For each={trayItems}>
        {(item) => (
          <button class={"InvisibleButton"}>
            <box valign={Gtk.Align.FILL} class={"BarItemContainer"}>
              <Gtk.GestureClick onPressed={() => item.activate(0, 0)} />
              <image iconName={item.iconName} />
            </box>
          </button>
        )}
      </For>
    </box>
  );
}
