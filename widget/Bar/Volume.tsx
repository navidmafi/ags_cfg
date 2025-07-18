import { createBinding, createComputed } from "ags";
import { Gdk, Gtk } from "ags/gtk4";
import AstalWp from "gi://AstalWp";
const VOLUME_STEP = 0.02;
export default function () {
  const wp = AstalWp.get_default();
  const defaultSpeaker = createBinding(wp, "defaultSpeaker");
  const defaultSpeakerIcon = createBinding(wp.defaultSpeaker, "volumeIcon");
  const defaultMicIcon = createBinding(wp.defaultMicrophone, "volumeIcon");
  const onScroll = (
    dy: number,
    device: "defaultMicrophone" | "defaultSpeaker"
  ) => {
    // dy < 0 is wheel-up, dy > 0 is wheel-down
    wp[device].volume += VOLUME_STEP * -dy;
  };

  const onClick = (device: "defaultMicrophone" | "defaultSpeaker") => {
    wp[device].set_mute(!wp[device].mute);
  };

  return (
    <box valign={Gtk.Align.CENTER} class={"BarItemContainer"}>
      <Gtk.EventControllerScroll
        onScroll={(_c, _dx, dy) => onScroll(dy, "defaultSpeaker")}
        flags={Gtk.EventControllerScrollFlags.VERTICAL}
      />
      <Gtk.GestureClick onPressed={() => onClick("defaultSpeaker")} />
      <image halign={Gtk.Align.CENTER} iconName={defaultMicIcon} />
      <image
        css={"color:white;"}
        halign={Gtk.Align.CENTER}
        iconName={defaultSpeakerIcon}
      />
    </box>
  );
}
