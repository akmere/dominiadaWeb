// @ts-nocheck
import { NextResponse } from 'next/server';
import { createReadStream, statSync } from 'fs'
import { pipeline } from 'stream'

export async function GET(request: Request, { params }) {
    const id = params.id;
    try {
        let filePath = `${process.env.RECORDINGS_FOLDER}/${id}.hbr2`;
        var stat = statSync(filePath);
        var readStream = createReadStream(filePath);
        return new NextResponse(readStream, {
            status : 200,
            headers: {
                'Content-Type': 'application/octet-stream',
                'Content-Length': stat.size,
                'Content-disposition': `attachment; filename=${id}.hbr2`
            }
        })
    }
    catch (e) {
        return new Response("", { status: 404, headers: {} });
    }
}