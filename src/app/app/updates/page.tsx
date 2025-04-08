import { readdir } from "fs/promises";
import { Metadata } from "next";
import { join } from "path";
import matter from "gray-matter";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Updates & Changelog",
};

export default async function Updates() {
  const files = (
    await readdir(
      join(
        import.meta.url
          .replace("file:/", "")
          .replace(new RegExp("\\/[^\\/]*$"), ""),
        "./(files)"
      )
    )
  ).map((file) =>
    join(
      import.meta.url
        .replace("file:/", "")
        .replace(new RegExp("\\/[^\\/]*$"), ""),
      "./(files)",
      `${file}/page.md`
    )
  );

  const updates = await Promise.all(
    files.map(async (file) => {
      const data = await Bun.file(file).text();
      const { data: metadata, content } = matter(data);
      return {
        fileName: file.replace("/", ""),
        md: data,
        fileContent: content,
        metadata,
      };
    })
  );

  return (
    <div className="px-16 py-8 flex flex-col gap-2">
      <h1 className="h1">Updates & Changelog</h1>
      <p className="text-muted-foreground">
        This is a list of all the updates and changes made to the app. You can
        find the latest updates at the top. If you have any questions or
        suggestions, feel free to reach out to us.
      </p>
      <div className="grid grid-cols-2 gap-2 mt-8">
        {updates.map((update) => (
          <Link
            key={update.fileName}
            className="p-4 border rounded-md bg-card text-card-foreground hover:bg-secondary transition-all"
            href={`/app/updates/${update.fileName.split("/").at(-2)}`}
          >
            <h2 className="h2">v{update.metadata.title}</h2>
            <p className="text-muted-foreground">
              {update.metadata.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
