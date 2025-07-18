import { createBinding, createConnection, createState } from "ags";
import { Astal, Gtk } from "ags/gtk4";
import app from "ags/gtk4/app";
import { timeout } from "ags/time";
import AstalWp from "gi://AstalWp?version=0.1";
import Progress from "./Progress_DEPR";
import AstalIO from "gi://AstalIO?version=0.1";

// const AnimationDirectionNameMap = {
//   TOP: "UP",
//   BOTTOM: "DOWN",
//   LEFT: "LEFT",
//   RIGHT: "RIGHT",
// } as const;

export default function ({
  direction = "BOTTOM",
}: {
  direction: "TOP" | "BOTTOM" | "LEFT" | "RIGHT";
}) {
  const wp = AstalWp.get_default();
  const defaultSpeakerVolume = createBinding(wp.defaultSpeaker, "volume");
  const defaultSpeakerIcon = createBinding(wp.defaultSpeaker, "volumeIcon");
  const [show, setShow] = createState(false);
  let hideTimeout: AstalIO.Time;

  wp.defaultSpeaker.connect("notify::volume", (e) => {
    print("Notified mooo", e);

    setShow(true);
    if (hideTimeout) hideTimeout.cancel();
    hideTimeout = timeout(2000, () => setShow(false));
  });

  return (
    <window
      visible
      name="volumebar"
      css={`
        margin-${direction.toLowerCase()}: 50px;
        background-color: transparent;
      `}
      exclusivity={Astal.Exclusivity.IGNORE}
      anchor={Astal.WindowAnchor[direction]}
      application={app}
    >
      <revealer
        revealChild={show}
        // transitionType={
        //   Gtk.RevealerTransitionType[
        //     `SLIDE_${AnimationDirectionNameMap[direction]}`
        //   ]
        // }
      >
        <Progress
          iconName={defaultSpeakerIcon}
          orientation={Gtk.Orientation.HORIZONTAL}
          fillRatio={defaultSpeakerVolume}
          showlabel
          trackLength={300}
          trackSize={60}
        />
      </revealer>
    </window>
  );
}
