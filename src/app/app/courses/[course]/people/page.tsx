import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { api } from "@/server/api";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "People",
}

export default async function PeoplePage({
  params,
}: {
  params: Promise<{ course: string }>;
}) {
  const courseId = (await params).course;

  const { data: people } = await (
    await api({})
  ).canvas.courses.people({
    courseId: Number(courseId),
  });

  return (
    <div className="flex flex-col gap-2 px-8 py-16">
      <h1 className="h1 mb-2">
        People
      </h1>
      {people?.map((person) => {
        return (<div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={person.avatar_url} />
            <AvatarFallback>
              {person.name.split(" ")[0]![0]}{person.name.split(" ")[1]?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-0.5">
            <span>{person.name}</span>
            <span className="text-xs text-muted-foreground">{(() => {
              switch (person.enrollments?.at(0)?.role) {
                case "StudentEnrollment":
                  return "Student";
                case "TeacherEnrollment":
                  return "Teacher";
                default:
                  return person.enrollments?.at(0)?.role
              }
            })()}</span>
          </div>
        </div>)
      })}
    </div>
  );
}
