import { unified } from "unified";
import remarkParse from "remark-parse";
import gfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import dedent from "dedent";
import type { VFileCompatible, VFile } from "vfile";

import { describe, it, expect } from "vitest";

import plugin, { PreLanguageOption } from "../src";

const compilerCreator = (options?: PreLanguageOption) =>
  unified()
    .use(remarkParse)
    .use(gfm)
    .use(remarkRehype)
    .use(plugin, options)
    .use(rehypeStringify);

const process = async (
  content: VFileCompatible,
  options?: PreLanguageOption,
): Promise<VFile> => {
  return compilerCreator(options).process(content);
};

const sourceWithLanguage = dedent`
  \`\`\`javascript
  console.log("ipikuka");
  \`\`\`
`;

const sourceDiffLanguage = dedent`
  \`\`\`diff-javascript
  console.log("ipikuka");
  \`\`\`
`;

const sourceNoLanguage = dedent`
  \`\`\`
  console.log("ipikuka");
  \`\`\`
`;

describe("reyhpe-pre-language", () => {
  // ******************************************
  it("with no option", async () => {
    expect(String(await process(sourceWithLanguage))).toMatchInlineSnapshot(`
      "<pre class="javascript"><code class="language-javascript">console.log("ipikuka");
      </code></pre>"
    `);

    expect(String(await process(sourceDiffLanguage))).toMatchInlineSnapshot(`
      "<pre class="javascript"><code class="language-diff-javascript">console.log("ipikuka");
      </code></pre>"
    `);

    expect(String(await process(sourceNoLanguage))).toMatchInlineSnapshot(`
      "<pre><code>console.log("ipikuka");
      </code></pre>"
    `);
  });

  // ******************************************
  it("with an option", async () => {
    expect(String(await process(sourceWithLanguage, "data-language"))).toMatchInlineSnapshot(`
      "<pre data-language="javascript"><code class="language-javascript">console.log("ipikuka");
      </code></pre>"
    `);

    expect(String(await process(sourceDiffLanguage, "data-language"))).toMatchInlineSnapshot(`
      "<pre data-language="javascript"><code class="language-diff-javascript">console.log("ipikuka");
      </code></pre>"
    `);

    expect(String(await process(sourceNoLanguage, "data-language"))).toMatchInlineSnapshot(`
      "<pre><code>console.log("ipikuka");
      </code></pre>"
    `);
  });

  // ******************************************
  it("example in the README", async () => {
    const example = dedent`
      \`\`\`javascript
      const me = "ipikuka";
      \`\`\`
    `;

    expect(String(await process(example))).toMatchInlineSnapshot(`
      "<pre class="javascript"><code class="language-javascript">const me = "ipikuka";
      </code></pre>"
    `);

    expect(String(await process(example, "className"))).toMatchInlineSnapshot(`
      "<pre class="javascript"><code class="language-javascript">const me = "ipikuka";
      </code></pre>"
    `);

    expect(String(await process(example, "data-language"))).toMatchInlineSnapshot(`
      "<pre data-language="javascript"><code class="language-javascript">const me = "ipikuka";
      </code></pre>"
    `);
  });

  // ******************************************
  it("xss attacks are sanitized by parser", async () => {
    const example = dedent`
      \`\`\`;alert("alert")
      const me = "ipikuka";
      \`\`\`
    `;

    expect(String(await process(example, "onmouseover"))).toMatchInlineSnapshot(`
      "<pre mouseover=";alert(&#x22;alert&#x22;)"><code class="language-;alert(&#x22;alert&#x22;)">const me = "ipikuka";
      </code></pre>"
    `);
  });
});
