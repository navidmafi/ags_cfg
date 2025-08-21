import {Gtk} from "ags/gtk4";
import {onCleanup} from "ags";
import {timeout} from "ags/time";
import Pango from "gi://Pango?version=1.0";
import AstalNotifd from "gi://AstalNotifd?version=0.1";

const TIMEOUT_MS = 5000;
export default function ({
                             n,
                             postHook = () => {
                             },
                         }: {
    n: AstalNotifd.Notification;
    postHook?: CallableFunction;
}) {
    let revealer: Gtk.Revealer;
    const dismiss = () => {
        n.dismiss();
        postHook();
    };
    // const hide_slowly = (...args: unknown[]) => {};
    const hide_slowly = (fn: CallableFunction) => {
        revealer.set_reveal_child(false);
        const connID = revealer.connect("notify::child-revealed", (r) => {
            if (!r.revealChild) fn();
            revealer.disconnect(connID);
        });
    };

    const timer = timeout(TIMEOUT_MS, () => hide_slowly(dismiss));
    onCleanup(() => timer.cancel());

    return (
        <Gtk.Revealer
            $={(ref) => (revealer = ref)}
            revealChild={false}
            onMap={(r) => r.set_reveal_child(true)}
        >
            <Gtk.Box
                class={"notification_contaier_box"}
                widthRequest={400}
                valign={Gtk.Align.START}
                halign={Gtk.Align.START}
                heightRequest={100}
            >
                <Gtk.Image vexpand pixelSize={60} file={n.image || n.appIcon}/>
                <Gtk.Box
                    hexpand
                    spacing={10}
                    class={"notification_contentbox"}
                    orientation={Gtk.Orientation.VERTICAL}
                >
                    <Gtk.Box spacing={4}>
                        <Gtk.Label
                            hexpand
                            halign={Gtk.Align.START}
                            class={"notification_title"}
                            wrap
                            lines={1}
                            ellipsize={Pango.EllipsizeMode.END}
                            maxWidthChars={1}
                            label={n.summary}
                        />
                        <button
                            iconName={"window-close-symbolic"}
                            onClicked={() =>
                                hide_slowly(() => {
                                    n.dismiss();
                                    postHook();
                                })
                            }
                        />
                    </Gtk.Box>
                    <Gtk.Label
                        halign={Gtk.Align.START}
                        class={"notification_description"}
                        wrap
                        singleLineMode={false}
                        // https://stackoverflow.com/questions/27462926/how-to-set-max-width-of-gtklabel-properly
                        maxWidthChars={1}
                        lines={5}
                        ellipsize={Pango.EllipsizeMode.END}
                        label={n.body}
                    />
                    {n.get_actions().length > 0 && (
                        <Gtk.Box marginTop={4} spacing={4}>
                            {n.get_actions().map((a) => (
                                <button
                                    onClicked={() => {
                                        a.id && n.invoke(a.id);
                                        hide_slowly(dismiss);
                                    }}
                                    hexpand
                                    label={a.label}
                                />
                            ))}
                        </Gtk.Box>
                    )}
                </Gtk.Box>
            </Gtk.Box>
        </Gtk.Revealer>
    );
}
