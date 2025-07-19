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
app.start({
  css: style,

  icons: `/home/navid/.config/ags/resources/icons`,
  requestHandler(request, res) {
    const [, argv] = GLib.shell_parse_argv(request);
    if (!argv) return res("argv parse error");

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
