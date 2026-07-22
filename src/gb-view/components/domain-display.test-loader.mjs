import { access, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const mocksUrl = new URL("./domain-display.test-mocks.mjs", import.meta.url).href;

export async function resolve(specifier, context, nextResolve) {
  if (
    specifier === "@mui/material" ||
    specifier === "@weng-lab/genomebrowser-ui"
  ) {
    return { url: mocksUrl, shortCircuit: true };
  }

  if (specifier.startsWith(".") && context.parentURL?.startsWith("file:")) {
    const candidate = new URL(specifier, context.parentURL);
    if (!candidate.pathname.match(/\.[cm]?[jt]sx?$/)) {
      for (const extension of [".ts", ".tsx"]) {
        const extended = new URL(`${candidate.href}${extension}`);
        try {
          await access(fileURLToPath(extended));
          return { url: extended.href, shortCircuit: true };
        } catch {
          // Try the next TypeScript extension.
        }
      }
    }
  }

  return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
  if (url.startsWith("file:") && /\.tsx?$/.test(new URL(url).pathname)) {
    const source = await readFile(fileURLToPath(url), "utf8");
    return {
      format: "module",
      shortCircuit: true,
      source: ts.transpileModule(source, {
        compilerOptions: {
          jsx: ts.JsxEmit.ReactJSX,
          module: ts.ModuleKind.ESNext,
          target: ts.ScriptTarget.ES2022,
        },
        fileName: fileURLToPath(url),
      }).outputText,
    };
  }

  return nextLoad(url, context);
}
