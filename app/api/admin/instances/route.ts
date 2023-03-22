// @ts-nocheck
import { NextResponse } from 'next/server';
import fs from 'fs';
import { exec} from 'child-process-promise';

export async function GET(request: Request) {
    let instancesJson = JSON.parse(fs.readFileSync('private/instances.json'));

    await Promise.all(instancesJson.map(async instance => {
        try {
            let configJson = JSON.parse((await exec(`ssh ${instance.address} 'cat ${instance.roomDirectory}/config.json'`)).stdout);
            instance.reachable = true;
            instance.config = configJson;
        }
        catch(err) {
            console.log(err);
            instance.reachable = false;
        }
    }));
    return new NextResponse(JSON.stringify(instancesJson), { status: 200, headers : {"Content-Type" : "application/json"}});
}