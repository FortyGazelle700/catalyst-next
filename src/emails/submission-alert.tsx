import { SubmissionTypeWithIcon } from "@/components/catalyst/pretty-state";
import {
  Html,
  Button,
  Header,
  Head,
  Container,
  Text,
  Body,
} from "@/lib/email-components";
import { ArrowRight } from "lucide-react";

export default function SubmissionAlertEmail({
  name = "John",
  assignmentsDue = [
    {
      name: "1.11 Thought Log: SETTING: TIME & PLACE",
      courseLabel: "English",
      courseName: "AP English Literature-Fisher-S1-2025",
      dueDate: "Sunday, Sep 14 at 11:59 PM",
      dueIn: "4 hours",
      url: "https://catalyst.bluefla.me/app/courses/167398/assignments/3465417",
      submissionTypes: ["online_upload", "online_text_entry"],
    },
    {
      name: "1.12 College & Career Plan Rough Draft",
      courseLabel: "English",
      courseName: "AP English Literature-Fisher-S1-2025",
      dueDate: "Sunday, Sep 14 at 11:59 PM",
      dueIn: "4 hours",
      url: "https://catalyst.bluefla.me/app/courses/167398/assignments/3465417",
      submissionTypes: ["online_upload"],
    },
  ],
}: {
  name?: string;
  assignmentsDue: {
    name: string;
    courseLabel: string;
    courseName: string;
    dueDate: string;
    dueIn: string;
    url: string;
    submissionTypes: string[];
  }[];
}) {
  return (
    <Html>
      <Head>
        <title>
          {`${assignmentsDue.length} assignment${
            assignmentsDue.length > 1 ? "s" : ""
          } due soon!`}
        </title>
      </Head>
      <Body className="mx-auto max-w-[80ch] p-4">
        <Header />
        <Container className="bg-muted text-muted-foreground my-8 ml-4 h-1 w-[40px] rounded-full" />
        <Container className="max-w-[80ch] p-4">
          <Text className="text-foreground text-4xl font-bold">Hi {name},</Text>
          <Text className="text-foreground mt-4 text-2xl font-bold italic">
            You have {assignmentsDue.length} assignment
            {assignmentsDue.length >= 2 ? "s" : ""} due soon!
          </Text>
        </Container>
        {assignmentsDue.map((assignment, idx) => (
          <Container
            key={idx}
            className="border-border mb-4 max-w-[80ch] rounded-xl border border-solid p-4 pt-6"
          >
            <Text className="text-foreground text-2xl font-bold">
              {assignment.name}
            </Text>
            <Text className="text-foreground/50">
              {assignment.courseLabel} ({assignment.courseName})
            </Text>
            <Text className="text-foreground/50">
              Due in {assignment.dueIn} on {assignment.dueDate}
            </Text>
            <Container className="text-foreground/50">
              Submit:{" "}
              {assignment.submissionTypes.map((type) => (
                <Container key={type} className="mt-2 ml-4">
                  <SubmissionTypeWithIcon
                    submission={type}
                    className="size-3"
                  />
                </Container>
              ))}
            </Container>
            <Button href={assignment.url} className="mt-4">
              Open Assignment <ArrowRight className="size-4" />
            </Button>
          </Container>
        ))}
        <Container className="bg-muted text-muted-foreground mt-6 mb-2 ml-4 h-1 w-[40px] rounded-full" />
        <Container className="max-w-[80ch] p-4">
          <Text className="text-foreground text-2xl font-bold">
            Notifications?
          </Text>
          <Text className="text-foreground text-xl font-bold">
            Disable these emails?
          </Text>
          <Text className="text-foreground/50">
            You can disable and manage your notification preferences{" "}
            <Button
              href="https://catalyst.bluefla.me/app/settings?page=%2Fnotifications"
              variant="link"
            >
              here
            </Button>
            .
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
