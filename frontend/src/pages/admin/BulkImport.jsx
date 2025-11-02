import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Upload, Download, FileText, AlertCircle } from 'lucide-react'
import { adminService } from '../../services/api'
import toast from 'react-hot-toast'

export default function BulkImport() {
  const [activeTab, setActiveTab] = useState('books')
  const [importType, setImportType] = useState('csv')
  const [file, setFile] = useState(null)
  const [jsonData, setJsonData] = useState('')
  const queryClient = useQueryClient()

  const importMutation = useMutation({
    mutationFn: ({ type, file, jsonData }) => {
      if (importType === 'json') {
        return adminService.bulkImportJSON(type, JSON.parse(jsonData))
      } else {
        const formData = new FormData()
        formData.append('file', file)
        return adminService.bulkImport(type, formData)
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['admin-books'])
      queryClient.invalidateQueries(['admin-categories'])
      const result = data.data
      toast.success(`Successfully imported ${result.imported} out of ${result.total} ${activeTab}`)
      if (result.errors && result.errors.length > 0) {
        toast.error(`${result.errors.length} errors occurred. Check console for details.`)
        console.error('Import errors:', result.errors)
      }
      setFile(null)
    },
    onError: (error) => {
      console.error('Import error:', error.response?.data)
      toast.error(error.response?.data?.message || 'Import failed')
    }
  })

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile)
    } else {
      toast.error('Please select a CSV file')
    }
  }

  const handleImport = () => {
    if (importType === 'csv' && !file) {
      toast.error('Please select a file')
      return
    }
    if (importType === 'json' && !jsonData.trim()) {
      toast.error('Please enter JSON data')
      return
    }
    importMutation.mutate({ type: activeTab, file, jsonData })
  }

  const downloadTemplate = (type) => {
    adminService.downloadTemplate(type)
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `${type}_template.csv`)
        document.body.appendChild(link)
        link.click()
        link.remove()
      })
      .catch(() => toast.error('Failed to download template'))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center">
            <Upload className="h-10 w-10 mr-3 text-blue-600" />
            Bulk Import
          </h1>
          <p className="text-gray-600">Import books and categories in bulk using CSV or JSON</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-xl mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-2xl">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('books')}
                className={`px-8 py-4 font-bold text-lg rounded-tl-2xl transition-all ${
                  activeTab === 'books'
                    ? 'bg-white text-blue-600 shadow-lg'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Import Books
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className={`px-8 py-4 font-bold text-lg transition-all ${
                  activeTab === 'categories'
                    ? 'bg-white text-blue-600 shadow-lg rounded-tr-2xl'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Import Categories
              </button>
            </nav>
          </div>

          <div className="p-8">
            {/* Import Type Selection */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4 text-gray-900">Choose Import Method</h3>
              <div className="grid grid-cols-2 gap-4">
                <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  importType === 'csv' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    value="csv"
                    checked={importType === 'csv'}
                    onChange={(e) => setImportType(e.target.value)}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-semibold">CSV File</div>
                    <div className="text-sm text-gray-600">Upload a CSV file</div>
                  </div>
                </label>
                <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  importType === 'json' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    value="json"
                    checked={importType === 'json'}
                    onChange={(e) => setImportType(e.target.value)}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-semibold">JSON Data</div>
                    <div className="text-sm text-gray-600">Paste JSON directly</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 mb-8">
              <div className="flex items-start">
                <AlertCircle className="h-6 w-6 text-blue-600 mt-1 mr-4" />
                <div>
                  <h3 className="text-xl font-bold text-blue-900 mb-3">Import Instructions</h3>
                  <ul className="text-blue-800 space-y-2">
                    <li className="flex items-center"><span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>Download the CSV template first</li>
                    <li className="flex items-center"><span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>Fill in your data following the template format</li>
                    <li className="flex items-center"><span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>Upload the completed CSV file</li>
                    {activeTab === 'books' && (
                      <li className="flex items-center"><span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>Categories must exist in database before importing books</li>
                    )}
                    {activeTab === 'categories' && (
                      <li className="flex items-center"><span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>Category names must be unique</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* Template Download */}
            <div className="mb-8">
              <button
                onClick={() => downloadTemplate(activeTab)}
                className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 rounded-xl font-bold hover:from-green-700 hover:to-green-800 flex items-center shadow-lg transition-all"
              >
                <Download className="h-5 w-5 mr-3" />
                Download {activeTab === 'books' ? 'Books' : 'Categories'} Template
              </button>
            </div>

            {/* Import Input */}
            {importType === 'csv' ? (
              <div className="border-2 border-dashed border-blue-300 rounded-2xl p-12 text-center bg-blue-50/50 hover:bg-blue-50 transition-colors">
                <FileText className="h-16 w-16 text-blue-400 mx-auto mb-6" />
                <div className="mb-6">
                  <label className="cursor-pointer">
                    <span className="text-blue-600 hover:text-blue-700 font-bold text-lg">
                      Choose CSV file
                    </span>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  <span className="text-gray-600 text-lg"> or drag and drop</span>
                </div>
                {file && (
                  <div className="bg-white p-4 rounded-xl mb-4 inline-block">
                    <span className="font-semibold text-green-600">Selected: {file.name}</span>
                  </div>
                )}
                <p className="text-gray-500">CSV files only</p>
              </div>
            ) : (
              <div>
                <label className="block text-lg font-bold mb-4 text-gray-900">Paste JSON Data:</label>
                <textarea
                  value={jsonData}
                  onChange={(e) => setJsonData(e.target.value)}
                  placeholder={activeTab === 'books' ? 
                    '[{"title":"Book Title","authors":["Author Name"],"description":"Description","price":999,"stock":50,"categories":["Fiction"]}]' :
                    '[{"name":"Category Name","description":"Category description"}]'
                  }
                  rows={10}
                  className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            {/* Import Button */}
            <div className="mt-8">
              <button
                onClick={handleImport}
                disabled={(importType === 'csv' && !file) || (importType === 'json' && !jsonData.trim()) || importMutation.isPending}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 flex items-center shadow-lg transition-all text-lg"
              >
                <Upload className="h-5 w-5 mr-3" />
                {importMutation.isPending ? 'Importing...' : `Import ${activeTab === 'books' ? 'Books' : 'Categories'}`}
              </button>
            </div>
          </div>
        </div>

        {/* Sample Data Format */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Sample Data Format</h2>
          {activeTab === 'books' ? (
            <div className="overflow-x-auto">
              <div className="overflow-x-auto">
                <table className="w-full text-sm border border-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="border border-gray-200 px-3 py-2 text-left">title</th>
                      <th className="border border-gray-200 px-3 py-2 text-left">authors</th>
                      <th className="border border-gray-200 px-3 py-2 text-left">description</th>
                      <th className="border border-gray-200 px-3 py-2 text-left">price</th>
                      <th className="border border-gray-200 px-3 py-2 text-left">stock</th>
                      <th className="border border-gray-200 px-3 py-2 text-left">categories</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-200 px-3 py-2">Sample Book</td>
                      <td className="border border-gray-200 px-3 py-2">Author Name</td>
                      <td className="border border-gray-200 px-3 py-2">Book description</td>
                      <td className="border border-gray-200 px-3 py-2">999</td>
                      <td className="border border-gray-200 px-3 py-2">50</td>
                      <td className="border border-gray-200 px-3 py-2">Fiction</td>
                    </tr>
                  </tbody>
                </table>
                <p className="text-xs text-gray-500 mt-2">
                  <strong>Note:</strong> Categories must exist in database. Optional fields: publisher, language, format, pages, isbn, featured, bestseller
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border border-gray-200 px-3 py-2 text-left">name</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-200 px-3 py-2">Science Fiction</td>
                    <td className="border border-gray-200 px-3 py-2">Books about future technology and space</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}