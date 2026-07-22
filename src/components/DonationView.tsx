import React, { useState } from 'react';
import { 
  Building2, CreditCard, SmartphoneNfc, QrCode, ExternalLink, 
  Briefcase, CheckCircle2, X, MousePointer2, Zap, Coins, 
  Activity, Signal, ShieldCheck, Trophy, Star 
} from 'lucide-react';

interface DonationViewProps {
  onReturnHome: () => void;
  themeStyle: any;
  producerId: string;
}

export const DonationView: React.FC<DonationViewProps> = ({
  onReturnHome,
  themeStyle,
  producerId
}) => {
  const [selectedTier, setSelectedTier] = useState<any>(null);
  const [customAmountInput, setCustomAmountInput] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const tiers = [
    { amount: "1 USD", icon: Zap },
    { amount: "2 USD", icon: Coins },
    { amount: "5 USD", icon: Activity },
    { amount: "10 USD", icon: Signal },
    { amount: "20 USD", icon: ShieldCheck },
    { amount: "50 USD", icon: Trophy },
    { amount: "100 USD", icon: Star }
  ];

  return (
    <main className={`max-w-6xl mx-auto w-full p-6 lg:p-10 pt-16 font-mono ${themeStyle.text}`}>
      <section className="mb-16 text-center">
        <h1 className="font-bebas text-7xl md:text-9xl tracking-tighter mb-4 leading-none uppercase">
          NETWORK SUPPORT
        </h1>
        <p className="text-xs font-bold tracking-widest uppercase opacity-60 max-w-2xl mx-auto">
          Fuel the global broadcast node infrastructure. We support all currencies including corporate and institutional funding.
        </p>
      </section>

      {/* Tiers Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
        {tiers.map((tier, idx) => (
          <button 
            key={idx} 
            onClick={() => setSelectedTier(tier)} 
            className={`p-8 border-4 ${themeStyle.border} flex flex-col items-center gap-3 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all`}
          >
            <tier.icon className="w-8 h-8" />
            <span className="font-bebas text-4xl">{tier.amount}</span>
          </button>
        ))}
        <button 
          onClick={() => setSelectedTier({ isCustom: true, amount: '' })} 
          className={`p-8 border-4 ${themeStyle.border} flex flex-col items-center gap-3 hover:bg-[#FF0080] hover:text-white transition-all`}
        >
          <MousePointer2 className="w-8 h-8" />
          <span className="font-bebas text-4xl">Custom</span>
        </button>
      </div>

      {/* Main Payment Terminals */}
      <div className={`border-4 ${themeStyle.border} p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16`}>
        <div className="space-y-10">
          <div className="flex items-center gap-4">
            <QrCode className="w-10 h-10 text-[#FF0080]" />
            <h2 className="font-bebas text-5xl tracking-tight leading-none">PAYMENT GATEWAY</h2>
          </div>
          
          <div className="space-y-8">
            <div className="space-y-2">
              <span className="text-[10px] font-bold opacity-50 uppercase tracking-widest block border-l-2 border-[#00FF7F] pl-3 mb-2">
                Bank Jago Direct (Global)
              </span>
              <div className="flex items-center gap-4">
                <Building2 className="w-8 h-8 text-orange-500" />
                <span className="font-bebas text-4xl tracking-widest bg-zinc-100 dark:bg-zinc-800 px-4 py-1 border border-current">
                  107863277869
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <span className="text-[10px] font-bold opacity-50 uppercase tracking-widest block border-l-2 border-blue-500 pl-3 mb-2">
                PayPal (Instant Sync)
              </span>
              <a 
                href="https://paypal.me/anindijewidhie" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-4 hover:opacity-80 transition-opacity group"
              >
                <CreditCard className="w-8 h-8 text-blue-600" />
                <span className="font-bebas text-3xl text-blue-600 underline decoration-2 underline-offset-4">
                  paypal.me/anindijewidhie
                </span>
                <ExternalLink className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold opacity-50 uppercase tracking-widest block border-l-2 border-[#FF0080] pl-3 mb-2">
                E-Wallet (GoPay / OVO / DANA / ShopeePay)
              </span>
              <div className="flex items-center gap-4">
                <SmartphoneNfc className="w-8 h-8 text-[#00FF7F]" />
                <span className="font-bebas text-4xl tracking-widest">+628567239000</span>
              </div>
            </div>
          </div>
        </div>

        {/* Universal QR */}
        <div className="bg-black text-white p-10 flex flex-col items-center justify-center border-4 border-white gap-8">
          <div className="bg-white p-6 border-4 border-[#00FF7F]">
            <QrCode className="w-48 h-48 text-black" />
          </div>
          <div className="text-center">
            <span className="font-bebas text-3xl tracking-widest animate-pulse block mb-1">SCAN UNIVERSAL QR</span>
            <span className="text-[10px] font-bold tracking-[0.3em] opacity-40 uppercase">Supports Banks, Organizations & Companies</span>
          </div>
        </div>
      </div>

      {/* Corporate Section */}
      <div className={`p-10 border-4 border-dashed ${themeStyle.border} bg-zinc-50 dark:bg-zinc-900/50 flex flex-col md:flex-row items-center gap-8 group mb-16`}>
        <div className="bg-black text-white p-6 border-4 border-white group-hover:bg-[#FF0080] transition-colors">
          <Briefcase className="w-16 h-16" />
        </div>
        <div className="space-y-3">
          <h3 className="font-bebas text-5xl leading-none">CORPORATE PARTNERS & GRANTS</h3>
          <p className="text-xs font-bold opacity-60 uppercase leading-relaxed max-w-xl">
            Scalable infrastructure support for big companies and institutional organizations funding global broadcast nodes.
          </p>
          <div className="flex items-center gap-6 text-[10px] font-bold opacity-50 uppercase tracking-widest pt-2">
            <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-[#00FF7F]" /> Institutional Grants</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-[#00FF7F]" /> Large Enterprise Support</span>
          </div>
        </div>
      </div>

      {/* Footer Return Button */}
      <div className="flex justify-center pb-12">
        <button 
          onClick={onReturnHome} 
          className="bg-black text-white px-16 py-6 text-4xl font-bebas border-4 border-white hover:scale-105 transition-all"
        >
          RETURN TO TALENT HUB
        </button>
      </div>

      {/* Payment Sync Modal */}
      {selectedTier && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-6 backdrop-blur-sm">
          <div className={`${themeStyle.bg} border-4 ${themeStyle.border} p-10 max-w-2xl w-full flex flex-col gap-8 animate-in zoom-in-95 duration-200`}>
            <div className="flex justify-between items-start border-b-4 border-current pb-6">
              <div>
                <h2 className="font-bebas text-5xl tracking-tighter uppercase mb-1">Sync Payment</h2>
                <span className="font-bebas text-3xl text-[#FF0080] uppercase tracking-widest">
                  {selectedTier.isCustom ? 'Custom Grant' : selectedTier.amount}
                </span>
              </div>
              <button onClick={() => setSelectedTier(null)} className="p-3 hover:bg-red-500 hover:text-white transition-colors">
                <X className="w-8 h-8" />
              </button>
            </div>

            {selectedTier.isCustom && (
              <div className="space-y-3">
                <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Manual Amount Entry (USD)</span>
                <input 
                  autoFocus
                  type="number" 
                  value={customAmountInput}
                  onChange={(e) => setCustomAmountInput(e.target.value)}
                  className={`w-full p-6 border-4 ${themeStyle.border} text-5xl font-bebas bg-zinc-100 dark:bg-zinc-800 outline-none focus:border-[#00FF7F]`}
                  placeholder="0.00"
                />
              </div>
            )}

            <div className="p-6 bg-zinc-100 dark:bg-zinc-900 border-2 border-current space-y-2 text-xs font-mono">
              <div className="flex justify-between font-bold uppercase">
                <span>Producer ID</span>
                <span className="opacity-50">{producerId}</span>
              </div>
              <div className="flex justify-between font-bold uppercase">
                <span>Merchant</span>
                <span>MY TV STAR FOUNDATION</span>
              </div>
            </div>

            <button 
              disabled={isProcessingPayment || (selectedTier.isCustom && (!customAmountInput || parseFloat(customAmountInput) <= 0))}
              onClick={() => {
                setIsProcessingPayment(true);
                setTimeout(() => {
                  setToastMsg(`LOGGED CONTRIBUTION: ${selectedTier.isCustom ? customAmountInput + ' USD' : selectedTier.amount}`);
                  setSelectedTier(null);
                  setIsProcessingPayment(false);
                  setTimeout(() => setToastMsg(null), 4000);
                }, 2000);
              }}
              className={`w-full py-8 font-bebas text-5xl border-4 ${themeStyle.border} ${themeStyle.accent} hover:bg-[#00FF7F] hover:text-black transition-all disabled:opacity-50`}
            >
              {isProcessingPayment ? 'Syncing Node...' : 'Finalize Transfer'}
            </button>
          </div>
        </div>
      )}

      {toastMsg && (
        <div className="fixed bottom-8 right-8 bg-[#00FF7F] text-black border-4 border-black p-6 font-bebas text-3xl z-[300] flex items-center gap-4">
          <CheckCircle2 className="w-8 h-8" />
          <span>{toastMsg}</span>
        </div>
      )}
    </main>
  );
};
