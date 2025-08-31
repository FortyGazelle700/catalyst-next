"use client";

import { Button } from "@/components/ui/button";
import type { ApiCtx } from "@/server/api";
import {
  ArrowRight,
  Gavel,
  ListTree,
  Loader,
  Lock,
  MonitorSmartphone,
  Trash,
  X,
} from "lucide-react";
import { type SetStateAction, type Dispatch, useState } from "react";

import {
  ResponsiveModal,
  ResponsiveModalTrigger,
  ResponsiveModalContent,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
  ResponsiveModalFooter,
  ResponsiveModalClose,
} from "@/components/catalyst/responsible-modal";
import { signOut } from "next-auth/react";

export default function DestructionSettings({
  setLink,
}: {
  link: string;
  setLink: Dispatch<SetStateAction<string>>;
  settings: ApiCtx["user"]["settings"];
  setSettings: Dispatch<SetStateAction<ApiCtx["user"]["settings"]>>;
  isPro: boolean;
}) {
  const [deleting, setDeleting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="mt-4 flex flex-col gap-4">
      <div>
        <h2 className="mt-2 flex items-center gap-2 font-bold">
          <Gavel /> Actions
        </h2>
      </div>
      <div className="flex flex-col gap-4">
        <label className="text-muted-foreground flex w-full items-center justify-between gap-2 rounded-full border px-4 py-2">
          <span>Delete Account & Purge Data</span>
          <div className="flex items-center gap-4">
            <ResponsiveModal open={modalOpen} onOpenChange={setModalOpen}>
              <ResponsiveModalTrigger asChild>
                <Button variant="destructive">Proceed</Button>
              </ResponsiveModalTrigger>
              <ResponsiveModalContent>
                <ResponsiveModalHeader>
                  <ResponsiveModalTitle>
                    Confirm Account Deletion
                  </ResponsiveModalTitle>
                </ResponsiveModalHeader>
                <div className="px-4 py-2">
                  <p>
                    Are you sure you want to delete your account and purge all
                    associated data? This action is irreversible.
                  </p>
                </div>
                <ResponsiveModalFooter>
                  <ResponsiveModalClose asChild>
                    <Button variant="outline">
                      <X /> Cancel
                    </Button>
                  </ResponsiveModalClose>
                  <Button
                    variant="destructive"
                    onClick={async () => {
                      setDeleting(true);
                      await fetch("/api/catalyst/account/delete", {
                        method: "DELETE",
                      });
                      localStorage.clear();
                      await signOut();
                    }}
                    disabled={deleting}
                  >
                    {deleting ? (
                      <>
                        <Loader className="animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash /> Confirm
                      </>
                    )}
                  </Button>
                </ResponsiveModalFooter>
              </ResponsiveModalContent>
            </ResponsiveModal>
          </div>
        </label>
      </div>
      <div>
        <h2 className="mt-2 flex items-center gap-2 font-bold">
          <ListTree /> Related Settings
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-4 @5xl:grid-cols-2">
        <Button
          variant="outline"
          className="h-20 w-full justify-between !px-10 py-4"
          onClick={() => setLink("/security")}
        >
          <div className="flex items-center gap-3">
            <Lock className="size-6" />
            <span>Security</span>
          </div>
          <ArrowRight className="size-5 shrink-0" />
        </Button>
        <Button
          variant="outline"
          className="h-20 w-full justify-between !px-10 py-4"
          onClick={() => setLink("/sessions")}
        >
          <div className="flex items-center gap-3">
            <MonitorSmartphone className="size-6" />
            <span>Devices</span>
          </div>
          <ArrowRight className="size-5 shrink-0" />
        </Button>
      </div>
    </div>
  );
}
