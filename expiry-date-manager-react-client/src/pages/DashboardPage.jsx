import React, { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Clock, Search, Filter, Plus, ChevronLeft, ChevronRight, Edit3, Trash2, 
  AlertTriangle, ShieldCheck, AlertCircle, Barcode, RefreshCw, LogOut, Package
} from 'lucide-react'
import { getProducts, updateProduct, deleteProduct } from '../services/productService'
import { getCurrentUser, logoutUser } from '../services/authService'
import EditProductModal from '../components/EditProductModal'
import DeleteConfirmModal from '../components/DeleteConfirmModal'

const DashboardPage = () => {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(null)
  const [products, setProducts] = useState([])
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    pageSize: 20,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false
  })
  
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('')
  const [expiryFilter, setExpiryFilter] = useState('all') // 'all' | '1month' | '3months' | 'expired'
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  // Modals state
  const [editingProduct, setEditingProduct] = useState(null)
  const [deletingProduct, setDeletingProduct] = useState(null)

  // Quick Metrics
  const [stats, setStats] = useState({
    total: 0,
    expired: 0,
    expiringSoon: 0,
    safe: 0
  })

  // Check auth user session
  useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrentUser()
      if (!user) {
        navigate('/login')
      } else {
        setCurrentUser(user)
      }
    }
    fetchUser()
  }, [navigate])

  // Fetch paginated products
  const fetchProductsList = useCallback(async () => {
    setIsLoading(true)
    setErrorMessage('')
    try {
      const response = await getProducts({
        page,
        limit: 20,
        search: searchTerm,
        expiryFilter
      })
      if (response.success) {
        const fetchedProducts = response.data.products || []
        setProducts(fetchedProducts)
        setPagination(response.data.pagination || {})

        // Compute summary metrics for current dataset
        const now = new Date()
        const thirtyDaysFromNow = new Date()
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)

        let expCount = 0
        let soonCount = 0
        let safeCount = 0

        fetchedProducts.forEach(p => {
          const expDate = new Date(p.expiryDate)
          if (expDate < now) {
            expCount++
          } else if (expDate <= thirtyDaysFromNow) {
            soonCount++
          } else {
            safeCount++
          }
        })

        setStats({
          total: response.data.pagination?.totalItems || fetchedProducts.length,
          expired: expCount,
          expiringSoon: soonCount,
          safe: safeCount
        })
      }
    } catch (error) {
      setErrorMessage(error.message || 'Failed to load products')
    } finally {
      setIsLoading(false)
    }
  }, [page, searchTerm, expiryFilter])

  useEffect(() => {
    fetchProductsList()
  }, [fetchProductsList])

  const handleLogout = async () => {
    try {
      await logoutUser()
      navigate('/login')
    } catch (error) {
      navigate('/login')
    }
  }

  // Handle inline Edit Save
  const handleSaveEdit = async (id, updatedData) => {
    await updateProduct(id, updatedData)
    fetchProductsList()
  }

  // Handle Delete
  const handleConfirmDelete = async (id) => {
    await deleteProduct(id)
    fetchProductsList()
  }

  // Calculate status pill style
  const getStatusBadge = (expiryDateStr) => {
    const now = new Date()
    const expDate = new Date(expiryDateStr)
    const diffTime = expDate - now
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-950/80 text-red-400 border border-red-800/60">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Expired ({Math.abs(diffDays)}d ago)</span>
        </span>
      )
    } else if (diffDays <= 30) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-950/80 text-amber-400 border border-amber-800/60">
          <Clock className="w-3.5 h-3.5" />
          <span>Expiring in {diffDays} days</span>
        </span>
      )
    } else {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Fresh ({diffDays} days left)</span>
        </span>
      )
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950 pb-20">
      
      {/* Dynamic background ambient glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-[30rem] h-[30rem] bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-40 w-[30rem] h-[30rem] bg-emerald-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Navigation Header */}
        <header className="flex items-center justify-between py-4 border-b border-slate-800/80 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20">
              <Clock className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-white">Expiry Manager</h1>
              <p className="text-xs text-slate-400">Inventory Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {currentUser && (
              <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-300 bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-800">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>{currentUser.email}</span>
              </div>
            )}

            <Link
              to="/add-product"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-500/20 hover:shadow-amber-500/35 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add Product</span>
            </Link>

            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-red-400 border border-slate-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Dashboard Metric Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase text-slate-400">Total Items</span>
              <Package className="w-5 h-5 text-slate-400" />
            </div>
            <div className="text-3xl font-extrabold text-white">{stats.total}</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/90 border border-red-900/40 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase text-red-400">Expired</span>
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div className="text-3xl font-extrabold text-red-400">{stats.expired}</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/90 border border-amber-900/40 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase text-amber-400">Expiring Soon</span>
              <Clock className="w-5 h-5 text-amber-400" />
            </div>
            <div className="text-3xl font-extrabold text-amber-400">{stats.expiringSoon}</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/90 border border-emerald-900/40 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase text-emerald-400">Fresh / Safe</span>
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-3xl font-extrabold text-emerald-400">{stats.safe}</div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 mb-6 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setPage(1)
              }}
              placeholder="Search by title or UPC code..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 text-white placeholder-slate-500 text-sm outline-none transition-all"
            />
          </div>

          {/* Expiry Filter Pills */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs font-bold text-slate-400 uppercase mr-1 shrink-0 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            {[
              { id: 'all', label: 'All Products' },
              { id: '1month', label: 'Expiring 1 Mo' },
              { id: '3months', label: 'Expiring 3 Mo' },
              { id: 'expired', label: 'Expired' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => {
                  setExpiryFilter(f.id)
                  setPage(1)
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  expiryFilter === f.id
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {f.label}
              </button>
            ))}

            <button
              onClick={fetchProductsList}
              title="Refresh List"
              className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 border border-slate-800 shrink-0 ml-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-red-950/60 border border-red-800/50 flex items-center gap-3 text-red-300 text-sm">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Products Grid / Table */}
        {isLoading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-semibold text-slate-400">Loading products inventory...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 px-4 text-center bg-slate-900/50 border border-slate-800/80 rounded-3xl backdrop-blur-xl">
            <div className="w-16 h-16 rounded-2xl bg-slate-800/60 flex items-center justify-center text-slate-500 mx-auto mb-4">
              <Package className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">No products found</h3>
            <p className="text-sm text-slate-400 mb-6 max-w-sm mx-auto">
              No product items matched your search query or filter parameters. Try adding a new product.
            </p>
            <Link
              to="/add-product"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add Your First Product</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((item) => (
              <div
                key={item._id}
                className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-3xl p-5 shadow-xl transition-all hover:-translate-y-1 flex flex-col justify-between group"
              >
                <div>
                  {/* Status & Barcode pill */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    {getStatusBadge(item.expiryDate)}
                    {item.upcCode && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                        <Barcode className="w-3 h-3 text-amber-400" />
                        <span>{item.upcCode}</span>
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors mb-2 line-clamp-2">
                    {item.title}
                  </h3>

                  {/* Amount & Date Details */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs text-slate-400 mb-4">
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-slate-500">Amount</span>
                      <span className="font-bold text-slate-200">
                        {item.amount?.value} {item.amount?.currency}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="block text-[10px] uppercase font-bold text-slate-500">Expires On</span>
                      <span className="font-bold text-amber-300">
                        {new Date(item.expiryDate).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Edit / Delete Buttons next to each product */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800/60">
                  <button
                    onClick={() => setEditingProduct(item)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => setDeletingProduct(item)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-red-950/80 text-slate-400 hover:text-red-400 text-xs font-bold transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* Pagination Bar (Max 20 per page cap) */}
        {pagination.totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between px-4 py-3 bg-slate-900/80 border border-slate-800 rounded-2xl">
            <div className="text-xs text-slate-400 font-medium">
              Showing page <span className="font-bold text-white">{pagination.currentPage}</span> of{' '}
              <span className="font-bold text-white">{pagination.totalPages}</span> ({pagination.totalItems} total items)
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={!pagination.hasPrevPage}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-950 text-xs font-bold text-slate-300 hover:text-white border border-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev</span>
              </button>

              <span className="px-3 py-1 rounded-xl bg-amber-500 text-slate-950 text-xs font-extrabold">
                {pagination.currentPage}
              </span>

              <button
                disabled={!pagination.hasNextPage}
                onClick={() => setPage((prev) => prev + 1)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-950 text-xs font-bold text-slate-300 hover:text-white border border-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Edit Product Modal */}
      <EditProductModal
        isOpen={Boolean(editingProduct)}
        onClose={() => setEditingProduct(null)}
        product={editingProduct}
        onSave={handleSaveEdit}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingProduct)}
        onClose={() => setDeletingProduct(null)}
        product={deletingProduct}
        onDelete={handleConfirmDelete}
      />

    </div>
  )
}

export default DashboardPage
