'use client';
import { useState, use, Fragment } from 'react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { products } from '@/data/products';
import { notFound } from 'next/navigation';

const TABS = [
  { label: 'Overview', value: 'overview' },
  { label: 'Specs & Templates', value: 'specs' },
  { label: 'Size Charts', value: 'size' },
  { label: 'FAQ', value: 'faq' },
];

const FAQS = [
  { q: 'Can I order a single custom polo t-shirt?', a: 'Yes, you can order even a single piece with your custom design.' },
  { q: 'What file formats do you accept for uploads?', a: 'We recommend high-resolution PNG, JPG, or vector PDF files for best results.' },
  { q: 'How long does delivery take?', a: 'Standard delivery is 5-7 business days after order confirmation.' },
];

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Fix for handleFileChange event type
type FileChangeEvent = React.ChangeEvent<HTMLInputElement>;

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = use(params);
  const product = products.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  const discountedPrice = product.isSale && product.discount
    ? product.price - (product.price * product.discount / 100)
    : null;

  const [selectedColor, setSelectedColor] = useState(product.colors ? product.colors[0] : { name: '', hex: '' });
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedImage, setSelectedImage] = useState(product.images ? product.images[0] : product.image);
  const [showBrowseModal, setShowBrowseModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  // WhatsApp share handler
  const handleWhatsAppShare = () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const text = `Check out this product: ${product.name} - ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Upload handler
  const handleFileChange = (e: FileChangeEvent) => {
    const file = e.target.files && e.target.files[0];
    setUploadedFile(file || null);
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setUploadedPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setUploadedPreview(null);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Product Image */}
          <div className="lg:w-1/2 w-full flex flex-col items-center">
            <div className="bg-white rounded-lg overflow-hidden shadow-md w-full flex justify-center items-center" style={{ minHeight: 320 }}>
              <Image
                src={selectedImage}
                alt={product.name}
                width={400}
                height={400}
                className="object-contain max-h-[320px] w-auto"
              />
            </div>
            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 mt-4 flex-wrap justify-center">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    className={`w-12 h-12 rounded overflow-hidden border ${selectedImage === img ? 'border-blue-500' : 'border-gray-200'} flex items-center justify-center bg-gray-50 focus:outline-none`}
                    onClick={() => setSelectedImage(img)}
                    aria-label={`Thumbnail ${i + 1}`}
                  >
                    <Image src={img} alt={product.name + ' thumb'} width={48} height={48} className="object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="lg:w-1/2 w-full flex flex-col gap-4 sticky top-8 self-start mt-6 lg:mt-0">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <ul className="text-gray-700 text-sm mb-2 list-disc pl-5 space-y-1">
              <li>Customise with Name and Logo</li>
              <li>Multi Customisation on Polo T-shirt? <a href="#" className="text-blue-600 underline">Explore here</a></li>
              <li>Regular fit with 3 high gloss solid buttons</li>
              <li>Soft fashion knit collar, ribbed double-needle cross stitch for sleeves and bottom hem</li>
              <li>T-shirt tolerance level for chest circumference & body length is ± 5%</li>
              <li>Made with color-fast ink and can withstand normal wash cycles</li>
              <li>Need help in designing? <a href="#" className="text-blue-600 underline">Design Services</a></li>
              <li>If you want a blank product, type a dot "." in the upload design section and proceed.</li>
            </ul>
            <button
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md w-fit mb-2"
              onClick={handleWhatsAppShare}
            >
              <svg viewBox="0 0 32 32" width="20" height="20" fill="currentColor"><path d="M16 3C9.373 3 4 8.373 4 15c0 2.637.857 5.08 2.333 7.09L4.06 28.94a1 1 0 001.414 1.414l6.85-2.273A12.94 12.94 0 0016 27c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 22c-1.8 0-3.53-.37-5.09-1.04a1 1 0 00-.74-.04l-5.01 1.66 1.66-5.01a1 1 0 00-.04-.74A9.96 9.96 0 016 15c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10zm-2-13a1 1 0 00-1 1v4a1 1 0 00.293.707l3 3a1 1 0 001.414-1.414L15 15.586V13a1 1 0 00-1-1z" /></svg>
              Share design on WhatsApp
            </button>
            <div className="text-gray-700 text-sm mb-2">
              <span className="font-semibold">Cash on Delivery available</span><br />
              <span>Price below is MRP (inclusive of all taxes)</span>
            </div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="font-semibold">Substrate Color</span>
              {product.colors && product.colors.map((colorObj, i) => (
                <button
                  key={typeof colorObj === 'string' ? colorObj : colorObj.name}
                  className={`w-6 h-6 rounded-full border-2 ${selectedColor && selectedColor.name === (typeof colorObj === 'string' ? colorObj : colorObj.name) ? 'border-gray-900' : 'border-gray-200'} mr-1`}
                  style={{ backgroundColor: typeof colorObj === 'string' ? colorObj : colorObj.hex }}
                  onClick={() => setSelectedColor(typeof colorObj === 'string' ? { name: colorObj, hex: colorObj } : colorObj)}
                  aria-label={typeof colorObj === 'string' ? colorObj : colorObj.name}
                />
              ))}
              {selectedColor && selectedColor.name && (
                <span className="ml-2 text-gray-700 text-sm">{selectedColor.name}</span>
              )}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Quantity</span>
              <select
                className="ml-2 border border-gray-300 rounded px-2 py-1"
                value={quantity}
                onChange={e => setQuantity(Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5, 10, 25, 50, 100].map(q => (
                  <option key={q} value={q}>{q} ({discountedPrice ? `₹${discountedPrice}` : `₹${product.price}`} / unit)</option>
                ))}
              </select>
            </div>
            <div className="mb-2 text-gray-700 text-sm">1 starting at ₹{discountedPrice ? discountedPrice : product.price}</div>
            <div className="flex flex-col gap-2 mb-2">
              <button
                className="bg-blue-400 text-white px-4 py-2 rounded-md font-medium"
                onClick={() => setShowBrowseModal(true)}
              >
                Browse designs<br /><span className="text-xs font-normal">Choose one of our templates</span>
              </button>
              <button
                className="bg-white border border-gray-300 text-gray-900 px-4 py-2 rounded-md font-medium flex items-center gap-2"
                onClick={() => setShowUploadModal(true)}
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" /></svg>
                Upload design<br /><span className="text-xs font-normal">Have a design? Upload and edit it</span>
              </button>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M8 12l2 2 4-4" /></svg>
              100% satisfaction guaranteed
            </div>
          </div>
        </div>
        {/* Tabs Section */}
        <div className="mt-10 bg-white rounded-lg shadow-md p-4 sm:p-6">
          <div className="flex gap-4 sm:gap-8 border-b border-gray-200 mb-6 overflow-x-auto">
            {TABS.map(tab => (
              <button
                key={tab.value}
                className={`pb-2 px-2 text-sm font-medium border-b-2 transition-colors duration-200 ${activeTab === tab.value ? 'border-blue-700 text-blue-700' : 'border-transparent text-gray-500 hover:text-blue-700'}`}
                onClick={() => setActiveTab(tab.value)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div>
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-lg font-semibold mb-2 text-blue-700">Proudly Showcase Your Brand Identity with Embroidered Polo T-shirts.</h2>
                <p className="mb-4 text-gray-700">Elevate your corporate and personal style with our Embroidered Polo T-shirts. These men's polo t-shirts are an exceptional platform for displaying your brand's logo and make them an impeccable choice for casual outings and professional events. They blend elegance with functionality and are designed with a regular fit, fashion knit collar, and high-gloss buttons.</p>
                <ul className="list-disc pl-5 text-gray-700 mb-4">
                  <li>Material Stock Options: White, Black, Grey, Maroon, Royal blue, Navy Blue, Cobalt Blue and Sky Blue colors come with dual material stock options.</li>
                  <li>Standard Stock: 220 GSM, 50% Cotton-50% Polyester</li>
                  <li>Premium Stock: 250 GSM, 60% Cotton-40% Polyester</li>
                  <li>The premium stock comes with soft lining inside the collar, premium rib on sleeves and side slits for better comfort.</li>
                </ul>
                <h3 className="font-semibold mb-1 text-blue-700">Embroidery Design Guidelines:</h3>
                <ul className="list-disc pl-5 text-gray-700 mb-4">
                  <li>Simple designs look better when embroidered. Avoid detailed artwork.</li>
                  <li>Keep font size above 10 points for better results.</li>
                  <li>Logos and text will work best. Simple elements, clean lines. Use high-resolution images.</li>
                  <li>Do not use photographs, human faces, or scenic images.</li>
                </ul>
                <h3 className="font-semibold mb-1 text-blue-700">Premium Quality at Best Price</h3>
                <ul className="list-disc pl-5 text-gray-700 mb-4">
                  <li>Even Low Quantities @ Best Prices - We offer low/ single quantities at affordable prices.</li>
                  <li>High quality products and Easy design - Our wide selection of high-quality products and online design tools make it easy for you to customize and order your favourite products.</li>
                </ul>
                <p className="text-xs text-gray-500 italic mt-2">Vistaprint India customizes all its products in facilities located within India. Some of our raw materials, intermediate components, and consumables used in the manufacturing of the final product could be from one or more countries. As we follow Global Sourcing, one product is likely to have a different country of origin depending on the batch sold.</p>
                <p className="text-xs text-gray-500 mt-2">Country of origin: India</p>
              </div>
            )}
            {activeTab === 'specs' && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Specs & Templates</h2>
                <ul className="list-disc pl-5 text-gray-700 mb-4">
                  <li>Download <a href="#" className="text-blue-600 underline">Polo T-shirt Print Template (PDF)</a></li>
                  <li>Download <a href="#" className="text-blue-600 underline">Embroidery Area Guide (PNG)</a></li>
                </ul>
                <p className="text-gray-700">Specs and downloadable print templates will be shown here.</p>
              </div>
            )}
            {activeTab === 'size' && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Size Charts</h2>
                <table className="w-full text-sm text-left text-gray-700 border mt-2">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-1 px-2 border">Size</th>
                      <th className="py-1 px-2 border">Chest (in)</th>
                      <th className="py-1 px-2 border">Length (in)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td className="py-1 px-2 border">S</td><td className="py-1 px-2 border">38</td><td className="py-1 px-2 border">26</td></tr>
                    <tr><td className="py-1 px-2 border">M</td><td className="py-1 px-2 border">40</td><td className="py-1 px-2 border">27</td></tr>
                    <tr><td className="py-1 px-2 border">L</td><td className="py-1 px-2 border">42</td><td className="py-1 px-2 border">28</td></tr>
                    <tr><td className="py-1 px-2 border">XL</td><td className="py-1 px-2 border">44</td><td className="py-1 px-2 border">29</td></tr>
                  </tbody>
                </table>
                <p className="text-gray-700 mt-2">For best fit, measure your favorite t-shirt and compare with the chart above.</p>
              </div>
            )}
            {activeTab === 'faq' && (
              <div>
                <h2 className="text-lg font-semibold mb-2">FAQ</h2>
                <div className="divide-y divide-gray-200">
                  {FAQS.map((faq, i) => (
                    <div key={i} className="py-2">
                      <button
                        className="w-full text-left flex justify-between items-center text-gray-800 font-medium focus:outline-none"
                        onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                        aria-expanded={faqOpen === i}
                      >
                        {faq.q}
                        <span>{faqOpen === i ? '-' : '+'}</span>
                      </button>
                      {faqOpen === i && (
                        <div className="mt-2 text-gray-600 text-sm">{faq.a}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Browse Designs Modal */}
        {showBrowseModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-2">
              <h3 className="text-lg font-semibold mb-4">Browse Designs</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-100 rounded p-4 flex items-center justify-center">Template 1</div>
                <div className="bg-gray-100 rounded p-4 flex items-center justify-center">Template 2</div>
                <div className="bg-gray-100 rounded p-4 flex items-center justify-center">Template 3</div>
                <div className="bg-gray-100 rounded p-4 flex items-center justify-center">Template 4</div>
              </div>
              <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600" onClick={() => setShowBrowseModal(false)}>Close</button>
            </div>
          </div>
        )}
        {/* Upload Design Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-2">
              <h3 className="text-lg font-semibold mb-4">Upload Design</h3>
              <input type="file" accept="image/*,.pdf" onChange={handleFileChange} className="mb-4" />
              {uploadedPreview && (
                <div className="mb-4 flex flex-col items-center">
                  <span className="text-xs text-gray-500 mb-2">Preview:</span>
                  <img src={uploadedPreview} alt="Preview" className="max-h-40 rounded border" />
                </div>
              )}
              <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 mb-2" onClick={() => setShowUploadModal(false)}>Done</button>
              <button className="w-full bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300" onClick={() => { setShowUploadModal(false); setUploadedFile(null); setUploadedPreview(null); }}>Cancel</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 