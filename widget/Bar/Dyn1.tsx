import { Astal, Gtk } from "ags/gtk4";
const { TOP, LEFT, RIGHT } = Astal.WindowAnchor;

export default function Dyn() {
  return (
    <window
      css={`
        background-color: #000;
        border-radius: 999px;
        margin-top: 4px;
      `}
      widthRequest={300}
      heightRequest={40}
      exclusivity={Astal.Exclusivity.IGNORE}
      anchor={TOP}
      visible
    ></window>
  );
}
