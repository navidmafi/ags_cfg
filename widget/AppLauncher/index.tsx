import {Astal, Gdk} from "ags/gtk4";
import app from "ags/gtk4/app";
import {createState, For} from "ags";
import Gtk from "gi://Gtk?version=4.0";
import AstalApps from "gi://AstalApps?version=0.1";
import Graphene from "gi://Graphene?version=1.0";

const {TOP, BOTTOM, LEFT, RIGHT} = Astal.WindowAnchor;

export default function Applauncher() {
    let contentbox: Gtk.Box;
    let containerBox: Gtk.Box;
    let searchentry: Gtk.Entry;
    let win: Gtk.Window;
    const apps = new AstalApps.Apps();
    const [list, setList] = createState(new Array<AstalApps.Application>());

    function search(text: string) {
        if (text === "") setList([]);
        else {
            const results = apps.exact_query(text).slice(0, 50);
            results.sort((a, b) => b.frequency - a.frequency);
            setList(results.slice(0, 8));
        }
    }

    function launch(app?: AstalApps.Application) {
        if (app) {
            win.hide();
            app.launch();
        }
    }

    function onKey(_e: Gtk.EventControllerKey, keyval: number, _: number) {
        if (keyval === Gdk.KEY_Escape) {
            return (win.visible = false);
        }
    }

    // close on clickaway
    function onClick(_e: Gtk.GestureClick, _: number, x: number, y: number) {
        const [, rect] = containerBox.compute_bounds(win);
        const position = new Graphene.Point({x, y});
        print(rect.get_area());
        if (!rect.contains_point(position)) {
            win.visible = false;
            return true;
        }
    }

    return (
        <window
            name="launcher"
            $={(ref) => {
                win = ref;
            }}
            css={"background-color:transparent;"}
            application={app}
            anchor={TOP | BOTTOM | LEFT | RIGHT}
            exclusivity={Astal.Exclusivity.IGNORE}
            keymode={Astal.Keymode.EXCLUSIVE}
            onNotifyVisible={({visible}) => {
                if (visible) searchentry.grab_focus();
                else searchentry.set_text("");
            }}
        >
            <Gtk.GestureClick onPressed={onClick}/>

            <Gtk.Box
                marginTop={300}
                $={(ref) => (containerBox = ref)}
                valign={Gtk.Align.START}
                halign={Gtk.Align.CENTER}
                overflow={Gtk.Overflow.HIDDEN}
                class={"launcher_container"}
            >
                <Gtk.EventControllerKey onKeyPressed={onKey}/>
                <Gtk.Box
                    $={(ref) => (contentbox = ref)}
                    class={"launcher-content"}
                    halign={Gtk.Align.CENTER}
                    orientation={Gtk.Orientation.VERTICAL}
                >
                    <Gtk.Entry
                        $={(ref) => (searchentry = ref)}
                        onNotifyText={({text}) => search(text)}
                        onActivate={(e) => launch(list.get()[0])}
                        placeholderText="Start typing to search"
                    />
                    <Gtk.Box
                        marginTop={list((l) => (l.length > 0 ? 20 : 0))}
                        spacing={4}
                        orientation={Gtk.Orientation.VERTICAL}
                    >
                        <For each={list}>
                            {(app) => (
                                <button onClicked={() => launch(app)}>
                                    <Gtk.Box spacing={4}>
                                        <image pixelSize={40} iconName={app.iconName}/>
                                        <label label={app.name} maxWidthChars={40} wrap/>
                                    </Gtk.Box>
                                </button>
                            )}
                        </For>
                    </Gtk.Box>
                </Gtk.Box>
            </Gtk.Box>
        </window>
    );
}
