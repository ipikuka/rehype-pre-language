import { unified } from "unified";
import remarkParse from "remark-parse";
import gfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import type { VFileCompatible, VFile } from "vfile";

import plugin, { type PreLanguageOption } from "../../src";

const compilerCreator = (options?: PreLanguageOption) =>
  unified()
    .use(remarkParse)
    .use(gfm)
    .use(remarkRehype)
    .use(plugin, options)
    .use(rehypeStringify);

export const process = async (
  content: VFileCompatible,
  options?: PreLanguageOption,
): Promise<VFile> => {
  return compilerCreator(options).process(content);
};
