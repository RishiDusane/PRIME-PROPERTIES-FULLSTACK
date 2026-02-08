import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function AvailabilityCalendar({ propertyId }) {
    const [availability, setAvailability] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        api.get(`/properties/${propertyId}/availability`)
            .then(res => setAvailability(res.data)) // array of 'YYYY-MM-DD' strings
            .catch(console.error);
    }, [propertyId]);

    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    const isBooked = (day) => {
        // Format YYYY-MM-DD
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return availability.includes(dateStr);
    };

    const isPast = (day) => {
        const checkDate = new Date(year, month, day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return checkDate < today;
    }

    const renderDays = () => {
        const days = [];
        // Empty slots for previous month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-10 w-10"></div>);
        }
        // Days
        for (let d = 1; d <= daysInMonth; d++) {
            const booked = isBooked(d);
            const past = isPast(d);
            let className = "h-10 w-10 flex items-center justify-center rounded-lg text-sm font-semibold transition cursor-default ";
            if (booked) {
                className += "bg-red-50 text-red-500 line-through decoration-red-500/50";
            } else if (past) {
                className += "text-slate-300";
            } else {
                className += "bg-emerald-50 text-emerald-700 font-bold border border-emerald-100 shadow-sm";
            }

            days.push(
                <div key={d} className={className} title={booked ? "Booked" : past ? "Past" : "Available"}>
                    {d}
                </div>
            );
        }
        return days;
    };

    return (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm max-w-sm mt-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-800 text-lg">Availability</h3>
                <div className="flex gap-2">
                    <button onClick={prevMonth} className="p-1 hover:bg-slate-100 rounded-full"><ChevronLeft size={20} /></button>
                    <span className="font-semibold text-slate-600 w-24 text-center text-sm">{monthNames[month]} {year}</span>
                    <button onClick={nextMonth} className="p-1 hover:bg-slate-100 rounded-full"><ChevronRight size={20} /></button>
                </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <span key={d} className="text-xs font-bold text-slate-400 uppercase">{d}</span>)}
            </div>
            <div className="grid grid-cols-7 gap-1 place-items-center">
                {renderDays()}
            </div>
            <div className="flex gap-4 mt-6 text-xs font-bold text-slate-500 justify-center uppercase tracking-wider">
                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-emerald-50 border border-emerald-100 rounded"></div> Available</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-50 text-red-300 rounded line-through"></div> Booked</div>
            </div>
        </div>
    );
}
