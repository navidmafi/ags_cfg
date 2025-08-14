import { createBinding, For } from "ags";
import { Gtk } from "ags/gtk4";
import { range } from "../../lib/utils";
import AstalHyprland from "../../@girs/astalhyprland-0.1";
export default () => {
  const hypr = AstalHyprland.get_default();
  const workspaces = createBinding(hypr, "workspaces");
  const focusedWorkspaceBinding = createBinding(hypr, "focusedWorkspace");

  return (
    <Gtk.Box valign={Gtk.Align.CENTER}>
      <Gtk.Box spacing={4}>
        <For
          each={workspaces<AstalHyprland.Workspace[]>((w) =>
            w.filter((a) => a.id).sort((a, b) => a.id - b.id)
          )}
        >
          {(w) => (
            <button
              name={w.name}
              widthRequest={30}
              heightRequest={20}
              valign={Gtk.Align.CENTER}
              cssClasses={focusedWorkspaceBinding.as((fw) => [
                "workspace_indicator",
                fw.name === w.name ? "active" : "",
              ])}
              label={w.id.toString()}
              onClicked={() => w.focus()}
            />
          )}
        </For>
      </Gtk.Box>
    </Gtk.Box>
  );
};
