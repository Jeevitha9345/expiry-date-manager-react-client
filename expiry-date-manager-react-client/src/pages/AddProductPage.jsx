import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Barcode, Search, PlusCircle, Calendar, DollarSign, Tag, CheckCircle2, AlertCircle, Sparkles, Camera } from 'lucide-react'
import { createProduct, lookupUpc } from '../services/productService'
import BarcodeScannerModal from '../components/BarcodeScannerModal'

const CURRENCIES = ['USD', 'EUR', 'INR', 'GBP', 'CAD', 'AUD', 'JPY']

const AddProductPage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    upcCode: '',
    title: '',
    value: '',
    currency: 'USD',
    expiryDate: '',
  })
  const [isSearchingUpc, setIsSearchingUpc] = useState(false)
  const [upcLookupStatus, setUpcLookupStatus] = useState(null) // { found: boolean, message: string }
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // Barcode Camera Modal state
  const [isScannerOpen, setIsScannerOpen] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (errorMessage) setErrorMessage('')
    if (upcLookupStatus) setUpcLookupStatus(null)
  }

  const performUpcLookup = async (codeToLookup) => {
    if (!codeToLookup || !codeToLookup.trim()) return
    setIsSearchingUpc(true)
    setUpcLookupStatus(null)
    setErrorMessage('')

    try {
      const response = await lookupUpc(codeToLookup.trim())
      if (response.data && response.data.found) {
        setFormData((prev) => ({
          ...prev,
          upcCode: codeToLookup.trim(),
          title: response.data.title || prev.title,
          value: response.data.amount?.value ?? prev.value,
          currency: response.data.amount?.currency || prev.currency,
        }))
        setUpcLookupStatus({
          found: true,
          message: 'Found existing product template! Auto-populated title and details.',
        })
      } else {
        setFormData((prev) => ({
          ...prev,
          upcCode: codeToLookup.trim(),
        }))
        setUpcLookupStatus({
          found: false,
          message: `Scanned UPC (${codeToLookup.trim()}). No previous entry found. Enter title & date manually.`,
        })
      }
    } catch (error) {
      setUpcLookupStatus({
        found: false,
        message: 'UPC lookup failed or item not found.',
      })
    } finally {
      setIsSearchingUpc(false)
    }
  }

  const handleLookupUpc = () => {
    performUpcLookup(formData.upcCode)
  }

  const handleBarcodeScanned = (scannedUpc) => {
    performUpcLookup(scannedUpc)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      await createProduct({
        upcCode: formData.upcCode.trim(),
        title: formData.title.trim(),
        amount: {
          value: parseFloat(formData.value) || 0,
          currency: formData.currency,
        },
        expiryDate: formData.expiryDate,
      })

      setSuccessMessage('Product added to inventory successfully!')
      setTimeout(() => {
        navigate('/dashboard')
      }, 1200)
    } catch (error) {
      setErrorMessage(error.message || 'Failed to add product.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16 selection:bg-amber-500 selection:text-slate-950">
      
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 pt-8">
        
        {/* Top Nav Link */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 text-sm font-semibold transition-all mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        {/* Card Frame */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          
          {/* Header */}
          <div className="flex items-center gap-4 pb-6 border-b border-slate-800/80 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20">
              <PlusCircle className="w-7 h-7 stroke-[2.2]" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-white">Add New Product</h1>
              <p className="text-xs text-slate-400">Scan UPC barcode or manually enter product parameters</p>
            </div>
          </div>

          {/* Feedback Alerts */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-2xl bg-red-950/60 border border-red-800/50 flex items-start gap-3 text-red-300 text-sm">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800/50 flex items-start gap-3 text-emerald-300 text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <span>{successMessage} Redirection in progress...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* UPC Barcode Section with Camera Scan & Manual Lookup */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  UPC Barcode
                </label>
                
                {/* Camera Scan Button */}
                <button
                  type="button"
                  onClick={() => setIsScannerOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-400 text-xs font-bold transition-all shadow-sm"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Scan with Camera</span>
                </button>
              </div>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Barcode className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="upcCode"
                    value={formData.upcCode}
                    onChange={handleChange}
                    placeholder="Scan barcode with camera or type UPC code..."
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-950 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-white placeholder-slate-500 text-sm font-mono transition-all outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleLookupUpc}
                  disabled={isSearchingUpc || !formData.upcCode.trim()}
                  className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-sm border border-slate-700/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                >
                  {isSearchingUpc ? (
                    <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      <span>Lookup</span>
                    </>
                  )}
                </button>
              </div>

              {upcLookupStatus && (
                <div
                  className={`mt-2.5 px-4 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2 ${
                    upcLookupStatus.found
                      ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/40'
                      : 'bg-slate-800/50 text-slate-400 border border-slate-700/50'
                  }`}
                >
                  <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>{upcLookupStatus.message}</span>
                </div>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Product Title *
              </label>
              <div className="relative">
                <Tag className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Organic Almond Milk 1L"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-950 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-white placeholder-slate-500 text-sm font-medium transition-all outline-none"
                />
              </div>
            </div>

            {/* Amount Value & Currency */}
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Amount / Quantity *
                </label>
                <div className="relative">
                  <DollarSign className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    name="value"
                    step="any"
                    required
                    min="0"
                    value={formData.value}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-950 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-white placeholder-slate-500 text-sm font-medium transition-all outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Currency
                </label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="w-full px-3 py-3.5 rounded-2xl bg-slate-950 border border-slate-800 focus:border-amber-500 text-amber-400 font-bold text-sm transition-all outline-none"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c} value={c} className="bg-slate-900 text-white">
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Expiry Date */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Expiration Date *
              </label>
              <div className="relative">
                <Calendar className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  name="expiryDate"
                  required
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-950 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-white text-sm font-medium transition-all outline-none [color-scheme:dark]"
                />
              </div>
            </div>

            {/* Submit & Cancel Actions */}
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800/80">
              <Link
                to="/dashboard"
                className="px-6 py-3.5 rounded-2xl text-slate-400 hover:text-white font-semibold text-sm transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/20 hover:shadow-amber-500/35 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <PlusCircle className="w-5 h-5" />
                    <span>Save Product</span>
                  </>
                )}
              </button>
            </div>

          </form>

        </div>

      </div>

      {/* Barcode Camera Scanner Modal */}
      <BarcodeScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={handleBarcodeScanned}
      />

    </div>
  )
}

export default AddProductPage
