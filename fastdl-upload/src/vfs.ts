import fs from "fs";
import path from "path";

const RootDirs: string[] = ["maps", "materials", "models", "particles", "resource", "sound"];

class VfsNode
{
	public name: string;
	public children: { [name: string]: VfsNode };
	public isDir: boolean;
	public path: string;

	constructor(name: string, actualPath: string, isDir: boolean)
	{
		this.name = name;
		this.isDir = isDir;
		this.path = actualPath.replace(/\\/g, '/');
		this.children = {};
	}
}

type FilePaths = { game: string, file: string };

// replicates the VFS used by gmod
class VirtualFileSystem
{
	private rootDir: string;
	private tree: VfsNode;

	constructor(gameDir: string)
	{
		this.rootDir = gameDir;
		this.tree = new VfsNode("", "/", true);
	}

	public getPaths(extensions: string[]): FilePaths[]
	{
		let accum: FilePaths[] = [];
		this.getPathsRecursive(this.tree, "", extensions, accum);
		return accum;
	}

	private getPathsRecursive(node: VfsNode, parent: string, extensions: string[], accum: FilePaths[])
	{
		Object.keys(node.children).forEach((k: string) =>
		{
			let child: VfsNode = node.children[k];
			if (child.isDir)
			{
				this.getPathsRecursive(child, `${parent}${child.name}/`, extensions, accum);	
			}
			else
			{
				let ext = path.extname(child.name).substring(1);
				if (extensions.indexOf(ext) !== -1)
				{
					accum.push({ game: `${parent}${child.name}`, file: child.path });	
				}
			}
		});
	}

	public getGamePaths(extensions: string[]): string[]
	{
		return this.getPaths(extensions).map(e => e.game);
	}

	public getFilePaths(extensions: string[]): string[]
	{
		return this.getPaths(extensions).map(e => e.file);
	}

	public async buildVfs()
	{
		// handle the root directory first
		for (let i = 0; i < RootDirs.length; i++)
		{
			await this.addDirToNode(path.join(this.rootDir, RootDirs[i]), this.tree);
		}

		// handle all addons
		let addonsPath = path.join(this.rootDir, "addons");
		let addons = await fs.promises.readdir(addonsPath, { withFileTypes: true });
		for (let i = 0; i < addons.length; i++)
		{
			if (addons[i].isDirectory())
			{
				let addonName = addons[i].name;
				let addonPath = path.join(this.rootDir, "addons", addonName);
				for (let j = 0; j < RootDirs.length; j++)
				{
					let contentPath = path.join(addonPath, RootDirs[j]);
					if (fs.existsSync(contentPath))
					{
						await this.addDirToNode(contentPath, this.tree);
					}
				}

				if (fs.existsSync(path.join(addonPath, "gamemodes")))
				{
					// handle any gamemode content lurking inside the addons
					await this.handleGamemodes(addonPath);
				}
			}
		}

		// handle gamemode content
		this.handleGamemodes(this.rootDir);
	}

	private async handleGamemodes(pathStr: string)
	{
		let gamemodesPath = path.join(pathStr, "gamemodes");
		let gamemodes = await fs.promises.readdir(gamemodesPath, { withFileTypes: true });
		for (let i = 0; i < gamemodes.length; i++)
		{
			let contentPath = path.join(gamemodesPath, gamemodes[i].name, "content");
			if (gamemodes[i].isDirectory() && fs.existsSync(contentPath))
			{
				this.addDirToNode(contentPath, this.tree);
			}
		}
	}

	private async addDirToNode(pathStr: string, rootNode: VfsNode)
	{
		let files = await fs.promises.readdir(pathStr, { withFileTypes: true });
		let nodeName = path.basename(pathStr);
		let newNode = rootNode.children[nodeName] || new VfsNode(nodeName, path.relative(this.rootDir, pathStr), true);
		for (let i = 0; i < files.length; i++)
		{
			let filePath = path.join(pathStr, files[i].name);
			if (files[i].isDirectory())
			{
				this.addDirToNode(filePath, newNode);
			}
			else
			{
				newNode.children[files[i].name] = new VfsNode(files[i].name, path.relative(this.rootDir, filePath), false);
			}
		}

		rootNode.children[nodeName] = newNode;
	}
}

export default VirtualFileSystem;