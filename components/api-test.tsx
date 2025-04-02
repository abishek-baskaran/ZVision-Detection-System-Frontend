"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { detectionService, cameraService, metricsService, analyticsService } from "@/lib/services"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ApiTest() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<any | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [endpoint, setEndpoint] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState<string>("7d")
  const [cameras, setCameras] = useState<any[]>([])
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null)

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
        
        {result && (
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
        )}
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        <div className="w-full mb-2 p-2 bg-muted/50 rounded-lg">
          <h3 className="text-sm font-semibold mb-2">General Endpoints</h3>
          <div className="flex flex-wrap gap-2">
            <Button onClick={testBackendConnection} disabled={loading}>
              Status
            </Button>
            <Button onClick={testCameraEndpoint} disabled={loading}>
              Cameras
            </Button>
          </div>
        </div>
        
        <div className="w-full p-2 bg-primary/10 rounded-lg">
          <h3 className="text-sm font-semibold mb-2">Dashboard Endpoints</h3>
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={testMetricsEndpoint} 
              disabled={loading} 
              className="border border-input bg-background hover:bg-accent hover:text-accent-foreground border-primary/40 hover:bg-primary/20"
            >
              Metrics
            </Button>
            <Button 
              onClick={testSummaryEndpoint} 
              disabled={loading} 
              className="border border-input bg-background hover:bg-accent hover:text-accent-foreground border-primary/40 hover:bg-primary/20"
            >
              Summary
            </Button>
            <Button 
              onClick={testDailyEndpoint} 
              disabled={loading} 
              className="border border-input bg-background hover:bg-accent hover:text-accent-foreground border-primary/40 hover:bg-primary/20"
            >
              Daily
            </Button>
            <Button 
              onClick={testCompareEndpoint} 
              disabled={loading} 
              className="border border-input bg-background hover:bg-accent hover:text-accent-foreground border-primary/40 hover:bg-primary/20"
            >
              Compare
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
} 