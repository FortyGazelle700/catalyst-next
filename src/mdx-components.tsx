import type { MDXComponents } from "mdx/types";
import { Button } from "./components/ui/button";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    h1: (props) => <h1 className="h1" {...props} />,
    h2: (props) => <h2 className="h2" {...props} />,
    h3: (props) => <h3 className="h3" {...props} />,
    h4: (props) => <h4 className="h4" {...props} />,
    h5: (props) => <h5 className="h5" {...props} />,
    h6: (props) => <h6 className="h6" {...props} />,
    p: (props) => <p className="p" {...props} />,
    ul: (props) => <ul className="list-disc pl-4" {...props} />,
    ol: (props) => <ol className="list-decimal pl-4" {...props} />,
    a: (props) => (
      <Button
        variant="link"
        className="h-auto p-0 text-[length:inherit]"
        {...props}
      />
    ),
    code: (props) => <code className="code" {...props} />,
    hr: (props) => <hr className="border-border my-4 border-t" {...props} />,
    blockquote: (props) => (
      <blockquote className="text-muted-foreground" {...props} />
    ),
    table: (props) => <table className="table" {...props} />,
    thead: (props) => <thead className="text-body" {...props} />,
    tbody: (props) => <tbody className="text-body" {...props} />,
    // eslint-disable-next-line @next/next/no-img-element
    img: (props) => <img className="rounded-lg" alt="" {...props} />,
  };
}
