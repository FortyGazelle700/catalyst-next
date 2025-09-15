import { cn } from "@/lib/utils";
import {
  Link,
  pixelBasedPreset,
  Tailwind,
  Button as ButtonPrimitive,
  Img as Image,
  Body as BodyPrimitive,
  Container as ContainerPrimitive,
  Html as HtmlPrimitive,
  Head as HeadPrimitive,
  Text as TextPrimitive,
} from "@react-email/components";
import { cva, type VariantProps } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium outline-none cursor-pointer no-underline",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-xs",
        destructive: "bg-destructive text-white shadow-xs",
        outline: "border border-input bg-background shadow-xs",
        secondary: "bg-secondary text-secondary-foreground shadow-xs",
        link: "text-primary underline underline-offset-4 !p-0",
        ghost: "",
      },
      size: {
        default: "px-4 py-2",
        sm: "rounded-md gap-1.5 px-3",
        lg: "rounded-md px-6",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export function Button({
  className = "",
  variant = "default",
  size = "default",
  href,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    variant?: VariantProps<typeof buttonVariants>["variant"];
    size?: VariantProps<typeof buttonVariants>["size"];
    href?: string;
  }) {
  const classes = cn(buttonVariants({ variant, size }), className);

  if (href) {
    // Render as anchor if href is provided
    return <Link className={classes} href={href} {...props} />;
  }

  // Render as button otherwise
  return (
    <ButtonPrimitive
      className={classes}
      {...{ ...props, size: undefined, variant: undefined }}
    />
  );
}

export function Header() {
  return (
    <Container className="mt-16 w-full max-w-[80ch]">
      <Container className="w-full max-w-[80ch]">
        <Button
          href="https://catalyst.bluefla.me"
          variant="ghost"
          className="bg-primary/30 mr-auto rounded-full p-4"
        >
          <Image
            src="https://catalyst.bluefla.me/favicon.ico"
            width="42"
            height="42"
            alt="Logo"
          />
        </Button>
      </Container>
      <Container className="mt-2 -ml-2 w-full">
        <Container>
          <Button
            href="https://catalyst.bluefla.me/"
            variant="ghost"
            className="text-primary text-4xl font-black"
          >
            Catalyst
          </Button>
        </Container>
        <Container>
          <Button
            href="https://www.bluefla.me/"
            variant="ghost"
            className="text-muted-foreground text-xs font-medium"
          >
            Product by Blue Flame
          </Button>
        </Container>
      </Container>
    </Container>
  );
}

export function Html({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLHtmlElement>) {
  return (
    <Tailwind
      config={{
        presets: [pixelBasedPreset],
        theme: {
          extend: {
            colors: {
              background: "#052e16",
              primary: "#22c55e",
              "primary-foreground": "#000000",
              foreground: "#ffffff",
              secondary: "#6b7280",
              "secondary-foreground": "#000000",
              accent: "#fbbf24",
              "accent-foreground": "#000000",
              muted: "#14532d",
              "muted-foreground": "#15803d",
              destructive: "#ef4444",
              "destructive-foreground": "#000000",
              border: "#166534",
              input: "#f9fafb",
              ring: "#e5e7eb",
            },
          },
        },
      }}
    >
      <HtmlPrimitive
        className={cn("bg-background font-sans", className)}
        {...props}
      />
    </Tailwind>
  );
}

export function Body({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLBodyElement>) {
  return (
    <BodyPrimitive
      className={cn("bg-background font-sans", className)}
      {...props}
    />
  );
}

export function Head({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLHeadElement>) {
  return <HeadPrimitive className={cn("", className)} {...props} />;
}

export function Container({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <ContainerPrimitive
      className={cn("mx-auto w-full max-w-[80ch]", className)}
      {...props}
    />
  );
}

export function Text({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <TextPrimitive
      className={cn("text-foreground my-2 leading-6", className)}
      {...props}
    />
  );
}
