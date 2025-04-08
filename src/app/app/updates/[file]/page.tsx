import matter from "gray-matter";
import { join } from "path";
import { remark } from "remark";
import html from "remark-html";

export default async function UpdatePage({
  params,
}: {
  params: Promise<{ file: string }>;
}) {
  const fileId = (await params).file;

  const file = await Bun.file(
    join(
      import.meta.url
        .replace("file:/", "")
        .replace(new RegExp("\\/[^\\/]*$"), ""),
      "../(files)",
      fileId,
      "page.md"
    )
  ).text();
  const { data: metadata, content } = matter(file);
  const { title, description } = metadata;
  const fileName = fileId.replace("/", "");
  const filePath = join(
    import.meta.url
      .replace("file:/", "")
      .replace(new RegExp("\\/[^\\/]*$"), ""),
    "../(files)",
    fileId,
    "page.md"
  );
  const md = await remark().use(html).process(content);
  const renderHTML = md.toString();

  return (
    <div className="px-16 py-8 flex flex-col gap-2">
      <div
        className="render-fancy mt-8"
        dangerouslySetInnerHTML={{ __html: renderHTML }}
      />
    </div>
  );
}
