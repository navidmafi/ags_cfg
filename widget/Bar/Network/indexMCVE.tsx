import { Gtk } from "ags/gtk4";
import { createBinding, For } from "ags";
import AstalNetwork from "gi://AstalNetwork?version=0.1";

export default function () {
  const { client } = AstalNetwork.get_default();
  const devices = createBinding(client, "devices");
  devices.subscribe(() => console.log(devices.get().length));
  return (
    <For each={devices}>
      {(d) => (
        <Gtk.Label label={createBinding(d, "state").as((s) => s.toString())} />
      )}
    </For>
  );
}
