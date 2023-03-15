import { NextResponse } from "next/server";

export async function GET(request, context) {
  const playerId = context.params.id;

  let response = NextResponse.json({heheh : 15});

  return response;
}

export async function POST(request, context) {
  const playerId = context.params.id;
  console.log(request);
  // console.log(await request.text());
  console.log(await request.json());

  let response = NextResponse.json({playerId: playerId});

  return response;
}