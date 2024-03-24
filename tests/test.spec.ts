import { describe, it, expect } from "vitest";
import dedent from "dedent";

import { process } from "./util/index";

describe("reyhpe-pre-language", () => {
  // ******************************************
  it("effectless for inline codes", async () => {
    expect(String(await process("`Hi`\n\n> blockquote"))).toMatchInlineSnapshot(`
      "<p><code>Hi</code></p>
      <blockquote>
      <p>blockquote</p>
      </blockquote>"
    `);
  });

  // ******************************************
  it("with language", async () => {
    const input = dedent`
      \`\`\`javascript
      console.log("ipikuka");
      \`\`\`
    `;

    expect(String(await process(input))).toMatchInlineSnapshot(`
      "<pre class="javascript"><code class="language-javascript">console.log("ipikuka");
      </code></pre>"
    `);

    expect(String(await process(input, "className"))).toMatchInlineSnapshot(`
      "<pre class="javascript"><code class="language-javascript">console.log("ipikuka");
      </code></pre>"
    `);

    expect(String(await process(input, "data-language"))).toMatchInlineSnapshot(`
      "<pre data-language="javascript"><code class="language-javascript">console.log("ipikuka");
      </code></pre>"
    `);
  });

  // ******************************************
  it("with language with diff", async () => {
    const input = dedent`
      \`\`\`diff-python
      print("ipikuka");
      \`\`\`
    `;

    expect(String(await process(input))).toMatchInlineSnapshot(`
      "<pre class="python"><code class="language-diff-python">print("ipikuka");
      </code></pre>"
    `);

    expect(String(await process(input, "className"))).toMatchInlineSnapshot(`
      "<pre class="python"><code class="language-diff-python">print("ipikuka");
      </code></pre>"
    `);

    expect(String(await process(input, "data-language"))).toMatchInlineSnapshot(`
      "<pre data-language="python"><code class="language-diff-python">print("ipikuka");
      </code></pre>"
    `);
  });

  // ******************************************
  it("with no language", async () => {
    const input = dedent`
      \`\`\`
      content
      \`\`\`
    `;

    expect(String(await process(input))).toMatchInlineSnapshot(`
      "<pre><code>content
      </code></pre>"
    `);

    expect(String(await process(input, "className"))).toMatchInlineSnapshot(`
      "<pre><code>content
      </code></pre>"
    `);

    expect(String(await process(input, "data-language"))).toMatchInlineSnapshot(`
      "<pre><code>content
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
