import app from "ags/gtk4/app";
import Bar from "./widget/Bar";
import OSD from "./widget/OSD";
import Applauncher from "./widget/AppLauncher";
import NotificationContainer from "./widget/Notification/NotificationContainer";
import { lockAction, unlockAction } from "./widget/Lock";
import { exec } from "ags/process";
import prettier from "prettier";

// https://github.com/hashankur/desktop-shell/blob/main/app.ts
// Note: ensure trailing semicolons as gtk css engine is sensitive about it
// Ensure no empty rulesets
const style = exec("bunx tailwindcss -i styles/main.css --no-autoprefixer")
  .replace(/::backdrop\s*\{[^}]*\}/, "")
  .replace(/\*.*\{/, "\* {"); // we remove the ::before and ::after pseudo classes, but the * block itself definition has critical defaults so we won't remove it

// console.log(style);
app.start({
  gtkTheme: "",
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
    // app.activate_action("lock", null);

    app.get_monitors().map(Bar);
    NotificationContainer();
    // Dyn();
    Applauncher();
    app.get_monitors().map(OSD);
  },
});
