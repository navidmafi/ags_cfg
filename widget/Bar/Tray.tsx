import { createBinding, For, onCleanup } from "ags";
import { Gdk, Gtk } from "ags/gtk4";
import AstalTray from "gi://AstalTray?version=0.1";

function TrayItemComponent({ item }: { item: AstalTray.TrayItem }) {
  let popovermenu: Gtk.PopoverMenu | null;
  let image: Gtk.Image;
  item.connect("notify::gicon", (i) => {
    image.set_from_gicon(i.gicon);
  });
  const updateMenu = () => {
    popovermenu?.set_menu_model(item.menuModel);
    popovermenu?.insert_action_group("dbusmenu", item.action_group);
  };

  // const signalId = item.connect("notify::menu-model", updateMenu);

  updateMenu();

  // onCleanup(() => {
  //   item.disconnect(signalId);
  // });

  return (
    <Gtk.Box>
      <button
        name={item.id}
        onClicked={() => item.activate(0, 0)}
        tooltipMarkup={item.tooltipMarkup}
      >
        <Gtk.GestureClick
          button={Gdk.BUTTON_SECONDARY}
          onPressed={() => {
            updateMenu();
            popovermenu?.popup();
          }}
        />
        <Gtk.Image
          vexpand
          $={(ref) => (image = ref)}
          onMap={(ref) => ref.set_from_gicon(item.gicon)}
        />
      </button>
      <Gtk.PopoverMenu $={(self) => (popovermenu = self)} />
    </Gtk.Box>
  );
}

export default function TrayBar() {
  const tray = AstalTray.get_default();
  const trayItems = createBinding(tray, "items");

  return (
    <Gtk.Box spacing={2}>
      <For each={trayItems}>{(item) => <TrayItemComponent item={item} />}</For>
    </Gtk.Box>
  );
}
