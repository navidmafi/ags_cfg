import {createState} from "ags";
import {Astal} from "ags/gtk4";
import app from "ags/gtk4/app";
import {timeout} from "ags/time";

export default function () {
    const [shouldRender, setShouldRender] = createState(false);
    const [logicalVisible, setLogicalVisible] = createState(false);

    timeout(500, () => {
        setShouldRender(true);
        setLogicalVisible(true);
    });
    timeout(2500, () => setLogicalVisible(false));
    return (
        <window
            visible={shouldRender}
            css={`
        background-color: transparent;
      `}
            name={"osd"}
            application={app}
            heightRequest={100}
            widthRequest={100}
            layer={Astal.Layer.OVERLAY}
            anchor={Astal.WindowAnchor.BOTTOM}
        >
            <revealer
                transitionDuration={1000}
                onNotifyChildRevealed={(r) =>
                    !r.childRevealed && setShouldRender(false)
                }
                revealChild={logicalVisible}
            >
                <label css={"font-size:100px"} label={"Moo"}/>
            </revealer>
        </window>
    );
}
