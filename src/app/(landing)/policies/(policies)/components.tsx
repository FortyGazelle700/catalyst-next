import { Check, X } from "lucide-react";

export const Allowed = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-start gap-2">
    <div className="bg-green-50 dark:bg-green-950 w-8 h-8 rounded-full text-green-500 grid place-items-center">
      <Check className="size-4" />
    </div>
    <div className="flex flex-col gap-1 items-start mt-1">{children}</div>
  </div>
);

export const Denied = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-start gap-2">
    <div className="bg-red-50 dark:bg-red-950 w-8 h-8 rounded-full text-red-500 grid place-items-center">
      <X className="size-4" />
    </div>
    <div className="flex flex-col gap-1 items-start mt-1">{children}</div>
  </div>
);

export const Information = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-start gap-2">
    <div className="bg-blue-50 dark:bg-blue-950 w-8 h-8 rounded-full text-blue-500 grid place-items-center text-sm select-none">
      i
    </div>
    <div className="flex flex-col gap-1 items-start mt-1">{children}</div>
  </div>
);
