import Tray from "gi://AstalTray";
import { Gdk, Gtk } from "ags/gtk4";
import { createBinding, For } from "ags";
import Gio from "gi://Gio?version=2.0";
import AstalTray from "gi://AstalTray?version=0.1";
import AstalTray01 from "gi://AstalTray";

const createMenu = (
  menuModel: Gio.MenuModel,
  actionGroup: Gio.ActionGroup | null
): Gtk.PopoverMenu => {
  const menu = Gtk.PopoverMenu.new_from_model(menuModel);
  menu.insert_action_group("dbusmenu", actionGroup);

  return menu;
};

export default function () {
  const tray = Tray.get_default();
  const trayItems = createBinding(tray, "items");

  return (
    <box spacing={2}>
      <For
        // each={trayItems<AstalTray.TrayItem[]>((ti) =>
        //   ti.filter((item) => true)
        // )}
        each={trayItems}
      >
        {(item) => {
          let popovermenu: Gtk.PopoverMenu;
          return (
            <box
              $={(widget) => {
                item.connect("notify::action-group", () => {
                  widget.insert_action_group("dbusmenu", item.action_group);
                });
              }}
              class={"BarItemContainer "}
              tooltipMarkup={item.tooltipMarkup}
              // menuModel={item.menuModel}
            >
              <Gtk.GestureClick
                button={Gdk.BUTTON_SECONDARY}
                onPressed={() => popovermenu.popup()}
              />
              <Gtk.GestureClick
                button={Gdk.BUTTON_PRIMARY}
                onPressed={(e, x, y) => item.activate(x, y)}
              />

              <Gtk.PopoverMenu
                $={(self) => (popovermenu = self)}
                visible={false}
                menuModel={item.menuModel}
              />
              <Gtk.Image gicon={item.gicon} />
            </box>
          );
        }}
      </For>
    </box>
  );
}
