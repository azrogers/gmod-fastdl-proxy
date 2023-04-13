import { Config, readConfig } from "./config";
import VirtualFileSystem from "./vfs";
import Uploader from "./uploader";
import compressBzip from "./util/bzip2";
import Cache from "./cache";
import { writeResourceFile } from "./resource";

import fs from "fs";

let config: Config = readConfig();
let cache: Cache = new Cache();
cache.load().then(() =>
{
	let vfs: VirtualFileSystem = new VirtualFileSystem(config.gameDir);
	let uploader: Uploader = new Uploader(config);
	vfs.buildVfs().then(() =>
	{
		writeResourceFile(vfs, "resource.lua");
		uploader.upload(vfs, cache);
	});
});