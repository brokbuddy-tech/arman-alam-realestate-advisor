'use client';

import React, { useRef, useState } from 'react';
import { Download, MapPin, Bed, Bath, Square, CheckCircle2, QrCode } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';
import RichText from '@/components/RichText';
import { broker, getBrokerInitials } from '@/data/broker';
import { useBrokBuddyData } from '@/context/BrokBuddyContext';
import type { Property } from '@/data/properties';

// We need to import jspdf and html2canvas, but they are client-side only.
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export function BrochureButton({ property }: { property: Property }) {
  const brochureRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { formatPrice } = useCurrency();
  const { broker: scopedBroker } = useBrokBuddyData();
  const displayedBroker = scopedBroker ?? broker;

  const handleDownload = async () => {
    if (!brochureRef.current || isGenerating) return;
    
    try {
      setIsGenerating(true);
      
      const element = brochureRef.current;
      
      const canvas = await html2canvas(element, {
        scale: 2, 
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${property.title.replace(/\s+/g, '-').toLowerCase()}-brochure.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate brochure. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <button 
        onClick={handleDownload}
        disabled={isGenerating}
        className="w-full bg-[#111812] hover:bg-neutral-800 text-[#FFDE02] px-6 py-4 rounded-2xl text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2"
      >
        <Download className={`w-5 h-5 ${isGenerating ? 'animate-bounce' : ''}`} />
        {isGenerating ? 'Generating Brochure...' : 'Download Brochure'}
      </button>

      {/* Hidden Brochure Layout (A4 Dimensions: 794px x 1123px) */}
      <div aria-hidden="true" inert className="fixed top-0 -left-[10000px] w-[794px] h-[1123px] opacity-0 pointer-events-none z-[-1] overflow-hidden">
        <div 
          ref={brochureRef} 
          className="w-[794px] h-[1123px] bg-white relative flex flex-col font-sans"
        >
          {/* Header Image */}
          <div className="relative h-[450px] w-full shrink-0 bg-neutral-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={property.image} 
              alt={property.title}
              crossOrigin="anonymous" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/90"></div>
            
            {/* Logo/Brand */}
            <div className="absolute top-8 left-8">
              <h1 className="text-3xl font-black text-white tracking-tighter">{displayedBroker.name}</h1>
              <p className="text-[#FFDE02] font-bold text-sm tracking-widest uppercase">{displayedBroker.role}</p>
            </div>

            {/* Property Title & Price */}
            <div className="absolute bottom-10 left-10 right-10">
              <div className="inline-flex items-center gap-2 bg-[#FFDE02] text-black text-sm font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider">
                {property.status} • {property.type}
              </div>
              <h2 className="text-5xl font-bold text-white mb-2 leading-tight">{property.title}</h2>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2 text-white/90 font-medium text-lg">
                  <MapPin className="w-5 h-5 text-[#FFDE02]" />
                  {property.address}
                </div>
                <div className="text-4xl font-black text-[#FFDE02]">
                  {formatPrice(property.price, property.currency)}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-10 flex-1 flex flex-col">
            {/* Key Specs */}
            <div className="grid grid-cols-4 gap-6 mb-10 pb-10 border-b border-neutral-200">
              <div className="bg-neutral-50 rounded-2xl p-6 text-center border border-neutral-100">
                <Bed className="w-8 h-8 mx-auto mb-3 text-neutral-400" />
                <div className="text-3xl font-black text-[#111812]">{property.beds ?? '—'}</div>
                <div className="text-sm font-bold text-neutral-500 uppercase tracking-wider mt-1">Bedrooms</div>
              </div>
              <div className="bg-neutral-50 rounded-2xl p-6 text-center border border-neutral-100">
                <Bath className="w-8 h-8 mx-auto mb-3 text-neutral-400" />
                <div className="text-3xl font-black text-[#111812]">{property.baths ?? '—'}</div>
                <div className="text-sm font-bold text-neutral-500 uppercase tracking-wider mt-1">Bathrooms</div>
              </div>
              <div className="bg-neutral-50 rounded-2xl p-6 text-center border border-neutral-100">
                <Square className="w-8 h-8 mx-auto mb-3 text-neutral-400" />
                <div className="text-3xl font-black text-[#111812]">{property.sqft.split(' ')[0]}</div>
                <div className="text-sm font-bold text-neutral-500 uppercase tracking-wider mt-1">Sq.Ft.</div>
              </div>
              <div className="bg-[#111812] rounded-2xl p-6 text-center border border-[#111812] flex flex-col justify-center items-center">
                <QrCode className="w-12 h-12 text-[#FFDE02] mb-2" />
                <div className="text-[10px] font-bold text-white uppercase tracking-wider">Scan to view<br/>online</div>
              </div>
            </div>

            {/* Description & Amenities */}
            <div className="flex gap-10 flex-1">
              <div className="flex-1 space-y-6">
                <h3 className="text-2xl font-bold text-[#111812]">Property Overview</h3>
                <div className="space-y-4 text-base text-neutral-600 leading-relaxed">
                  <RichText content={property.description.join('\n\n')} />
                </div>
              </div>
              
              <div className="w-[300px] shrink-0 space-y-6">
                <h3 className="text-2xl font-bold text-[#111812]">Premium Amenities</h3>
                <div className="space-y-4">
                  {property.amenities.slice(0, 8).map((amenity: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-3 text-sm font-bold text-neutral-700 bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                      <CheckCircle2 className="w-5 h-5 text-[#111812] shrink-0"/> {amenity}
                    </div>
                  ))}
                  {property.amenities.length > 8 && (
                    <div className="text-sm font-bold text-neutral-400 pl-2">
                      + {property.amenities.length - 8} more amenities
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer / Agent */}
          <div className="bg-[#111812] p-10 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full border-2 border-[#FFDE02] bg-white/10 flex items-center justify-center text-2xl font-black">
                AA
              </div>
              <div>
                <h4 className="text-2xl font-bold mb-1">{displayedBroker.name}</h4>
                <p className="text-[#FFDE02] font-semibold text-sm">{displayedBroker.role}</p>
              </div>
            </div>
            <div className="text-right">
              <h3 className="text-xl font-bold text-white mb-2">{displayedBroker.name}</h3>
              <p className="text-sm text-neutral-400">{displayedBroker.role}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
