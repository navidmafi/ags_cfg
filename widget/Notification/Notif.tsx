import { createState, For } from "ags";
import { Gtk } from "ags/gtk4";
import { timeout } from "ags/time";
import AstalNotifd from "gi://AstalNotifd?version=0.1";
import Pango from "gi://Pango?version=1.0";

const TIMEOUT_MS = 2000;
export default function ({
  n,
  postHook = () => {},
}: {
  n: AstalNotifd.Notification;
  postHook?: CallableFunction;
}) {
  let revealer: Gtk.Revealer;
  const hide_slowly = (fn: CallableFunction) => {
    return () => {
      revealer.set_reveal_child(false);
      revealer.connect("notify::child-revealed", (r) => !r.revealChild && fn());
    };
  };

  timeout(
    TIMEOUT_MS,
    hide_slowly(() => n.dismiss())
  );

  return (
    <revealer
      $={(ref) => (revealer = ref)}
      revealChild={false}
      onMap={(r) => r.set_reveal_child(true)}
    >
      <box
        class={"notification_contaier_box"}
        widthRequest={400}
        valign={Gtk.Align.START}
        halign={Gtk.Align.START}
        heightRequest={100}
      >
        <image vexpand pixelSize={60} file={n.image || n.appIcon} />
        <box
          hexpand
          spacing={10}
          class={"notification_contentbox"}
          orientation={Gtk.Orientation.VERTICAL}
        >
          <box>
            <label
              hexpand
              halign={Gtk.Align.START}
              class={"notification_title"}
              wrap
              lines={1}
              ellipsize={Pango.EllipsizeMode.END}
              maxWidthChars={30}
              label={n.summary}
            />
            <button
              iconName={"window-close-symbolic"}
              onClicked={hide_slowly(() => {
                n.dismiss();
                postHook();
              })}
            />
          </box>
          <label
            halign={Gtk.Align.START}
            class={"notification_description"}
            wrap
            singleLineMode={false}
            maxWidthChars={40}
            lines={5}
            ellipsize={Pango.EllipsizeMode.END}
            label={n.body}
          />
          {n.get_actions().length > 0 && (
            <box marginTop={4} spacing={4}>
              {n.get_actions().map((a) => (
                <button
                  onClicked={hide_slowly(() => {
                    n.invoke(a.id);
                    postHook();
                  })}
                  hexpand
                  label={a.label}
                />
              ))}
            </box>
          )}
        </box>
      </box>
    </revealer>
  );
}
