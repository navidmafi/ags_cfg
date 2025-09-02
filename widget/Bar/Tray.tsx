import { createBinding, For, onCleanup } from "ags";
import { Gdk, Gtk } from "ags/gtk4";
import AstalTray from "gi://AstalTray?version=0.1";

function TrayItemComponent({ item }: { item: AstalTray.TrayItem }) {
  let popovermenu: Gtk.PopoverMenu;
  let image: Gtk.Image;
  const handlerId = item.connect("notify", (i) => {
    popovermenu?.insert_action_group("dbusmenu", i.action_group);
    image.set_from_gicon(i.gicon);
  });
  onCleanup(() => {
    item.disconnect(handlerId);
  });
  return (
    <Gtk.Box
      name={item.id}
      class="BarItemContainer"
      tooltipMarkup={item.tooltipMarkup}
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
        // menuModel={item.menuModel}
      />
      <Gtk.Image $={(ref) => (image = ref)} />
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
