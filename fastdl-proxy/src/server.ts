import { S3Client, ListObjectsV2CommandInput, ListObjectsV2Command, GetObjectCommandInput, GetObjectCommand } from "@aws-sdk/client-s3";
import { Config } from "./config";
import { Express, Request, Response, RequestHandler, NextFunction } from "express";

class FileNode
{
	public name: string;
	public children: { [key: string]: FileNode }
	public path: string;

	constructor(name: string)
	{
		this.name = name;
		this.children = {};
	}
}

class Server
{
	private config: Config;
	private client: S3Client;
	private rootNode: FileNode;
	private pathRegex: RegExp;

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
		this.rootNode = new FileNode("");
		this.pathRegex = new RegExp(`^${this.config.baseUrl}/`);
	}

	async loadFiles()
	{
		let continuationToken: string = null;
		while(true)
		{
			let input: ListObjectsV2CommandInput = {
				Bucket: this.config.s3Bucket,
				EncodingType: "url",
				ContinuationToken: continuationToken
			};

			let command = new ListObjectsV2Command(input);
			let response = await this.client.send(command);
			response.Contents.forEach(r =>
			{
				this.addFileToTree(r.Key);
			});

			if (!response.IsTruncated)
			{
				break;
			}

			continuationToken = response.NextContinuationToken;
		}
	}

	addFileToTree(file: string)
	{
		let parts = file.split('/');
		let node = this.rootNode;
		let pathSoFar = [];
		for (let i = 0; i < parts.length; i++)
		{
			let k = parts[i].toLowerCase();
			let newNode = node.children[k] || new FileNode(k);
			node.children[k] = newNode;
			node = newNode;
			pathSoFar.push(parts[i]);
			node.path = pathSoFar.join('/');
		}
	}

	createRoute() : RequestHandler
	{
		return this.route.bind(this);
	}

	route(req: Request, res: Response, next: NextFunction)
	{
		let path = req.path.replace(this.pathRegex, '');
		// remove trailing slashes
		while (path[path.length - 1] == '/')
		{
			path = path.substring(0, path.length - 1);	
		}
		// remove leading slashes
		while (path[0] == '/')
		{
			path = path.substring(1);
		}

		let parts = path.split('/');
		let node = this.rootNode;
		for (let i = 0; i < parts.length; i++)
		{
			let k = parts[i].toLowerCase();
			node = node.children[k];
			if (!node)
			{
				res.sendStatus(404);
				return next();
			}
		}

		let finalPath = decodeURIComponent(node.path.replace(/\+/g, ' '));

		let childKeys = Object.keys(node.children);
		if (childKeys.length > 0)
		{
			let paths = [];
			childKeys.forEach(c =>
			{
				paths.push({
					name: c,
					url: this.config.baseUrl + '/' + path + '/' + c
				});
			});

			res.render("directory", {
				paths,
				dir: path
			});
		}
		else
		{
			let input: GetObjectCommandInput = {
				Bucket: this.config.s3Bucket,
				Key: finalPath
			};

			this.client.send(new GetObjectCommand(input)).then((response) =>
			{
				if (response.ContentLength)
				{
					response.Body.transformToByteArray().then(arr =>
					{
						res.contentType(response.ContentType).send(Buffer.from(arr));
					});
				}
			});
		}
	}
} 

export default Server;
