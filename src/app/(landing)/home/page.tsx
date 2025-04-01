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
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
};

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
      <header className="flex flex-col items-start justify-center h-full gap-2 py-12 pt-32">
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
              <ArrowRight className="-translate-x-1 group-hover:translate-x-0 transition-transform" />
            </AnimatedShinyText>
          </Button>
        </ElementAnimate>
        <ElementAnimate animation="blurInUp" delay={800} once>
          <div className="h-1 w-[20ch] bg-accent rounded-full" />
        </ElementAnimate>
        <div className="flex items-center gap-4">
          <ElementAnimate animation="blurInUp" delay={850} once>
            <Button href="/app" className="group">
              Get Started
              <ArrowRight className="-translate-x-1 group-hover:translate-x-0 transition-transform" />
            </Button>
          </ElementAnimate>
          <ElementAnimate animation="blurInUp" delay={950} once>
            <Button variant="outline" href="#integrations" className="group">
              Learn More
              <div className="stack">
                <ArrowDown className="opacity-0 -translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                <ArrowDown className="opacity-100 translate-y-0 group-hover:opacity-0 group-hover:translate-y-3 transition-all" />
              </div>
            </Button>
          </ElementAnimate>
        </div>
        <div className="mt-6 h-48 lg:h-96 sm:h-64 hidden -space-x-8 xs:flex">
          <ElementAnimate
            animation="blurInUp"
            delay={1200}
            once
            className="h-full"
          >
            <Safari
              className="-rotate-2 h-full w-auto shadow-xl"
              url="https://catalyst.bluefla.me/app"
              src=""
            />
          </ElementAnimate>
          <ElementAnimate
            animation="blurInUp"
            delay={1400}
            once
            className="h-full"
          >
            <IPhone15Pro className="w-auto h-full rotate-3 shadow-xl" src="" />
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
        <div className="flex-1 h-auto w-full">
          <Integrations />
        </div>
        <div className="h-1 lg:h-24 w-24 lg:w-1 bg-accent rounded-full" />
        <div className="flex flex-col gap-2 flex-1">
          <h2 className="h2">Our Integrations</h2>
          <p className="max-w-[80ch] text-muted-foreground">
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
          <ArrowRight className="size-[0.75rem] inline" /> 85%), +2 more
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
        <div className="relative flex h-[20rem] w-full flex-col overflow-hidden rounded-lg bg-background">
          <Marquee vertical className="[--duration:40s]" reverse>
            {notifications.map((notification, index) => (
              <Card
                key={index}
                className="flex w-full flex-col gap-2 p-4 text-xs md:text-base"
              >
                <CardHeader className="flex flex-col-reverse sm:gap-2 gap-8 sm:flex-row items-center justify-between p-2">
                  <CardTitle>{notification.name}</CardTitle>
                  <CardDescription>{notification.time}</CardDescription>
                </CardHeader>
                <CardContent className="p-2 pt-0">
                  {notification.description}
                </CardContent>
              </Card>
            ))}
          </Marquee>
          <div className="absolute left-0 right-0 top-0 h-8 bg-gradient-to-b from-background to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent" />
        </div>
      </>
    );
  }

  return (
    <>
      <section className="-my-3 flex min-h-[20rem] !w-full flex-col items-center justify-center p-8">
        <div className="flex flex-col-reverse items-center justify-center gap-8 lg:flex-row">
          <div className="flex flex-col gap-2 flex-1">
            <h2 className="h2">Our Notifications</h2>
            <p className="max-w-[80ch] text-muted-foreground">
              Catalyst sends you notifications to help you stay on track with
              your studies. With Catalyst, you can receive notifications about
              upcoming assignments, exams, and events to help you stay
              organized.
            </p>
          </div>
          <div className="h-1 lg:h-24 w-24 lg:w-1 bg-accent rounded-full" />
          <div className="flex-1 h-auto w-auto">
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
        <div className="relative flex gap-8 h-auto w-full flex-col overflow-hidden rounded-lg bg-background">
          <Marquee className="w-full overflow-hidden [--gap:4rem]">
            {items.map((item, index) => (
              <span
                key={index}
                className="text-4xl font-bold text-muted-foreground"
              >
                {item}
              </span>
            ))}
          </Marquee>
          <VelocityScroll
            text="And so much more"
            default_velocity={2}
            className="text-4xl font-bold text-muted-foreground"
          />
          <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-background to-transparent" />
          <div className="absolute top-0 bottom-0 right-0 w-8 bg-gradient-to-l from-background to-transparent" />
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
        <div className="flex-1 flex-shrink h-auto relative">
          <ScreenshotsCarousel />
        </div>
        <div className="h-1 lg:h-24 w-24 lg:w-1 bg-accent rounded-full" />
        <div className="flex-1 flex flex-col gap-2">
          <h2 className="h2">Take a peak</h2>
          <p className="max-w-[80ch] text-muted-foreground">
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
      <section className="grid grid-cols-1 grid-rows-5 md:grid-cols-[1fr_1fr] md:grid-rows-[1fr_1fr_1fr] xl:grid-rows-[1fr_1fr] xl:grid-cols-[1fr_1fr_1fr] gap-2">
        <Testimonials />
      </section>
    </>
  );
}

function SiteFooter() {
  return (
    <footer className="flex flex-col items-start justify-center gap-8 p-8 border-t mt-16">
      <div className="flex items-center justify-between gap-6 lg:gap-4 w-full lg:flex-row flex-col">
        <h2 className="flex items-center justify-center font-bold gap-1">
          <Button
            variant="ghost"
            href="https://www.bluefla.me/"
            className="text-lg h-auto px-4 py-1 rounded-lg"
          >
            <span className="text-blue-500 flex gap-2 items-center justify-center">
              <Flame className="fill-blue-500/50 stroke-blue-500/50 size-[1em]" />{" "}
              Blue Flame
            </span>
          </Button>
          <Slash className="size-[1rem]" />
          <Button
            variant="ghost"
            href="/"
            className="text-lg h-auto px-4 py-1 rounded-lg stroke-muted-foreground"
          >
            <span className="text-green-500 flex gap-2 items-center justify-center">
              <FlaskConical className="fill-green-500/50 stroke-green-500/50 size-[1em]" />{" "}
              Catalyst
            </span>
          </Button>
        </h2>
        <div className="flex gap-2 sm:flex-row flex-col items-center justify-end">
          <Button variant="ghost" href="/contact">
            Contact
          </Button>
          <Button variant="ghost" href="/policies">
            Policies
          </Button>
          <Button href="/app" className="group ml-2">
            Get Started
            <ArrowRight className="-translate-x-1 group-hover:translate-x-0 transition-transform l" />
          </Button>
        </div>
      </div>
    </footer>
  );
}
