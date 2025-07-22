import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ChevronsLeftRightEllipsis,
  FlaskConical,
  Info,
} from "lucide-react";
import { type Metadata } from "next";
import { GoogleAuth } from "./page.client";
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
          <div className="bg-border/30 rounded-full border p-4">
            <GoogleSVG className="size-6" />
          </div>
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

const GoogleSVG = ({ className }: { className?: string }) => (
  <>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width="100"
      height="100"
      viewBox="0 0 48 48"
      className={className}
    >
      <path
        fill="#fbc02d"
        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
      ></path>
      <path
        fill="#e53935"
        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
      ></path>
      <path
        fill="#4caf50"
        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
      ></path>
      <path
        fill="#1565c0"
        d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
      ></path>
    </svg>
  </>
);
