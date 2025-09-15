import {
  Html,
  Button,
  Header,
  Head,
  Container,
  Text,
  Body,
} from "@/lib/email-components";

export default function UpdateEmail({
  name = "John",
}: {
  timeOfDay: string;
  name?: string;
}) {
  return (
    <Html>
      <Head>
        <title>Welcome to Catalyst - Your Journey Begins Here!</title>
      </Head>
      <Body className="mx-auto max-w-[80ch] p-4">
        <Header />
        <Container className="bg-muted text-muted-foreground my-8 ml-4 h-1 w-[40px] rounded-full" />
        <Container className="max-w-[80ch] p-4">
          <Text className="text-foreground text-4xl font-bold">
            Hi there {name},
          </Text>
          <Text className="text-foreground mt-4 text-2xl font-bold italic">
            Welcome to Catalyst!
          </Text>
          <Text className="text-foreground mt-4">
            Welcome to Catalyst! We{"'"}re so happy for you to join our
            platform! Catalyst is constantly being updated, and we{"'"}d love to
            hear your feedback. If you have any questions, suggestions, or need
            assistance, please don{"'"}t hesitate to reach out to us at{" "}
            <Button href="mailto:support@catalyst.bluefla.me" variant="link">
              support@catalyst.bluefla.me
            </Button>
            .
          </Text>
        </Container>
        <Container className="bg-muted text-muted-foreground my-2 ml-4 h-1 w-[40px] rounded-full" />
        <Container className="max-w-[80ch] p-4">
          <Text className="text-foreground text-2xl font-bold">
            Troubleshooting
          </Text>
          <Text className="text-foreground text-xl font-bold">
            Didn{"'"}t create this account?
          </Text>
          <Text className="text-foreground/50">
            We use Google Authentication to create accounts. If you didn{"'"}t
            create this account, someone else may have access to your Google
            Account. You can always delete your account anytime by signing in
            and heading over to your account settings.
          </Text>
          <Text className="text-foreground text-xl font-bold">
            Need help onboarding?
          </Text>
          <Text className="text-foreground/50">
            We have directions listed while onboarding to help you move along,
            if you need additional help, please reach out to us at{" "}
            <Button href="mailto:support@catalyst.bluefla.me" variant="link">
              support@catalyst.bluefla.me
            </Button>
            .
          </Text>
          <Text className="text-foreground text-xl font-bold">
            My school isn{"'"}t listed?
          </Text>
          <Text className="text-foreground/50">
            If your school isn{"'"}t listed, feel free to create a new school.
            This platform is still growing, and we need your help to grow our
            community and database of schools. If you need help, feel free to
            reach out to us!
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
