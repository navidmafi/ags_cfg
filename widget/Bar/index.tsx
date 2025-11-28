// Note on animations:  move the With inside the revealer (or eliminate it entirely) so that the revealer instance survives across state changes.

//When you wrap the <revealer> itself in a With (or otherwise recreate it) on every hover-state change, GTK never actually gets to animate “from state A to state B” on the same widget instance—it just tears the old one down and slaps a brand-new one in its place. As soon as you do that, there is nothing for the cross-fade to interpolate between.

// So don't wrap revealers with `With` or dynamic re-rendering logic

import Battery from "./Battery";
import Date from "./Date";
import Workspaces from "./Workspaces";
import Network from "./Network/index";
import Tray from "./Tray";
import Volume from "./Volume";
import Music from "./Music";
import { createState } from "ags";
import { Astal, Gdk, Gtk } from "ags/gtk4";
import app from "ags/gtk4/app";
import Power from "./Power";

export default function Bar(gdkmonitor: Gdk.Monitor) {
  const { TOP, LEFT, RIGHT } = Astal.WindowAnchor;
  const [hovered, setHovered] = createState(false);
  return (
    <window
      visible
      name="bar"
      class="bg-background text-on_background"
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={TOP | LEFT | RIGHT}
      application={app}
    >
      <centerbox>
        <Workspaces $type="start" />

        <Gtk.Box $type="center">
          <Gtk.EventControllerMotion
            onEnter={() => setHovered(true)}
            onLeave={() => setHovered(false)}
          />
          <Gtk.Overlay halign={Gtk.Align.CENTER}>
            <Music $type={"overlay"} visible={hovered} />
            <Date visible={hovered((h) => !h)} />
          </Gtk.Overlay>
        </Gtk.Box>
        <Gtk.Box spacing={1} $type="end">
          <Tray />
          <Network />
          <Volume />
          <Battery />
          <Power />
        </Gtk.Box>
      </centerbox>
    </window>
  );
}
