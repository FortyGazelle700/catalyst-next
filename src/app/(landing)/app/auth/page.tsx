import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import { GoogleAuth, MicrosoftAuth } from "./page.client";
import { Suspense } from "react";
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
      <div className="border rounded-lg px-8 pt-8 py-4 w-[min(60ch,100vw)] gap-2 flex flex-col">
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
        <div className="flex items-center justify-center py-4 gap-2">
          <Suspense>
            <GoogleAuth />
          </Suspense>
          <Suspense>
            <MicrosoftAuth />
          </Suspense>
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
