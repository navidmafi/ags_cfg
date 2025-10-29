import { createBinding, For, onCleanup } from "ags";
import { Gdk, Gtk } from "ags/gtk4";
import AstalTray from "gi://AstalTray?version=0.1";

function TrayItemComponent({ item }: { item: AstalTray.TrayItem }) {
  let popovermenu: Gtk.PopoverMenu | null;
  let image: Gtk.Image;
  const handlerId = item.connect("notify", (i) => {
    popovermenu?.insert_action_group("dbusmenu", i.action_group);
    popovermenu?.set_menu_model(item.menuModel);
    image.set_from_gicon(i.gicon);
  });
  onCleanup(() => {
    item.disconnect(handlerId);
  });
  return (
    <Gtk.Box>
      <button
        name={item.id}
        onClicked={() => item.activate(0, 0)}
        tooltipMarkup={item.tooltipMarkup}
      >
        <Gtk.GestureClick
          button={Gdk.BUTTON_SECONDARY}
          onPressed={() => popovermenu?.popup()}
        />

        <Gtk.Image vexpand $={(ref) => (image = ref)} />
      </button>
      <Gtk.PopoverMenu
        $={(self) => (popovermenu = self)}
        menuModel={item.menuModel}
      />
    </Gtk.Box>
  );
}

export default function TrayBar() {
  const tray = AstalTray.get_default();
  const trayItems = createBinding(tray, "items");

  return (
    <Gtk.Box spacing={2}>
      <For
        each={trayItems<AstalTray.TrayItem[]>((items) =>
          items.filter((item) => Boolean(item.gicon))
        )}
      >
        {(item) => <TrayItemComponent item={item} />}
      </For>
    </Gtk.Box>
  );
}
