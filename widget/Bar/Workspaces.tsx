import { createBinding, For } from "ags";
import { Gtk } from "ags/gtk4";
import Hyprland from "gi://AstalHyprland";
import { range } from "../../lib/utils";
import AstalHyprland from "gi://AstalHyprland?version=0.1";
export default () => {
  const hypr = Hyprland.get_default();
  const workspaces = createBinding(hypr, "workspaces");
  const ws: number = 10;

  const focusedWorkspaceBinding = createBinding(hypr, "focusedWorkspace");

  return (
    <box valign={Gtk.Align.CENTER}>
      <box spacing={4}>
        <For
          each={workspaces<AstalHyprland.Workspace[]>((w) =>
            w.filter((ws) => ws.id !== 0).sort((a, b) => a.id - b.id)
          )}
        >
          {(w) => (
            <button
              widthRequest={30}
              heightRequest={20}
              valign={Gtk.Align.CENTER}
              class={focusedWorkspaceBinding.as((fw) => {
                return w.id === fw.id
                  ? "workspace_indicator active"
                  : "workspace_indicator";
              })}
              label={w.id.toString()}
              onClicked={() => w.focus()}
            />
          )}
        </For>
      </box>
    </box>
  );
};
