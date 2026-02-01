export default function PdfToPptxPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-white rounded-2xl shadow-xl p-12">
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mx-auto flex items-center justify-center">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            PDF to PPTX Converter
          </h1>
          
          <div className="inline-block bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-3 rounded-full text-xl font-semibold mb-6">
            Coming Soon
          </div>
          
          <p className="text-gray-600 text-lg mb-8">
            We're working hard to bring you this amazing tool. Convert your PDF files to PowerPoint presentations with ease!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/tools" className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Back to Tools
            </a>
            <a href="/" className="border-2 border-gray-900 hover:bg-gray-900 hover:text-white text-gray-900 px-8 py-3 rounded-lg font-semibold transition-colors">
              Go to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
