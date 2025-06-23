import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { PDFDocument, rgb } from 'pdf-lib';
import { useNavigate } from 'react-router-dom';
export default function Dashboard() {
  const { user, logout } = useAuth();
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfPreview, setPdfPreview] = useState(null);
  const [signatureText, setSignatureText] = useState('');
  const [signaturePosition, setSignaturePosition] = useState({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [modifiedPdf, setModifiedPdf] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const canvasRef = useRef(null);
  const pdfContainerRef = useRef(null);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      generatePdfPreview(file);
    } else {
      alert('Please select a PDF file');
    }
  };
  const navigate = useNavigate()

  // Generate PDF preview
  const generatePdfPreview = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const firstPage = pdfDoc.getPages()[0];
      const { width, height } = firstPage.getSize();
      
      // Create canvas for preview
      const canvas = canvasRef.current;
      canvas.width = width;
      canvas.height = height;
      
      // Store PDF dimensions for positioning
      setPdfPreview({ width, height });
    } catch (error) {
      console.error('Error generating preview:', error);
      alert('Failed to load PDF');
    }
  };

  // Handle signature drag
  const handleMouseDown = (e) => {
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !pdfPreview) return;
    
    const container = pdfContainerRef.current;
    const rect = container.getBoundingClientRect();
    const scaleX = pdfPreview.width / rect.width;
    const scaleY = pdfPreview.height / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = pdfPreview.height - (e.clientY - rect.top) * scaleY; // PDF coordinates start from bottom
    
    setSignaturePosition({ x, y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add signature to PDF
  const handleAddSignature = async () => {
    if (!pdfFile || !signatureText) {
      alert('Please select a PDF file and enter signature text');
      return;
    }
    setIsLoading(true);
    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      // Add signature at the current position
      firstPage.drawText(signatureText, {
        x: signaturePosition.x,
        y: signaturePosition.y,
        size: 30,
        color: rgb(0, 0, 0),
      });
      // Save the modified PDF
      const modifiedPdfBytes = await pdfDoc.save();
      setModifiedPdf(new Blob([modifiedPdfBytes], { type: 'application/pdf' }));
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add signature to PDF');
    } finally {
      setIsLoading(false);
    }
  };

  // Download PDF
  const handleDownload = () => {
    if (modifiedPdf) {
      const url = URL.createObjectURL(modifiedPdf);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'signed-document.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  // Draw preview
  useEffect(() => {
    if (!pdfPreview || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw PDF placeholder (in a real app, you'd render the actual PDF)
    if (pdfFile) {
      const renderPDF = async () => {
        const arrayBuffer = await pdfFile.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const firstPage = pdfDoc.getPages()[0];
        const { width, height } = firstPage.getSize();
        
        // Draw PDF content (simplified for example)
        ctx.fillStyle = '#f3f4f6';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = '#000';
        ctx.font = '20px Arial';
        ctx.fillText('PDF Content', 50, 50);
      };
      renderPDF();
    }
    
    // Draw signature
    if (signatureText) {
      ctx.font = '30px Arial';
      ctx.fillText(signatureText, signaturePosition.x, canvas.height - signaturePosition.y);
    }
  }, [pdfPreview, signatureText, signaturePosition, pdfFile]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-purple-900">
      <nav className="bg-black bg-opacity-30 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div onClick={()=>{navigate("/")}} className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-white">Mr. Signify</h1>
              </div>
            </div>
            <div className="flex items-center">
               <span className="text-purple-200  mr-2">Welcome,</span>
              <span className="text-purple-200 rounded-full border-2 p-2 mr-4">{user?.userName}</span>
              <button
                onClick={logout}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 transition-all duration-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-2 border-purple-500/20 bg-black bg-opacity-20 backdrop-blur-sm rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-white">PDF Editor with Draggable Signature</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-1">
                  Select PDF File
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-purple-200 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-600/50 file:text-white hover:file:bg-purple-700/50"
                />
              </div>
              <div>
                <label htmlFor="signature" className="block text-sm font-medium text-purple-200 mb-1">
                  Signature Text
                </label>
                <input
                  type="text"
                  id="signature"
                  value={signatureText}
                  onChange={(e) => setSignatureText(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-purple-500/30 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 bg-black/30 text-white"
                  placeholder="Enter your signature text"
                />
              </div>
              {pdfFile && (
                <div 
                  ref={pdfContainerRef}
                  className="relative border-2 border-purple-500/20 rounded-md overflow-auto max-h-96 bg-white"
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  <canvas
                    ref={canvasRef}
                    className="w-full h-full"
                  />
                  {signatureText && (
                    <div className="absolute top-0 left-0 w-full h-full cursor-move"
                      onMouseDown={handleMouseDown}
                    >
                      <div 
                        className="absolute text-black text-2xl font-bold cursor-move"
                        style={{
                          left: `${(signaturePosition.x / pdfPreview.width) * 100}%`,
                          top: `${100 - (signaturePosition.y / pdfPreview.height) * 100}%`,
                          transform: 'translate(-50%, -50%)'
                        }}
                      >
                        {signatureText}
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div className="flex space-x-4">
                <button
                  onClick={handleAddSignature}
                  disabled={isLoading || !pdfFile || !signatureText}
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 transition-all duration-300"
                >
                  {isLoading ? 'Processing...' : 'Add Signature to PDF'}
                </button>
                {modifiedPdf && (
                  <button
                    onClick={handleDownload}
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-300"
                  >
                    Download Signed PDF
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}