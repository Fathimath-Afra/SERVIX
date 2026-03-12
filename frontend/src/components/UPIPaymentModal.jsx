import { useState } from 'react';
import Swal from 'sweetalert2';

const UPIPaymentModal = ({ amount, onSucess, onCancel }) => {
    const [step, setStep] = useState(1); 

    const handleSimulatePayment = () => {
        Swal.fire({
            title: 'Processing UPI...',
            text: 'Communicating with your bank',
            didOpen: () => Swal.showLoading(),
            timer: 2000,
            showConfirmButton: false
        }).then(() => {
            onSucess({
                transactionId: "TID" + Math.floor(Math.random() * 1000000),
                status: 'success'
            });
        });
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[2000] p-4 backdrop-blur-sm">
            <div className="bg-white w-full max-w-sm border border-gray-200">
                {/* Header */}
                <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Secure UPI Payment</span>
                    <button onClick={onCancel} className="text-gray-400 hover:text-black">✕</button>
                </div>

                <div className="p-8">
                    <p className="text-center text-xs font-bold text-gray-400 uppercase">Amount to Pay</p>
                    <h2 className="text-center text-4xl font-black text-gray-900 mt-1">Rs. {amount}</h2>

                    {step === 1 ? (
                        
                        <div className="mt-8 space-y-3">
                            <p className="text-[10px] font-black uppercase text-gray-400 mb-4">Select UPI App</p>
                            <button onClick={() => setStep(2)} className="w-full border p-3 flex items-center gap-4 hover:border-black transition-all">
                                <span className="text-xl">📱</span> <span className="text-sm font-bold uppercase">Google Pay / PhonePe</span>
                            </button>
                            <button onClick={() => setStep(2)} className="w-full border p-3 flex items-center gap-4 hover:border-black transition-all">
                                <span className="text-xl">QR</span> <span className="text-sm font-bold uppercase">Scan Any QR Code</span>
                            </button>
                        </div>
                    ) : (
                        /* QR Code  */
                        <div className="mt-8 text-center">
                            <div className="w-40 h-40 bg-gray-100 mx-auto mb-4 flex items-center justify-center border-2 border-dashed border-gray-300">
                                <span className="text-[10px] font-black text-gray-300 uppercase">QR CODE DUMMY</span>
                            </div>
                            <p className="text-[10px] text-gray-400 uppercase mb-6">Scan with any UPI App to pay</p>
                            <button 
                                onClick={handleSimulatePayment}
                                className="w-full bg-black text-white py-3 text-[10px] font-black uppercase tracking-widest hover:bg-gray-800"
                            >
                                Simulate Payment Success
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UPIPaymentModal;