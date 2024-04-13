import { describe, it, expect } from "vitest";
import dedent from "dedent";
import * as prettier from "prettier";

import { process } from "./util/index";

describe("reyhpe-pre-language", () => {
  let html: string;

  // ******************************************
  it("effectless for inline codes", async () => {
    html = String(await process("`Hi`\n\n> blockquote"));

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<p>
        <code>Hi</code>
      </p>
      <blockquote>
        <p>blockquote</p>
      </blockquote>
      "
    `);
  });

  // ******************************************
  it("with language", async () => {
    const input = dedent`
      \`\`\`javascript
      console.log("ipikuka");
      \`\`\`
    `;

    html = String(await process(input));

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<pre class="javascript">
        <code class="language-javascript">console.log("ipikuka");</code>
      </pre>
      "
    `);

    html = String(await process(input, "className"));

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<pre class="javascript">
        <code class="language-javascript">console.log("ipikuka");</code>
      </pre>
      "
    `);

    html = String(await process(input, "data-language"));

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<pre data-language="javascript">
        <code class="language-javascript">console.log("ipikuka");</code>
      </pre>
      "
    `);
  });

  // ******************************************
  it("with language with diff", async () => {
    const input = dedent`
      \`\`\`diff-python
      print("ipikuka");
      \`\`\`
    `;

    html = String(await process(input));

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<pre class="python">
        <code class="language-diff-python">print("ipikuka");</code>
      </pre>
      "
    `);

    html = String(await process(input, "className"));

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<pre class="python">
        <code class="language-diff-python">print("ipikuka");</code>
      </pre>
      "
    `);

    html = String(await process(input, "data-language"));

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<pre data-language="python">
        <code class="language-diff-python">print("ipikuka");</code>
      </pre>
      "
    `);
  });

  // ******************************************
  it("with no language", async () => {
    const input = dedent`
      \`\`\`
      content
      \`\`\`
    `;

    html = String(await process(input));

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<pre>
        <code>content</code>
      </pre>
      "
    `);

    html = String(await process(input, "className"));

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<pre>
        <code>content</code>
      </pre>
      "
    `);

    html = String(await process(input, "data-language"));

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<pre>
        <code>content</code>
      </pre>
      "
    `);
  });

  // ******************************************
  it("xss attacks are sanitized by parser", async () => {
    const example = dedent`
      \`\`\`;alert("alert")
      const me = "ipikuka";
      \`\`\`
    `;

    html = String(await process(example, "onmouseover"));

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<pre mouseover=";alert(&#x22;alert&#x22;)">
        <code class="language-;alert(&#x22;alert&#x22;)">const me = "ipikuka";</code>
      </pre>
      "
    `);
  });
});
