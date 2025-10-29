// important :In GTK (and by extension in Astal/AGS), a Window widget may have exactly one direct child.

import GLib from "gi://GLib?version=2.0";
import { createBinding, createState, For } from "ags";
import { Astal, Gtk } from "ags/gtk4";
import Notif2 from "./Notif";
import AstalNotifd from "gi://AstalNotifd?version=0.1";

const { TOP, RIGHT } = Astal.WindowAnchor;

export default function () {
  const notifd = AstalNotifd.get_default();
  const notifs = createBinding(notifd, "notifications");
  const [windowVisible, setWindowVisible] = createState(false);

  let ncwindow: Gtk.Window;
  let boxRef: Gtk.Box | null = null;

  notifd.connect("notify::notifications", (n) => {
    setWindowVisible(n.notifications.length > 0);

    GLib.idle_add(GLib.PRIORITY_DEFAULT_IDLE, () => {
      if (boxRef && ncwindow) {
        const height = boxRef.get_allocated_height();
        const width = ncwindow.get_allocated_width();
        ncwindow.set_default_size(width, height);
      }
      return GLib.SOURCE_REMOVE;
    });
  });

  return (
    <window
      resizable={true}
      $={(ref) => (ncwindow = ref)}
      visible={windowVisible}
      exclusivity={Astal.Exclusivity.IGNORE}
      anchor={TOP | RIGHT}
      marginTop={40}
      class={"dbg"}
      css={"background-color:transparent;"}
      marginRight={15}
    >
      <Gtk.Box
        $={(r) => (boxRef = r)}
        orientation={Gtk.Orientation.VERTICAL}
        valign={Gtk.Align.START}
        halign={Gtk.Align.START}
        spacing={4}
      >
        <For
          each={notifs<AstalNotifd.Notification[]>((ns) =>
            ns.sort((a, b) => a.time - b.time)
          )}
        >
          {(n) => <Notif2 n={n} />}
        </For>
      </Gtk.Box>
    </window>
  );
}
