# rehype-pre-language

[![NPM version][npm-image]][npm-url]
[![Build][github-build]][github-build-url]
![npm-typescript]
[![License][github-license]][github-license-url]

This package is a [unified][unified] ([rehype][rehype]) plugin **to add language information as a property to pre element** (compatible with new parser "[micromark][micromark]").

"**unified**" is a project that transforms content with abstract syntax trees (ASTs). "**rehype**" is a tool that transforms HTML with plugins. "**hast**" stands for HTML Abstract Syntax Tree (HAST) that rehype uses.

**This plugin is a rehype plugin that adds language information into "className" of the `<pre />` element that has a `<code />` element inside if the `<code />` element's className contains a language information.**

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
<pre class="javascript"><code class="language-javascript">const me = "ipikuka";
</code></pre>
```

Without `rehype-pre-language`, the `<pre>` element wouldn't have a language information:

```html
<pre><code class="language-javascript">const me = "ipikuka";
</code></pre>
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

This package is fully typed with [TypeScript][typeScript].

The plugin exports the type `PreLanguageOption`.

## Compatibility

This plugin works with unified version 6+ and remark version 7+.

## Security

Use of `rehype-pre-language` involves rehype (hast), but doesn't lead to cross-site scripting (XSS) attacks.

## My Plugins

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
  – Remark plugin to expose the table of contents via Vfile.data or via an option reference
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

[MIT][license] © ipikuka

### Keywords

[unified][unifiednpm] [rehype][rehypenpm] [rehype-plugin][rehypepluginnpm] [hast][hastnpm] [markdown][markdownnpm]

[unified]: https://github.com/unifiedjs/unified
[unifiednpm]: https://www.npmjs.com/search?q=keywords:unified
[rehype]: https://github.com/rehypejs/rehype
[rehypenpm]: https://www.npmjs.com/search?q=keywords:rehype
[rehypepluginnpm]: https://www.npmjs.com/search?q=keywords:rehype%20plugin
[hast]: https://github.com/syntax-tree/hast
[hastnpm]: https://www.npmjs.com/search?q=keywords:hast
[micromark]: https://github.com/micromark/micromark
[typescript]: https://www.typescriptlang.org/
[license]: https://github.com/ipikuka/rehype-pre-language/blob/main/LICENSE
[markdownnpm]: https://www.npmjs.com/search?q=keywords:markdown

[npm-url]: https://www.npmjs.com/package/rehype-pre-language
[npm-image]: https://img.shields.io/npm/v/rehype-pre-language
[github-license]: https://img.shields.io/github/license/ipikuka/rehype-pre-language
[github-license-url]: https://github.com/ipikuka/rehype-pre-language/blob/master/LICENSE
[github-build]: https://github.com/ipikuka/rehype-pre-language/actions/workflows/publish.yml/badge.svg
[github-build-url]: https://github.com/ipikuka/rehype-pre-language/actions/workflows/publish.yml
[npm-typescript]: https://img.shields.io/npm/types/rehype-pre-language
