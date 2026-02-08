import React from 'react';
import { CheckCircle, Circle, Clock } from 'lucide-react';

export default function BookingTimeline({ appointment, booking }) {
    const steps = [
        { key: 'requested', label: 'Requested' },
        { key: 'approved', label: 'Approved' },
        { key: 'paid', label: 'Paid' },
        // { key: 'completed', label: 'Comp' } // Optional, can imply Completed after Paid
    ];

    let currentStep = 0;
    if (appointment.status === 'PENDING') currentStep = 0;
    else if (appointment.status === 'APPROVED') currentStep = 1;
    else if (appointment.status === 'REJECTED') currentStep = -1; // Special case

    if (appointment.status === 'APPROVED' && booking) {
        currentStep = 2;
    }

    if (currentStep === -1) {
        return <span className="text-red-600 font-bold text-xs uppercase bg-red-100 px-3 py-1 rounded-full">Rejected</span>;
    }

    return (
        <div className="flex items-center space-x-1">
            {steps.map((step, index) => {
                const active = index <= currentStep;
                const current = index === currentStep;

                return (
                    <div key={step.key} className="flex items-center">
                        <div className={`
              flex items-center justify-center w-6 h-6 rounded-full border-2 text-[10px] font-bold
              ${active
                                ? 'bg-emerald-500 border-emerald-500 text-white'
                                : 'bg-white border-slate-300 text-slate-400'}
            `} title={step.label}>
                            {active ? <CheckCircle size={12} className="stroke-[4]" /> : <Circle size={12} />}
                        </div>
                        {/* Connector line */}
                        {index < steps.length - 1 && (
                            <div className={`h-0.5 w-6 ${index < currentStep ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
