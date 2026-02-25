'use client'

import React from 'react'
import { QRCodeSVG } from 'qrcode.react'

interface BadgeMember {
  readonly member_uuid: string
  readonly registration_code: string
  readonly title: string
  readonly first_name: string
  readonly last_name: string
  readonly job_position: string
}

interface BadgeExhibitor {
  readonly company_name: string
  readonly country: string
  readonly booth_no: string
}

interface ExhibitorBadgeProps {
  readonly staff: BadgeMember
  readonly exhibitor: BadgeExhibitor
}

export function ExhibitorBadge({ staff, exhibitor }: ExhibitorBadgeProps) {
  return (
    <div className="print-badge w-[4in] h-[6in] bg-white flex flex-col items-center text-center mx-auto mb-8 break-after-page relative overflow-hidden shadow-lg border border-gray-100 print:shadow-none print:border-none">
      {/* Category Header Bar */}
      <div className="w-full bg-emerald-600 h-16 flex items-center justify-center">
        <span className="text-white text-3xl font-black uppercase tracking-[0.3em] leading-none">
          EXHIBITOR
        </span>
      </div>

      {/* Event Header */}
      <div className="w-full pt-8 px-6">
        <div className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700/60 mb-1">
          Expo Flow Management
        </div>
        <div className="h-[2px] w-12 bg-emerald-600 mx-auto opacity-30"></div>
        <div className="text-xs font-medium text-slate-400 mt-2 uppercase tracking-widest">
          Bangkok 2026
        </div>
      </div>

      {/* Staff Identity Section */}
      <div className="w-full flex-1 flex flex-col justify-center px-6 py-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 leading-[1.1] mb-2 px-2 break-words">
            {staff.title} {staff.first_name}<br />
            {staff.last_name}
          </h1>
          <div className="inline-block px-4 py-1 bg-slate-100 rounded-full">
            <h2 className="text-lg text-slate-600 font-bold uppercase tracking-wide">
              {staff.job_position || 'Staff'}
            </h2>
          </div>
        </div>

        <div className="mt-8 space-y-1 bg-slate-50/50 py-4 px-4 rounded-xl border border-slate-100/50">
          <h3 className="text-xl text-emerald-800 font-black uppercase tracking-tight leading-tight">
            {exhibitor.company_name}
          </h3>
          <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">
            {exhibitor.country}
          </p>
        </div>
      </div>

      {/* Footer / QR Section */}
      <div className="w-full bg-slate-50 px-6 py-8 flex flex-col items-center gap-6 border-t border-slate-100">
        <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-200">
          <QRCodeSVG 
            value={staff.member_uuid} 
            size={110} 
            level="H"
          />
        </div>
        
        <div className="flex items-center gap-6 w-full justify-center">
          <div className="text-left">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Booth No.</div>
            <div className="text-xl font-black text-emerald-600 tracking-tighter">{exhibitor.booth_no}</div>
          </div>
          <div className="h-8 w-[1px] bg-slate-200"></div>
          <div className="text-right">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Badge ID</div>
            <div className="text-sm font-mono font-bold text-slate-700">{staff.registration_code}</div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap');
        
        .print-badge {
          font-family: 'Outfit', sans-serif !important;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        @media print {
          @page {
            size: 4in 6in;
            margin: 0;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
            margin: 0;
            padding: 0;
          }
          .print-badge {
            box-shadow: none !important;
            border: none !important;
            width: 4in !important;
            height: 6in !important;
            margin: 0 !important;
            position: absolute;
            top: 0;
            left: 0;
            break-after: page;
          }
          body > *:not(.print-area) {
            display: none !important;
          }
          .print-area {
            display: block !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 4in !important;
            height: 6in !important;
          }
        }
      `}</style>
    </div>
  )
}
