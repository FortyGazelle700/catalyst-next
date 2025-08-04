import type { Session as SessionType } from "next-auth";

import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

declare module "*.mdx" {
  let MDXComponent: (props: unknown) => JSX.Element;
  export default MDXComponent;
}

declare module "next-auth" {
  interface Session extends SessionType {
    sessionToken: string;
    authorized?: boolean;
  }
}

export interface IpLocationResponse {
  query: string;
  status: string;
  continent: string;
  continentCode: string;
  country: string;
  countryCode: string;
  region: string;
  regionName: string;
  city: string;
  district: string;
  zip: string;
  lat: number;
  lon: number;
  timezone: string;
  offset: number;
  currency: string;
  isp: string;
  org: string;
  as: string;
  asname: string;
  mobile: boolean;
  proxy: boolean;
  hosting: boolean;
}

declare global {
  var db: PostgresJsDatabase<Record<string, never>> & {
    $client: postgres.Sql<Record<string, never>>;
  };

  var ipRequests: Map<string, IpLocationResponse | null>;

  interface DocumentPictureInPicture {
    requestWindow(options?: {
      width?: number;
      height?: number;
    }): Promise<Window>;
    window?: Window;
  }

  interface Document {
    pictureInPictureElement?: Element;
  }

  interface Window {
    globalDebug: Record<string, unknown>;
    opener: Window | null;
  }

  declare var documentPictureInPicture: DocumentPictureInPicture;
}

export {};
