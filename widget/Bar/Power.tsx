import { createBinding, createComputed } from "ags";
import { Gdk, Gtk } from "ags/gtk4";
import app from "ags/gtk4/app";
import Gio from "gi://Gio?version=2.0";
import GLib from "gi://GLib?version=2.0";

function addAction(name: string, command: string, needsLock = false) {
  const action = new Gio.SimpleAction({ name });
  action.connect("activate", () => {
    try {
      if (needsLock) {
        app.activate_action("lock", null);
        setTimeout(() => {
          GLib.spawn_command_line_async(command);
        }, 500);
      } else {
        GLib.spawn_command_line_async(command);
      }
    } catch (e) {
      logError(e as Error, `Failed to run ${command}`);
    }
  });
  app.add_action(action);
}

export default function () {
  addAction("shutdown", "systemctl poweroff");
  addAction("reboot", "systemctl reboot");
  addAction("suspend", "systemctl suspend", true);
  addAction("hibernate", "systemctl hibernate", true);

  const mm = new Gio.Menu();
  mm.append("Shutdown", "app.shutdown");
  mm.append("Reboot", "app.reboot");
  mm.append("Suspend", "app.suspend");
  mm.append("Hibernate", "app.hibernate");

  return (
    <menubutton vexpand>
      <Gtk.PopoverMenu menuModel={mm} />

      <image
        valign={Gtk.Align.CENTER}
        css={"color:#ff808090;"}
        iconName={"system-shutdown-symbolic"}
      />
    </menubutton>
  );
}
