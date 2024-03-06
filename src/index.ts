import type { Plugin } from "unified";
import type { Root } from "hast";
import { type VisitorResult, visit } from "unist-util-visit";
import { hasProperty } from "hast-util-has-property";

export type PreLanguageOption = string;

/**
 *
 * This plugin adds language information as a property to pre element
 *
 */
const plugin: Plugin<[PreLanguageOption?], Root> = (option) => {
  const property = option ? (option.startsWith("on") ? option.slice(2) : option) : "className";

  /**
   * Transform.
   *
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  return (tree: Root): undefined => {
    visit(tree, "element", function (node, index, parent): VisitorResult {
      if (!parent) return;

      if (node.tagName !== "code") return;

      if (parent.type !== "element" || parent.tagName !== "pre") return;

      if (hasProperty(node, "className")) {
        const filtered = (node.properties.className as string[]).filter((name) =>
          name.startsWith("language-"),
        );

        if (filtered.length) {
          let language = filtered[0].slice(9);

          if (language.startsWith("diff-")) {
            language = language.slice(5);
          }

          if (parent.properties) {
            if (property === "className") {
              if (hasProperty(parent, "className")) {
                parent.properties["className"] = [
                  ...(parent.properties.className as string[]),
                  language,
                ];
              } else {
                parent.properties["className"] = [language];
              }
            } else {
              parent.properties[property] = language;
            }
          } else {
            parent.properties = { [property]: language };
          }
        }
      }
    });
  };
};

export default plugin;
