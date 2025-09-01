import { Extension } from "@tiptap/core";
import type { Node } from "@tiptap/pm/model";
import type { Transaction } from "@tiptap/pm/state";
import type { CommandProps } from "@tiptap/react";
import { TextSelection, AllSelection } from "prosemirror-state";

export const clamp = (val: number, min: number, max: number) => {
  if (val < min) {
    return min;
  }
  if (val > max) {
    return max;
  }
  return val;
};

const IndentProps = {
  min: 0,
  max: 210,

  more: 30,
  less: -30,
};

export function isBulletListNode(node: Node) {
  return node.type.name === "bullet_list";
}

export function isOrderedListNode(node: Node) {
  return node.type.name === "order_list";
}

export function isTodoListNode(node: Node) {
  return node.type.name === "todo_list";
}

export function isListNode(node: Node) {
  return (
    isBulletListNode(node) || isOrderedListNode(node) || isTodoListNode(node)
  );
}

function setNodeIndentMarkup(tr: Transaction, pos: number, delta: number) {
  if (!tr.doc) return tr;

  const node = tr.doc.nodeAt(pos);
  if (!node) return tr;

  const minIndent = IndentProps.min;
  const maxIndent = IndentProps.max;

  const indent = clamp(
    ((node?.attrs?.indent as number) || 0) + delta,
    minIndent,
    maxIndent,
  );

  if (indent === node.attrs.indent) return tr;

  const nodeAttrs = {
    ...node.attrs,
    indent,
  };

  return tr.setNodeMarkup(pos, node.type, nodeAttrs, node.marks);
}

const updateIndentLevel = (tr: Transaction, delta: number) => {
  const { doc, selection } = tr;

  if (!doc || !selection) return tr;

  if (
    !(selection instanceof TextSelection || selection instanceof AllSelection)
  ) {
    return tr;
  }

  const { from, to } = selection;

  doc.nodesBetween(from, to, (node: Node, pos) => {
    const nodeType = node.type;

    if (nodeType.name === "paragraph" || nodeType.name === "heading") {
      tr = setNodeIndentMarkup(tr, pos, delta);
      return false;
    }
    if (isListNode(node)) {
      return false;
    }
    return true;
  });

  return tr;
};

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    indent: {
      indent: () => ReturnType;
      outdent: () => ReturnType;
    };
  }
}

interface Options {
  types: string[];
  indentLevels: number[];
  defaultIndentLevel: number;
}

export const Indent = Extension.create({
  name: "indent",

  addOptions() {
    return {
      types: ["heading", "paragraph"],
      indentLevels: [0, 30, 60, 90, 120, 150, 180, 210],
      defaultIndentLevel: 0,
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: (this.options as Options).types,
        attributes: {
          indent: {
            default: (this.options as Options).defaultIndentLevel,
            renderHTML: (attributes) => ({
              style: `margin-left: ${attributes.indent}px !important;`,
            }),
            parseHTML: (element) =>
              parseInt(element.style.marginLeft) ||
              (this.options as Options).defaultIndentLevel,
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      indent:
        () =>
        ({ tr, state, dispatch, editor }: CommandProps) => {
          const { selection } = state;
          tr = tr.setSelection(selection);
          tr = updateIndentLevel(tr, IndentProps.more);

          if (tr.docChanged) {
            dispatch?.(tr);
            return true;
          }

          editor.chain().focus().run();

          return false;
        },
      outdent:
        () =>
        ({ tr, state, dispatch, editor }: CommandProps) => {
          const { selection } = state;
          tr = tr.setSelection(selection);
          tr = updateIndentLevel(tr, IndentProps.less);

          if (tr.docChanged) {
            dispatch?.(tr);
            return true;
          }

          editor.chain().focus().run();

          return false;
        },
    };
  },
  addKeyboardShortcuts() {
    return {
      Tab: (): boolean => {
        if (
          !(
            this.editor.isActive("bulletList") ||
            this.editor.isActive("orderedList")
          )
        ) {
          return this.editor.commands.insertContent({
            type: "text",
            text: "\t",
          });
        }
        return this.editor.commands.focus();
      },
      "Shift-Tab": (): boolean => {
        if (
          !(
            this.editor.isActive("bulletList") ||
            this.editor.isActive("orderedList")
          )
        ) {
          if (this.editor.state.selection.$from.nodeBefore?.text == "\t") {
            return this.editor.commands.deleteRange({
              from: this.editor.state.selection.$from.pos - 1,
              to: this.editor.state.selection.$from.pos,
            });
          }
          return this.editor.commands.outdent();
        }
        return this.editor.commands.focus();
      },
      Backspace: (): boolean => {
        if (
          !(
            this.editor.isActive("bulletList") ||
            this.editor.isActive("orderedList")
          ) &&
          this.editor.state.selection.from == 1 &&
          this.editor.state.selection.to == 1
        ) {
          return this.editor.commands.outdent();
        }
        const from = this.editor.state.selection.$from.pos;
        const to = this.editor.state.selection.$to.pos;
        return this.editor.commands.deleteRange({
          from: from == to ? from - 1 : from,
          to: to,
        });
      },
    };
  },
});
