import { Gtk } from "ags/gtk4";

import { Accessor } from "ags";

const OrientationSpacing = {
  [Gtk.Orientation.VERTICAL]: "bottom",
  [Gtk.Orientation.HORIZONTAL]: "left",
} as const;

export default function Progress({
  fillRatio,
  iconName,
  orientation = Gtk.Orientation.VERTICAL,
  trackSize = 50,
  trackLength = 300,
  showlabel = false,
}: {
  fillRatio: Accessor<number>;
  orientation: Gtk.Orientation;
  iconName: Accessor<string>;
  trackSize: number; // cross-axis size (thickness)
  trackLength: number; // main-axis size (length)
  showlabel: boolean;
}) {
  const isVertical = orientation === Gtk.Orientation.VERTICAL;
  return (
    <Gtk.Overlay
      overflow={Gtk.Overflow.HIDDEN}
      widthRequest={isVertical ? trackSize : trackLength}
      heightRequest={isVertical ? trackLength : trackSize}
      class={"slider_container"}
    >
      <Gtk.Box
        $type={"overlay"}
        halign={isVertical ? Gtk.Align.FILL : Gtk.Align.END}
        valign={isVertical ? Gtk.Align.START : Gtk.Align.FILL}
        class={"slider_fill_mask"}
        widthRequest={fillRatio((r) =>
          isVertical ? trackSize : Math.max(0, 1 - r) * trackLength
        )}
        heightRequest={fillRatio((r) =>
          isVertical ? Math.max(0, 1 - r) * trackLength : trackSize
        )}
      />
      <Gtk.Box
        $type={"overlay"}
        halign={isVertical ? Gtk.Align.CENTER : Gtk.Align.FILL}
        valign={isVertical ? Gtk.Align.END : Gtk.Align.CENTER}
        spacing={8}
        orientation={orientation}
        css={`
          margin-${OrientationSpacing[orientation]}: 20px; ${
          !isVertical ? "margin-right : 20px;" : ""
        }
        `}
      >
        <Gtk.Image pixelSize={30} iconName={iconName} />
        <Gtk.Label
          halign={isVertical ? undefined : Gtk.Align.END}
          css={`
            font-size: 1.4em;
          `}
          hexpand={!isVertical}
          label={fillRatio((r) => Math.floor(r * 100).toString())}
        />
      </Gtk.Box>

      <Gtk.Box
        halign={isVertical ? Gtk.Align.FILL : Gtk.Align.START}
        valign={isVertical ? Gtk.Align.END : Gtk.Align.FILL}
        class={"slider_fill"}
        // css={
        //   isVertical
        //     ? `border-radius: 0 0 999px 999px;`
        //     : `border-radius: 999px 0 0 999px;`
        // }
        // widthRequest={fillRatio((r) =>
        //   isVertical ? trackSize : r * trackLength
        // )}
        // heightRequest={fillRatio((r) =>
        //   isVertical ? r * trackLength : trackSize
        // )}
        widthRequest={isVertical ? trackSize : trackLength}
        heightRequest={isVertical ? trackLength : trackSize}
      />
    </Gtk.Overlay>
  );
}
