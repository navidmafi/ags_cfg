// important :In GTK (and by extension in Astal/AGS), a Window widget may have exactly one direct child.

import { createBinding, createState, For } from "ags";
import { Astal, Gdk, Gtk } from "ags/gtk4";
import Pango from "gi://Pango?version=1.0";
import Notif2 from "./Notif";
import AstalNotifd from "../../@girs/astalnotifd-0.1";

const { TOP, RIGHT } = Astal.WindowAnchor;

export default function () {
  const notifd = AstalNotifd.get_default();
  const notifs = createBinding(notifd, "notifications");
  const [windowVisible, setWindowVisible] = createState(false);
  notifd.connect("notify::notifications", (n) => {
    setWindowVisible(n.notifications.length > 0);
  });
  return (
    <window
      visible={windowVisible}
      exclusivity={Astal.Exclusivity.IGNORE}
      anchor={TOP | RIGHT}
      marginTop={40}
      css={"background-color:transparent; /* border:10px solid #fff; */"}
      marginRight={15}
    >
      <Gtk.Box
        orientation={Gtk.Orientation.VERTICAL}
        valign={Gtk.Align.START}
        halign={Gtk.Align.START}
        spacing={4}
      >
        <For each={notifs<AstalNotifd.Notification[]>((ns) => ns.slice(0, 2))}>
          {(n) => <Notif2 n={n} />}
        </For>
      </Gtk.Box>
    </window>
  );
}
