import { NextResponse } from "next/server"
import { cameras } from "../route"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  // Find the camera
  const camera = cameras.find((camera) => camera.id === id)

  if (!camera) {
    return NextResponse.json({ error: "Camera not found" }, { status: 404 })
  }

  return NextResponse.json(camera)
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  // Find the camera
  const cameraIndex = cameras.findIndex((camera) => camera.id === id)

  if (cameraIndex === -1) {
    return NextResponse.json({ error: "Camera not found" }, { status: 404 })
  }

  // Remove the camera
  cameras.splice(cameraIndex, 1)

  // Return success with no content
  return new NextResponse(null, { status: 204 })
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const id = params.id
  const body = await request.json()

  // Find the camera
  const cameraIndex = cameras.findIndex((camera) => camera.id === id)

  if (cameraIndex === -1) {
    return NextResponse.json({ error: "Camera not found" }, { status: 404 })
  }

  // Simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Update the camera with the new settings
  cameras[cameraIndex] = {
    ...cameras[cameraIndex],
    ...body,
  }

  return NextResponse.json(cameras[cameraIndex])
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  // Backend doesn't support PATCH, so we convert to PUT
  // Note: This maintains partial update behavior because we're first
  // spreading the existing camera object before applying the updates

  const id = params.id
  const body = await request.json()

  // Find the camera
  const cameraIndex = cameras.findIndex((camera) => camera.id === id)

  if (cameraIndex === -1) {
    return NextResponse.json({ error: "Camera not found" }, { status: 404 })
  }

  // In a real implementation, we would call the backend PUT endpoint
  // const response = await fetch(`${process.env.BACKEND_URL}/api/cameras/${id}`, {
  //   method: 'PUT',
  //   headers: {
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify({
  //     ...cameras[cameraIndex], // Include existing properties
  //     ...body // Apply partial updates
  //   })
  // })
  // return response
  
  // For this mock implementation, update the camera (same behavior as PUT)
  cameras[cameraIndex] = {
    ...cameras[cameraIndex],
    ...body,
  }

  return NextResponse.json(cameras[cameraIndex])
}

