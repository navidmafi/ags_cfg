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
  trackSize = 60,
  trackLength = 300,
}: {
  fillRatio: Accessor<number>;
  orientation: Gtk.Orientation;
  iconName: Accessor<string>;
  trackSize?: number;
  trackLength?: number;
  showlabel: boolean;
}) {
  const isVertical = orientation === Gtk.Orientation.VERTICAL;

  return (
    <Gtk.Overlay
      overflow={Gtk.Overflow.HIDDEN}
      widthRequest={isVertical ? trackSize : trackLength}
      heightRequest={isVertical ? trackLength : trackSize}
      class="text-on_primary rounded-full border-solid border-4 border-surface"
    >
      <Gtk.Box
        $type="overlay"
        halign={isVertical ? Gtk.Align.FILL : Gtk.Align.END}
        valign={isVertical ? Gtk.Align.START : Gtk.Align.FILL}
        class="bg-surface"
        widthRequest={isVertical ? trackSize : trackLength}
        heightRequest={isVertical ? trackLength : trackSize}
      />

      <Gtk.Box
        $type="overlay"
        halign={isVertical ? Gtk.Align.FILL : Gtk.Align.START}
        valign={isVertical ? Gtk.Align.END : Gtk.Align.FILL}
        class="bg-primary"
        widthRequest={isVertical ? trackSize : trackLength}
        heightRequest={isVertical ? trackLength : trackSize}
        css={fillRatio((r) => {
          const clamped = Math.max(0, Math.min(r, 1)); // 0..1 for visual fill
          const origin = isVertical ? "center bottom" : "left center";
          const transform = isVertical
            ? `scaleY(${clamped})`
            : `scaleX(${clamped})`;
          return `
              transform-origin: ${origin};
              transform: ${transform};
              transition: transform 100ms;
            `;
        })}
      />

      <Gtk.Box
        $type="overlay"
        halign={isVertical ? Gtk.Align.CENTER : Gtk.Align.FILL}
        valign={isVertical ? Gtk.Align.END : Gtk.Align.CENTER}
        spacing={8}
        orientation={orientation}
        css={`margin-${OrientationSpacing[orientation]}: 20px; ${
          !isVertical ? "margin-right: 20px;" : ""
        }`}
      >
        <Gtk.Image pixelSize={30} iconName={iconName} />
        <Gtk.Label
          halign={isVertical ? undefined : Gtk.Align.END}
          class="text-[1.4em]"
          hexpand={!isVertical}
          label={fillRatio((r) => Math.floor(r * 100).toString())}
        />
      </Gtk.Box>
    </Gtk.Overlay>
  );
}
