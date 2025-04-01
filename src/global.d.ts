declare module "*.mdx" {
  let MDXComponent: (props: unknown) => JSX.Element;
  export default MDXComponent;
}

declare global {
  var db: PostgresJsDatabase<Record<string, never>> & {
    $client: postgres.Sql<{}>;
  };
}

export {};
