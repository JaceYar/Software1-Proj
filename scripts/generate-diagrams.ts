import { readdir, mkdir, rm } from "fs/promises";
import { join, relative } from "path";

const DOCS_DIR = join(import.meta.dir, "..", "Documentation");
const OUTPUT_DIR = join(import.meta.dir, "image-output");
const TEMP_DIR = join(import.meta.dir, ".tmp-mermaid");
const MMDC = join(import.meta.dir, "node_modules", ".bin", "mmdc");

async function findMarkdownFiles(dir: string): Promise<string[]> {
  const files: string[] = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await findMarkdownFiles(fullPath)));
    } else if (entry.name.endsWith(".md")) {
      files.push(fullPath);
    }
  }
  return files;
}

function extractMermaidBlocks(content: string): string[] {
  const blocks: string[] = [];
  const regex = /```mermaid\n([\s\S]*?)```/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(content)) !== null) {
    blocks.push(match[1].trim());
  }
  return blocks;
}

// Converts a relative doc path like "User-Cases/AdminLogin.md"
// into a flat slug like "User-Cases-AdminLogin" for use as a directory name.
function pathToSlug(relPath: string): string {
  return relPath
    .replace(/\.md$/, "")
    .replace(/[\\/]/g, "-");
}

async function renderDiagram(
  mmdContent: string,
  outputPath: string,
  tempFile: string
): Promise<void> {
  await Bun.write(tempFile, mmdContent);

  const proc = Bun.spawn(
    [MMDC, "-i", tempFile, "-o", outputPath, "-b", "white", "--quiet"],
    { stdout: "pipe", stderr: "pipe" }
  );

  const exitCode = await proc.exited;

  if (exitCode !== 0) {
    const err = await new Response(proc.stderr).text();
    throw new Error(err.trim() || `mmdc exited with code ${exitCode}`);
  }
}

async function main() {
  await mkdir(OUTPUT_DIR, { recursive: true });
  await mkdir(TEMP_DIR, { recursive: true });

  const mdFiles = await findMarkdownFiles(DOCS_DIR);
  console.log(`Scanning ${mdFiles.length} markdown files in Documentation/\n`);

  let totalDiagrams = 0;
  let totalErrors = 0;

  for (const filePath of mdFiles) {
    const content = await Bun.file(filePath).text();
    const blocks = extractMermaidBlocks(content);

    if (blocks.length === 0) continue;

    const relPath = relative(DOCS_DIR, filePath);
    const slug = pathToSlug(relPath);
    const fileOutputDir = join(OUTPUT_DIR, slug);
    await mkdir(fileOutputDir, { recursive: true });

    console.log(`${relPath}  (${blocks.length} diagram${blocks.length > 1 ? "s" : ""})`);

    for (let i = 0; i < blocks.length; i++) {
      const label = `diagram-${i + 1}`;
      const outputPath = join(fileOutputDir, `${label}.png`);
      const tempFile = join(TEMP_DIR, `${slug}-${label}.mmd`);

      process.stdout.write(`  ${label} ... `);

      try {
        await renderDiagram(blocks[i], outputPath, tempFile);
        console.log("✓");
        totalDiagrams++;
      } catch (e: any) {
        console.log(`✗  ${e.message}`);
        totalErrors++;
      }
    }
  }

  await rm(TEMP_DIR, { recursive: true, force: true });

  console.log(
    `\n${totalDiagrams} diagram(s) rendered → ${OUTPUT_DIR}` +
      (totalErrors > 0 ? `\n${totalErrors} error(s)` : "")
  );
}

main();
