import type { Plugin } from "unified";
import type { Root } from "hast";
import { type VisitorResult, visit } from "unist-util-visit";

export type PreLanguageOption = string;

// check if it is a string array
function isStringArray(value: unknown): value is string[] {
  return (
    // type-coverage:ignore-next-line
    Array.isArray(value) && value.every((item) => typeof item === "string")
  );
}

/**
 *
 * add code language to <pre> element as a property
 *
 */
const plugin: Plugin<[PreLanguageOption?], Root> = (option) => {
  const property = option ? (option.startsWith("on") ? option.slice(2) : option) : "className";

  /**
   *
   * get the language from classNames
   *
   */
  function getLanguage(classNames: string[]): string | undefined {
    const isLanguageString = (element: string): boolean =>
      element.startsWith("language-") || element.startsWith("lang-");

    const languageString = classNames.find(isLanguageString);

    if (!languageString) return;

    const language = languageString.slice(languageString.indexOf("-") + 1).toLowerCase();

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
    visit(tree, "element", function (code, index, parent): VisitorResult {
      if (!parent || index === undefined || code.tagName !== "code") {
        return;
      }

      if (parent.type !== "element" || parent.tagName !== "pre") {
        return;
      }

      const classNames = code.properties.className;

      if (!isStringArray(classNames)) return;

      const language = getLanguage(classNames);

      if (!language) return;

      if (property !== "className") {
        parent.properties[property] = language;
      } else {
        parent.properties.className = [
          /* v8 ignore next */
          ...(isStringArray(parent.properties.className) ? parent.properties.className : []),
          language,
        ];
      }
    });
  };
};

export default plugin;
