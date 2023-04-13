import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";
import { Readable } from "stream";
import signale from "signale";
import cliProgress from "cli-progress";
import pLimit from "p-limit";
import compressBzip from "./util/bzip2";

import { Config } from "./config";
import VirtualFileSystem from "./vfs";
import Cache from "./cache";

const Extensions: string[] = ["bsp", "vtf", "vmt", "png", "svg", "vtx", "vvd", "mdl", "phy", "pcf", "wav", "mp3", "ogg", "otf", "ttf"];

class Uploader
{
	private client: S3Client;
	private config: Config;

	constructor(config: Config)
	{
		this.config = config;
		this.client = new S3Client({
			region: config.s3Region,
			endpoint: config.s3Endpoint,
			credentials: {
				accessKeyId: config.s3AccessKey,
				secretAccessKey: config.s3SecretKey
			}
		});
	}

	async upload(vfs: VirtualFileSystem, cache: Cache)
	{
		let files = vfs.getFilePaths(Extensions);
		let promises = [];
		signale.pending(`found ${files.length} files to upload`);
		
		const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
		progressBar.start(files.length, 0);

		let limit = pLimit(10);

		for (let i = 0; i < files.length; i++)
		{
			let promise = limit(() => this.uploadFile(
				path.join(this.config.gameDir, files[i]),
				files[i],
				cache,
				progressBar));
			promises.push(promise);
		}

		signale.pending('uploading files');
		await Promise.all(promises);
		await cache.save();
		progressBar.stop();
		signale.success(`uploaded ${files.length} files`);
	}

	private async uploadFile(file: string, targetPath: string, cache: Cache, progressBar: cliProgress.SingleBar)
	{
		let wasUploaded = await cache.checkOrAddFile(file);
		if (wasUploaded)
		{
			progressBar.increment();
			return;
		}
		
		let uploadStream: Readable;
		let uploadPath = targetPath;
		let info = await fs.promises.stat(file);
		// if over 50kb, compress to bzip
		if (info.size > 50000)
		{
			let bytes = await compressBzip(file);
			uploadStream = Readable.from(bytes);
			uploadPath = uploadPath + ".bz2";
		}
		else
		{
			uploadStream = fs.createReadStream(file);
		}

		let command = new PutObjectCommand({
			Key: uploadPath,
			Body: uploadStream,
			Bucket: this.config.s3Bucket
		});

		await this.client.send(command);
		progressBar.increment();
	}
}

export default Uploader;