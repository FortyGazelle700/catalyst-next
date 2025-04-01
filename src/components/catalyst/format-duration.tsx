import { Temporal } from "@js-temporal/polyfill";

const pluralUnitsInOrder = [
  "years",
  "months",
  "weeks",
  "days",
  "hours",
  "minutes",
  "seconds",
  "milliseconds",
  "microseconds",
  "nanoseconds",
] as unknown as Temporal.DateTimeUnit[];

const unitAbbreviations = {
  years: {
    short: ["y", "y"],
    medium: ["yr", "yrs"],
    long: ["year", "years"],
  },
  months: {
    short: ["m", "m"],
    medium: ["mo", "mos"],
    long: ["month", "months"],
  },
  weeks: {
    short: ["w", "w"],
    medium: ["wk", "wks"],
    long: ["week", "weeks"],
  },
  days: {
    short: ["d", "d"],
    medium: ["day", "days"],
    long: ["day", "days"],
  },
  hours: {
    short: ["h", "h"],
    medium: ["hr", "hrs"],
    long: ["hour", "hours"],
  },
  minutes: {
    short: ["m", "m"],
    medium: ["min", "mins"],
    long: ["minute", "minutes"],
  },
  seconds: {
    short: ["s", "s"],
    medium: ["sec", "secs"],
    long: ["second", "seconds"],
  },
  milliseconds: {
    short: ["ms", "ms"],
    medium: ["ms", "ms"],
    long: ["millisecond", "milliseconds"],
  },
  microseconds: {
    short: ["μs", "μs"],
    medium: ["μs", "μs"],
    long: ["microsecond", "microseconds"],
  },
  nanoseconds: {
    short: ["ns", "ns"],
    medium: ["ns", "ns"],
    long: ["nanosecond", "nanoseconds"],
  },
};

export function formatDuration(
  duration: Temporal.Duration,
  {
    maxUnit = pluralUnitsInOrder.at(0),
    minUnit = pluralUnitsInOrder.at(-1),
    maxUnits = Infinity,
    hideUnnecessaryUnits = false,
    style = "long",
  }: {
    maxUnit?: Temporal.DateTimeUnit;
    minUnit?: Temporal.DateTimeUnit;
    maxUnits?: number;
    hideUnnecessaryUnits?: boolean;
    style?: "long" | "medium" | "short" | "digital";
  }
) {
  const startPoint = Temporal.PlainDate.from("1970-01-01");
  let result = "";
  let unitsAdded = 0;

  for (const unit of pluralUnitsInOrder) {
    const value = duration.round({
      largestUnit: maxUnit ?? "auto",
      smallestUnit: minUnit ?? "nanoseconds",
      relativeTo: startPoint,
      roundingMode: "floor",
    })[unit as keyof Temporal.DurationLike];
    if (!(style == "digital" && ["minutes", "seconds"].includes(unit))) {
      if (unitsAdded >= maxUnits) break;
      if (unitsAdded == 0 && value == 0) continue;
      if (!hideUnnecessaryUnits && unitsAdded > 0 && value == 0) continue;
    }
    if (style == "digital" && ["hours", "minutes", "seconds"].includes(unit)) {
      result += `${value.toString().padStart(2, "0")}:`;
    } else {
      result += ` ${value} ${unitAbbreviations[unit as keyof typeof unitAbbreviations][
        style == "digital" ? "short" : style
        ][value == 1 ? 0 : 1]
        }`;
    }
    unitsAdded++;
    if (unit == minUnit) break;
  }
  if (unitsAdded == 0 && style != "digital") {
    return `0 ${unitAbbreviations[
      ((minUnit ?? "nanosecond") + "s") as keyof typeof unitAbbreviations
      ][style][1]
      }`;
  }
  return result.replace(" ", "").replace(new RegExp(":$"), "");
}
