import { Accessor } from "ags";
import { createPoll, interval } from "ags/time";
const timeZones = {
  TEH: "Asia/Tehran",
  TLV: "Asia/Jerusalem",
  TYO: "Asia/Tokyo",
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  day: "2-digit",
  month: "short",
  timeZone: Object.values(timeZones)[0],
});

const timeFormatters = Object.fromEntries(
  Object.entries(timeZones).map(([label, tz]) => [
    label,
    new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: tz,
      hour12: true,
    }),
  ])
);

const getFormattedTimes = (epochTime: number): string => {
  const date = new Date(epochTime * 1000);
  const dateStr = dateFormatter.format(date);

  const times = Object.entries(timeFormatters)
    .map(([label, formatter]) => `${label}: ${formatter.format(date)}`)
    .join(" - ");

  return `${dateStr} - ${times}`;
};

export default function ({ visible }: { visible: Accessor<boolean> }) {
  const epoch = createPoll("", 1000, "date +'%s'");
  return (
    <revealer revealChild={visible}>
      {/* <label label={epoch} /> */}
      <label label={epoch.as((e) => getFormattedTimes(Number(e)))} />
      {/*  155*/}
    </revealer>
  );
}
