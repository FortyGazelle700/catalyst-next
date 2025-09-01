"use client";

import { pipManager } from "../app/manager.pip";

export function Render({ id }: { id: string }) {
  const elem = pipManager[id]?.Render();
  if (!elem) {
    return <div>Invalid PIP</div>;
  }
  return elem;
}
