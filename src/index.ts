import type { Plugin } from "unified";
import type { Properties, Root } from "hast";
import { type VisitorResult, visit, CONTINUE } from "unist-util-visit";

export type PreLanguageOption = string;

/**
 *
 * adds code language to <pre> element as a property
 *
 */
const plugin: Plugin<[PreLanguageOption?], Root> = (option) => {
  const property = option ? (option.startsWith("on") ? option.slice(2) : option) : "className";

  /**
   *
   * extract the language from properties
   */
  function getLanguage(properties: Properties): string | undefined {
    const { className } = properties;

    if (!className) return;

    const filtered = (className as string[]).filter((name) => name.startsWith("language-"));

    /* v8 ignore next */
    if (!filtered.length) return;

    let language = filtered[0].slice(9);

    if (language.startsWith("diff-")) {
      language = language.slice(5);
    }

    return language;
  }

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
      /* v8 ignore next */
      if (!parent || typeof index === "undefined") return;

      if (node.tagName !== "code") return CONTINUE;

      const language = getLanguage(node.properties);

      if (!language) return CONTINUE;

      /* v8 ignore next */
      if (parent.type === "root") return; // just for type narrowing

      if (property !== "className") {
        parent.properties[property] = language;
      } else {
        parent.properties.className = [
          /* v8 ignore next */ // ignore because I couldn't create a test case
          ...(parent.properties.className ? (parent.properties.className as string[]) : []),
          language,
        ];
      }
    });
  };
};

export default plugin;
