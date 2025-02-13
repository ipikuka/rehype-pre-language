import { unified } from "unified";
import remarkParse from "remark-parse";
import rehypeParse from "rehype-parse";
import gfm from "remark-gfm";
import remarkFlexibleCodeTitles from "remark-flexible-code-titles";
import remarkRehype from "remark-rehype";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";
import type { VFileCompatible, VFile } from "vfile";

import plugin, { type PreLanguageOption } from "../../src";

/**
 *
 * process with remark parse from markdown source
 *
 */
const compilerCreatorFromMarkdown = (options?: PreLanguageOption) =>
  unified()
    .use(remarkParse)
    .use(gfm)
    .use(remarkFlexibleCodeTitles, { title: false, container: false })
    .use(remarkRehype)
    .use(plugin, options)
    .use(rehypeStringify);

/**
 *
 * process with rehype parse from html source
 *
 */
export const processFromMarkdown = async (
  content: VFileCompatible,
  options?: PreLanguageOption,
): Promise<VFile> => {
  return compilerCreatorFromMarkdown(options).process(content);
};

const compilerCreatorFromHtml = (options?: PreLanguageOption) =>
  unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeHighlight)
    .use(plugin, options)
    .use(rehypeStringify);

export const processFromHtml = async (
  content: VFileCompatible,
  options?: PreLanguageOption,
): Promise<VFile> => {
  return compilerCreatorFromHtml(options).process(content);
};
