"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import type { FindSchoolResult } from "@/server/api/catalyst/schools/find";
import {
  ArrowLeft,
  Ban,
  Loader,
  MapIcon,
  MoreHorizontal,
  Pin,
  Save,
  School,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Map } from "@/components/catalyst/map.dynamic";

const states = [
  {
    abbr: "AL",
    name: "Alabama",
  },
  {
    abbr: "AK",
    name: "Alaska",
  },
  {
    abbr: "AZ",
    name: "Arizona",
  },
  {
    abbr: "AR",
    name: "Arkansas",
  },
  {
    abbr: "CA",
    name: "California",
  },
  {
    abbr: "CO",
    name: "Colorado",
  },
  {
    abbr: "CT",
    name: "Connecticut",
  },
  {
    abbr: "DE",
    name: "Delaware",
  },
  {
    abbr: "FL",
    name: "Florida",
  },
  {
    abbr: "GA",
    name: "Georgia",
  },
  {
    abbr: "HI",
    name: "Hawaii",
  },
  {
    abbr: "ID",
    name: "Idaho",
  },
  {
    abbr: "IL",
    name: "Illinois",
  },
  {
    abbr: "IN",
    name: "Indiana",
  },
  {
    abbr: "IA",
    name: "Iowa",
  },
  {
    abbr: "KS",
    name: "Kansas",
  },
  {
    abbr: "KY",
    name: "Kentucky",
  },
  {
    abbr: "LA",
    name: "Louisiana",
  },
  {
    abbr: "ME",
    name: "Maine",
  },
  {
    abbr: "MD",
    name: "Maryland",
  },
  {
    abbr: "MA",
    name: "Massachusetts",
  },
  {
    abbr: "MI",
    name: "Michigan",
  },
  {
    abbr: "MN",
    name: "Minnesota",
  },
  {
    abbr: "MS",
    name: "Mississippi",
  },
  {
    abbr: "MO",
    name: "Missouri",
  },
  {
    abbr: "MT",
    name: "Montana",
  },
  {
    abbr: "NE",
    name: "Nebraska",
  },
  {
    abbr: "NV",
    name: "Nevada",
  },
  {
    abbr: "NH",
    name: "New Hampshire",
  },
  {
    abbr: "NJ",
    name: "New Jersey",
  },
  {
    abbr: "NM",
    name: "New Mexico",
  },
  {
    abbr: "NY",
    name: "New York",
  },
  {
    abbr: "NC",
    name: "North Carolina",
  },
  {
    abbr: "ND",
    name: "North Dakota",
  },
  {
    abbr: "OH",
    name: "Ohio",
  },
  {
    abbr: "OK",
    name: "Oklahoma",
  },
  {
    abbr: "OR",
    name: "Oregon",
  },
  {
    abbr: "PA",
    name: "Pennsylvania",
  },
  {
    abbr: "RI",
    name: "Rhode Island",
  },
  {
    abbr: "SC",
    name: "South Carolina",
  },
  {
    abbr: "SD",
    name: "South Dakota",
  },
  {
    abbr: "TN",
    name: "Tennessee",
  },
  {
    abbr: "TX",
    name: "Texas",
  },
  {
    abbr: "UT",
    name: "Utah",
  },
  {
    abbr: "VT",
    name: "Vermont",
  },
  {
    abbr: "VA",
    name: "Virginia",
  },
  {
    abbr: "WA",
    name: "Washington",
  },
  {
    abbr: "WV",
    name: "West Virginia",
  },
  {
    abbr: "WI",
    name: "Wisconsin",
  },
  {
    abbr: "WY",
    name: "Wyoming",
  },
];

export default function SchoolPageClient({
  school: defaultSchool,
}: {
  school?: {
    id: string | null;
    name: string | null;
    district: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    zip: string | null;
    canvasURL: string | null;
  };
}) {
  const [name, setName] = useState(defaultSchool?.name ?? "");
  const [district, setDistrict] = useState(defaultSchool?.district ?? "");
  const [address, setAddress] = useState(defaultSchool?.address ?? "");
  const [city, setCity] = useState(defaultSchool?.city ?? "");
  const [state, setState] = useState(defaultSchool?.state ?? "");
  const [zip, setZip] = useState(defaultSchool?.zip ?? "");
  const [canvasUrl, setCanvasUrl] = useState(defaultSchool?.canvasURL ?? "");

  const [coords, setCoords] = useState<[number, number]>([0, 0]);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const storedData = localStorage.getItem("schoolData");
    if (storedData) {
      const data = JSON.parse(storedData) as {
        name: string | null;
        district: string | null;
        address: string | null;
        city: string | null;
        state: string | null;
        zip: string | null;
        canvasUrl: string | null;
        coords: [number, number] | null;
      };
      if (
        Object.values({ ...data, coords: "" }).every(
          (v) => v == null || v == "",
        )
      )
        return;
      setName(data.name ?? "");
      setDistrict(data.district ?? "");
      setAddress(data.address ?? "");
      setCity(data.city ?? "");
      setState(data.state ?? "");
      setZip(data.zip ?? "");
      setCanvasUrl(data.canvasUrl ?? "");
      setCoords(data.coords ?? [0, 0]);
    }
  }, []);

  useEffect(() => {
    const data = {
      name,
      district,
      address,
      city,
      state,
      zip,
      canvasUrl,
      coords,
    };
    localStorage.setItem("schoolData", JSON.stringify(data));
  }, [name, district, address, city, state, zip, canvasUrl, coords]);

  useEffect(() => {
    const query = `${address ?? ""} ${city ?? ""} ${state ?? ""} ${
      zip ?? ""
    }`.trim();
    if (!query) return;
    const url = new URL(
      `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`,
    );
    const timeout = setTimeout(() => {
      (async () => {
        const response = await fetch(url.toString());
        const data = (await response.json()) as {
          lat: string;
          lon: string;
        }[];
        if (data && data.length > 0) {
          const { lat, lon } = data[0]!;
          setCoords([0, 0]);
          setTimeout(() => setCoords([parseFloat(lat), parseFloat(lon)]), 100);
        }
      })().catch(console.error);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [address, city, state, zip]);

  const map = useMemo(
    () =>
      coords.toString() == "0,0" ? (
        <div className="text-muted-foreground relative grid place-items-center overflow-hidden">
          <MapIcon className="size-8" />
        </div>
      ) : (
        <Map coords={coords} />
      ),
    [coords],
  );

  return (
    <div className="flex flex-col gap-4 @4xl:flex-row">
      <div className="flex flex-1 flex-col gap-4">
        <div>
          <h2 className="mt-2 flex items-center gap-2 font-bold">
            <School /> School Information
          </h2>
        </div>
        <div className="flex gap-4">
          <label className="text-muted-foreground relative flex flex-1 flex-col gap-1 text-xs">
            School Name
            <DynamicSchoolInput
              value={name}
              onChange={(evt) => setName(evt.target.value)}
              onData={(data: {
                lat: number;
                lon: number;
                district: string;
                name: string;
                address: {
                  house_number?: string;
                  road: string;
                  city?: string;
                  county?: string;
                  village?: string;
                  state?: string;
                  postcode?: string;
                };
              }) => {
                setCoords([0, 0]);
                setTimeout(() => setCoords([data.lat, data.lon]));
                setDistrict(data.district);
                setAddress(
                  data.address.house_number
                    ? `${data.address.house_number} ${data.address.road}`
                    : `${data.name} ${data.address.road}`,
                );
                setCity(
                  data.address.city ??
                    data.address.county ??
                    data.address.village ??
                    "",
                );
                setState(
                  states.find((state) => state.name == data.address.state)
                    ?.abbr ?? "",
                );
                setZip(data.address.postcode ?? "");
              }}
              placeholder="East High School"
            />
          </label>
        </div>
        <div className="flex gap-4">
          <label className="text-muted-foreground relative flex flex-1 flex-col gap-1 text-xs">
            District Name
            <Input
              value={district}
              onChange={(evt) => setDistrict(evt.target.value)}
              placeholder="Salt Lake City School District"
              className="text-foreground"
            />
          </label>
        </div>
        <div className="flex gap-4">
          <label className="text-muted-foreground relative flex flex-1 flex-col gap-1 text-xs">
            Address
            <Input
              value={address}
              onChange={(evt) => setAddress(evt.target.value)}
              placeholder="840 South 1300 East"
              className="text-foreground"
            />
          </label>
        </div>
        <div className="flex gap-4">
          <label className="text-muted-foreground relative flex flex-1 flex-col gap-1 text-xs">
            City
            <Input
              value={city}
              onChange={(evt) => setCity(evt.target.value)}
              placeholder="Salt Lake City"
              className="text-foreground"
            />
          </label>
        </div>
        <div className="flex gap-4">
          <label className="text-muted-foreground relative flex flex-1 flex-col gap-1 text-xs">
            State
            <Select value={state} onValueChange={setState}>
              <SelectTrigger className="text-foreground w-full">
                {states.find((s) => s.abbr === state)?.name ?? "Select State"}
              </SelectTrigger>
              <SelectContent>
                {states.map((s) => (
                  <SelectItem key={s.abbr} value={s.abbr}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>
          <label className="text-muted-foreground relative flex flex-1 flex-col gap-1 text-xs">
            Zip Code
            <Input
              value={zip}
              onChange={(evt) => setZip(evt.target.value)}
              placeholder="84102"
              className="text-foreground"
            />
          </label>
        </div>
        <div className="flex gap-4">
          <label className="text-muted-foreground relative flex flex-1 flex-col gap-1 text-xs">
            Canvas URL
            <Input
              value={canvasUrl}
              onChange={(evt) => setCanvasUrl(evt.target.value)}
              onBlur={(evt) => {
                const url = evt.target.value.trim();
                if (url && !url.startsWith("https://")) {
                  setCanvasUrl(`https://${url}`);
                }
                const urlObj = new URL(canvasUrl);
                setCanvasUrl(urlObj.toString());
              }}
              placeholder="https://canvas.instructure.com"
              className="text-foreground"
            />
          </label>
        </div>
        <div>
          <h2 className="mt-2 flex items-center gap-2 font-bold">
            <MoreHorizontal /> Other Settings
          </h2>
        </div>
        <div className="flex items-center justify-start gap-4">
          <Button
            variant="link"
            href={`/app/schools/${defaultSchool?.id}/manage/periods`}
            className="text-muted-foreground h-auto p-0 text-xs"
          >
            Manage Periods
          </Button>
          <Button
            variant="link"
            href={`/app/schools/${defaultSchool?.id}/manage/schedules`}
            className="text-muted-foreground h-auto p-0 text-xs"
          >
            Manage Schedules
          </Button>
          <Button
            variant="link"
            href={`/app/schools/${defaultSchool?.id}/manage/schedules/dates`}
            className="text-muted-foreground h-auto p-0 text-xs"
          >
            Manage Schedule Dates
          </Button>
        </div>
        <div className="mt-2 mb-3 flex items-center justify-between gap-2">
          <Button variant="outline" href={`/app/schools/${defaultSchool?.id}`}>
            <ArrowLeft />
            Back
          </Button>
          <Button
            onClick={async () => {
              setSaving(true);
              await fetch("/api/catalyst/schools/create", {
                method: "POST",
                body: JSON.stringify({
                  name,
                  district,
                  address,
                  city,
                  state,
                  zip,
                  canvasUrl,
                }),
              });
              setSaving(false);
            }}
            disabled={
              saving ||
              !name ||
              !district ||
              !address ||
              !city ||
              !state ||
              !zip ||
              !canvasUrl
            }
          >
            {saving ? (
              <>
                Saving... <Loader className="animate-spin" />
              </>
            ) : (
              <>
                Save
                <Save />
              </>
            )}
          </Button>
        </div>
      </div>
      <div className="border-border flex h-96 flex-col gap-1 overflow-hidden rounded-xs border @4xl:h-auto @4xl:flex-1">
        <span className="flex items-center gap-2 px-3 py-2 text-xs">
          <MapIcon className="size-3" />
          Map Preview
        </span>
        <div className="stack flex-1">
          <div className="bg-secondary/50"></div>
          {map}
        </div>
      </div>
    </div>
  );
}

function DynamicSchoolInput({
  value,
  onChange,
  onData,
  placeholder,
}: {
  value: string;
  onChange: (evt: React.ChangeEvent<HTMLInputElement>) => void;
  onData?: (data: FindSchoolResult) => void;
  placeholder?: string;
}) {
  const [showOptions, setShowOptions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timer = useRef<NodeJS.Timeout | null>(null);

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<FindSchoolResult[]>([]);

  useEffect(() => {
    const handleFocusIn = (event: FocusEvent) => {
      if (wrapperRef.current?.contains(event.target as Node)) {
        setShowOptions(true);
        if (timer.current) clearTimeout(timer.current);
      }
    };
    const handleFocusOut = (_evt: FocusEvent) => {
      timer.current = setTimeout(() => {
        if (
          wrapperRef.current &&
          !wrapperRef.current.contains(document.activeElement)
        ) {
          setShowOptions(false);
          setHighlightedIndex(-1);
        }
      }, 100);
    };
    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("focusout", handleFocusOut);
    return () => {
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("focusout", handleFocusOut);
    };
  }, []);

  useEffect(() => {
    if (!showOptions) return;
    setLoading(true);

    if (value.length < 3) {
      setResults([]);
      setLoading(false);
      return;
    }

    const handler = setTimeout(() => {
      const fetchSchools = async () => {
        try {
          const res = await fetch(`/api/catalyst/schools/find?query=${value}`);
          if (!res.ok) throw new Error("Failed to fetch schools");
          const data = (
            (await res.json()) as {
              success: boolean;
              data: FindSchoolResult[];
              errors?: { message: string }[];
            }
          )?.data;
          setResults(data);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching schools:", error);
          setLoading(false);
        }
      };

      fetchSchools().catch(console.error);
    }, 500);

    return () => clearTimeout(handler);
  }, [value, showOptions]);

  useEffect(() => {
    setHighlightedIndex(results.length > 0 ? 0 : -1);
  }, [results]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showOptions || results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === "Enter") {
      if (highlightedIndex >= 0 && highlightedIndex < results.length) {
        e.preventDefault();
        handleSelect(results[highlightedIndex]!);
      }
    } else if (e.key === "Escape") {
      setShowOptions(false);
      setHighlightedIndex(-1);
    }
  };

  const handleSelect = (school: FindSchoolResult) => {
    onData?.(school);
    setLoading(false);
    setResults([]);
    onChange({
      target: { value: school.name },
    } as React.ChangeEvent<HTMLInputElement>);
    setTimeout(() => {
      (document.activeElement as HTMLInputElement)?.blur();
      setShowOptions(false);
      setHighlightedIndex(-1);
    }, 100);
  };

  const options = (
    <div className="bg-background border-border absolute top-[calc(100%+theme(spacing.4))] left-0 z-10 flex h-86 w-full flex-col gap-2 overflow-auto rounded-xs border p-2">
      {results
        .filter((_, i) => i < 5)
        .map((school, idx) => (
          <Button
            key={school.name}
            variant="outline"
            className={`h-auto flex-col items-start gap-1 rounded-xs ${
              highlightedIndex === idx ? "bg-accent" : ""
            }`}
            onClick={() => handleSelect(school)}
            onMouseEnter={() => setHighlightedIndex(idx)}
            onMouseDown={(e) => {
              // Prevent input blur before click
              e.preventDefault();
            }}
            tabIndex={-1}
            type="button"
            aria-selected={highlightedIndex === idx}
          >
            <span className="text-foreground font-bold">{school.name}</span>
            <div className="text-muted-foreground flex items-center gap-1 text-xs">
              <School /> {school.district}
            </div>
            <div className="text-muted-foreground flex items-center gap-1 text-xs">
              <Pin />{" "}
              {school.address.city ??
                school.address.county ??
                school.address.village}
              , {school.address.state}
            </div>
          </Button>
        ))}
      {results.length === 0 && (
        <div className="text-muted-foreground flex h-full w-full flex-col items-center justify-center gap-2 text-sm">
          <Ban />
          <span className="text-center">No results found.</span>
          <span className="text-center">
            Try refining your search,
            <br />
            or enter information manually.
          </span>
        </div>
      )}
      <AnimatePresence>
        {loading && (
          <motion.div
            className="border-t-border bg-background absolute inset-0 top-auto flex h-10 items-center justify-center border-t"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <Loader className="mr-2 size-4 animate-spin" /> Searching...
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="relative" ref={wrapperRef}>
      <Input
        ref={inputRef}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="text-foreground"
        onKeyDown={handleKeyDown}
        autoComplete="off"
        aria-autocomplete="list"
        aria-controls="school-autocomplete-list"
        aria-activedescendant={
          highlightedIndex >= 0
            ? `school-option-${highlightedIndex}`
            : undefined
        }
      />
      {showOptions && options}
    </div>
  );
}
