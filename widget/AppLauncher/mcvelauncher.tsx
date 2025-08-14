import { createState } from "ags";
import { Astal, Gtk } from "ags/gtk4";
import { timeout } from "ags/time";

const { TOP, BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor;

export default function () {
  const [visible, setVisible] = createState(false);
  for (let i = 0; i < 20 * 2; i++) {
    timeout(i * 1000, () => {
      setVisible(i % 2 === 0);
    });
  }
  return (
    <window
      css={"background-color:transparent;"}
      visible={visible}
      anchor={TOP | BOTTOM | LEFT | RIGHT}
      exclusivity={Astal.Exclusivity.IGNORE}
      keymode={Astal.Keymode.ON_DEMAND}
    >
      <Gtk.Box valign={Gtk.Align.CENTER} halign={Gtk.Align.CENTER}>
        <entry placeholderText="Start typing to search" />
      </Gtk.Box>
    </window>
  );
}
