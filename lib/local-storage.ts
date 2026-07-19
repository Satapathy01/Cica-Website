import { mkdir, writeFile, unlink, access } from "fs/promises";
import path from "path";
import crypto from "crypto";

const STORAGE_ROOT = path.join(process.cwd(), "public", "uploads");

export type UploadFolder =
  | "teachers"
  | "gallery"
  | "hero"
  | "documents";

async function ensureDirectory(folder: UploadFolder) {
  const directory = path.join(STORAGE_ROOT, folder);

  try {
    await access(directory);
  } catch {
    await mkdir(directory, { recursive: true });
  }

  return directory;
}

function sanitizeFileName(fileName: string) {
  return fileName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9.\-_]/g, "");
}

export async function saveFileLocally(
  file: File,
  folder: UploadFolder
) {
  const directory = await ensureDirectory(folder);

  const extension =
    path.extname(file.name) || ".bin";

  const fileName =
    `${Date.now()}-${crypto.randomUUID()}${extension}`;

  const safeName = sanitizeFileName(fileName);

  const buffer = Buffer.from(
    await file.arrayBuffer()
  );

  const absolutePath = path.join(
    directory,
    safeName
  );

  await writeFile(absolutePath, buffer);

  return {
    fileName: safeName,

    absolutePath,

    publicPath: `/uploads/${folder}/${safeName}`
  };
}

export async function deleteLocalFile(
  publicPath?: string
) {
  if (!publicPath) return;

  const cleaned = publicPath.replace(/^\/+/, "");

  const absolutePath = path.join(
    process.cwd(),
    "public",
    cleaned
  );

  try {
    await unlink(absolutePath);
  } catch {
    // Ignore missing files
  }
}

export function getPublicFileUrl(
  folder: UploadFolder,
  fileName: string
) {
  return `/uploads/${folder}/${fileName}`;
}