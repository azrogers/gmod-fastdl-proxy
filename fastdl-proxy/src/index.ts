import express from "express";

import { readConfig } from "./config";
import Server from "./server";

const config = readConfig();
const server = new Server(config);

server.loadFiles().then(() =>
{
	const app = express();

	app.set("view engine", "pug");

	app.get("/*?", server.createRoute());

	app.listen(config.port, () =>
	{
		console.log(`listening on port ${config.port}`);
	});
});