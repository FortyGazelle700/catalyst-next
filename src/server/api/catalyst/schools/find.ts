import { type ApiCtx } from "../..";

export interface LocationDetails {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  class: string;
  type: string;
  place_rank: number;
  importance: number;
  addresstype: string;
  name: string;
  display_name: string;
  address: Address;
  boundingbox: string[];
}

export interface Address {
  building: string;
  house_number: string;
  road: string;
  city?: string;
  village?: string;
  county: string;
  state: string;
  "ISO3166-2-lvl4": string;
  country: string;
  country_code: string;
}

export interface FindSchoolResult {
  name: string;
  lat: number;
  lon: number;
  address: Address;
  district: string;
}

export default async function findSchool(_ctx: ApiCtx) {
  return async ({ query }: { query: string }) => {
    const cheerio = await import("cheerio");
    let locations = [] as FindSchoolResult[];
    for (const type of ["", "high", "middle", "elementary"]) {
      const req = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          query + (type ? ` ${type}` : ""),
        ).replace("%20", "+")}&format=json&addressdetails=1`,
        {
          headers: {
            "User-Agent": "ia_archiver",
          },
          next: {
            revalidate: 60 * 60,
          },
        },
      );
      if (!req.ok) {
        console.error(
          "Failed to fetch location data:",
          req.status,
          req.statusText,
        );
        return {
          success: false,
          data: [],
          errors: [{ message: "Failed to fetch location data" }],
        };
      }
      const res = (await req.json()) as LocationDetails[];
      res
        .filter((loc: LocationDetails) => loc.type == "school")
        .map((loc: LocationDetails) => ({
          name: loc.name,
          lat: Number(loc.lat),
          lon: Number(loc.lon),
          address: loc.address,
        }))
        .forEach((loc: Omit<FindSchoolResult, "district">) => {
          locations.push(loc as FindSchoolResult);
        });
    }

    locations = locations.filter(
      (
        loc: { name: string; address: Address },
        idx: number,
        arr: FindSchoolResult[],
      ) =>
        arr.findIndex(
          (l: { name: string; address: Address }) =>
            l.address &&
            loc.address &&
            JSON.stringify(l.address.city) === JSON.stringify(loc.address.city),
        ) == idx,
    );

    locations = await Promise.all(
      locations.map(async (loc: Omit<FindSchoolResult, "district">) => {
        let url;

        let res;
        let html;
        let $;

        url = `https://nces.ed.gov/ccd/schoolsearch/school_list.asp?Search=1&InstName=${encodeURIComponent(
          loc.name,
        )}&city=${encodeURIComponent(
          loc.address.city ?? loc.address.village ?? "",
        )}&county=${encodeURIComponent(loc.address.county ?? "")}`;

        res = await fetch(url);
        html = await res.text();
        $ = cheerio.load(html);

        const schoolRow = $(".resultRow").eq(0);
        url = schoolRow.find("a").eq(0).attr("href") ?? "";

        url = `https://nces.ed.gov/ccd/schoolsearch/${url}`;

        res = await fetch(url);
        html = await res.text();
        $ = cheerio.load(html);

        const district = $(".formGrid.\\/3")
          .eq(1)
          .find("a")
          .eq(0)
          .text()
          .trim();

        return {
          ...loc,
          district: district ? `${district} School District` : loc.name,
        };
      }),
    );

    return {
      success: true,
      data: locations,
      errors: [] as {
        message: string;
      }[],
    };
  };
}
