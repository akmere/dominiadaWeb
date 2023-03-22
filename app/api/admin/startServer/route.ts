// @ts-nocheck
import { NextResponse } from 'next/server';
import fs from 'fs';
import { exec} from 'child-process-promise';

export async function POST(request: Request) {
    let data = await request.json();
    if (!data.instance || !data.token) return new NextResponse(`Not enough data`, { status: 422 });
    let instancesJson = JSON.parse(fs.readFileSync('private/instances.json'));
    let instanceFromJson = instancesJson.find(instance => instance.name == data.instance);
    if (!instanceFromJson) return new NextResponse(`Instance ${data.instance} not found!`, { status: 404 });
    let configJson = null;
    if (data.config) {
        try {
            configJson = typeof data.config === 'object' ? data.config : JSON.parse(data.config);
        }
        catch (err) {
            return new NextResponse(`Given config is an invalid JSON!\n${err}`, { status: 422 });
        }
    }

    if (configJson) {
        let oldConfigText = (await exec(`ssh ${instanceFromJson.address} cat ${instanceFromJson.roomDirectory}/config.json`)).stdout;
        let oldConfigJson = JSON.parse(oldConfigText);
        Object.keys(configJson).forEach(key => {
            oldConfigJson[key] = configJson[key];
        });
        let newJsonText = JSON.stringify(oldConfigJson, null, '\t');
        await exec(`ssh ${instanceFromJson.address} 'mkdir -p ${instanceFromJson.roomDirectory}/configbackups && cp ${instanceFromJson.roomDirectory}/config.json ${instanceFromJson.roomDirectory}/configbackups/config$(date +"%Y%m%d%H%M%S").json'`);
        let tempFileName = `tempConfig${Date.now().toString()}.json`;
        let tempFilePath = `${process.env.TEMP_FOLDER}/${tempFileName}`;
        fs.writeFileSync(`${tempFilePath}`, newJsonText);
        await exec(`scp ${tempFilePath} ${instanceFromJson.address}:${instanceFromJson.roomDirectory}/config.json`);
        fs.unlinkSync(tempFilePath);
    }

    // return new NextResponse('OK', { status: 200 });

    exec(`ssh ${instanceFromJson.address} '${instanceFromJson.roomDirectory}/runroom.sh ${data.token}'`);

    return new NextResponse('OK', { status: 200 });
}