export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="p-8 flex flex-col gap-2 mx-auto w-[80ch] max-w-[80ch] rounded-md border mt-8">
      <h1 className="h1">Onboarding</h1>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}
