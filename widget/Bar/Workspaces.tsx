import { createBinding, For } from "ags";
import { Gtk } from "ags/gtk4";
import AstalHyprland from "gi://AstalHyprland?version=0.1";

export default () => {
  const hypr = AstalHyprland.get_default();
  const workspaces = createBinding(hypr, "workspaces");
  const focused = createBinding(hypr, "focusedWorkspace");
  return (
    <Gtk.Box valign={Gtk.Align.CENTER}>
      <Gtk.EventControllerScroll
        onScroll={(_c, _dx, dy) => {
          const spaces = [...hypr.workspaces].sort((a, b) => a.id - b.id);
          const len = spaces.length;
          if (len === 0) return;

          if (!focused) return;
          const curIdx = spaces.findIndex((ws) => ws.id === focused.get().id);
          if (curIdx === -1) return;

          // convert dy to an integer step (1 or -1)
          const step = Math.sign(dy) || 0;
          if (step === 0) return;

          const nextIdx = (curIdx - step + len) % len; // -dy in original; here dy sign already accounts
          const target = spaces[nextIdx];
          if (!target) return;

          // avoid redundant .focus() calls
          if (target.id === focused.get().id) return;
          target.focus();
        }}
        flags={Gtk.EventControllerScrollFlags.VERTICAL}
      />
      <Gtk.Box spacing={2}>
        <For
          each={workspaces.as<Array<AstalHyprland.Workspace>>((wss) =>
            wss.filter((a) => a.id > 0).sort((a, b) => a.id - b.id)
          )}
        >
          {(ws) => (
            <Gtk.Button
              class={focused.as((fw) =>
                [
                  "p-0 min-w-8 min-h-8",
                  fw?.id === ws.id ? "bg-primary" : "bg-surface",
                ].join(" ")
              )}
              label={ws.id.toString()}
              onClicked={() => ws.focus()}
            />
          )}
        </For>
      </Gtk.Box>
    </Gtk.Box>
  );
};
