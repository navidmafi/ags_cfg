import { Astal, Gtk } from "ags/gtk4";
import Notifd from "gi://AstalNotifd";
import GLib from "gi://GLib?version=2.0";

const transitionDuration = 300;

const time = (time: number, format = "%H:%M") =>
  GLib.DateTime.new_from_unix_local(time).format(format);

const fileExists = (path: string) => GLib.file_test(path, GLib.FileTest.EXISTS);

type NotificationIconProps = {
  notification: Notifd.Notification;
};

export default function ({ notification }: NotificationIconProps) {
  var { appIcon, image } = notification;

  if (image && fileExists(image)) {
    return (
      <box
        valign={Gtk.Align.START}
        hexpand={false}
        class="notification__icon"
        css={`
          background-image: url("file://${image}");
          background-size: cover;
          background-repeat: no-repeat;
          background-position: center;
          min-width: 60px;
          min-height: 60px;
        `}
      />
    );
  }

  if (appIcon) {
    return (
      <box
        valign={Gtk.Align.START}
        hexpand={false}
        class="notification__icon"
        css={`
          background-image: url("file://${appIcon}");
          background-size: cover;
          background-repeat: no-repeat;
          background-position: center;
          min-width: 60px;
          min-height: 60px;
        `}
      />
    );
  }

  return (
    <box valign={Gtk.Align.START} hexpand={false} class="notification__icon">
      <image iconName={"info-outline-symbolic"} />
    </box>
  );
}
