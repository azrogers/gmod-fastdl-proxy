import util from "util";
import child_process from "child_process";
import path from "path";

const exec = util.promisify(child_process.exec);

async function compressBzip(filePath: string) : Promise<Buffer>
{
	let binPath = path.resolve(path.join(__dirname, "../../bin/bzip2.exe"));
	let args = [binPath, `"${filePath}"`, '-c -z -3'];
	const { stdout, stderr } = await exec(args.join(' '), { encoding: 'buffer', maxBuffer: 1024 * 1024 * 1024 });
	return stdout;
}

export default compressBzip;