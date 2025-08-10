import fs from "fs";
import path from "path";

interface Props {
  folderPath: string;
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function getPngFiles({ folderPath }: Props) {
  const imagesDir = path.join(process.cwd(), "public", folderPath);

  return fs
    .readdirSync(imagesDir)
    .filter((file) => file.endsWith(".png"))
    .map((file) => ({
      path: `/${folderPath}/${file}`,
      name: capitalize(file.replace(/-/g, " ").replace(/\.png$/, "")),
    }));
}
