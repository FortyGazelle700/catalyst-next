import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function UserAvatar({
  name,
  image,
  className,
}: {
  name: string;
  image?: string;
  className?: string;
}) {
  return (
    <Avatar className={cn("size-[1em]", className)}>
      <AvatarImage src={image} alt={`${name}'s Avatar`} />
      <AvatarFallback>
        {name
          .split(" ")
          .map((word) => word[0])
          .join("")
          .split("$$$$$$")
          .map((itm) =>
            itm.split("").length == 1
              ? itm.split("")?.at(0)
              : (itm.split("")?.at(0) ?? "") + (itm.split("")?.at(-1) ?? ""),
          )
          .join("")}
      </AvatarFallback>
    </Avatar>
  );
}
