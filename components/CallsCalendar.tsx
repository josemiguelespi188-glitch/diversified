import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Phone,
  Clock,
  User,
  X,
  Video,
  Calendar,
} from 'lucide-react';
import { T, Badge, SectionHeading, Button } from './UIElements';

interface ScheduledCall {
  id: string;
  name: string;
  email: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  duration: number; // minutes
  type: 'Initial Consultation' | 'Portfolio Review' | 'Deal Walkthrough' | 'Onboarding' | 'Quarterly Check-in' | 'Investment Strategy';
  notes?: string;
  amount?: number; // interest amount
  via: 'Video' | 'Phone';
  status: 'scheduled' | 'completed' | 'cancelled';
}

const EXAMPLE_CALLS: ScheduledCall[] = [
  { id: 'c1',  name: 'Elena Marchetti',   email: 'e.marchetti@familyoffice.it',  date: '2026-03-03', time: '10:00', duration: 45, type: 'Initial Consultation',   via: 'Video', status: 'completed', amount: 500000, notes: 'High-net-worth family office. Interested in multifamily and debt.' },
  { id: 'c2',  name: 'Robert Chen',       email: 'r.chen@prequity.com',          date: '2026-03-05', time: '14:00', duration: 30, type: 'Portfolio Review',        via: 'Video', status: 'completed', amount: 1200000, notes: 'Reviewing Q4 performance. Wants to reallocate toward industrial.' },
  { id: 'c3',  name: 'Sarah Davidson',    email: 's.davidson@privateco.com',     date: '2026-03-07', time: '11:00', duration: 60, type: 'Onboarding',              via: 'Video', status: 'completed', amount: 250000, notes: 'New investor — individual accredited. Walk through portal and docs.' },
  { id: 'c4',  name: 'Michael Torres',    email: 'm.torres@torrescap.com',       date: '2026-03-10', time: '15:00', duration: 45, type: 'Deal Walkthrough',        via: 'Phone', status: 'completed', amount: 750000, notes: 'Interested in Phoenix Multifamily Fund. Wants full PPM review.' },
  { id: 'c5',  name: 'Amanda Fischer',    email: 'a.fischer@wealthco.de',        date: '2026-03-12', time: '10:30', duration: 30, type: 'Initial Consultation',   via: 'Video', status: 'completed', notes: 'International investor from Germany. Accreditation questions.' },
  { id: 'c6',  name: 'James Holloway',    email: 'j.holloway@hvcap.com',         date: '2026-03-17', time: '13:00', duration: 30, type: 'Quarterly Check-in',     via: 'Video', status: 'completed', amount: 2100000, notes: 'Long-standing client. Review distributions and new deal pipeline.' },
  { id: 'c7',  name: 'Priya Nair',        email: 'p.nair@techfolio.io',          date: '2026-03-19', time: '11:00', duration: 45, type: 'Initial Consultation',   via: 'Video', status: 'scheduled', amount: 400000, notes: 'Tech executive. First real estate investment — needs full education.' },
  { id: 'c8',  name: 'David Whitmore',    email: 'd.whitmore@dw-partners.com',   date: '2026-03-20', time: '16:00', duration: 60, type: 'Investment Strategy',    via: 'Video', status: 'scheduled', amount: 3500000, notes: 'Wants diversified allocation across all strategies. Major account.' },
  { id: 'c9',  name: 'Caroline Reyes',    email: 'c.reyes@latinocap.mx',         date: '2026-03-24', time: '14:30', duration: 45, type: 'Onboarding',              via: 'Phone', status: 'scheduled', amount: 150000, notes: 'Mexico-based. Trust account setup. First deal: Industrial Fund.' },
  { id: 'c10', name: 'William Bradford',  email: 'w.bradford@bradfordtrust.com', date: '2026-03-26', time: '10:00', duration: 30, type: 'Deal Walkthrough',        via: 'Video', status: 'scheduled', amount: 900000, notes: 'Trust account. Focused on NYC value-add deal.' },
  { id: 'c11', name: 'Sophia Müller',     email: 's.muller@swisswealth.ch',      date: '2026-03-28', time: '15:30', duration: 60, type: 'Investment Strategy',    via: 'Video', status: 'scheduled', amount: 5000000, notes: 'Swiss family office. Strategic allocation call. High priority.' },
  { id: 'c12', name: 'Thomas Nakamura',   email: 't.nakamura@nakafund.jp',       date: '2026-03-31', time: '09:00', duration: 30, type: 'Quarterly Check-in',     via: 'Video', status: 'scheduled', amount: 1800000, notes: 'Japan-based investor. Review upcoming distributions and Q1 report.' },
];

const TYPE_COLORS: Record<ScheduledCall['type'], string> = {
  'Initial Consultation':  T.sky,
  'Portfolio Review':      T.jade,
  'Deal Walkthrough':      T.gold,
  'Onboarding':            '#A78BFA',
  'Quarterly Check-in':    T.jade,
  'Investment Strategy':   T.gold,
};

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function fmt(n: number) {
  return n.toString().padStart(2, '0');
}

const DetailModal: React.FC<{ call: ScheduledCall; onClose: () => void }> = ({ call, onClose }) => {
  const color = TYPE_COLORS[call.type];
  const date = new Date(call.date + 'T12:00:00');
  const dateStr = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(7,8,12,0.88)', backdropFilter: 'blur(10px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md rounded-md overflow-hidden" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: `1px solid ${T.border}` }}>
          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: T.textSub }}>Call Details</span>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-sm hover:bg-white/5 text-lg" style={{ color: T.textDim }}>×</button>
        </div>

        <div className="p-6 space-y-5">
          {/* Type badge + status */}
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-widest"
              style={{ background: `${color}15`, color, border: `1px solid ${color}40` }}
            >
              {call.type}
            </span>
            <Badge variant={call.status === 'scheduled' ? 'gold' : call.status === 'completed' ? 'jade' : 'ruby'}>
              {call.status}
            </Badge>
          </div>

          {/* Investor */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm flex items-center justify-center text-sm font-black flex-shrink-0" style={{ background: T.goldFaint, border: `1px solid ${T.gold}30`, color: T.gold }}>
              {call.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: T.text }}>{call.name}</p>
              <p className="text-xs" style={{ color: T.textDim }}>{call.email}</p>
            </div>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Calendar, label: 'Date', value: dateStr },
              { icon: Clock,    label: 'Time', value: `${call.time} · ${call.duration} min` },
              { icon: call.via === 'Video' ? Video : Phone, label: 'Via', value: call.via },
              ...(call.amount ? [{ icon: User, label: 'Interest', value: `$${(call.amount / 1000).toFixed(0)}K` }] : []),
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="p-3 rounded-sm" style={{ background: T.raised, border: `1px solid ${T.border}` }}>
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon size={11} style={{ color: T.textDim }} />
                  <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: T.textDim }}>{label}</p>
                </div>
                <p className="text-xs font-semibold" style={{ color: T.text }}>{value}</p>
              </div>
            ))}
          </div>

          {/* Notes */}
          {call.notes && (
            <div className="p-3 rounded-sm" style={{ background: T.raised, border: `1px solid ${T.border}` }}>
              <p className="text-[9px] font-black uppercase tracking-widest mb-1.5" style={{ color: T.textDim }}>Notes</p>
              <p className="text-xs leading-relaxed" style={{ color: T.textSub }}>{call.notes}</p>
            </div>
          )}

          <Button onClick={onClose} variant="outline" className="w-full">Close</Button>
        </div>
      </div>
    </div>
  );
};

export const CallsCalendar: React.FC = () => {
  const today = new Date();
  const [viewYear, setViewYear] = useState(2026);
  const [viewMonth, setViewMonth] = useState(2); // 0-indexed: 2 = March
  const [selectedCall, setSelectedCall] = useState<ScheduledCall | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate());

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const callsThisMonth = EXAMPLE_CALLS.filter(c => {
    const d = new Date(c.date + 'T12:00:00');
    return d.getFullYear() === viewYear && d.getMonth() === viewMonth;
  });

  const callsByDay: Record<number, ScheduledCall[]> = {};
  callsThisMonth.forEach(c => {
    const day = parseInt(c.date.split('-')[2], 10);
    if (!callsByDay[day]) callsByDay[day] = [];
    callsByDay[day].push(c);
  });

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
    setSelectedDay(null);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
    setSelectedDay(null);
  };

  const selectedDayCalls = selectedDay ? (callsByDay[selectedDay] || []) : [];

  const upcomingCalls = EXAMPLE_CALLS
    .filter(c => c.status === 'scheduled')
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="space-y-8">
      <SectionHeading title="Calls Calendar" subtitle="Scheduled investor calls and consultations" />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="xl:col-span-2 rounded-md overflow-hidden" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
          {/* Month nav */}
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: `1px solid ${T.border}` }}>
            <button
              onClick={prevMonth}
              className="w-8 h-8 flex items-center justify-center rounded-sm hover:bg-white/5 transition-colors"
              style={{ color: T.textDim }}
            >
              <ChevronLeft size={15} />
            </button>
            <h3 className="text-sm font-black uppercase tracking-widest" style={{ color: T.text }}>
              {MONTH_NAMES[viewMonth]} {viewYear}
            </h3>
            <button
              onClick={nextMonth}
              className="w-8 h-8 flex items-center justify-center rounded-sm hover:bg-white/5 transition-colors"
              style={{ color: T.textDim }}
            >
              <ChevronRight size={15} />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 px-4 pt-4 pb-1">
            {DAYS_OF_WEEK.map(d => (
              <div key={d} className="text-center text-[9px] font-black uppercase tracking-widest pb-3" style={{ color: T.textDim }}>
                {d}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-7 px-4 pb-4 gap-1">
            {/* Empty cells for first day offset */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {/* Day cells */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayCalls = callsByDay[day] || [];
              const isSelected = selectedDay === day;
              const isToday = viewYear === today.getFullYear() && viewMonth === today.getMonth() && day === today.getDate();
              const hasCalls = dayCalls.length > 0;

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(isSelected ? null : day)}
                  className="relative flex flex-col items-center pt-2 pb-1.5 rounded-sm transition-all duration-150 min-h-[56px]"
                  style={{
                    background: isSelected ? T.goldFaint : hasCalls ? `${T.raised}` : 'transparent',
                    border: isSelected ? `1px solid ${T.gold}50` : `1px solid ${hasCalls ? T.border : 'transparent'}`,
                  }}
                  onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = T.raised; }}
                  onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = hasCalls ? T.raised : 'transparent'; }}
                >
                  <span
                    className="text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full"
                    style={{
                      color: isSelected ? T.gold : isToday ? '#000' : hasCalls ? T.text : T.textDim,
                      background: isToday ? T.gold : 'transparent',
                      fontWeight: isToday || isSelected ? '900' : '600',
                    }}
                  >
                    {day}
                  </span>

                  {/* Call dots */}
                  {dayCalls.length > 0 && (
                    <div className="flex gap-0.5 mt-1 flex-wrap justify-center px-1">
                      {dayCalls.slice(0, 3).map(c => (
                        <div
                          key={c.id}
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ background: TYPE_COLORS[c.type] }}
                        />
                      ))}
                      {dayCalls.length > 3 && (
                        <span className="text-[8px] font-bold" style={{ color: T.textDim }}>+{dayCalls.length - 3}</span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="px-6 pb-4 pt-2 flex flex-wrap gap-3" style={{ borderTop: `1px solid ${T.border}` }}>
            {Object.entries(TYPE_COLORS).map(([type, color]) => (
              <div key={type} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                <span className="text-[9px] font-bold uppercase tracking-wide" style={{ color: T.textDim }}>{type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel: day detail or upcoming */}
        <div className="space-y-4">
          {selectedDay && selectedDayCalls.length > 0 ? (
            <div className="rounded-md overflow-hidden" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
              <div className="px-5 py-4" style={{ borderBottom: `1px solid ${T.border}` }}>
                <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: T.textDim }}>
                  {MONTH_NAMES[viewMonth]} {selectedDay}
                </p>
                <p className="text-lg font-black mt-0.5" style={{ color: T.text }}>
                  {selectedDayCalls.length} Call{selectedDayCalls.length > 1 ? 's' : ''}
                </p>
              </div>
              <div className="divide-y" style={{ borderColor: T.border }}>
                {selectedDayCalls.map(call => (
                  <button
                    key={call.id}
                    onClick={() => setSelectedCall(call)}
                    className="w-full p-4 text-left transition-colors hover:bg-white/[0.02] flex items-start gap-3"
                  >
                    <div
                      className="w-1 self-stretch rounded-full flex-shrink-0 mt-0.5"
                      style={{ background: TYPE_COLORS[call.type] }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate" style={{ color: T.text }}>{call.name}</p>
                      <p className="text-[10px] mt-0.5" style={{ color: TYPE_COLORS[call.type] }}>{call.type}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock size={9} style={{ color: T.textDim }} />
                        <span className="text-[9px]" style={{ color: T.textDim }}>{call.time} · {call.duration}min</span>
                        {call.via === 'Video' ? <Video size={9} style={{ color: T.textDim }} /> : <Phone size={9} style={{ color: T.textDim }} />}
                      </div>
                    </div>
                    <Badge variant={call.status === 'scheduled' ? 'gold' : 'jade'} className="flex-shrink-0">
                      {call.status}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>
          ) : selectedDay && selectedDayCalls.length === 0 ? (
            <div className="rounded-md p-6 text-center" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
              <Calendar size={28} className="mx-auto mb-3" style={{ color: T.textDim }} />
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: T.textDim }}>
                No calls on {MONTH_NAMES[viewMonth]} {selectedDay}
              </p>
            </div>
          ) : null}

          {/* Upcoming calls list */}
          <div className="rounded-md overflow-hidden" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
            <div className="px-5 py-4" style={{ borderBottom: `1px solid ${T.border}` }}>
              <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: T.textDim }}>Upcoming</p>
              <p className="text-lg font-black mt-0.5" style={{ color: T.text }}>{upcomingCalls.length} Scheduled</p>
            </div>
            <div className="divide-y max-h-[420px] overflow-y-auto" style={{ borderColor: T.border }}>
              {upcomingCalls.map(call => {
                const d = new Date(call.date + 'T12:00:00');
                const dayStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                return (
                  <button
                    key={call.id}
                    onClick={() => setSelectedCall(call)}
                    className="w-full p-4 text-left transition-colors hover:bg-white/[0.02] flex items-center gap-3"
                  >
                    <div className="text-center w-10 flex-shrink-0">
                      <p className="text-[9px] font-black uppercase" style={{ color: T.textDim }}>
                        {dayStr.split(' ')[0]}
                      </p>
                      <p className="text-lg font-black leading-none" style={{ color: T.gold }}>
                        {dayStr.split(' ')[1]}
                      </p>
                    </div>
                    <div
                      className="w-px self-stretch"
                      style={{ background: TYPE_COLORS[call.type] }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate" style={{ color: T.text }}>{call.name}</p>
                      <p className="text-[10px] mt-0.5 truncate" style={{ color: T.textDim }}>{call.type} · {call.time}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Calls',       value: EXAMPLE_CALLS.length.toString(),             accent: T.gold },
          { label: 'Completed',         value: EXAMPLE_CALLS.filter(c => c.status === 'completed').length.toString(),  accent: T.jade },
          { label: 'Upcoming',          value: upcomingCalls.length.toString(),              accent: T.sky },
          { label: 'Capital Interest',  value: `$${(EXAMPLE_CALLS.filter(c => c.amount).reduce((s, c) => s + (c.amount || 0), 0) / 1000000).toFixed(1)}M`, accent: T.gold },
        ].map(stat => (
          <div key={stat.label} className="p-5 rounded-md" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
            <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: T.textDim }}>{stat.label}</p>
            <p className="text-2xl font-black" style={{ color: stat.accent }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {selectedCall && <DetailModal call={selectedCall} onClose={() => setSelectedCall(null)} />}
    </div>
  );
};
