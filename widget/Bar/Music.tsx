//  you should never assume the length of an array
// Accessing properties are not reactive, you need a createBinding for each value.
// WILL NOT WORK: defaultSpeaker((spk) => spk.volumeIcon)

import { Accessor, createBinding, createComputed, For } from "ags";
import Pango from "gi://Pango?version=1.0";
import AstalMpris from "gi://AstalMpris?version=0.1";
import { Gtk } from "ags/gtk4";

export default function ({ visible }: { visible: Accessor<boolean> }) {
  const mpris = AstalMpris.get_default();
  const players = createBinding(mpris, "players");
  return (
    <revealer
      widthRequest={400}
      halign={Gtk.Align.CENTER}
      revealChild={visible}
      transitionType={Gtk.RevealerTransitionType.CROSSFADE}
    >
      <Gtk.Box hexpand spacing={4}>
        <Gtk.Box hexpand visible={players((pls) => pls.length === 0)}>
          <label hexpand label={"Not playing"} />
        </Gtk.Box>
        <For each={players}>{(p) => <PlayerBar player={p} />}</For>
      </Gtk.Box>
    </revealer>
  );
}

function PlayerBar({ player }: { player: AstalMpris.Player }) {
  function onScroll(dy: number) {
    // dy < 0 is wheel-up, dy > 0 is wheel-down
    if (dy < 0) player.next();
    else if (dy > 0) player.previous();
  }

  const title = createBinding(player, "title");
  const artist = createBinding(player, "artist");
  return (
    <Gtk.Box spacing={2}>
      <Gtk.Button onClicked={() => player.previous()}>
        <Gtk.Image iconName={"media-skip-backward-symbolic"} />
      </Gtk.Button>
      <Gtk.Button onClicked={() => player.play_pause()} hexpand>
        <Gtk.EventControllerScroll
          flags={Gtk.EventControllerScrollFlags.VERTICAL}
          onScroll={(_, _dx, dy) => onScroll(dy)}
        />
        <label
          hexpand
          // class={"dbg"}
          widthChars={20}
          ellipsize={Pango.EllipsizeMode.END}
          label={createComputed([title, artist], (t, a) => `${t} - ${a}`)}
        />
      </Gtk.Button>
      <Gtk.Button onClicked={() => player.next()}>
        <Gtk.Image iconName={"media-skip-forward-symbolic"} />
      </Gtk.Button>
    </Gtk.Box>
  );
}
