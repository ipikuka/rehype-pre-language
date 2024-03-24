# rehype-pre-language

[![NPM version][badge-npm-version]][npm-package-url]
[![NPM downloads][badge-npm-download]][npm-package-url]
[![Build][badge-build]][github-workflow-url]
[![codecov](https://codecov.io/gh/ipikuka/rehype-pre-language/graph/badge.svg?token=o3TGkL4yUV)](https://codecov.io/gh/ipikuka/rehype-pre-language)
[![type-coverage](https://img.shields.io/badge/dynamic/json.svg?label=type-coverage&prefix=%E2%89%A5&suffix=%&query=$.typeCoverage.atLeast&uri=https%3A%2F%2Fraw.githubusercontent.com%2Fipikuka%2Frehype-pre-language%2Fmaster%2Fpackage.json)](https://github.com/ipikuka/rehype-pre-language)
[![typescript][badge-typescript]][typescript-url]
[![License][badge-license]][github-license-url]

This package is a [unified][unified] ([rehype][rehype]) plugin **to add language information of `<code>` element into `<pre>` element as a property**.

**[unified][unified]** is a project that transforms content with abstract syntax trees (ASTs) using the new parser **[micromark][micromark]**. **[remark][remark]** adds support for markdown to unified. **[mdast][mdast]** is the Markdown Abstract Syntax Tree (AST) which is a specification for representing markdown in a syntax tree. "**rehype**" is a tool that transforms HTML with plugins. "**hast**" stands for HTML Abstract Syntax Tree (HAST) that rehype uses.

**This plugin finds the `<code>` elements in hast, takes the language information and adds the language into `<pre>` element as "className" property by default or as a property provided in options.**

## When should I use this?

This plugin `rehype-pre-language` is useful if there is no language information in `<pre>` element but `<code>` element like `<pre><code className="language-typescript"></pre>`, and you need `<pre>` element to have language information.

## Installation

This package is suitable for ESM only. In Node.js (version 16+), install with npm:

```bash
npm install rehype-pre-language
```

or

```bash
yarn add rehype-pre-language
```

## Usage

Say we have the following markdown file, `example.md`:

````markdown
```javascript
const me = "ipikuka";
```
````

And our module, `example.js`, looks as follows:

```javascript
import { read } from "to-vfile";
import remark from "remark";
import gfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypePreLanguage from "rehype-pre-language";

main();

async function main() {
  const file = await remark()
    .use(gfm)
    .use(remarkRehype)
    .use(rehypePreLanguage)
    .use(rehypeStringify)
    .process(await read("example.md"));

  console.log(String(file));
}
```

Now, running `node example.js` you see that the `<pre>` element has a "class" with language information:

```html
<pre class="javascript">
  <code class="language-javascript">const me = "ipikuka";</code>
</pre>
```

Without `rehype-pre-language`, the `<pre>` element wouldn't have a language information:

```html
<pre>
  <code class="language-javascript">const me = "ipikuka";</code>
</pre>
```

## Options

There is one **string** option which is a property of `<pre>` element in which the language information is going to be passed. 

```typescript
type PreLanguageOption = string; // the default is "className"

use(rehypePreLanguage, PreLanguageOption);
```

### Examples:

```typescript
// adds the language information into "className" of <pre> element as default
use(rehypePreLanguage);

// adds the language information into "className" of <pre> element
use(rehypePreLanguage, "className");

// adds the language information into "data-language" property of <pre> element
use(rehypePreLanguage, "data-language"); 
```

## Syntax tree

This plugin modifies the `hast` (HTML abstract syntax tree).

## Types

This package is fully typed with [TypeScript][typescript].

The plugin exports the type `PreLanguageOption`.

## Compatibility

This plugin works with `rehype-parse` version 1+, `rehype-stringify` version 1+, `rehype` version 1+, and unified version `4+`.

## Security

Use of `rehype-pre-language` involves rehype (hast), but doesn't lead to cross-site scripting (XSS) attacks.

## My Plugins

I like to contribute the Unified / Remark / MDX ecosystem, so I recommend you to have a look my plugins.

### My Remark Plugins

- [`remark-flexible-code-titles`](https://www.npmjs.com/package/remark-flexible-code-titles)
  – Remark plugin to add titles or/and containers for the code blocks with customizable properties
- [`remark-flexible-containers`](https://www.npmjs.com/package/remark-flexible-containers)
  – Remark plugin to add custom containers with customizable properties in markdown
- [`remark-ins`](https://www.npmjs.com/package/remark-ins)
  – Remark plugin to add `ins` element in markdown
- [`remark-flexible-paragraphs`](https://www.npmjs.com/package/remark-flexible-paragraphs)
  – Remark plugin to add custom paragraphs with customizable properties in markdown
- [`remark-flexible-markers`](https://www.npmjs.com/package/remark-flexible-markers)
  – Remark plugin to add custom `mark` element with customizable properties in markdown
- [`remark-flexible-toc`](https://www.npmjs.com/package/remark-flexible-toc)
  – Remark plugin to expose the table of contents via `vfile.data` or via an option reference
- [`remark-mdx-remove-esm`](https://www.npmjs.com/package/remark-mdx-remove-esm)
  – Remark plugin to remove import and/or export statements (mdxjsEsm)

### My Rehype Plugins

- [`rehype-pre-language`](https://www.npmjs.com/package/rehype-pre-language)
  – Rehype plugin to add language information as a property to `pre` element

### My Recma Plugins

- [`recma-mdx-escape-missing-components`](https://www.npmjs.com/package/recma-mdx-escape-missing-components)
  – Recma plugin to set the default value `() => null` for the Components in MDX in case of missing or not provided so as not to throw an error
- [`recma-mdx-change-props`](https://www.npmjs.com/package/recma-mdx-change-props)
  – Recma plugin to change the `props` parameter into the `_props` in the `function _createMdxContent(props) {/* */}` in the compiled source in order to be able to use `{props.foo}` like expressions. It is useful for the `next-mdx-remote` or `next-mdx-remote-client` users in `nextjs` applications.

## License

[MIT License](./LICENSE) © ipikuka

### Keywords

🟩 [unified][unifiednpm] 🟩 [rehype][rehypenpm] 🟩 [rehype plugin][rehypepluginnpm] 🟩 [hast][hastnpm] 🟩 [markdown][markdownnpm]

[unifiednpm]: https://www.npmjs.com/search?q=keywords:unified
[rehypenpm]: https://www.npmjs.com/search?q=keywords:rehype
[rehypepluginnpm]: https://www.npmjs.com/search?q=keywords:rehype%20plugin
[hastnpm]: https://www.npmjs.com/search?q=keywords:hast
[markdownnpm]: https://www.npmjs.com/search?q=keywords:markdown

[unified]: https://github.com/unifiedjs/unified
[micromark]: https://github.com/micromark/micromark
[remark]: https://github.com/remarkjs/remark
[remarkplugins]: https://github.com/remarkjs/remark/blob/main/doc/plugins.md
[mdast]: https://github.com/syntax-tree/mdast
[rehype]: https://github.com/rehypejs/rehype
[rehypeplugins]: https://github.com/rehypejs/rehype/blob/main/doc/plugins.md
[hast]: https://github.com/syntax-tree/hast
[typescript]: https://www.typescriptlang.org/

[badge-npm-version]: https://img.shields.io/npm/v/rehype-pre-language
[badge-npm-download]:https://img.shields.io/npm/dt/rehype-pre-language
[npm-package-url]: https://www.npmjs.com/package/rehype-pre-language

[badge-license]: https://img.shields.io/github/license/ipikuka/rehype-pre-language
[github-license-url]: https://github.com/ipikuka/rehype-pre-language/blob/main/LICENSE

[badge-build]: https://github.com/ipikuka/rehype-pre-language/actions/workflows/publish.yml/badge.svg
[github-workflow-url]: https://github.com/ipikuka/rehype-pre-language/actions/workflows/publish.yml

[badge-typescript]: https://img.shields.io/npm/types/rehype-pre-language
[typescript-url]: https://www.typescriptlang.org/
