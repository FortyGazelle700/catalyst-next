import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import IPhone15Pro from "@/components/magicui/iphone-15-pro";
import { Safari } from "@/components/magicui/safari";
import { TextAnimate, ElementAnimate } from "@/components/magicui/text-animate";
import { Button } from "@/components/ui/button";
import {
  ArrowDown,
  ArrowRight,
  Flame,
  FlaskConical,
  Rocket,
  Slash,
} from "lucide-react";
import { Integrations } from "./integrations";
import { Marquee } from "@/components/magicui/marquee";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { VelocityScroll } from "@/components/magicui/scroll-based-velocity";
import { ScreenshotsCarousel } from "./screenshots";
import { Testimonials } from "./testimonials";
import { type Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Home",
};

export const dynamic = "force-static";

export default async function Home() {
  return (
    <>
      <HeaderSection />
      <ElementAnimate animation="blurInUp" delay={1800} once className="h-full">
        <IntegrationSection />
      </ElementAnimate>
      <ElementAnimate animation="blurInUp" delay={1900} once className="h-full">
        <NotificationsSection />
      </ElementAnimate>
      <ElementAnimate
        animation="blurInUp"
        delay={2000}
        once
        className="h-full w-full"
      >
        <AndMoreSection />
      </ElementAnimate>
      <ElementAnimate
        animation="blurInUp"
        delay={2100}
        once
        className="h-full w-full"
      >
        <ScreenshotsSection />
      </ElementAnimate>
      <ElementAnimate
        animation="blurInUp"
        delay={2200}
        once
        className="h-full w-full"
      >
        <TestimonialSection />
      </ElementAnimate>
      <ElementAnimate
        animation="blurInUp"
        delay={2300}
        once
        className="h-full w-full"
      >
        <SiteFooter />
      </ElementAnimate>
    </>
  );
}

function HeaderSection() {
  return (
    <>
      <header className="flex h-full flex-col items-start justify-center gap-2 py-12 pt-32">
        <h1 className="h1">
          <TextAnimate animation="blurInUp" by="word" once>
            Welcome to Catalyst!
          </TextAnimate>
        </h1>
        <span className="text-muted-foreground">
          <TextAnimate animation="blurInUp" by="line" delay={450} once>
            Expedite your learning experience!
          </TextAnimate>
        </span>
        <ElementAnimate animation="blurInUp" delay={700} once>
          <Button
            variant="outline"
            size="sm"
            // href="/development"
            className="group"
          >
            <AnimatedShinyText>
              <Rocket fill="currentcolor" />
              Application in development
              <ArrowRight className="-translate-x-1 transition-transform group-hover:translate-x-0" />
            </AnimatedShinyText>
          </Button>
        </ElementAnimate>
        <ElementAnimate animation="blurInUp" delay={800} once>
          <div className="bg-accent h-1 w-[20ch] rounded-full" />
        </ElementAnimate>
        <div className="flex items-center gap-4">
          <ElementAnimate animation="blurInUp" delay={850} once>
            <Button href="/app" className="group">
              Get Started
              <ArrowRight className="-translate-x-1 transition-transform group-hover:translate-x-0" />
            </Button>
          </ElementAnimate>
          <ElementAnimate animation="blurInUp" delay={950} once>
            <Button variant="outline" href="#integrations" className="group">
              Learn More
              <div className="stack">
                <ArrowDown className="-translate-y-3 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100" />
                <ArrowDown className="translate-y-0 opacity-100 transition-all group-hover:translate-y-3 group-hover:opacity-0" />
              </div>
            </Button>
          </ElementAnimate>
        </div>
        <div className="xs:flex mt-6 hidden h-48 -space-x-16 sm:h-64 lg:h-96">
          <ElementAnimate
            animation="blurInUp"
            delay={1200}
            once
            className="h-full"
          >
            <Safari
              className="h-full w-auto -rotate-2 shadow-xl"
              url="https://catalyst.bluefla.me/app"
            >
              <Image
                src="/dashboard.png"
                className="h-full w-full object-cover object-left"
                style={{
                  imageRendering: "crisp-edges",
                }}
                width={1920}
                height={1080}
                alt="Catalyst Dashboard"
              />
            </Safari>
          </ElementAnimate>
          <ElementAnimate
            animation="blurInUp"
            delay={1400}
            once
            className="relative bottom-2 h-full scale-105"
          >
            <IPhone15Pro
              className="h-full w-auto rotate-3 shadow-xl"
              src="/dashboard-mobile.png"
              style={{
                imageRendering: "crisp-edges",
              }}
            />
          </ElementAnimate>
        </div>
      </header>
    </>
  );
}

function IntegrationSection() {
  return (
    <section
      className="-my-3 flex min-h-[20rem] !w-full flex-col items-center justify-center p-8"
      id="integrations"
    >
      <div className="flex flex-col items-center justify-center gap-8 lg:flex-row">
        <div className="h-auto w-full flex-1">
          <Integrations />
        </div>
        <div className="bg-accent h-1 w-24 rounded-full lg:h-24 lg:w-1" />
        <div className="flex flex-1 flex-col gap-2">
          <h2 className="h2">Our Integrations</h2>
          <p className="text-muted-foreground max-w-[80ch]">
            Catalyst integrates with your favorite tools to help you stay
            organized and on track with your studies. With Catalyst, you can
            access your study materials, connect with classmates, and track your
            progress all in one place.
          </p>
        </div>
      </div>
    </section>
  );
}

function NotificationsSection() {
  const notifications = [
    {
      name: "Overview is Ready",
      description: (
        <>
          AP CSA FRQ grade updated (84%{" "}
          <ArrowRight className="inline size-[0.75rem]" /> 85%), +2 more
        </>
      ),
      time: "34 minutes ago",
    },
    {
      name: "Assignment Due Soon!",
      description: "3.6 Wksht B due tonight at 11:59pm",
      time: "1 hour ago",
    },
    {
      name: "Exam Approaching",
      description: "AP Quiz 3.3-3.6 next class (tomorrow)",
      time: "2 hours ago",
    },
    {
      name: "Message: Zachary S",
      description: "I think I did good",
      time: "4 hours ago",
    },
    {
      name: "Assignment due-date suggestion!",
      description: "2 people suggested a change on 3.6 Wksht A due date",
      time: "5 hour ago",
    },
  ];

  function Notifications() {
    return (
      <>
        <div className="bg-background relative flex h-[20rem] w-full flex-col overflow-hidden rounded-lg">
          <Marquee vertical className="[--duration:40s]" reverse>
            {notifications.map((notification, index) => (
              <Card
                key={index}
                className="flex w-full flex-col gap-2 p-4 text-xs md:text-base"
              >
                <CardHeader className="flex flex-col-reverse items-center justify-between gap-8 p-2 sm:flex-row sm:gap-2">
                  <CardTitle>{notification.name}</CardTitle>
                  <CardDescription>{notification.time}</CardDescription>
                </CardHeader>
                <CardContent className="p-2 pt-0">
                  {notification.description}
                </CardContent>
              </Card>
            ))}
          </Marquee>
          <div className="from-background absolute top-0 right-0 left-0 h-8 bg-gradient-to-b to-transparent" />
          <div className="from-background absolute right-0 bottom-0 left-0 h-8 bg-gradient-to-t to-transparent" />
        </div>
      </>
    );
  }

  return (
    <>
      <section className="-my-3 flex min-h-[20rem] !w-full flex-col items-center justify-center p-8">
        <div className="flex flex-col-reverse items-center justify-center gap-8 lg:flex-row">
          <div className="flex flex-1 flex-col gap-2">
            <h2 className="h2">Our Notifications</h2>
            <p className="text-muted-foreground max-w-[80ch]">
              Catalyst sends you notifications to help you stay on track with
              your studies. With Catalyst, you can receive notifications about
              upcoming assignments, exams, and events to help you stay
              organized.
            </p>
          </div>
          <div className="bg-accent h-1 w-24 rounded-full lg:h-24 lg:w-1" />
          <div className="h-auto w-auto flex-1">
            <Notifications />
          </div>
        </div>
      </section>
    </>
  );
}

function AndMoreSection() {
  const items = [
    "Customizable",
    "User Friendly",
    "Cross Platform",
    "Secure",
    "Intelligent",
    "Powerful",
    "Fast",
    "Reliable",
  ];
  return (
    <>
      <section className="-my-3 flex !w-full flex-col items-center justify-center gap-2 py-4">
        <div className="bg-background relative flex h-auto w-full flex-col gap-8 overflow-hidden rounded-lg">
          <Marquee className="w-full overflow-hidden [--gap:4rem]">
            {items.map((item, index) => (
              <span
                key={index}
                className="text-muted-foreground text-4xl font-bold"
              >
                {item}
              </span>
            ))}
          </Marquee>
          <VelocityScroll
            text="And so much more"
            default_velocity={2}
            className="text-muted-foreground text-4xl font-bold"
          />
          <div className="from-background absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r to-transparent" />
          <div className="from-background absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l to-transparent" />
        </div>
      </section>
    </>
  );
}

function ScreenshotsSection() {
  return (
    <section
      className="-my-3 flex min-h-[20rem] !w-full flex-col items-center justify-center p-8"
      id="integrations"
    >
      <div className="flex flex-col items-center justify-center gap-8 lg:flex-row">
        <div className="relative h-auto flex-1">
          <ScreenshotsCarousel />
        </div>
        <div className="bg-accent h-1 w-24 rounded-full lg:h-24 lg:w-1" />
        <div className="flex flex-1 flex-col gap-2">
          <h2 className="h2">Take a peak</h2>
          <p className="text-muted-foreground max-w-[80ch]">
            Catalyst is a modern platform that offers a wide range of features
            to help you succeed in your learning journey. With Catalyst, you can
            access your study materials, connect with classmates, and track your
            progress all in one place.
          </p>
        </div>
      </div>
    </section>
  );
}

function TestimonialSection() {
  return (
    <>
      <section className="grid grid-cols-1 grid-rows-5 gap-2 md:grid-cols-[1fr_1fr] md:grid-rows-[1fr_1fr_1fr] xl:grid-cols-[1fr_1fr_1fr] xl:grid-rows-[1fr_1fr]">
        <Testimonials />
      </section>
    </>
  );
}

function SiteFooter() {
  return (
    <footer className="mt-16 flex flex-col items-start justify-center gap-8 border-t p-8">
      <div className="flex w-full flex-col items-center justify-between gap-6 lg:flex-row lg:gap-4">
        <h2 className="flex items-center justify-center gap-1 font-bold">
          <Button
            variant="ghost"
            href="https://www.bluefla.me/"
            className="h-auto rounded-lg px-4 py-1 text-lg"
          >
            <span className="flex items-center justify-center gap-2 text-blue-500">
              <Flame className="size-[1em] fill-blue-500/50 stroke-blue-500/50" />{" "}
              Blue Flame
            </span>
          </Button>
          <Slash className="size-[1rem]" />
          <Button
            variant="ghost"
            href="/"
            className="stroke-muted-foreground h-auto rounded-lg px-4 py-1 text-lg"
          >
            <span className="flex items-center justify-center gap-2 text-green-500">
              <FlaskConical className="size-[1em] fill-green-500/50 stroke-green-500/50" />{" "}
              Catalyst
            </span>
          </Button>
        </h2>
        <div className="flex flex-col items-center justify-end gap-2 sm:flex-row">
          <Button variant="ghost" href="/contact">
            Contact
          </Button>
          <Button variant="ghost" href="/policies">
            Policies
          </Button>
          <Button href="/app" className="group ml-2">
            Get Started
            <ArrowRight className="l -translate-x-1 transition-transform group-hover:translate-x-0" />
          </Button>
        </div>
      </div>
    </footer>
  );
}
