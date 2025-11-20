import Astal from "gi://Astal?version=4.0";
import { exec } from "ags/process";
import { createPoll } from "ags/time";
import Gtk from "gi://Gtk?version=4.0";
import Gdk from "gi://Gdk?version=4.0";
import { createBinding, createState, For, onCleanup, This } from "ags";
import AstalAuth from "gi://AstalAuth?version=0.1";
import app from "ags/gtk4/app";
import Lock from "gi://Gtk4SessionLock";
import Gio from "gi://Gio?version=2.0";

/*
GtkImage should be used for icon assets, in other words: content that you always want to display at a 1:1 scale and that defines the size of the widget
GtkPicture should be used for image assets: content that is defined by the size of the widget
*/

/*
Call sessionLock.lock().
For each monitor, create a new Gtk.Window (fullscreen, exclusive input).
Immediately call sessionLock.assign_window_to_monitor(win, monitor).

You cannot just “prepare” a realized window earlier and later retroactively hand it to Gtk4SessionLock. The compositor won’t treat it as a lock surface unless the assignment happens inside an active lock session.
The correct flow is: create the window at lock time, assign it, then destroy it at unlock.
*/

export const sessionLock = new Lock.Instance();
const { CENTER, FILL } = Gtk.Align;

export const lockAction = new Gio.SimpleAction({ name: "lock" });
export const unlockAction = new Gio.SimpleAction({ name: "unlock" });

const lockWindows: Gtk.Window[] = [];

lockAction.connect("activate", () => {
  sessionLock.lock();
  for (const m of app.get_monitors()) {
    const win = BuildLockWindow(m) as Gtk.Window;
    sessionLock.assign_window_to_monitor(win, m);
    lockWindows.push(win);
  }
});

unlockAction.connect("activate", () => {
  sessionLock.unlock();
  for (const w of lockWindows) {
    w.destroy();
  }
  lockWindows.length = 0;
});

function BuildLockWindow(monitor: Gdk.Monitor) {
  const [prompt, setPrompt] = createState("");
  const currTime = createPoll("", 1000, "date +'%H:%M'");
  return (
    <window
      keymode={Astal.Keymode.EXCLUSIVE}
      name={`lockscreen`}
      class={"bg-transparent"}
      gdkmonitor={monitor}
      application={app}
      $={(self) => onCleanup(() => self.destroy())}
    >
      <overlay>
        <Gtk.Picture
          keep_aspect_ratio
          file={Gio.File.new_for_path(
            exec(["bash", "-c", "swww query | awk '{print $9}'"])
          )}
          content_fit={Gtk.ContentFit.COVER}
          vexpand
          hexpand
        />
        <Gtk.Box $type={"overlay"} vexpand hexpand class={"bg-overlay"}>
          <Gtk.Box
            orientation={Gtk.Orientation.VERTICAL}
            valign={CENTER}
            halign={CENTER}
          >
            <Gtk.Label
              hexpand
              class={"text-9xl text-on_surface"}
              label={currTime}
            />
            <Gtk.Label hexpand label={prompt} />

            <Gtk.PasswordEntry
              placeholder_text={"Enter your password..."}
              class={"bg-transparent"}
              onActivate={(self) => {
                if (self.get_text().length === 0) {
                  setPrompt("Password Required, try again.");
                  return;
                } else if (self.get_text().length > 0) {
                  setPrompt("Authenticating...");
                  AstalAuth.Pam.authenticate(self.get_text(), (_, task) => {
                    try {
                      AstalAuth.Pam.authenticate_finish(task);
                      app.activate_action("unlock", null);
                    } catch (error) {
                      setPrompt((error as Error).message);
                      print(error);
                    }
                  });
                }
              }}
              onRealize={(self) => self.grab_focus()}
            />
          </Gtk.Box>
        </Gtk.Box>

        <Gtk.Image
          $type={"overlay"}
          class={"mr-6"}
          valign={Gtk.Align.END}
          halign={Gtk.Align.END}
          file={"/KEX/osdm_watermark.png"}
          pixelSize={130}
        />
      </overlay>
    </window>
  );
}
