import GLib from "gi://GLib?version=2.0";

const td = new TextDecoder("utf-8");
export const decodeSSID = (loc: GLib.Bytes) => {
  const data = loc?.get_data();
  if (!data) return null;
  return td.decode(data);
};
