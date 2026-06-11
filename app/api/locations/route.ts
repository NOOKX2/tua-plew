import { NextResponse } from "next/server";
import { rentalLocations } from "@/lib/locations";

export async function GET() {
  return NextResponse.json(rentalLocations);
}
