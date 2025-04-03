import { NextResponse } from "next/server"
import { cameraService } from "@/lib/services"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // Force params to be awaited
    const resolvedParams = await Promise.resolve(params)
    const id = resolvedParams.id

    // Use our service module to get camera by ID
    const camera = await cameraService.getCamera(id)
    return NextResponse.json(camera)
  } catch (error) {
    console.error(`Error fetching camera:`, error)
    return NextResponse.json({ error: "Camera not found" }, { status: 404 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Force params to be awaited
    const resolvedParams = await Promise.resolve(params)
    const id = resolvedParams.id
    
    // Use our camera service to delete the camera
    // If your backend implements this properly with the camera service, it will get called
    // otherwise it will use the mock implementation
    const result = await cameraService.deleteCamera(id)
    return NextResponse.json(result)
  } catch (error) {
    console.error(`Error deleting camera:`, error)
    return NextResponse.json({ error: "Failed to delete camera" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    // Force params to be awaited
    const resolvedParams = await Promise.resolve(params)
    const id = resolvedParams.id
    const body = await request.json()

    // Use our service module to update camera
    const updatedCamera = await cameraService.updateCamera(id, body)
    return NextResponse.json(updatedCamera)
  } catch (error) {
    console.error(`Error updating camera:`, error)
    return NextResponse.json({ error: "Failed to update camera" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    // Backend doesn't support PATCH as per api_discrepencies.md
    // so we convert to PUT (same as before)
    const resolvedParams = await Promise.resolve(params)
    const id = resolvedParams.id
    const body = await request.json()
    
    // Use our service module to update camera
    const updatedCamera = await cameraService.updateCamera(id, body)
    return NextResponse.json(updatedCamera)
  } catch (error) {
    console.error(`Error patching camera:`, error)
    return NextResponse.json({ error: "Failed to update camera" }, { status: 500 })
  }
}

