"use client";

import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { useEffect, useMemo, useState } from "react";
import L from "leaflet";
import { cn } from "@/lib/utils";
import { ErrorBoundary } from "react-error-boundary";
import { Ban, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

L.Marker.prototype.options.icon = L.icon({
  iconUrl: "/map-pin.svg",
  iconRetinaUrl: "/blank.png",
  shadowUrl: "/blank.png",
  iconSize: [64, 64],
  iconAnchor: [32, 64],
  popupAnchor: [0, 0],
  shadowSize: [0, 0],
});

export function Map({
  coords,
  className,
}: {
  coords: L.LatLngTuple;
  className?: string;
}) {
  return (
    <ErrorBoundary
      fallbackRender={(opts) => <Error {...opts} className="[&>div]:p-2" />}
    >
      <MapMap coords={coords} className={className} />
    </ErrorBoundary>
  );
}

function Error({
  error: _e,
  reset,
  resetErrorBoundary,
  className,
}: {
  error: Error & { digest?: string };
  reset?: () => void;
  resetErrorBoundary?: () => void;
  className?: string;
}) {
  return (
    <div className={cn("flex max-h-full flex-col", className)}>
      <div className="mt-16 flex flex-col items-start justify-center gap-2 px-32 py-16">
        <Ban className="size-16" />
        <h1 className="h3">Hmm, An Application Error Occurred</h1>
        <p className="text-muted-foreground">
          Hmm, it seems like a client-side error occurred. Please try again
          later.
          <br />
          This error should already be reported to the support team.
          <br />
          If the problem persists, please report the issue as a bug.
        </p>
        <div className="mt-4 flex items-center gap-4">
          <Button onClick={() => reset?.() ?? resetErrorBoundary?.()}>
            <RotateCcw /> Retry
          </Button>
        </div>
      </div>
    </div>
  );
}

export function MapMap({
  coords,
  className,
}: {
  coords: L.LatLngTuple;
  className?: string;
}) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial system theme
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(mediaQuery.matches);

    // Listen for changes
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mediaQuery.addEventListener("change", handler);

    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  setTimeout(() => {
    // @ts-expect-error It doesn't know about dynamic imports for css
    import("leaflet/dist/leaflet.css").catch(console.error);
  }, 100);

  const mapComponent = useMemo(
    () => (
      <MapContainer
        key="map-container"
        center={coords}
        zoom={16}
        minZoom={12}
        maxZoom={18}
        maxBounds={[coords, coords]}
        className="h-full w-full bg-black"
      >
        <TileLayer
          key="tile-layer"
          url={
            isDark
              ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          }
        />
        <Marker position={coords} />
      </MapContainer>
    ),
    [coords, isDark],
  );

  const ret = useMemo(
    () => (
      <div
        className={cn(
          "[&_.leaflet-container]:!bg-secondary relative overflow-hidden [&_.leaflet-bottom]:hidden [&_.leaflet-interactive]:!pointer-events-none [&_.leaflet-top]:hidden",
          className,
        )}
        key="map-div"
      >
        {mapComponent}
      </div>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [coords, className, isDark],
  );

  return ret;
}
