// When you want to render based on a value, you can use the <With> component.
// In a lot of cases, it is better to always render the component and set its visible property instead. This is because <With> will destroy/recreate the widget each time the passed value changes.
// When the value changes and the widget is re-rendered, the previous one is removed from the parent component and the new one is appended. The order of widgets is not kept, so make sure to wrap <With> in a container to avoid this.

// Hard earned exp: use poll subscriptions only on the highest level of properties. E.g. return a  whole classlist instead of one dynamic str
// HEXp2: you may want to use createBinding instead of createPoll
// Example where percentage is an accessor:
// WRONG: label={FormatBattery(percentage)}
// CORRECT: label={percentage((p) => FormatBattery(p))}
// In short: don't transform/reduce values outside accessor functions
// Do not use direct output of createBinding without .as()

// For loop nither "accessor(transformFn) nor accessor.as(transformFn) is useful. use <For />"
import { createBinding, createComputed, With } from "ags";
import { Gtk } from "ags/gtk4";
import { createPoll } from "ags/time";
import Battery from "gi://AstalBattery";
export default function () {
  const battery = Battery.get_default();
  const percentage = createBinding(battery, "percentage");
  const charging = createBinding(battery, "charging");
  return (
    <Gtk.Box class={"BarItemContainer"} valign={Gtk.Align.CENTER}>
      <image
        valign={Gtk.Align.CENTER}
        iconName={createBinding(battery, "iconName")}
        cssClasses={createComputed([charging, percentage], (c, p) => [
          "BatteryIcon",
          c ? "charging" : "",
          p < 0.15 ? "critical" : "",
        ])}
      />
      <label label={percentage.as((p) => `${Math.floor(p * 100)} %`)} />
    </Gtk.Box>
  );
}
