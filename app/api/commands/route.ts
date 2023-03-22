// @ts-nocheck
import { NextResponse } from 'next/server';
import fs from 'fs';

export async function GET(request: Request) {
    const path = `public/commands.json`;
    var data = fs.readFileSync(path, 'utf8');
    var json = JSON.parse(data);
    console.log('heheheheh');

    // res.status(200).json(json);

    return NextResponse.json(json);
}