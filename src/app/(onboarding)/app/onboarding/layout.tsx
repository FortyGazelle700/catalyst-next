export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto my-8 flex w-[min(80ch,calc(100%-theme(spacing.8)))] flex-col items-center gap-2 rounded-md border p-8">
      <h1 className="h1">Welcome to Catalyst</h1>
      <p className="text-muted-foreground text-center">
        Let{"'"}s get your profile set up to personalize your experience
      </p>
      <div className="flex w-full flex-col">{children}</div>
    </div>
  );
}
