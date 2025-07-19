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

export const metadata: Metadata = {
  title: "Continue",
};

export default function AuthPage() {
  return (
    <div className="flex-1 grid place-items-center">
      <div className="border rounded-xl px-8 pt-8 py-4 w-[min(60ch,100vw)] gap-2 flex flex-col">
        <div className="flex gap-2 items-center justify-start">
          <Button variant="outline" href="/">
            <ArrowLeft /> Exit
          </Button>
        </div>
        <h1 className="h1">Continue with Catalyst</h1>
        <p className="text-muted-foreground text-xs">
          By continuing, you agree to Catalyst{"'"}s <TosButton /> and{" "}
          <PrivacyButton />.
        </p>
        <div className="-mx-8 my-4">
          <hr className="w-full h-0.25 bg-border my-2" />
        </div>
        <div className="flex items-center justify-center py-4 gap-4">
          <div className="rounded-full border p-4 bg-border/30">
            <FlaskConical className="size-6" />
          </div>
          <ChevronsLeftRightEllipsis />
          <div className="rounded-full border p-4 bg-border/30">
            <GoogleSVG className="size-6" />
          </div>
        </div>
        <div className="flex items-center justify-between pb-4 gap-2 -m-4 mt-4 -mr-4">
          <p className="text-xs text-center font-bold text-muted-foreground pl-2 flex items-center gap-2">
            <Info className="size-4" /> Connect with Google to access your
            Catalyst account
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
          className="h-auto text-xs text-muted-foreground p-0"
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
          className="h-auto text-xs text-muted-foreground p-0"
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
