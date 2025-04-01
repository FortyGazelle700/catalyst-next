import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function Testimonials() {
  const testimonials = [
    {
      name: "Drake Semchyshyn",
      title: "CEO, Student",
      content:
        "Catalyst is a great platform for students to stay organized and on track with their studies. With Catalyst, students can access their study materials, connect with classmates, and track their progress all in one place.",
    },
    {
      name: "Memeber",
      title: "Open Slot",
      content: "Placeholder",
    },
    {
      name: "Memeber",
      title: "Open Slot",
      content: "Placeholder",
    },
    {
      name: "Memeber",
      title: "Open Slot",
      content: "Placeholder",
    },
  ];

  return (
    <>
      <Button
        variant="secondary"
        className="flex-col h-auto justify-stretch items-stretch p-4 md:col-span-2 xl:col-span-1 xl:row-span-2"
      >
        <div className="flex gap-2 items-start justify-start p-4 border-b border-background">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-background">
              {testimonials[0]?.name.split(" ").at(0)!.charAt(0) +
                (testimonials[0]?.name.split(" ").at(1)?.charAt(0) ?? "")}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start justify-center">
            <h3 className="h3">{testimonials[0]?.name}</h3>
            <p className="text-muted-foreground text-xs">
              {testimonials[0]?.title}
            </p>
          </div>
        </div>
        <div className="p-4 flex-1 max-w-full flex flex-col items-start justify-start">
          <p className="text-muted-foreground max-w-full text-wrap text-start">
            {testimonials[0]?.content}
          </p>
        </div>
      </Button>
      {testimonials.slice(1).map((testimonial, index) => (
        <Button
          key={index}
          variant="outline"
          className="flex-col h-auto justify-stretch items-stretch p-4"
        >
          <div className="flex gap-2 items-start justify-start p-4 border-b">
            <Avatar className="h-12 w-12">
              <AvatarFallback>
                {testimonial?.name.split(" ").at(0)!.charAt(0) +
                  (testimonial?.name.split(" ").at(1)?.charAt(0) ?? "")}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start justify-start">
              <h3 className="h3">{testimonial?.name}</h3>
              <p className="text-muted-foreground text-xs">
                {testimonial?.title}
              </p>
            </div>
          </div>
          <div className="p-4 flex-1 max-w-full flex flex-col items-start justify-start">
            <p className="text-muted-foreground max-w-full text-wrap">
              {testimonial?.content}
            </p>
          </div>
        </Button>
      ))}
      <Button
        variant="outline"
        href="/app/testimonials/request"
        className="flex-col h-auto justify-end items-start p-8! text-xl gap-2 group"
      >
        <div className="stack">
          <ArrowRight className="size-6 opacity-0 -translate-x-6 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
          <ArrowRight className="size-6 opacity-100 translate-x-0 group-hover:opacity-0 group-hover:translate-x-6 transition-all" />
        </div>
        <span>Request a Testimony</span>
      </Button>
    </>
  );
}
