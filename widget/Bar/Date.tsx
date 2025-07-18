import { Accessor } from "ags";
import { createPoll } from "ags/time";

const getFormattedTimes = (
  epochTime: number,
  timeZones: { [key: string]: string }
): string => {
  const formatDate = (epoch: number, timeZone: string) => {
    const date = new Date(epoch * 1000);
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      day: "2-digit",
      month: "short",
      timeZone,
    };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

  const formatTime = (epoch: number, timeZone: string) => {
    const date = new Date(epoch * 1000);
    const options: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      timeZone,
      hour12: true,
    };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

  const dateStr = formatDate(epochTime, Object.values(timeZones)[0]);

  const times = Object.entries(timeZones)
    .map(([label, tz]) => {
      const formattedTime = formatTime(epochTime, tz);
      return `${label}: ${formattedTime}`;
    })
    .join(" - ");

  return `${dateStr} - ${times}`;
};
const timeZones = {
  TEH: "Asia/Tehran",
  TLV: "Asia/Jerusalem",
  TYO: "Asia/Tokyo",
  // PEK: "Asia/Shanghai",
};
export default function ({ visible }: { visible: Accessor<boolean> }) {
  const epoch = createPoll("", 1000, "date +'%s'");
  return (
    <revealer revealChild={visible}>
      <label label={epoch((e) => getFormattedTimes(Number(e), timeZones))} />
    </revealer>
  );
}
