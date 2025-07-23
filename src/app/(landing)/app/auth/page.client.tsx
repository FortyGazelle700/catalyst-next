"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Loader } from "lucide-react";
import { useState } from "react";

export const GoogleAuth = () => {
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(false);

  return (
    <Button
      onClick={async () => {
        setLoading(true);
        await signIn("google", {
          redirectTo: searchParams.get("redirectTo") ?? "/app",
        });
      }}
      className="ml-auto"
      disabled={loading}
    >
      {loading ? (
        <>
          Authorizing... <Loader className="animate-spin" />
        </>
      ) : (
        <>
          Continue
          <ArrowRight />
        </>
      )}
    </Button>
  );
};
