import app from "ags/gtk4/app";
import style from "styles/main.scss";
import Bar from "./widget/Bar";
import GLib from "gi://GLib?version=2.0";
import OSD from "./widget/OSD";
import mcve from "./widget/OSD/mcve";
import Applauncher from "./widget/AppLauncher";
import mcvelauncher from "./widget/AppLauncher/mcvelauncher";
import { exec } from "ags/process";
import NotificationContainer from "./widget/Notification/NotificationContainer";
import { StartLock } from "./widget/Lock";

app.start({
  css: style,

  icons: `/home/navid/.config/ags/resources/icons`,
  requestHandler(request, res) {
    const req = request.join(" ");
    if (req == "lock") {
      StartLock();
      return;
    }
    return res("unknown command");
  },
  main() {
    app.get_monitors().map(Bar);
    // mcvelauncher();
    NotificationContainer();
    Applauncher();
    app.get_monitors().map(OSD);
    exec(["hyprctl", "keyword general:col.active_border", "0xffff6d2e"]);
    exec(["hyprctl", "keyword general:border_size", "2"]);

    // mcve();
  },
});
