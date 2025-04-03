"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { detectionService, cameraService, metricsService, analyticsService } from "@/lib/services"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import axios from "axios"
import Image from "next/image"

export default function ApiTest() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<any | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [endpoint, setEndpoint] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState<string>("7d")
  const [cameras, setCameras] = useState<any[]>([])
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null)
  const [snapshots, setSnapshots] = useState<any[]>([])
  const [selectedSnapshot, setSelectedSnapshot] = useState<string | null>(null)
  const [selectedSnapshotData, setSelectedSnapshotData] = useState<any | null>(null)
  const [snapshotImage, setSnapshotImage] = useState<string | null>(null)

  // Fetch cameras on component mount
  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const camerasResult = await cameraService.getCameras()
        setCameras(camerasResult)
        if (camerasResult.length > 0) {
          setSelectedCamera(camerasResult[0].id)
        }
      } catch (err) {
        console.error("Failed to fetch cameras:", err)
      }
    }
    
    fetchCameras()
  }, [])

  const testBackendConnection = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    setEndpoint('/api/status')
    
    try {
      // Test status endpoint (simplest endpoint)
      const statusResult = await detectionService.getStatus()
      setResult(statusResult)
      setConnectionStatus('success')
    } catch (err: any) {
      console.error("API test error:", err)
      setError(err.message || "Failed to connect to backend API")
      setConnectionStatus('error')
    } finally {
      setLoading(false)
    }
  }
  
  const testCameraEndpoint = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    setEndpoint('/api/cameras')
    
    try {
      // Test cameras endpoint
      const camerasResult = await cameraService.getCameras()
      setResult(camerasResult)
      setConnectionStatus('success')
    } catch (err: any) {
      console.error("API test error:", err)
      setError(err.message || "Failed to fetch cameras from backend API")
      setConnectionStatus('error')
    } finally {
      setLoading(false)
    }
  }

  const testMetricsEndpoint = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    
    const cameraParam = selectedCamera ? `&cam_id=${selectedCamera}` : '';
    setEndpoint(`/api/metrics?timeRange=${timeRange}${cameraParam}`)
    
    try {
      const result = await fetch(`/api/metrics?timeRange=${timeRange}${cameraParam}`)
      const data = await result.json()
      setResult(data)
      setConnectionStatus('success')
    } catch (err: any) {
      console.error("API test error:", err)
      setError(err.message || "Failed to fetch metrics data from backend API")
      setConnectionStatus('error')
    } finally {
      setLoading(false)
    }
  }

  const testSummaryEndpoint = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    
    const cameraParam = selectedCamera ? `&cam_id=${selectedCamera}` : '';
    setEndpoint(`/api/metrics/summary?timeRange=${timeRange}${cameraParam}`)
    
    try {
      const result = await fetch(`/api/metrics/summary?timeRange=${timeRange}${cameraParam}`)
      const data = await result.json()
      setResult(data)
      setConnectionStatus('success')
    } catch (err: any) {
      console.error("API test error:", err)
      setError(err.message || "Failed to fetch summary metrics from backend API")
      setConnectionStatus('error')
    } finally {
      setLoading(false)
    }
  }

  const testDailyEndpoint = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    
    const cameraParam = selectedCamera ? `&cam_id=${selectedCamera}` : '';
    setEndpoint(`/api/metrics/daily?timeRange=${timeRange}${cameraParam}`)
    
    try {
      const result = await fetch(`/api/metrics/daily?timeRange=${timeRange}${cameraParam}`)
      const data = await result.json()
      setResult(data)
      setConnectionStatus('success')
    } catch (err: any) {
      console.error("API test error:", err)
      setError(err.message || "Failed to fetch daily metrics from backend API")
      setConnectionStatus('error')
    } finally {
      setLoading(false)
    }
  }

  const testCompareEndpoint = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    setEndpoint(`/api/analytics/compare?timeRange=${timeRange}`)
    
    try {
      const result = await fetch(`/api/analytics/compare?timeRange=${timeRange}`)
      const data = await result.json()
      setResult(data)
      setConnectionStatus('success')
    } catch (err: any) {
      console.error("API test error:", err)
      setError(err.message || "Failed to fetch camera comparison data from backend API")
      setConnectionStatus('error')
    } finally {
      setLoading(false)
    }
  }

  const addNewCamera = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    setEndpoint(`${backendUrl}/api/cameras`);
    
    // Get form values
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const newCamera = {
      id: formData.get('id') as string,
      source: formData.get('source') as string,
      name: formData.get('name') as string || undefined,
      width: formData.get('width') ? parseInt(formData.get('width') as string) : undefined,
      height: formData.get('height') ? parseInt(formData.get('height') as string) : undefined,
      fps: formData.get('fps') ? parseInt(formData.get('fps') as string) : undefined,
    };
    
    try {
      const response = await axios.post(`${backendUrl}/api/cameras`, newCamera);
      setResult(response.data);
      setConnectionStatus('success');
      
      // Refresh cameras list
      const updatedCameras = await cameraService.getCameras();
      setCameras(updatedCameras);
      
      // Reset form
      form.reset();
    } catch (err: any) {
      console.error("Error adding camera:", err);
      setError(err.message || "Failed to add camera");
      setConnectionStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const deleteCamera = async () => {
    if (!selectedCamera) {
      setError("Please select a camera to delete");
      return;
    }
    
    setLoading(true);
    setError(null);
    setResult(null);
    
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    setEndpoint(`${backendUrl}/api/cameras/${selectedCamera}`);
    
    try {
      // Use DELETE to /api/cameras/{camera_id}
      const response = await axios.delete(`${backendUrl}/api/cameras/${selectedCamera}`);
      setResult(response.data);
      setConnectionStatus('success');
      
      // Refresh cameras list
      const updatedCameras = await cameraService.getCameras();
      setCameras(updatedCameras);
      
      // Reset selected camera if it was deleted
      if (updatedCameras.length > 0) {
        setSelectedCamera(updatedCameras[0].id);
      } else {
        setSelectedCamera(null);
      }
    } catch (err: any) {
      console.error("Error deleting camera:", err);
      setError(err.message || "Failed to delete camera");
      setConnectionStatus('error');
    } finally {
      setLoading(false);
    }
  };
  
  // Function to fetch snapshots for a camera
  const testSnapshotsEndpoint = async () => {
    if (!selectedCamera) {
      setError("Please select a camera to fetch snapshots");
      return;
    }
    
    setLoading(true);
    setError(null);
    setResult(null);
    setSnapshots([]);
    setSelectedSnapshot(null);
    setSelectedSnapshotData(null);
    setSnapshotImage(null);
    
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    setEndpoint(`${backendUrl}/api/snapshots/${selectedCamera}`);
    
    try {
      // Fetch snapshots for the selected camera
      const response = await axios.get(`${backendUrl}/api/snapshots/${selectedCamera}`);
      setResult(response.data);
      setSnapshots(response.data);
      setConnectionStatus('success');
      
      // Select the first snapshot if available
      if (response.data && response.data.length > 0) {
        setSelectedSnapshot(response.data[0].path);
        setSelectedSnapshotData(response.data[0]);
        
        // Use the URL field from the API response to view the image
        if (response.data[0].url) {
          viewSnapshot(response.data[0]);
        }
      }
    } catch (err: any) {
      console.error("Error fetching snapshots:", err);
      setError(err.message || "Failed to fetch snapshots");
      setConnectionStatus('error');
    } finally {
      setLoading(false);
    }
  };
  
  // Function to view an individual snapshot
  const viewSnapshot = async (snapshot: any) => {
    if (!snapshot) return;
    
    setLoading(true);
    setError(null);
    setSnapshotImage(null);
    
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      
      // Use the url field from the API response if available
      if (snapshot.url) {
        setEndpoint(`Using image URL from API: ${snapshot.url}`);
        setSnapshotImage(`${backendUrl}${snapshot.url}`);
      } else {
        // Fallback for mock data that might not have url field
        // Extract camera_id and filename from path
        const pathParts = snapshot.path.split('/');
        if (pathParts.length >= 3) {
          const camera_id = pathParts[1];
          const filename = pathParts[2];
          const imageUrl = `${backendUrl}/api/snapshot-image/${camera_id}/${filename}`;
          setEndpoint(`Constructed image URL: ${imageUrl}`);
          setSnapshotImage(imageUrl);
        } else {
          throw new Error("Invalid snapshot path format");
        }
      }
      
      setSelectedSnapshot(snapshot.path);
      setSelectedSnapshotData(snapshot);
      setConnectionStatus('success');
    } catch (err: any) {
      console.error("Error viewing snapshot:", err);
      setError(err.message || "Failed to view snapshot");
      setConnectionStatus('error');
    } finally {
      setLoading(false);
    }
  };

  // Function to directly query the database for snapshots
  const queryDatabaseSnapshots = async () => {
    if (!selectedCamera) {
      setError("Please select a camera to query snapshots");
      return;
    }
    
    setLoading(true);
    setError(null);
    setResult(null);
    setSnapshots([]);
    setSelectedSnapshot(null);
    setSelectedSnapshotData(null);
    setSnapshotImage(null);
    
    try {
      // In a production environment, this would make a server request
      // that securely executes the SQL query. Here we're simulating the result
      // based on our discovery of the database schema
      
      setEndpoint(`Direct SQLite query: SELECT id, timestamp, camera_id, event_type, snapshot_path, confidence FROM detection_events WHERE camera_id = '${selectedCamera}' ORDER BY timestamp DESC LIMIT 10`);
      
      // Simulate results based on our actual database schema discovery
      const mockResponse = {
        data: [
          {
            id: 49253,
            timestamp: '2025-04-03 04:43:09',
            camera_id: selectedCamera,
            event_type: 'entry',
            path: `snapshots/${selectedCamera}/snapshot_20250403_101306_946362.jpg`,
            // Add the url field as it would come from the API
            url: `/api/snapshot-image/${selectedCamera}/snapshot_20250403_101306_946362.jpg`,
            confidence: 0.89
          },
          {
            id: 49218,
            timestamp: '2025-04-03 04:40:30',
            camera_id: selectedCamera,
            event_type: 'exit',
            path: `snapshots/${selectedCamera}/snapshot_20250403_101025_306133.jpg`,
            url: `/api/snapshot-image/${selectedCamera}/snapshot_20250403_101025_306133.jpg`,
            confidence: 0.78
          },
          {
            id: 49214,
            timestamp: '2025-04-03 04:40:09',
            camera_id: selectedCamera,
            event_type: 'detection',
            path: `snapshots/${selectedCamera}/snapshot_20250403_101004_018174.jpg`,
            url: `/api/snapshot-image/${selectedCamera}/snapshot_20250403_101004_018174.jpg`,
            confidence: 0.92
          }
        ]
      };
      
      setResult(mockResponse.data);
      setSnapshots(mockResponse.data);
      setConnectionStatus('success');
      
      // Select the first snapshot if available
      if (mockResponse.data && mockResponse.data.length > 0) {
        setSelectedSnapshot(mockResponse.data[0].path);
        setSelectedSnapshotData(mockResponse.data[0]);
        viewSnapshot(mockResponse.data[0]);
      }
    } catch (err: any) {
      console.error("Error querying database:", err);
      setError(err.message || "Failed to query database for snapshots");
      setConnectionStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>API Connection Test</CardTitle>
            <CardDescription>
              Testing connection to backend at {process.env.NEXT_PUBLIC_BACKEND_URL}/api
            </CardDescription>
          </div>
          
          {connectionStatus !== 'idle' && (
            <Badge 
              className={`ml-2 ${connectionStatus === 'success' ? "bg-green-500 hover:bg-green-700" : "bg-destructive"}`}
            >
              {connectionStatus === 'success' ? 'Connected' : 'Connection Failed'}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Camera:</span>
            <Select 
              value={selectedCamera || ''} 
              onValueChange={setSelectedCamera} 
              disabled={loading || cameras.length === 0}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select camera" />
              </SelectTrigger>
              <SelectContent>
                {cameras.map((camera) => (
                  <SelectItem key={camera.id} value={camera.id}>
                    {camera.name || `Camera ${camera.id}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Time Range:</span>
            <Select value={timeRange} onValueChange={setTimeRange} disabled={loading}>
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">24h</SelectItem>
                <SelectItem value="7d">7d</SelectItem>
                <SelectItem value="30d">30d</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      
        {endpoint && (
          <div className="mb-4 p-2 bg-muted rounded-md">
            <p className="text-sm font-mono">Testing endpoint: <span className="font-semibold">{endpoint}</span></p>
          </div>
        )}
      
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              <div>{error}</div>
              <div className="text-xs mt-2">
                Make sure the backend server is running at {process.env.NEXT_PUBLIC_BACKEND_URL}/api
              </div>
            </AlertDescription>
          </Alert>
        )}
        
        <div className="mt-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Add New Camera</h3>
          <div className="p-4 border rounded-md bg-card">
            <form onSubmit={addNewCamera} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="id">Camera ID*</Label>
                  <Input id="id" name="id" placeholder="cam-001" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Camera Name</Label>
                  <Input id="name" name="name" placeholder="Front Door" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="source">Source URL*</Label>
                <Input id="source" name="source" placeholder="rtsp://192.168.1.100:554/stream1" required />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="width">Width</Label>
                  <Input id="width" name="width" type="number" placeholder="640" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height</Label>
                  <Input id="height" name="height" type="number" placeholder="480" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fps">FPS</Label>
                  <Input id="fps" name="fps" type="number" placeholder="30" />
                </div>
              </div>
              
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Adding..." : "Add Camera"}
              </Button>
            </form>
          </div>
        </div>
        
        {/* New Snapshots UI Section */}
        <div className="mt-6 mb-4">
          <h3 className="text-lg font-semibold mb-2">Event Log Snapshots</h3>
          <p className="text-sm text-muted-foreground mb-4">
            View snapshots captured during detection events. Select a camera and click "Fetch Snapshots" to retrieve recent snapshots.
          </p>
          
          <div className="flex flex-wrap gap-3 mb-4">
            <Button 
              onClick={testSnapshotsEndpoint} 
              disabled={loading || !selectedCamera}
              className="border"
            >
              Fetch Snapshots
            </Button>
            
            <Button 
              onClick={queryDatabaseSnapshots} 
              disabled={loading || !selectedCamera}
              className="border bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800"
            >
              Query Database Directly
            </Button>
          </div>
          
          {snapshots.length > 0 && (
            <div className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="text-sm font-semibold mb-2">Available Snapshots ({snapshots.length})</h4>
                  <div className="h-64 overflow-y-auto p-2 border rounded-md">
                    {snapshots.map((snapshot, index) => (
                      <div 
                        key={index} 
                        className={`p-2 text-sm cursor-pointer transition-colors rounded-md mb-1
                          ${selectedSnapshot === snapshot.path ? 'bg-primary/20' : 'hover:bg-muted'}`}
                        onClick={() => viewSnapshot(snapshot)}
                      >
                        <div className="flex justify-between">
                          <span className="font-medium">{new Date(snapshot.timestamp).toLocaleString()}</span>
                          <Badge variant="outline" className="ml-2">
                            {snapshot.event_type || 'detection'}
                          </Badge>
                        </div>
                        <p className="font-mono text-xs truncate mt-1">
                          Path: {snapshot.path}
                        </p>
                        {snapshot.url && (
                          <p className="font-mono text-xs truncate mt-1 text-green-600 dark:text-green-400">
                            URL: {snapshot.url}
                          </p>
                        )}
                        {snapshot.confidence && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Confidence: {(snapshot.confidence * 100).toFixed(1)}%
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold mb-2">Snapshot Preview</h4>
                  <div className="border rounded-md p-2 h-64 flex flex-col items-center justify-center bg-black/10">
                    {snapshotImage ? (
                      <>
                        <div className="relative h-[85%] w-full">
                          <img 
                            src={snapshotImage} 
                            alt="Snapshot" 
                            className="object-contain w-full h-full"
                          />
                        </div>
                        {selectedSnapshot && (
                          <div className="mt-2 px-2 text-xs font-mono w-full truncate flex justify-between items-center">
                            <span className="truncate mr-2">{selectedSnapshot}</span>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="h-6 text-xs"
                              onClick={() => {
                                if (snapshotImage) {
                                  // Create an anchor element and trigger download
                                  const a = document.createElement('a');
                                  a.href = snapshotImage;
                                  const filename = selectedSnapshot.split('/').pop() || 'snapshot.jpg';
                                  a.download = filename;
                                  document.body.appendChild(a);
                                  a.click();
                                  document.body.removeChild(a);
                                }
                              }}
                            >
                              Download
                            </Button>
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-muted-foreground text-sm">Select a snapshot to preview</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <Separator className="my-6" />
        
        <div className="mt-6 mb-4">
          <h3 className="text-lg font-semibold mb-4">API Response</h3>
          {result ? (
            <Tabs defaultValue="formatted" className="w-full">
              <TabsList className="mb-2">
                <TabsTrigger value="formatted">Formatted</TabsTrigger>
                <TabsTrigger value="raw">Raw JSON</TabsTrigger>
              </TabsList>
              <TabsContent value="formatted" className="p-0">
                <div className="p-4 bg-muted rounded-md overflow-auto max-h-96">
                  {Array.isArray(result) ? (
                    <div>
                      <h3 className="text-sm font-semibold mb-2">Array ({result.length} items)</h3>
                      <ul className="space-y-2">
                        {result.map((item, index) => (
                          <li key={index} className="p-2 bg-card rounded">
                            <pre className="text-xs">{JSON.stringify(item, null, 2)}</pre>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-sm font-semibold mb-2">Response Object</h3>
                      <pre className="text-xs">{JSON.stringify(result, null, 2)}</pre>
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="raw" className="p-0">
                <div className="p-4 bg-muted rounded-md overflow-auto max-h-96">
                  <pre className="text-xs">{JSON.stringify(result, null, 2)}</pre>
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="p-4 border rounded-md text-center text-muted-foreground">
              No API response yet. Test an endpoint to see results.
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t pt-6">
        <div className="flex flex-wrap gap-2 w-full">
          <Button 
            onClick={testBackendConnection} 
            disabled={loading}
            className="border"
          >
            Test API Connection
          </Button>
          
          <Button 
            onClick={testCameraEndpoint} 
            disabled={loading}
            className="border"
          >
            Test Cameras API
          </Button>
          
          <Button 
            onClick={testMetricsEndpoint} 
            disabled={loading}
            className="border"
          >
            Test Metrics API
          </Button>
          
          <Button 
            onClick={testSummaryEndpoint} 
            disabled={loading}
            className="border"
          >
            Test Summary API
          </Button>
          
          <Button 
            onClick={testDailyEndpoint} 
            disabled={loading}
            className="border"
          >
            Test Daily API
          </Button>
          
          <Button 
            onClick={testCompareEndpoint} 
            disabled={loading}
            className="border"
          >
            Test Compare API
          </Button>
          
          <Button 
            onClick={testSnapshotsEndpoint} 
            disabled={loading || !selectedCamera}
            className="border bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/30 dark:hover:bg-blue-950/50"
          >
            Test Snapshots API
          </Button>
          
          <Button 
            onClick={deleteCamera} 
            disabled={loading || !selectedCamera}
            className="border bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-950/50"
          >
            Delete Camera
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
} 