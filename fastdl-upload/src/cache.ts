import checksum from "checksum";
import fs from "fs";

class Cache
{
	private files: { [path: string]: string }

	checkOrAddFile(path: string): Promise<boolean>
	{
		return new Promise<boolean>((resolve, reject) =>
		{
			checksum.file(path, (err, hash) =>
			{
				if (err)
				{
					reject(err);
				}	
				else
				{
					let contains = this.files[path] == hash;
					this.files[path] = hash;
					resolve(contains);
				}
			});
		});
	}

	async load()
	{
		if (!fs.existsSync("cache.json"))
		{
			this.files = {};
		}
		else
		{
			this.files = JSON.parse(await fs.promises.readFile("cache.json", { encoding: 'utf-8' }));
		}
	}

	async save()
	{
		await fs.promises.writeFile("cache.json", JSON.stringify(this.files));
	}
}

export default Cache;