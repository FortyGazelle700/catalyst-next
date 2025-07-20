"use client";

import { cn } from "@/lib/utils";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import TurndownService from "turndown";
import {
  type Editor,
  EditorProvider,
  type KeyboardShortcutCommand,
  useCurrentEditor,
} from "@tiptap/react";
import DocumentExtension from "@tiptap/extension-document";
import UnderlineExtension from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import SuperscriptExtension from "@tiptap/extension-superscript";
import SubscriptExtension from "@tiptap/extension-subscript";
import HighlighterExtension from "@tiptap/extension-highlight";
import BlockquoteExtension from "@tiptap/extension-blockquote";
import BoldExtension from "@tiptap/extension-bold";
import ItalicExtension from "@tiptap/extension-italic";
import StrikeExtension from "@tiptap/extension-strike";
import BulletListExtension from "@tiptap/extension-bullet-list";
import OrderedListExtension from "@tiptap/extension-ordered-list";
import HorizontalRuleExtension from "@tiptap/extension-horizontal-rule";
import HeadingExtension from "@tiptap/extension-heading";
import ParagraphExtension from "@tiptap/extension-paragraph";
import HardBreakExtension from "@tiptap/extension-hard-break";
import TextExtension from "@tiptap/extension-text";
import ListItemExtension from "@tiptap/extension-list-item";
import {
  Baseline,
  Bold,
  Check,
  Clock,
  Code,
  Computer,
  CornerDownLeft,
  Hash,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Highlighter,
  History,
  Indent,
  Italic,
  List,
  ListOrdered,
  Loader,
  Minus,
  Outdent,
  Pilcrow,
  Redo,
  RemoveFormatting,
  SquareSigma,
  Strikethrough,
  Subscript,
  Superscript,
  TextCursor,
  TextQuote,
  Underline,
  Undo,
  UndoDot,
} from "lucide-react";
import type React from "react";
import {
  Fragment,
  type ReactNode,
  useEffect,
  useRef,
  useState,
  useMemo,
  type JSX,
} from "react";
import { Toggle } from "../ui/toggle";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import Placeholder from "@tiptap/extension-placeholder";
import { Indent as IndentExtension } from "./editor-extensions/indent";
import { Badge } from "../ui/badge";
import {
  ResponsiveModal,
  ResponsiveModalClose,
  ResponsiveModalContent,
  ResponsiveModalDescription,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
  ResponsiveModalTrigger,
} from "../catalyst/responsible-modal";

function FontStyle() {
  const { editor } = useCurrentEditor();

  const paragraphStyle = useRef([
    {
      id: "h1",
      name: "Heading 1",
      icon: Heading1,
      isActive: () => editor?.isActive("heading", { level: 1 }),
      setActive: () => editor?.chain().focus().setHeading({ level: 1 }).run(),
    },
    {
      id: "h2",
      name: "Heading 2",
      icon: Heading2,
      isActive: () => editor?.isActive("heading", { level: 2 }),
      setActive: () => editor?.chain().focus().setHeading({ level: 2 }).run(),
    },
    {
      id: "h3",
      name: "Heading 3",
      icon: Heading3,
      isActive: () => editor?.isActive("heading", { level: 3 }),
      setActive: () => editor?.chain().focus().setHeading({ level: 3 }).run(),
    },
    {
      id: "h4",
      name: "Heading 4",
      icon: Heading4,
      isActive: () => editor?.isActive("heading", { level: 4 }),
      setActive: () => editor?.chain().focus().setHeading({ level: 4 }).run(),
    },
    {
      id: "h5",
      name: "Heading 5",
      icon: Heading5,
      isActive: () => editor?.isActive("heading", { level: 5 }),
      setActive: () => editor?.chain().focus().setHeading({ level: 5 }).run(),
    },
    {
      id: "h6",
      name: "Heading 6",
      icon: Heading6,
      isActive: () => editor?.isActive("heading", { level: 6 }),
      setActive: () => editor?.chain().focus().setHeading({ level: 6 }).run(),
    },
    {
      id: "p",
      name: "Paragraph",
      icon: Pilcrow,
      isActive: () => editor?.isActive("paragraph"),
      setActive: () => editor?.chain().focus().setParagraph().run(),
    },
  ]);

  const [editorState, setEditorState] = useState(0);

  const [currentStyle, setCurrentStyle] = useState(
    paragraphStyle.current.at(-1)!,
  );

  useEffect(() => {
    let style = paragraphStyle.current.find((style) => style.isActive());
    style ??= paragraphStyle.current.at(-1)!;
    setCurrentStyle(style);
  }, [editorState]);

  useEffect(() => {
    editor?.on("transaction", () => {
      setEditorState(Math.random());
    });
  }, [editor]);

  return (
    <Select
      onValueChange={(value) => {
        paragraphStyle.current.find((style) => style.id == value)!.setActive();
        setCurrentStyle(
          paragraphStyle.current.find((style) => style.id == value)!,
        );
      }}
      defaultValue={currentStyle.id}
      value={currentStyle.id}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <SelectTrigger className="max-w-[20ch] min-w-[20ch]">
            <div className="flex items-center gap-2">
              <currentStyle.icon /> {currentStyle.name}
            </div>
          </SelectTrigger>
        </TooltipTrigger>
        <TooltipContent className="flex items-center gap-2">
          <Pilcrow className="h-4 w-4" /> Paragraph Style
        </TooltipContent>
      </Tooltip>
      <SelectContent>
        {paragraphStyle.current.map((style) => (
          <SelectItem value={style.id} key={`p-style-${style.id}`}>
            <div className="flex items-center gap-1">
              <style.icon /> {style.name}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function TextAndHighlightColorPicker() {
  const { editor } = useCurrentEditor();

  const colors = [
    ["#ef4444", "#b91c1c"],
    ["#f97316", "#c2410c"],
    ["#f59e0b", "#b45309"],
    ["#10b981", "#047857"],
    ["#3b82f6", "#1e40af"],
    ["#6366f1", "#4338ca"],
    ["#8b5cf6", "#6d28d9"],
  ];

  return (
    <>
      <Popover>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="px-3">
                <Baseline className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent className="flex items-center gap-2">
            <Baseline className="h-4 w-4" /> Text Color
          </TooltipContent>
        </Tooltip>
        <PopoverContent className="w-[40ch]">
          <div className="flex gap-1">
            <div className="flex flex-1 flex-col gap-1">
              <Button
                size="icon"
                className="flex-1"
                onClick={() => editor?.chain().focus().unsetColor().run()}
              >
                <Baseline />
              </Button>
            </div>
            {colors.map((colorGroup, idx) => (
              <div
                key={`${idx}-group-text`}
                className="flex flex-1 flex-col gap-1"
              >
                {colorGroup.map((color) => (
                  <Button
                    key={`${color}-text`}
                    variant="ghost"
                    size="icon"
                    style={{ backgroundColor: color }}
                    className="h-6 w-auto p-0"
                    onClick={() =>
                      editor?.chain().focus().setColor(color).run()
                    }
                  >
                    <Check
                      className={
                        editor?.isActive("textStyle", { color }) ? "" : "hidden"
                      }
                    />
                  </Button>
                ))}
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      <Popover>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="px-3">
                <Highlighter className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent className="flex items-center gap-2">
            <Highlighter className="h-4 w-4" /> Highlight
          </TooltipContent>
        </Tooltip>
        <PopoverContent className="w-[40ch]">
          <div className="flex gap-1">
            <div className="flex flex-1 flex-col gap-1">
              <Button
                size="icon"
                className="flex-1"
                variant="outline"
                onClick={() => editor?.chain().focus().unsetHighlight().run()}
              >
                <Highlighter />
              </Button>
            </div>
            {colors.map((colorGroup, idx) => (
              <div
                key={`${idx}-group-highlight`}
                className="flex flex-1 flex-col gap-1"
              >
                {colorGroup.map((color) => (
                  <Button
                    key={`${color}-highlight`}
                    variant="ghost"
                    size="icon"
                    style={{ backgroundColor: color }}
                    className="h-6 w-auto p-0"
                    onClick={() =>
                      editor?.chain().focus().setHighlight({ color }).run()
                    }
                  >
                    <Check
                      className={
                        editor?.isActive("highlight", { color }) ? "" : "hidden"
                      }
                    />
                  </Button>
                ))}
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}

function KaTeX() {
  return (
    <Drawer>
      <Tooltip>
        <TooltipTrigger asChild>
          <DrawerTrigger asChild>
            <Button variant="outline" size="icon" className="px-3">
              <SquareSigma className="h-4 w-4" />
            </Button>
          </DrawerTrigger>
        </TooltipTrigger>
        <TooltipContent className="flex items-center gap-2">
          <SquareSigma className="h-4 w-4" /> Math Equations
        </TooltipContent>
      </Tooltip>
      <DrawerContent className="max-w-[60ch]">
        <DrawerHeader>
          <DrawerTitle className="flex gap-2">
            <SquareSigma className="h-6 w-6" /> Math Equations
          </DrawerTitle>
        </DrawerHeader>
        <div className="text-sm">
          Catalyst Text Editor supports special formatting of Math Equations
          using KaTeX. To start using KaTeX in your text, wrap your equation in{" "}
          <code className="code bg-secondary rounded-sm p-1">$</code> symbols.
          For example,{" "}
          <code className="code bg-secondary rounded-sm p-1">
            $x^2 + y^2 = z^2$
          </code>{" "}
          will render as <span className="text-primary">x² + y² = z²</span>. If
          you want to see all of the supported functions visit the{" "}
          <Button
            href="https://katex.org/docs/supported.html"
            variant="link"
            target="_blank"
            className="h-[1em] p-0 text-[1em]"
          >
            KaTeX Docs
          </Button>
          .
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function Markdown() {
  return (
    <Drawer>
      <Tooltip>
        <TooltipTrigger asChild>
          <DrawerTrigger asChild>
            <Button variant="outline" size="icon" className="px-3">
              <Hash className="h-4 w-4" />
            </Button>
          </DrawerTrigger>
        </TooltipTrigger>
        <TooltipContent className="flex items-center gap-2">
          <Hash className="h-4 w-4" /> Markdown
        </TooltipContent>
      </Tooltip>
      <DrawerContent className="max-w-[60ch]">
        <DrawerHeader>
          <DrawerTitle className="flex gap-2">
            <Code className="h-6 w-6" /> Markdown
          </DrawerTitle>
        </DrawerHeader>
        <div className="text-sm">
          Catalyst Text Editor supports Markdown formatting. You can use
          Markdown syntax to format your text. For example,{" "}
          <code className="code bg-secondary rounded-sm p-1">**bold**</code>{" "}
          will render as <strong>bold</strong>. If you want to see all of the
          supported functions visit the{" "}
          <Button
            href="https://www.markdownguide.org/basic-syntax/"
            variant="link"
            target="_blank"
            className="h-[1em] p-0 text-[1em]"
          >
            Markdown Guide
          </Button>
          .
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function MenuBar({
  DraftMenu,
  drafts,
  setDrafts,
}: {
  DraftMenu: ({ children }: { children: ReactNode }) => JSX.Element;
  drafts: DraftEvent[];
  setDrafts: (draft: DraftEvent[]) => void;
}) {
  const { editor } = useCurrentEditor();

  const [editorState, setEditorState] = useState(0);

  const initialTools = useMemo(
    () => [
      [
        {
          custom: (
            <Tooltip>
              <TooltipTrigger asChild>
                <DraftMenu>
                  <Button variant="outline" size="icon" className="px-3">
                    <History className="h-4 w-4" />
                  </Button>
                </DraftMenu>
              </TooltipTrigger>
              <TooltipContent className="flex items-center gap-2">
                <History className="h-4 w-4" /> History
              </TooltipContent>
            </Tooltip>
          ),
        },
        {
          name: "Undo",
          Icon: Undo,
          action: () => undo(editor, drafts, setDrafts),
          isPressed: () => false,
        },
        {
          name: "Redo",
          Icon: Redo,
          action: () => redo(editor, drafts, setDrafts),
          isPressed: () => false,
        },
      ],
      [
        {
          name: "Clear Formatting",
          Icon: RemoveFormatting,
          action: () => editor?.chain().focus().unsetAllMarks().run(),
          isPressed: () => false,
        },
      ],
      [
        {
          custom: <TextAndHighlightColorPicker />,
        },
        {
          custom: <FontStyle />,
        },
        {
          name: "Outdent",
          Icon: Outdent,
          action: () => editor?.chain().focus().outdent().run(),
          isPressed: () => false,
        },
        {
          name: "Indent",
          Icon: Indent,
          action: () => editor?.chain().focus().indent().run(),
          isPressed: () => false,
        },
      ],
      [
        {
          name: "Bold",
          Icon: Bold,
          action: () => editor?.chain().focus().toggleBold().run(),
          isPressed: () => editor?.isActive("bold"),
        },
        {
          name: "Italic",
          Icon: Italic,
          action: () => editor?.chain().focus().toggleItalic().run(),
          isPressed: () => editor?.isActive("italic"),
        },
        {
          name: "Underline",
          Icon: Underline,
          action: () => editor?.chain().focus().toggleUnderline().run(),
          isPressed: () => editor?.isActive("underline"),
        },
        {
          name: "Strikethrough",
          Icon: Strikethrough,
          action: () => editor?.chain().focus().toggleStrike().run(),
          isPressed: () => editor?.isActive("strike"),
        },
        {
          name: "Superscript",
          Icon: Superscript,
          action: () => editor?.chain().focus().toggleSuperscript().run(),
          isPressed: () => editor?.isActive("superscript"),
        },
        {
          name: "Subscript",
          Icon: Subscript,
          action: () => editor?.chain().focus().toggleSubscript().run(),
          isPressed: () => editor?.isActive("subscript"),
        },
      ],
      [
        {
          name: "Bullet List",
          Icon: List,
          action: () => editor?.chain().focus().toggleBulletList().run(),
          isPressed: () => editor?.isActive("bulletList"),
        },
        {
          name: "Ordered List",
          Icon: ListOrdered,
          action: () => editor?.chain().focus().toggleOrderedList().run(),
          isPressed: () => editor?.isActive("orderedList"),
        },
      ],
      [
        {
          name: "Blockquote",
          Icon: TextQuote,
          action: () => editor?.chain().focus().toggleBlockquote().run(),
          isPressed: () => editor?.isActive("blockquote"),
        },
        {
          name: "Horizontal Rule",
          Icon: Minus,
          action: () => editor?.chain().focus().setHorizontalRule().run(),
          isPressed: () => editor?.isActive("horizontalRule"),
        },
        {
          name: "Break",
          Icon: CornerDownLeft,
          action: () => editor?.chain().focus().setHardBreak().run(),
          isPressed: () => editor?.isActive("hardBreak"),
        },
      ],
      [
        {
          custom: <Markdown />,
        },
        {
          custom: <KaTeX />,
        },
      ],
    ],
    [DraftMenu, drafts, editor, setDrafts],
  );

  const [tools, setTools] = useState(initialTools);

  useEffect(() => {
    editor?.on("transaction", () => {
      setEditorState(Math.random());
    });
  }, [editor]);

  useEffect(() => {
    setTools(initialTools);
  }, [editorState, initialTools]);

  return (
    <div className="bg-background sticky top-0 z-10 mb-2 flex gap-1 overflow-auto">
      {tools.map((toolGroup, idx) => (
        <Fragment key={`tool-group-${idx}`}>
          {idx != 0 && (
            <Separator orientation="vertical" className="my-2 h-auto" />
          )}
          <div className="flex gap-1">
            {toolGroup.map((tool, toolIdx) => {
              if ("custom" in tool) {
                const Custom = tool.custom;
                return (
                  <Fragment key={`tool-group-custom-${toolIdx}`}>
                    {Custom}
                  </Fragment>
                );
              }
              return (
                <Tooltip key={`tooltip-${toolIdx}`}>
                  <TooltipTrigger asChild>
                    <Toggle
                      variant="outline"
                      aria-label={tool.name}
                      onPressedChange={tool.action}
                      pressed={tool.isPressed()}
                      className={cn(
                        tool.isPressed() ? "bg-accent" : "bg-transparent",
                      )}
                    >
                      <tool.Icon className="h-4 w-4" />
                    </Toggle>
                  </TooltipTrigger>
                  <TooltipContent
                    className="flex items-center gap-2"
                    align={idx == 0 && toolIdx == 0 ? "start" : "center"}
                  >
                    <tool.Icon className="h-4 w-4" /> {tool.name}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </Fragment>
      ))}
    </div>
  );
}

function MenuFooter({
  draftState,
  DraftMenu,
  asMarkdown,
}: {
  drafts: DraftEvent[];
  draftState: DraftState;
  DraftMenu: ({ children }: { children: ReactNode }) => JSX.Element;
  asMarkdown: boolean;
}) {
  const { editor } = useCurrentEditor();

  const [characterCount, setCharacterCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [sentenceCount, setSentenceCount] = useState(0);
  const [paragraphCount, setParagraphCount] = useState(0);
  const [editorState, setEditorState] = useState(0);

  useEffect(() => {
    editor?.on("transaction", () => {
      setEditorState(Math.random());
    });
  }, [editor]);

  useEffect(() => {
    const textWithSpaces = editor?.getText() ?? "";
    const text = textWithSpaces.trim();
    const characters = textWithSpaces.length;
    const words = text.split(/\s+/).filter((word) => word.length > 0).length;
    const sentences =
      text.split(/[.!?]+/).length -
      (text == "" ||
      text.endsWith(".") ||
      text.endsWith("!") ||
      text.endsWith("?")
        ? 1
        : 0);
    const paragraphs = text.split("\n\n").length - (text == "" ? 1 : 0);

    setWordCount(words);
    setCharacterCount(characters);
    setSentenceCount(sentences);
    setParagraphCount(paragraphs);
  }, [editor, editorState]);

  return (
    <div className="my-4 flex flex-col-reverse items-center justify-between gap-2 px-4 @[20ch]:mt-2 @[20ch]:flex-row">
      <div className="flex items-center gap-2">
        <DraftMenu>
          <Button
            variant="ghost"
            className="h-auto items-stretch gap-2 px-3 py-2 text-xs"
          >
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="hidden @[80ch]:inline">History</span>
            </div>
            <Separator orientation="vertical" className="my-0.5 h-auto" />
            <div className="stack flex items-center gap-2">
              {(() => {
                switch (draftState) {
                  case "start":
                    return (
                      <>
                        <TextCursor />
                        <span className="hidden @[80ch]:inline">
                          Saves automatically
                        </span>
                      </>
                    );
                  case "loading":
                    return (
                      <>
                        <Loader className="animate-spin" />
                        <span className="hidden @[80ch]:inline">Saving...</span>
                      </>
                    );
                  case "local":
                    return (
                      <>
                        <Computer />
                        <span className="hidden @[80ch]:inline">
                          Saved locally
                        </span>
                      </>
                    );
                  case "cloud":
                    return (
                      <>
                        <Check />
                        <span className="hidden @[80ch]:inline">
                          Saved to cloud
                        </span>
                      </>
                    );
                }
              })()}
            </div>
          </Button>
        </DraftMenu>
        {asMarkdown && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1 text-xs">
                <Hash className="size-3" />
                Saved as Markdown
              </div>
            </TooltipTrigger>
            <TooltipContent className="flex items-center gap-2">
              Not all content will be saved properly
            </TooltipContent>
          </Tooltip>
        )}
      </div>
      <div className="flex items-center gap-4 text-xs">
        <div className="flex gap-1">
          <span>
            C<span className="hidden @[80ch]:inline">haracters</span>
          </span>
          <span className="font-mono font-bold">{characterCount}</span>
        </div>
        <div className="flex gap-1">
          <span>
            W<span className="hidden @[80ch]:inline">ords</span>
          </span>
          <span className="font-mono font-bold">{wordCount}</span>
        </div>
        <div className="flex gap-1">
          <span>
            S<span className="hidden @[80ch]:inline">entences</span>
          </span>
          <span className="font-mono font-bold">{sentenceCount}</span>
        </div>
        <div className="flex gap-1">
          <span>
            P<span className="hidden @[80ch]:inline">aragraphs</span>
          </span>
          <span className="font-mono font-bold">{paragraphCount}</span>
        </div>
      </div>
    </div>
  );
}

function DraftMenu({
  drafts,
  setDrafts,
  children,
  open,
  setOpen,
  editor,
}: {
  drafts: DraftEvent[];
  setDrafts: (_: DraftEvent[]) => void;
  children: React.ReactNode;
  open: boolean;
  setOpen: (_: boolean) => void;
  editor: Editor | null;
}) {
  return (
    <ResponsiveModal open={open} onOpenChange={setOpen}>
      <ResponsiveModalTrigger asChild>{children}</ResponsiveModalTrigger>
      <ResponsiveModalContent forceMount>
        <ResponsiveModalHeader>
          <ResponsiveModalTitle className="flex gap-2">
            <History className="h-6 w-6" /> History
          </ResponsiveModalTitle>
          <ResponsiveModalDescription>
            View and manage your drafts
          </ResponsiveModalDescription>
        </ResponsiveModalHeader>
        <div className="flex flex-col gap-2 overflow-auto p-4">
          {drafts.map((draft, idx) => {
            if (draft.type === "undo") {
              return (
                <Button
                  key={`draft-${draft.id}-${idx}`}
                  variant="outline"
                  onClick={() => {
                    /**/
                  }}
                  className={cn(
                    "pointer-events-none flex h-auto w-full flex-col items-stretch gap-2",
                  )}
                >
                  <div className="flex justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Undo className="h-4 w-4" />
                      <span>Undo</span>
                    </div>
                  </div>
                </Button>
              );
            } else if (draft.type === "redo") {
              return (
                <Button
                  key={`draft-${draft.id}-${idx}`}
                  variant="outline"
                  onClick={() => {
                    /**/
                  }}
                  className={cn(
                    "pointer-events-none flex h-auto w-full flex-col items-stretch gap-2",
                  )}
                >
                  <div className="flex justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Redo className="h-4 w-4" />
                      <span>Redo</span>
                    </div>
                  </div>
                </Button>
              );
            } else if (draft.type === "revert") {
              return (
                <Button
                  key={`draft-${draft.id}-${idx}`}
                  variant="outline"
                  onClick={() => {
                    /**/
                  }}
                  className={cn(
                    "pointer-events-none flex h-auto w-full flex-col items-stretch gap-2",
                  )}
                >
                  <div className="flex justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <UndoDot className="h-4 w-4" />
                      <span>
                        Reverted to a draft at{" "}
                        {new Date(draft.setToId).toLocaleString()} version
                      </span>
                    </div>
                  </div>
                </Button>
              );
            } else if (draft.type === "draft") {
              return (
                <ResponsiveModalClose asChild key={`draft-${draft.id}-${idx}`}>
                  <Button
                    variant="outline"
                    onClick={() =>
                      setToDraftId(editor, drafts, setDrafts, draft.id)
                    }
                    className={cn(
                      "flex h-auto w-full flex-col items-stretch gap-2 p-4",
                    )}
                  >
                    <div className="flex justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>
                          Draft at {new Date(draft.id).toLocaleString()}
                        </span>
                      </div>
                      {draft.isCurrent && <Badge>Current Draft</Badge>}
                    </div>
                    <TextEditor
                      content={draft.content}
                      readOnly
                      className="max-h-96 overflow-hidden"
                    />
                  </Button>
                </ResponsiveModalClose>
              );
            }
          })}
        </div>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
}

let isFromUndoRedo = false;

function EditorHistoryProvider({
  drafts,
  setDrafts,
  draftState,
  setDraftState,
  saveId,
}: {
  drafts: DraftEvent[];
  setDrafts: (drafts: DraftEvent[]) => void;
  draftState: DraftState;
  setDraftState: (state: DraftState) => void;
  saveId: string;
}) {
  const { editor } = useCurrentEditor();

  const [editorState, setEditorState] = useState(0);

  const lastValue = useRef<string | null>(null);
  const transactionDebounce = useRef<NodeJS.Timeout | null>(null);
  const isNewSession = useRef(true);

  editor?.on("transaction", () => {
    setEditorState(Math.random());
  });

  useEffect(() => {
    const currentHTML = editor?.getHTML() ?? "";
    if (lastValue.current == currentHTML) return;

    lastValue.current = currentHTML;
    if (transactionDebounce.current) clearTimeout(transactionDebounce.current);

    if (isFromUndoRedo) {
      isFromUndoRedo = false;
      setDraftState("local");
      return;
    }

    if (isNewSession.current) {
      isNewSession.current = false;
      setDraftState("start");
      setTimeout(() => {
        editor?.commands.setContent(
          (
            drafts.find((d) => d.type == "draft" && d.isCurrent) as {
              content: string;
            }
          )?.content ?? "",
        );
        lastValue.current = editor?.getHTML() ?? "";
      }, 1);
      return;
    }

    if (draftState != "loading") {
      setDraftState("loading");
    }

    transactionDebounce.current = setTimeout(() => {
      const localDrafts = drafts.map((draft) => ({
        ...draft,
        isCurrent: false,
      }));
      localDrafts.push({
        type: "draft",
        id: new Date().toISOString(),
        content: currentHTML,
        isCurrent: true,
      });
      setDrafts([...localDrafts]);
      setDraftState("local");
    }, 500);

    return () => {
      if (transactionDebounce.current) {
        clearTimeout(transactionDebounce.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorState]);

  useEffect(() => {
    localStorage.setItem(
      `editor-${saveId}-draft-events`,
      JSON.stringify(drafts),
    );
  }, [drafts, saveId]);

  return <></>;
}

type Draft = {
  id: string;
  content: string;
  isCurrent: boolean;
};

type DraftState = "start" | "loading" | "local" | "cloud";

type DraftEvent =
  | {
      id: string;
      type: "revert" | "undo" | "redo";
      setToId: string;
    }
  | (Draft & {
      type: "draft";
    });

function setToDraftId(
  editor: Editor | null,
  drafts: DraftEvent[],
  setDrafts: (_: DraftEvent[]) => void,
  id: string,
  action: "undo" | "redo" | "revert" = "revert",
) {
  if (!editor) return;
  isFromUndoRedo = true;
  const draft = drafts.find((draft) => draft.id == id && draft.type == "draft");
  if (!draft) return;
  editor.commands.setContent((draft as { content: string }).content);
  const localDrafts = [
    ...drafts.map((draft) =>
      draft.type == "draft" ? { ...draft, isCurrent: draft.id == id } : draft,
    ),
    {
      id: new Date().toISOString(),
      type: action,
      setToId: id,
    },
  ];
  for (let l = 0; l < 2; l++) {
    for (let i = 0; i < localDrafts.length; i++) {
      if (
        localDrafts[i]?.type == "undo" &&
        localDrafts[i + 1]?.type == "redo" &&
        (localDrafts[i + 1] as { setToId: string })?.setToId == id
      ) {
        localDrafts.splice(i, 2);
      }
      if (
        localDrafts[i]?.type == "redo" &&
        localDrafts[i + 1]?.type == "undo" &&
        (localDrafts[i + 1] as { setToId: string })?.setToId == id
      ) {
        localDrafts.splice(i, 2);
      }
      if (
        localDrafts[i]?.type == "draft" &&
        localDrafts[i + 1]?.type == "draft" &&
        (localDrafts[i] as Draft).content ==
          (localDrafts[i + 1] as Draft).content
      ) {
        localDrafts.splice(i, 1);
      }
    }
  }
  setDrafts(localDrafts);
}

function undo(
  editor: Editor | null,
  drafts: DraftEvent[],
  setDrafts: (_: DraftEvent[]) => void,
) {
  if (!editor) return;
  const theReturnStatement = editor.commands.focus();
  const currentDraft = drafts.find(
    (draft) => draft.type == "draft" && draft.isCurrent,
  );
  if (!currentDraft) return theReturnStatement;
  const currentDraftIndex = drafts.indexOf(currentDraft);
  const nextDraft = drafts
    .slice(0, currentDraftIndex)
    .reverse()
    .find((draft) => draft.type == "draft");
  if (!nextDraft) return theReturnStatement;
  setToDraftId(editor, drafts, setDrafts, nextDraft.id, "undo");
  return theReturnStatement;
}
function redo(
  editor: Editor | null,
  drafts: DraftEvent[],
  setDrafts: (_: DraftEvent[]) => void,
) {
  if (!editor) return;
  const theReturnStatement = editor.commands.focus();
  const currentDraft = drafts.find(
    (draft) => draft.type == "draft" && draft.isCurrent,
  );
  if (!currentDraft) return theReturnStatement;
  const currentDraftIndex = drafts.indexOf(currentDraft);
  const nextDraft = drafts
    .slice(currentDraftIndex + 1)
    .find((draft) => draft.type == "draft");
  if (!nextDraft) return theReturnStatement;
  setToDraftId(editor, drafts, setDrafts, nextDraft.id, "redo");
  return theReturnStatement;
}

export function TextEditor({
  content,
  setContent,
  className,
  disabled = false,
  readOnly = false,
  placeholder = "Write something...",
  saveId = "default",
  setMarkdown,
}: {
  content?: string;
  setContent?: (content: string) => void;
  className?: string;
  placeholder?: string | null;
  disabled?: boolean;
  readOnly?: boolean;
  saveId?: string;
  setMarkdown?: (markdown: string) => void;
}) {
  const extensions = useRef([
    DocumentExtension.extend({
      addKeyboardShortcuts() {
        return {
          "Mod-z": () =>
            (() =>
              undo(
                this.editor,
                JSON.parse(
                  typeof window !== "undefined"
                    ? (localStorage.getItem(`editor-${saveId}-draft-events`) ??
                        "[]")
                    : "[]",
                ) as DraftEvent[],
                setDrafts,
              ))(),
          "Mod-y": () =>
            (() =>
              redo(
                this.editor,
                JSON.parse(
                  typeof window !== "undefined"
                    ? (localStorage.getItem(`editor-${saveId}-draft-events`) ??
                        "[]")
                    : "[]",
                ) as DraftEvent[],
                setDrafts,
              ))(),
          "Mod-Shift-z": () =>
            (() =>
              redo(
                this.editor,
                JSON.parse(
                  typeof window !== "undefined"
                    ? (localStorage.getItem(`editor-${saveId}-draft-events`) ??
                        "[]")
                    : "[]",
                ) as DraftEvent[],
                setDrafts,
              ))(),
        } as unknown as Record<string, KeyboardShortcutCommand>;
      },
    }),
    ListItemExtension,
    Color.configure({ types: [TextStyle.name, ListItem.name] }),
    HighlighterExtension.configure({ multicolor: true }),
    TextStyle.configure({}),
    Link.configure({
      openOnClick: false,
      autolink: true,
    }),
    TextExtension,
    UnderlineExtension,
    SuperscriptExtension,
    SubscriptExtension,
    BlockquoteExtension,
    BoldExtension,
    ItalicExtension,
    StrikeExtension,
    BulletListExtension,
    OrderedListExtension,
    HorizontalRuleExtension,
    HeadingExtension,
    ParagraphExtension,
    HardBreakExtension,
    Placeholder.configure({
      placeholder: placeholder ?? "",
    }),
    IndentExtension,
  ]);

  if (
    typeof window !== "undefined" &&
    localStorage.getItem(`editor-${saveId}-draft-events`) === null
  ) {
    localStorage.setItem(`editor-${saveId}-draft-events`, "[]");
  }

  const [drafts, setDrafts] = useState<DraftEvent[]>(
    JSON.parse(
      typeof window !== "undefined"
        ? (localStorage.getItem(`editor-${saveId}-draft-events`) ?? "[]")
        : "[]",
    ) as DraftEvent[],
  );
  const [draftState, setDraftState] = useState<DraftState>("start");
  const [open, setOpen] = useState(false);
  const { editor } = useCurrentEditor();

  const turndown = useRef(new TurndownService());

  function LocalDraftMenu({ children }: { children: ReactNode }) {
    return (
      <DraftMenu
        drafts={drafts}
        setDrafts={setDrafts}
        open={open}
        setOpen={setOpen}
        editor={editor}
      >
        {children}
      </DraftMenu>
    );
  }

  return (
    <div className="@container">
      <EditorProvider
        slotBefore={
          readOnly ? (
            <></>
          ) : (
            <MenuBar
              DraftMenu={LocalDraftMenu}
              drafts={drafts}
              setDrafts={setDrafts}
            />
          )
        }
        slotAfter={
          readOnly ? (
            <></>
          ) : (
            <>
              <EditorHistoryProvider
                saveId={saveId}
                drafts={drafts}
                setDrafts={setDrafts}
                draftState={draftState}
                setDraftState={setDraftState}
              />
              <MenuFooter
                drafts={drafts}
                draftState={draftState}
                DraftMenu={LocalDraftMenu}
                asMarkdown={!!setMarkdown}
              />
            </>
          )
        }
        editable={!readOnly}
        extensions={extensions.current}
        content={content}
        immediatelyRender={false}
        onTransaction={({ editor }) => {
          setContent?.(editor.getHTML());
          setMarkdown?.(turndown.current.turndown(editor.getHTML()));
        }}
        editorProps={{
          editable: () => !(readOnly || disabled),
          attributes: {
            class: cn(
              "border dark:border-0 text-left rounded-md p-4 outline-0 overflow-auto render-fancy render-white-content",
              disabled ? "opacity-50 bg-blue-500 pointer-events-none" : "",
              className,
            ),
          },
        }}
      >
        <></>
      </EditorProvider>
    </div>
  );
}
