#!/usr/bin/env gjs

imports.gi.versions.Gtk = "3.0";
imports.gi.versions.AppIndicator3 = "0.1";
const { Gtk, GObject, Gio, GLib, GdkPixbuf } = imports.gi;

Gtk.init(null);

const randStr = () => Math.random().toString(36).substring(2, 8);

const makeMenu = () => {
  const m = new Gtk.Menu();
  for (let i = 0, n = Math.floor(Math.random() * 5) + 1; i < n; i++) {
    const label = `Action ${randStr()}`;
    const item = new Gtk.MenuItem({ label });
    item.connect("activate", () => print(`Activated: ${label}`));
    m.append(item);
  }
  m.show_all();
  return m;
};

const makeIcon = (size = 16) => {
  const data = new Uint8Array(size * size * 4).map((_, i) =>
    i % 4 === 3 ? 255 : Math.floor(Math.random() * 256)
  );
  const pixbuf = GdkPixbuf.Pixbuf.new_from_data(
    data,
    GdkPixbuf.Colorspace.RGB,
    true,
    8,
    size,
    size,
    size * 4,
    () => {}
  );
  const tmp = `/tmp/dyn-icon-${randStr()}.png`;
  pixbuf.savev(tmp, "png", [], []);
  return tmp;
};

const Doohickey = GObject.registerClass(
  class DynamicTrayApp extends Gtk.Application {
    _init() {
      super._init({ application_id: "io.doohickey" });
    }
    vfunc_startup() {
      super.vfunc_startup();
      const AppIndicator = imports.gi.AppIndicator3;
      this._indicator = AppIndicator.Indicator.new(
        "dynamic-tray",
        "system-run",
        AppIndicator.IndicatorCategory.APPLICATION_STATUS
      );
      this._indicator.set_status(AppIndicator.IndicatorStatus.ACTIVE);
      GLib.timeout_add(GLib.PRIORITY_DEFAULT, 100, () => {
        if (this._menu) this._menu.destroy();
        this._menu = makeMenu();
        this._indicator.set_menu(this._menu);
        this._indicator.set_icon_full(makeIcon(), "Random icon");
        return GLib.SOURCE_CONTINUE;
      });
    }
    vfunc_activate() {
      this.hold();
    }
  }
);

new Doohickey().run([]);
