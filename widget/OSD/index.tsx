import Wp from "gi://AstalWp";
import Brightness from "../../lib/brightness";
import {Accessor, createState, onCleanup, Setter} from "ags";
import {timeout} from "ags/time";
import {Astal, Gdk, Gtk} from "ags/gtk4";
import app from "ags/gtk4/app";
import Progress from "./Progress";

function OnScreenProgress({
                              visible,
                              setVisible,
                              setRender,
                          }: {
    visible: Accessor<boolean>;
    setVisible: Setter<boolean>;
    setRender: Setter<boolean>;
}) {
    const brightness = Brightness.get_default();

    const speaker = Wp.get_default().get_default_speaker();
    const mic = Wp.get_default().get_default_microphone();

    const [iconName, setIconName] = createState("");
    const [value, setValue] = createState(0);

    let count = 0; // clever workaround for managing side effect of multiple state changes in <2s

    function show(v: number, icon: string) {
        setRender(true);
        setVisible(true);
        setValue(v);
        setIconName(icon);

        count++;

        timeout(2000, () => {
            count--;
            if (count === 0) setVisible(false);
        });
    }

    const brightnessHook = brightness.connect("notify", (b) =>
        show(b.screen, "display-brightness-symbolic")
    );

    const speakerMuteHook = speaker.connect("notify::mute", (s) =>
        show(s.volume, s.volumeIcon)
    );
    const speakerVolHook = speaker.connect("notify::volume", (s) =>
        show(s.volume, s.volumeIcon)
    );
    const micVolHook = mic.connect("notify::volume", (m) =>
        show(m.volume, m.volumeIcon)
    );
    const micMuteHook = mic.connect("notify::mute", (m) =>
        show(m.volume, m.volumeIcon)
    );

    onCleanup(() => {
        brightness.disconnect(brightnessHook);
        speaker.disconnect(speakerMuteHook);
        speaker.disconnect(speakerVolHook);
        mic.disconnect(micMuteHook);
        mic.disconnect(micVolHook);
    });
    return (
        <revealer
            revealChild={visible}
            onNotifyChildRevealed={(r) => !r.childRevealed && setRender(false)}
            transitionType={Gtk.RevealerTransitionType.CROSSFADE}
        >
            <Progress
                fillRatio={value}
                trackLength={300}
                trackSize={50}
                iconName={iconName}
                orientation={Gtk.Orientation.VERTICAL}
                showlabel={false}
            />
        </revealer>
    );
}

export default function OSD(monitor: Gdk.Monitor) {
    const [visible, setVisible] = createState(false);
    const [render, setRender] = createState(false);

    return (
        <window
            name={"OSD"}
            namespace={"osd"}
            application={app}
            visible={render}
            css={"background-color:transparent;"}
            gdkmonitor={monitor}
            marginRight={40}
            layer={Astal.Layer.OVERLAY}
            exclusivity={Astal.Exclusivity.IGNORE}
            anchor={Astal.WindowAnchor.RIGHT}
        >
            <OnScreenProgress
                visible={visible}
                setVisible={setVisible}
                setRender={setRender}
            />
        </window>
    );
}
