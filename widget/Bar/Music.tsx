//  you should never assume the length of an array
// Accessing properties are not reactive, you need a createBinding for each value.
// WILL NOT WORK: defaultSpeaker((spk) => spk.volumeIcon)

import { Accessor, createBinding, createComputed, For, With } from "ags";
import { Gtk } from "ags/gtk4";
import AstalMpris from "gi://AstalMpris?version=0.1";
import Pango from "gi://Pango?version=1.0";

export default function ({ visible }: { visible: Accessor<boolean> }) {
  const mpris = AstalMpris.get_default();
  const players = createBinding(mpris, "players");
  // const firstPlayer = players((pls) => pls[0]);
  return (
    <revealer
      // class={"dbg"}
      halign={Gtk.Align.FILL}
      revealChild={visible}
      transitionType={Gtk.RevealerTransitionType.CROSSFADE}
    >
      <box hexpand spacing={4}>
        <box
          hexpand
          visible={players((pls) => pls.length === 0)}
          class={"BarItemContainer"}
        >
          <label hexpand label={"Not playing"} />
        </box>
        {/* <For each={players<Array<AstalMpris.Player>>((ps) => ps.slice(0, 1))}> */}
        <For each={players}>{(p) => p && <PlayerBar player={p} />}</For>
      </box>
    </revealer>
  );
}

function PlayerBar({ player }: { player: AstalMpris.Player }) {
  function onScroll(dy: number) {
    // dy < 0 is wheel-up, dy > 0 is wheel-down
    if (dy < 0) player.next();
    else if (dy > 0) player.previous();
  }

  function onClick() {
    player.play_pause();
  }
  const title = createBinding(player, "title");
  const artist = createBinding(player, "artist");
  return (
    <box hexpand class={"BarItemContainer"}>
      <Gtk.EventControllerScroll
        flags={Gtk.EventControllerScrollFlags.VERTICAL}
        onScroll={(_, _dx, dy) => onScroll(dy)}
      />
      <Gtk.GestureClick onReleased={onClick} />
      <label
        hexpand
        // class={"dbg"}
        widthChars={20}
        ellipsize={Pango.EllipsizeMode.END}
        label={createComputed([title, artist], (t, a) => `${t} - ${a}`)}
      />
    </box>
  );
}
