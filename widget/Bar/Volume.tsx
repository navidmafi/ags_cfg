import {createBinding} from "ags";
import {Gtk} from "ags/gtk4";
import AstalWp from "gi://AstalWp?version=0.1";

const VOLUME_STEP = 0.02;
export default function () {
    const wp = AstalWp.get_default();
    const defaultSpeaker = createBinding(wp, "defaultSpeaker");
    const defaultSpeakerIcon = createBinding(wp.defaultSpeaker, "volumeIcon").as(
        (i) => i || "microphone-hardware-disabled-symbolic"
    );
    const defaultMicIcon = createBinding(wp.defaultMicrophone, "volumeIcon").as(
        (i) => i || "audio-volume-muted-blocking-symbolic"
    );
    const onScroll = (
        dy: number,
        device: "defaultMicrophone" | "defaultSpeaker"
    ) => {
        // dy < 0 is wheel-up, dy > 0 is wheel-down
        wp[device].volume += VOLUME_STEP * -dy;
    };

    const onClick = (device: "defaultMicrophone" | "defaultSpeaker") => {
        wp[device].set_mute(!wp[device].mute);
    };

    return (
        <Gtk.Box class={"BarItemContainer"}>
            <Gtk.EventControllerScroll
                onScroll={(_c, _dx, dy) => onScroll(dy, "defaultSpeaker")}
                flags={Gtk.EventControllerScrollFlags.VERTICAL}
            />
            <Gtk.GestureClick onPressed={() => onClick("defaultSpeaker")}/>
            <Gtk.Box spacing={4}>
                <Gtk.Image halign={Gtk.Align.CENTER} iconName={defaultMicIcon}/>
                <Gtk.Image
                    css={"color:white;"}
                    halign={Gtk.Align.CENTER}
                    iconName={defaultSpeakerIcon}
                />
            </Gtk.Box>
        </Gtk.Box>
    );
}
