import Astal from "gi://Astal?version=4.0";
import { exec } from "ags/process";
import { createPoll } from "ags/time";
import Gtk from "gi://Gtk?version=4.0";
import Gdk from "gi://Gdk?version=4.0";
import GdkPixbuf from "gi://GdkPixbuf?version=2.0";
import { createState } from "ags";
import AstalAuth from "gi://AstalAuth?version=0.1";
import app from "ags/gtk4/app";
import Lock from "gi://Gtk4SessionLock";

/*
    GtkImage should be used for icon assets, in other words: content that you always want to display at a 1:1 scale and that defines the size of the widget
    GtkPicture should be used for image assets: content that is defined by the size of the widget
 */
// const pam = new AstalAuth.Pam({ service: "login" });

export const sessionLock = new Lock.Instance();
const display = Gdk.Display.get_default();
const { TOP, BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor;
const { CENTER, FILL } = Gtk.Align;

export function StartLock() {
  sessionLock.lock();
  app.get_monitors().map(Lockscreen);
}

// sessionLock.connect("locked", () => {
//   pam.start_authenticate();
// });

// pam.connect("notify", (n) => console.log(n));

// pam.connect("fail", (auth, msg) => {
//   console.warn("PAM fail:", msg);
// });

function Lockscreen(monitor: Gdk.Monitor) {
  let bgImage: Gtk.Picture;
  let lockwin: Gtk.Window;
  const [prompt, setPrompt] = createState("");
  const currTime = createPoll("", 1000, "date +'%H:%M'");
  //   pam.connect("auth-error", (auth, msg) => {
  //     console.error("pam error:", msg);
  //     setPrompt(msg);
  //   });
  //   pam.connect("auth-info", (auth, msg) => {
  //     console.info("pam info:", msg);
  //     setPrompt(msg);
  //   });
  //   pam.connect("fail", (auth, msg) => {
  //     console.warn("pam fail:", msg);
  //     setPrompt("Authentication failed — try again.");
  //   });
  //   pam.connect("success", () => {
  //     sessionLock.unlock();
  //     lockwin.destroy();
  //   });

  return (
    <window
      exclusivity={Astal.Exclusivity.IGNORE}
      keymode={Astal.Keymode.EXCLUSIVE}
      name={`lockscreen-${monitor}`}
      application={app}
      $={(ref) => {
        lockwin = ref;
        sessionLock.assign_window_to_monitor(ref, monitor);
      }}
      //   onMap={() => {
      //     pam.start_authenticate();
      //   }}
      anchor={TOP | BOTTOM | LEFT | RIGHT}
      fullscreened
      css={"background-color: transparent;"}
    >
      <overlay>
        <Gtk.Picture
          keep_aspect_ratio
          $={(ref) => (bgImage = ref)}
          content_fit={Gtk.ContentFit.COVER}
          vexpand
          hexpand
          class={"lockimg"}
          onMap={() => {
            const res = exec(["bash", "-c", "swww query | awk '{print $8}'"]);
            bgImage.set_filename(res);
          }}
        />
        <Gtk.Box $type={"overlay"} vexpand hexpand class={"lockoverlay"}>
          <Gtk.Box
            orientation={Gtk.Orientation.VERTICAL}
            valign={CENTER}
            halign={CENTER}
          >
            <Gtk.Label hexpand css={"font-size:120px;"} label={currTime} />
            <Gtk.Label hexpand label={prompt} />

            <Gtk.PasswordEntry
              placeholder_text={"Enter your password..."}
              css={"background: transparent;"}
              onActivate={(self) => {
                if (self.get_text().length === 0) {
                  setPrompt("Password Required, try again.");
                  return;
                } else if (self.get_text().length > 0) {
                  setPrompt("Authenticating...");
                  AstalAuth.Pam.authenticate(self.get_text(), (_, task) => {
                    try {
                      AstalAuth.Pam.authenticate_finish(task);
                      print("authentication sucessful");
                      sessionLock.unlock();
                      lockwin.destroy();
                    } catch (error) {
                      setPrompt((error as Error).message);
                      print(error);
                    }
                  });
                  //   pam.supply_secret(self.get_text());
                }
              }}
              onRealize={(self) => self.grab_focus()}
            />
          </Gtk.Box>
        </Gtk.Box>
      </overlay>
    </window>
  );
}
