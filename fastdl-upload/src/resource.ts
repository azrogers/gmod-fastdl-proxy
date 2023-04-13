import VirtualFileSystem from "./vfs";
import fs from "fs";

const Extensions: string[] = ["vmt", "png", "svg", "mdl", "pcf", "wav", "mp3", "ogg", "otf", "ttf"];

function generateResourceFile(vfs: VirtualFileSystem): string
{
	let paths = vfs.getGamePaths(Extensions);
	return paths.map(p => `resource.AddFile("${p}")`).join('\n');
}

async function writeResourceFile(vfs: VirtualFileSystem, path: string)
{
	await fs.promises.writeFile(path, generateResourceFile(vfs));
}

export { writeResourceFile };