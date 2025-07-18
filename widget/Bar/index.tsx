// Note on animations:  move the With inside the revealer (or eliminate it entirely) so that the revealer instance survives across state changes.

//When you wrap the <revealer> itself in a With (or otherwise recreate it) on every hover-state change, GTK never actually gets to animate “from state A to state B” on the same widget instance—it just tears the old one down and slaps a brand-new one in its place. As soon as you do that, there is nothing for the cross-fade to interpolate between.

// So don't wrap revealers with `With` or dynamic re-rendering logic

import app from "ags/gtk4/app";
import { Astal, Gtk, Gdk } from "ags/gtk4";
import { execAsync } from "ags/process";
import { createPoll } from "ags/time";
import Battery from "./Battery";
import Date from "./Date";
import Workspaces from "./Workspaces";
import Network from "./Network";
import Tray from "./Tray";
import Volume from "./Volume";
import Music from "./Music";
import { createState, With } from "ags";

export default function Bar(gdkmonitor: Gdk.Monitor) {
  const { TOP, LEFT, RIGHT } = Astal.WindowAnchor;
  const [hovered, setHovered] = createState(false);
  return (
    <window
      visible
      name="bar"
      class="Bar"
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={TOP | LEFT | RIGHT}
      application={app}
    >
      <centerbox>
        <Workspaces $type="start" />

        <box widthRequest={400} $type="center">
          <Gtk.EventControllerMotion
            onEnter={() => setHovered(true)}
            onLeave={() => setHovered(false)}
          />
          <overlay>
            <Music $type={"overlay"} visible={hovered} />
            <Date visible={hovered((h) => !h)} />
          </overlay>
        </box>
        <box spacing={1} $type="end">
          <Tray />
          <Volume />
          <Network />
          <Battery />
        </box>
      </centerbox>
    </window>
  );
}
