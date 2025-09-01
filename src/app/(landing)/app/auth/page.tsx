import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ChevronsLeftRightEllipsis,
  FlaskConical,
  Info,
} from "lucide-react";
import { type Metadata } from "next";
import { GoogleAuth, GoogleLogo } from "./page.client";
import { LinkModal } from "@/components/catalyst/link-modal";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import TermsOfService from "@/app/(landing)/policies/(policies)/service/page.mdx";
import PrivacyPolicy from "@/app/(landing)/policies/(policies)/privacy/page.mdx";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Continue",
};

export default async function AuthPage() {
  const session = await auth();

  if (session?.authorized) {
    redirect("/app");
  }

  return (
    <div className="grid flex-1 place-items-center">
      <div className="flex w-[min(60ch,calc(100vw-theme(spacing.10)))] flex-col gap-2 rounded-xl border px-8 py-4 pt-8">
        <div className="flex items-center justify-start gap-2">
          <Button variant="outline" href="/home">
            <ArrowLeft /> Exit
          </Button>
        </div>
        <h1 className="h1">Continue with Catalyst</h1>
        <p className="text-muted-foreground text-xs">
          By continuing, you agree to Catalyst{"'"}s <TosButton /> and{" "}
          <PrivacyButton />.
        </p>
        <div className="-mx-8 my-4">
          <hr className="bg-border my-2 h-0.25 w-full" />
        </div>
        <div className="flex items-center justify-center gap-4 py-4">
          <div className="bg-border/30 rounded-full border p-4">
            <FlaskConical className="size-6" />
          </div>
          <ChevronsLeftRightEllipsis />
          <GoogleLogo />
        </div>
        <div className="-m-4 mt-4 -mr-4 flex flex-col items-center justify-between gap-4 pb-4 sm:flex-row">
          <p className="text-muted-foreground flex items-center gap-2 pl-2 text-left text-xs font-bold">
            <Info className="size-4 shrink-0" /> Connect with Google to access
            your Catalyst account
          </p>
          <GoogleAuth />
        </div>
      </div>
    </div>
  );
}

const TosButton = () => {
  return (
    <LinkModal
      link="/policies/service"
      trigger={
        <Button
          variant="link"
          className="text-muted-foreground h-auto p-0 text-xs"
        >
          Terms of Service
        </Button>
      }
      title="Terms of Service"
      description="By continuing, you agree to Catalyst's Terms of Service."
      breadcrumbs={
        <Breadcrumb className="ml-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/policies">Policies</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Terms of Service</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      }
      content={<TermsOfService />}
    />
  );
};

const PrivacyButton = () => {
  return (
    <LinkModal
      link="/policies/privacy"
      trigger={
        <Button
          variant="link"
          className="text-muted-foreground h-auto p-0 text-xs"
        >
          Privacy Policy
        </Button>
      }
      title="Privacy Policy"
      description="By continuing, you agree to Catalyst's Privacy Policy."
      breadcrumbs={
        <Breadcrumb className="ml-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/policies">Policies</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Privacy Policy</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      }
      content={<PrivacyPolicy />}
    />
  );
};
