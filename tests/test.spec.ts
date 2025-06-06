import { describe, it, expect } from "vitest";
import dedent from "dedent";
import * as prettier from "prettier";

import { processFromMarkdown, processFromHtml } from "./util/index";

describe("reyhpe-pre-language", () => {
  let html: string;

  // ******************************************
  it("effectless for inline codes", async () => {
    html = String(await processFromMarkdown("`Hi`\n\n> blockquote"));

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

    html = String(await processFromMarkdown(input));

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<pre class="javascript">
        <code class="language-javascript">console.log("ipikuka");</code>
      </pre>
      "
    `);

    html = String(await processFromMarkdown(input, "className"));

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<pre class="javascript">
        <code class="language-javascript">console.log("ipikuka");</code>
      </pre>
      "
    `);

    html = String(await processFromMarkdown(input, "data-language"));

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

    html = String(await processFromMarkdown(input));

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<pre class="diff-python">
        <code class="language-diff-python">print("ipikuka");</code>
      </pre>
      "
    `);

    html = String(await processFromMarkdown(input, "className"));

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<pre class="diff-python">
        <code class="language-diff-python">print("ipikuka");</code>
      </pre>
      "
    `);

    html = String(await processFromMarkdown(input, "data-language"));

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<pre data-language="diff-python">
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

    html = String(await processFromMarkdown(input));

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<pre>
        <code>content</code>
      </pre>
      "
    `);

    html = String(await processFromMarkdown(input, "className"));

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<pre>
        <code>content</code>
      </pre>
      "
    `);

    html = String(await processFromMarkdown(input, "data-language"));

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

    html = String(await processFromMarkdown(example, "onmouseover"));

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<pre mouseover=";alert(&#x22;alert&#x22;)">
        <code class="language-;alert(&#x22;alert&#x22;)">const me = "ipikuka";</code>
      </pre>
      "
    `);
  });

  // ******************************************
  it("with code title and no code content", async () => {
    const input = dedent(`
      \`\`\`js:C:\\users\\documents
      \`\`\`
    `);

    html = String(await processFromMarkdown(input));

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<pre class="js">
        <code class="language-js"></code>
      </pre>
      "
    `);

    html = String(await processFromMarkdown(input, "className"));

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<pre class="js">
        <code class="language-js"></code>
      </pre>
      "
    `);

    html = String(await processFromMarkdown(input, "data-language"));

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<pre data-language="js">
        <code class="language-js"></code>
      </pre>
      "
    `);
  });

  it("work with html source, code highlighting with lang class,", async () => {
    const input = dedent`
      <pre><code class="lang-js">console.log("ipikuka");</code></pre>
    `;

    html = String(await processFromHtml(input));

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<pre class="js">
        <code class="hljs lang-js">
          <span class="hljs-variable language_">console</span>.
          <span class="hljs-title function_">log</span>(
          <span class="hljs-string">"ipikuka"</span>);
        </code>
      </pre>
      "
    `);

    html = String(await processFromHtml(input, "className"));

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<pre class="js">
        <code class="hljs lang-js">
          <span class="hljs-variable language_">console</span>.
          <span class="hljs-title function_">log</span>(
          <span class="hljs-string">"ipikuka"</span>);
        </code>
      </pre>
      "
    `);

    html = String(await processFromHtml(input, "data-language"));

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<pre data-language="js">
        <code class="hljs lang-js">
          <span class="hljs-variable language_">console</span>.
          <span class="hljs-title function_">log</span>(
          <span class="hljs-string">"ipikuka"</span>);
        </code>
      </pre>
      "
    `);
  });

  it("work with html source, no language class", async () => {
    const input = dedent`
      <pre><code class="hljs">console.log("ipikuka");</code></pre>
    `;

    html = String(await processFromHtml(input));

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<pre>
        <code class="hljs">console.log("ipikuka");</code>
      </pre>
      "
    `);

    html = String(await processFromHtml(input, "className"));

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<pre>
        <code class="hljs">console.log("ipikuka");</code>
      </pre>
      "
    `);

    html = String(await processFromHtml(input, "data-language"));

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<pre>
        <code class="hljs">console.log("ipikuka");</code>
      </pre>
      "
    `);
  });
});
