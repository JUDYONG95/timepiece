import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { z } from "zod"

// Schema for validating new watch data
const watchSchema = z.object({
  name: z.string().min(1, "Name is required"),
  brand: z.string().min(1, "Brand is required"),
  year: z.string().regex(/^\d{4}$/, "Year must be a 4-digit number"),
  description: z.string().min(1, "Description is required"),
  imageSrc: z.string().url("Image URL must be valid"),
})

export async function GET() {
  try {
    const watches = await prisma.watch.findMany()
    return NextResponse.json(watches)
  } catch (error) {
    console.error("Error fetching watches:", error)
    return NextResponse.json({ message: "Failed to fetch watches" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const validatedData = watchSchema.parse(body)

    const newWatch = await prisma.watch.create({
      data: validatedData,
    })

    return NextResponse.json(newWatch, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid request data", errors: error.errors }, { status: 400 })
    }
    console.error("Error adding watch:", error)
    return NextResponse.json({ message: "Failed to add watch" }, { status: 500 })
  }
}
