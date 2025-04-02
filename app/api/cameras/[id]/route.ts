import { NextResponse } from "next/server"
import { cameraService } from "@/lib/services"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Use our service module to get camera by ID
    const camera = await cameraService.getCamera(id)
    return NextResponse.json(camera)
  } catch (error) {
    console.error(`Error fetching camera ${params.id}:`, error)
    return NextResponse.json({ error: "Camera not found" }, { status: 404 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Note: We don't have a delete method in our service yet.
    // This would need to be implemented in the camera service
    return NextResponse.json({ error: "Not implemented" }, { status: 501 })
  } catch (error) {
    console.error(`Error deleting camera ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to delete camera" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()

    // Use our service module to update camera
    const updatedCamera = await cameraService.updateCamera(id, body)
    return NextResponse.json(updatedCamera)
  } catch (error) {
    console.error(`Error updating camera ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to update camera" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    // Backend doesn't support PATCH as per api_discrepencies.md
    // so we convert to PUT (same as before)
    const id = params.id
    const body = await request.json()
    
    // Use our service module to update camera
    const updatedCamera = await cameraService.updateCamera(id, body)
    return NextResponse.json(updatedCamera)
  } catch (error) {
    console.error(`Error patching camera ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to update camera" }, { status: 500 })
  }
}

