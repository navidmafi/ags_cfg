import app from "ags/gtk4/app";
import Bar from "./widget/Bar";
import OSD from "./widget/OSD";
import Applauncher from "./widget/AppLauncher";
import NotificationContainer from "./widget/Notification/NotificationContainer";
import { lockAction, unlockAction } from "./widget/Lock";
import { exec } from "ags/process";

// https://github.com/hashankur/desktop-shell/blob/main/app.ts
const style = exec("bunx tailwindcss -i styles/main.css")
  .replace(/::backdrop\s*\{[^}]*\}/, "")
  .replace(/\*.*\{[^}]*\}/, "")
  .replace(/([^;{}\s])\s*\}/g, "$1;\n}"); // add trailing semicolon

console.log(style);
app.start({
  css: style,
  requestHandler(request, res) {
    const req = request.join(" ");
    console.log(req);
    if (req == "lock") {
      app.activate_action("lock", null);
      return;
    }
    if (request.length === 0) return res("already running");
    return res("unknown request");
  },
  main() {
    app.add_action(lockAction);
    app.add_action(unlockAction);
    app.get_monitors().map(Bar);
    NotificationContainer();
    // Dyn();
    Applauncher();
    app.get_monitors().map(OSD);
  },
});
