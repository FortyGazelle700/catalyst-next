import { cn } from "@/lib/utils";
import {
  Dumbbell,
  Calculator,
  Palette,
  Book,
  Languages,
  FlaskConical,
  Cpu,
  Globe,
  HelpCircle,
  Pin,
  Heart,
} from "lucide-react";

export const SubjectIcon = ({
  subject,
  className,
}: {
  subject: string;
  className?: string;
}) => {
  let SubjectIcon = HelpCircle;
  switch (subject) {
    case "Persistent":
      SubjectIcon = Pin;
      break;
    case "Physical Education":
      SubjectIcon = Dumbbell;
      break;
    case "Activity":
      SubjectIcon = Heart;
      break;
    case "Math":
      SubjectIcon = Calculator;
      break;
    case "Arts":
      SubjectIcon = Palette;
      break;
    case "English":
      SubjectIcon = Book;
      break;
    case "Language":
      SubjectIcon = Languages;
      break;
    case "Science":
      SubjectIcon = FlaskConical;
      break;
    case "Technology":
      SubjectIcon = Cpu;
      break;
    case "Social Studies":
      SubjectIcon = Globe;
      break;
  }
  return <SubjectIcon className={cn(className)} />;
};

export const subjectColors = (subject: string): string => {
  switch (subject) {
    case "Persistent":
      return "oklch(0.871 0.15 154.449)";
    case "Physical Education":
      return "oklch(0.585 0.233 277.117)";
    case "Activity":
      return "oklch(0.81 0.117 11.638)";
    case "Math":
      return "oklch(0.809 0.105 251.813)";
    case "Arts":
      return "oklch(0.827 0.119 306.383)";
    case "English":
      return "oklch(0.704 0.191 22.216)";
    case "Language":
      return "oklch(0.704 0.191 22.216)";
    case "Science":
      return "oklch(0.852 0.199 91.936)";
    case "Technology":
      return "oklch(0.872 0.01 258.338)";
    case "Social Studies":
      return "oklch(0.75 0.183 55.934)";
    default:
      return "oklch(0.551 0.027 264.364)";
  }
};
