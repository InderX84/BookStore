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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 flex items-center">
          <Upload className="h-8 w-8 mr-3" />
          Bulk Import
        </h1>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('books')}
                className={`px-6 py-3 font-medium ${
                  activeTab === 'books'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Import Books
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className={`px-6 py-3 font-medium ${
                  activeTab === 'categories'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Import Categories
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Import Type Selection */}
            <div className="mb-6">
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="csv"
                    checked={importType === 'csv'}
                    onChange={(e) => setImportType(e.target.value)}
                    className="mr-2"
                  />
                  CSV File
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="json"
                    checked={importType === 'json'}
                    onChange={(e) => setImportType(e.target.value)}
                    className="mr-2"
                  />
                  JSON Data
                </label>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                <div>
                  <h3 className="font-medium text-blue-900 mb-2">Import Instructions</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Download the CSV template first</li>
                    <li>• Fill in your data following the template format</li>
                    <li>• Upload the completed CSV file</li>
                    {activeTab === 'books' && (
                      <li>• Categories must exist in database before importing books</li>
                    )}
                    {activeTab === 'categories' && (
                      <li>• Category names must be unique</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* Template Download */}
            <div className="mb-6">
              <button
                onClick={() => downloadTemplate(activeTab)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Download {activeTab === 'books' ? 'Books' : 'Categories'} Template
              </button>
            </div>

            {/* Import Input */}
            {importType === 'csv' ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <div className="mb-4">
                  <label className="cursor-pointer">
                    <span className="text-blue-600 hover:text-blue-700 font-medium">
                      Choose CSV file
                    </span>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  <span className="text-gray-600"> or drag and drop</span>
                </div>
                {file && (
                  <div className="text-sm text-gray-600 mb-4">
                    Selected: {file.name}
                  </div>
                )}
                <p className="text-xs text-gray-500">CSV files only</p>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium mb-2">Paste JSON Data:</label>
                <textarea
                  value={jsonData}
                  onChange={(e) => setJsonData(e.target.value)}
                  placeholder={activeTab === 'books' ? 
                    '[{"title":"Book Title","authors":["Author Name"],"description":"Description","price":999,"stock":50,"categories":["Fiction"]}]' :
                    '[{"name":"Category Name","description":"Category description"}]'
                  }
                  rows={8}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 font-mono text-sm"
                />
              </div>
            )}

            {/* Import Button */}
            <div className="mt-6">
              <button
                onClick={handleImport}
                disabled={(importType === 'csv' && !file) || (importType === 'json' && !jsonData.trim()) || importMutation.isPending}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
              >
                <Upload className="h-4 w-4 mr-2" />
                {importMutation.isPending ? 'Importing...' : `Import ${activeTab === 'books' ? 'Books' : 'Categories'}`}
              </button>
            </div>
          </div>
        </div>

        {/* Sample Data Format */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Sample Data Format</h2>
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