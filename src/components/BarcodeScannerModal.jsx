import React, { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { Camera, X, RefreshCw, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react'

const BarcodeScannerModal = ({ isOpen, onClose, onScanSuccess }) => {
  const [scannerError, setScannerError] = useState('')
  const [cameras, setCameras] = useState([])
  const [selectedCameraId, setSelectedCameraId] = useState('')
  const [isScanning, setIsScanning] = useState(false)
  const html5QrcodeRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return

    let isMounted = true

    const startScanner = async () => {
      setScannerError('')
      try {
        const devices = await Html5Qrcode.getCameras()
        if (!isMounted) return

        if (devices && devices.length > 0) {
          setCameras(devices)
          // Prefer back camera if available
          const backCamera = devices.find(
            (d) => d.label.toLowerCase().includes('back') || d.label.toLowerCase().includes('environment')
          )
          const chosenCameraId = backCamera ? backCamera.id : devices[0].id
          setSelectedCameraId(chosenCameraId)

          await initHtml5Qrcode(chosenCameraId)
        } else {
          setScannerError('No camera found on your device. Please connect a webcam or use a mobile camera.')
        }
      } catch (err) {
        if (!isMounted) return
        setScannerError('Camera access denied or unreadable. Please grant camera permission in your browser settings.')
      }
    }

    startScanner()

    return () => {
      isMounted = false
      stopScanner()
    }
  }, [isOpen])

  const initHtml5Qrcode = async (cameraId) => {
    try {
      if (html5QrcodeRef.current && html5QrcodeRef.current.isScanning) {
        await html5QrcodeRef.current.stop()
      }

      const html5Qrcode = new Html5Qrcode('barcode-reader-container')
      html5QrcodeRef.current = html5Qrcode

      const config = {
        fps: 15,
        qrbox: { width: 280, height: 160 },
        aspectRatio: 1.777778,
      }

      setIsScanning(true)

      await html5Qrcode.start(
        cameraId,
        config,
        (decodedText, decodedResult) => {
          // Barcode successfully scanned!
          if (decodedText) {
            playBeep()
            onScanSuccess(decodedText)
            stopScanner()
            onClose()
          }
        },
        (errorMessage) => {
          // Frame by frame parse errors are expected until code is centered
        }
      )
    } catch (error) {
      setScannerError('Failed to initialize video stream: ' + error.message)
      setIsScanning(false)
    }
  }

  const stopScanner = async () => {
    if (html5QrcodeRef.current) {
      try {
        if (html5QrcodeRef.current.isScanning) {
          await html5QrcodeRef.current.stop()
        }
        await html5QrcodeRef.current.clear()
      } catch (e) {
        // Ignore stop errors
      }
      html5QrcodeRef.current = null
      setIsScanning(false)
    }
  }

  const handleCameraChange = async (e) => {
    const newCameraId = e.target.value
    setSelectedCameraId(newCameraId)
    if (newCameraId) {
      await initHtml5Qrcode(newCameraId)
    }
  }

  // Play audio beep indicator on barcode scan
  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
      const osc = audioCtx.createOscillator()
      const gain = audioCtx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(880, audioCtx.currentTime)
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime)
      osc.connect(gain)
      gain.connect(audioCtx.destination)
      osc.start()
      osc.stop(audioCtx.currentTime + 0.15)
    } catch (e) {
      // Audio fallback
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-800 animate-scaleUp text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Live Barcode Camera Scanner</h3>
              <p className="text-xs text-slate-400">Point your camera at any UPC / EAN product barcode</p>
            </div>
          </div>
          <button
            onClick={() => {
              stopScanner()
              onClose()
            }}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Viewport Container */}
        <div className="p-6">
          
          {scannerError ? (
            <div className="p-6 text-center bg-red-950/40 border border-red-800/50 rounded-2xl">
              <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-red-200 mb-1">Camera Permission / Device Error</h4>
              <p className="text-xs text-red-300/80 mb-4">{scannerError}</p>
              <button
                onClick={() => {
                  if (selectedCameraId) initHtml5Qrcode(selectedCameraId)
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-900/60 hover:bg-red-800 text-white font-semibold text-xs transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Camera Permission</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              
              {/* Camera Selector dropdown if multiple cameras */}
              {cameras.length > 1 && (
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="text-slate-400 font-semibold">Select Camera:</span>
                  <select
                    value={selectedCameraId}
                    onChange={handleCameraChange}
                    className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-amber-400 text-xs font-bold outline-none"
                  >
                    {cameras.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label || `Camera ${c.id}`}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Barcode scanner camera viewport */}
              <div className="relative overflow-hidden rounded-2xl border-2 border-slate-800 bg-slate-950 min-h-[220px]">
                <div id="barcode-reader-container" className="w-full h-full"></div>

                {/* Laser animation overlay */}
                {isScanning && (
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <div className="w-[280px] h-[140px] border-2 border-amber-400/80 rounded-xl relative shadow-[0_0_15px_rgba(245,158,11,0.3)] overflow-hidden">
                      <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_8px_#f59e0b] animate-scanLine"></div>
                    </div>
                    <span className="mt-3 text-[11px] font-bold text-amber-400 tracking-wider uppercase bg-slate-950/80 px-3 py-1 rounded-full border border-amber-500/30">
                      Align barcode within frame
                    </span>
                  </div>
                )}
              </div>

              {/* Helpful hardware tip */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  <strong>Tip:</strong> You can also plug in any standard handheld USB or Bluetooth barcode scanner gun. It will auto-fill the field instantly!
                </span>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  )
}

export default BarcodeScannerModal
