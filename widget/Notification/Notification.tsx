import AstalNotifd from "gi://AstalNotifd?version=0.1";
import Icon from "./Icon";
import { Gtk } from "ags/gtk4";
import Pango from "gi://Pango?version=1.0";
import { Time } from "ags/time";

type NotificationsProps = {
  notification: AstalNotifd.Notification;
};

export default function (props: NotificationsProps) {
  const { notification } = props;

  return (
    <box hexpand class="content">
      <Icon notification={notification} />
      <box hexpand vexpand>
        <box class="notification__header" vexpand valign={Gtk.Align.CENTER}>
          <box hexpand={true} spacing={6}>
            <label
              class="notification__title"
              maxWidthChars={14}
              wrap={true}
              justify={Gtk.Justification.LEFT}
              ellipsize={Pango.EllipsizeMode.END}
              useMarkup={true}
              label={notification.summary.trim()}
            />
            <label class="notification__dot" label={"•"} />
            {notification.appName != "" && (
              <label
                class="notification__app-name"
                justify={Gtk.Justification.LEFT}
                ellipsize={Pango.EllipsizeMode.END}
                wrap={true}
                maxWidthChars={8}
                useMarkup={true}
                label={notification.appName.trim()} // 修复这里使用 appName 而不是 app_name
              />
            )}
            {notification.appName != "" && (
              <label class="notification__dot" label={"•"} />
            )}
            <label
              class="notification__time"
              label={new Time(notification.time)?.toString()}
            />
          </box>
        </box>
        <revealer
          visible={notification.body != ""}
          reveal_child={notification.body != ""}
        >
          <label
            class="notification__description"
            hexpand={true}
            useMarkup={true}
            xalign={0}
            lines={3}
            justify={Gtk.Justification.LEFT}
            ellipsize={Pango.EllipsizeMode.END}
            maxWidthChars={24}
            wrap={true}
            label={notification.body.trim().toString()}
          />
        </revealer>
      </box>
      <button
        vexpand={true}
        valign={Gtk.Align.START}
        class="notification__close-button"
        onClicked={() => {
          notification.dismiss();
        }}
      >
        <image iconName="window-close-symbolic" />
      </button>
    </box>
  );
}
