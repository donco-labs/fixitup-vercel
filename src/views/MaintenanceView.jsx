import React, { useState } from 'react';
import { Calendar, Plus, CheckCircle, Clock, AlertTriangle, X, Moon, Sparkles, LayoutList, Calendar as CalendarIcon } from 'lucide-react';
import { FREQUENCY_TYPES, WHIMSY_TYPES } from '../utils/scheduling';
import CalendarGrid from '../components/CalendarGrid';

export default function MaintenanceView({ tasks, onComplete, onAdd }) {
    const [viewMode, setViewMode] = useState('list'); // 'list' | 'calendar'
    const [isAdding, setIsAdding] = useState(false);

    // Add Form State
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [freqType, setFreqType] = useState(FREQUENCY_TYPES.INTERVAL);

    // Interval State
    const [intervalValue, setIntervalValue] = useState(1);
    const [intervalUnit, setIntervalUnit] = useState('months'); // days, weeks, months, years

    // Annual State
    const [selectedMonth, setSelectedMonth] = useState(0);
    const [selectedDay, setSelectedDay] = useState(1);

    // Whimsy State
    const [whimsyType, setWhimsyType] = useState(WHIMSY_TYPES.FULL_MOON);

    const getStatus = (task) => {
        const due = new Date(task.nextDue);
        const now = new Date();
        const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
        const dateStr = due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        if (diffDays < 0) return { label: 'Overdue', color: '#f44336', icon: AlertTriangle, days: `${dateStr} (Overdue)` };
        if (diffDays <= 7) return { label: 'Due Soon', color: '#ff9800', icon: Clock, days: `${dateStr} (Soon)` };
        return { label: 'Good', color: '#4caf50', icon: CheckCircle, days: `Next: ${dateStr} ` };
    };

    const handleAdd = () => {
        if (!newTaskTitle) return;

        const payload = {
            title: newTaskTitle,
            frequencyType: freqType,
            tags: ['Custom']
        };

        if (freqType === FREQUENCY_TYPES.INTERVAL) {
            let days = 30;
            const val = parseInt(intervalValue);
            if (intervalUnit === 'days') days = val;
            if (intervalUnit === 'weeks') days = val * 7;
            if (intervalUnit === 'months') days = val * 30;
            if (intervalUnit === 'years') days = val * 365;

            payload.intervalValue = val;
            payload.intervalUnit = intervalUnit;
            payload.frequencyDays = days; // Legacy fallback
        } else if (freqType === FREQUENCY_TYPES.ANNUAL) {
            payload.month = parseInt(selectedMonth);
            payload.day = parseInt(selectedDay);
        } else if (freqType === FREQUENCY_TYPES.WHIMSY) {
            payload.whimsyType = whimsyType;
        }

        onAdd(payload);
        setIsAdding(false);
        setNewTaskTitle('');
        setIntervalValue(1);
    };

    const sortedTasks = [...tasks].sort((a, b) => new Date(a.nextDue) - new Date(b.nextDue));
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return (
        <div className="slide-up">
            <div style={{ padding: '0 20px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#333', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Calendar size={20} color="#651fff" />
                        Schedule
                    </h2>

                    <div style={{ display: 'flex', gap: '8px' }}>
                        <div style={{ background: '#f5f5f5', padding: '4px', borderRadius: '20px', display: 'flex' }}>
                            <button
                                onClick={() => setViewMode('list')}
                                style={{ padding: '6px', borderRadius: '50%', border: 'none', background: viewMode === 'list' ? 'white' : 'transparent', color: viewMode === 'list' ? '#651fff' : '#999', boxShadow: viewMode === 'list' ? '0 2px 5px rgba(0,0,0,0.1)' : 'none', cursor: 'pointer' }}
                            >
                                <LayoutList size={18} />
                            </button>
                            <button
                                onClick={() => setViewMode('calendar')}
                                style={{ padding: '6px', borderRadius: '50%', border: 'none', background: viewMode === 'calendar' ? 'white' : 'transparent', color: viewMode === 'calendar' ? '#651fff' : '#999', boxShadow: viewMode === 'calendar' ? '0 2px 5px rgba(0,0,0,0.1)' : 'none', cursor: 'pointer' }}
                            >
                                <CalendarIcon size={18} />
                            </button>
                        </div>

                        <button
                            onClick={() => setIsAdding(!isAdding)}
                            style={{ background: '#651fff', color: 'white', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        >
                            {isAdding ? <X size={20} /> : <Plus size={20} />}
                        </button>
                    </div>
                </div>

                {isAdding && (
                    <div style={{ background: '#f3e5f5', padding: '16px', borderRadius: '16px', marginBottom: '20px', animation: 'fadeIn 0.2s', border: '1px solid #e1bee7' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px', color: '#651fff' }}>New Task</h3>
                        <input
                            type="text"
                            placeholder="Task Name"
                            value={newTaskTitle}
                            onChange={e => setNewTaskTitle(e.target.value)}
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '12px', fontSize: '14px' }}
                        />

                        <div style={{ display: 'flex', gap: '4px', marginBottom: '12px', background: 'white', padding: '4px', borderRadius: '8px' }}>
                            {[
                                { id: FREQUENCY_TYPES.INTERVAL, label: 'Standard' },
                                { id: FREQUENCY_TYPES.ANNUAL, label: 'Annual' },
                                { id: FREQUENCY_TYPES.WHIMSY, label: 'Magic', icon: Sparkles }
                            ].map(type => (
                                <button
                                    key={type.id}
                                    onClick={() => setFreqType(type.id)}
                                    style={{ flex: 1, padding: '8px', borderRadius: '6px', border: 'none', background: freqType === type.id ? '#651fff' : 'transparent', color: freqType === type.id ? 'white' : '#666', fontSize: '12px', fontWeight: '600', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px' }}
                                >
                                    {type.icon && <type.icon size={12} />}
                                    {type.label}
                                </button>
                            ))}
                        </div>

                        {freqType === FREQUENCY_TYPES.INTERVAL && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                <span style={{ fontSize: '14px', color: '#666' }}>Every</span>
                                <input
                                    type="number"
                                    min="1"
                                    value={intervalValue}
                                    onChange={e => setIntervalValue(e.target.value)}
                                    style={{ width: '50px', padding: '8px', borderRadius: '8px', border: '1px solid #ddd' }}
                                />
                                <select
                                    value={intervalUnit}
                                    onChange={e => setIntervalUnit(e.target.value)}
                                    style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ddd', flex: 1, background: 'white' }}
                                >
                                    <option value="days">Days</option>
                                    <option value="weeks">Weeks</option>
                                    <option value="months">Months</option>
                                    <option value="years">Years</option>
                                </select>
                            </div>
                        )}

                        {freqType === FREQUENCY_TYPES.ANNUAL && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                <span style={{ fontSize: '14px', color: '#666' }}>On</span>
                                <select
                                    value={selectedMonth}
                                    onChange={e => setSelectedMonth(parseInt(e.target.value))}
                                    style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #ddd', background: 'white' }}
                                >
                                    {months.map((m, i) => <option key={i} value={i}>{m}</option>)}
                                </select>
                                <input
                                    type="number"
                                    min="1" max="31"
                                    value={selectedDay}
                                    onChange={e => setSelectedDay(e.target.value)}
                                    style={{ width: '60px', padding: '8px', borderRadius: '8px', border: '1px solid #ddd' }}
                                />
                            </div>
                        )}

                        {freqType === FREQUENCY_TYPES.WHIMSY && (
                            <div style={{ marginBottom: '12px' }}>
                                <select
                                    value={whimsyType}
                                    onChange={e => setWhimsyType(e.target.value)}
                                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ddd', background: 'white', marginBottom: '8px' }}
                                >
                                    <option value={WHIMSY_TYPES.FULL_MOON}>🌕 Every Full Moon</option>
                                    <option value={WHIMSY_TYPES.FRIDAY_13TH}>👻 Every Friday the 13th</option>
                                    <option value={WHIMSY_TYPES.LEAP_DAY}>🐸 Every Leap Day (Feb 29)</option>
                                </select>
                                <div style={{ fontSize: '12px', color: '#666', fontStyle: 'italic' }}>
                                    We'll calculate the celestial movements for you.
                                </div>
                            </div>
                        )}

                        <button
                            onClick={handleAdd}
                            style={{ width: '100%', padding: '12px', background: '#651fff', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }}
                        >
                            Summon Task
                        </button>
                    </div>
                )}

                {viewMode === 'calendar' ? (
                    <CalendarGrid tasks={tasks} />
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {sortedTasks.map(task => {
                            const status = getStatus(task);
                            const StatusIcon = status.icon;

                            return (
                                <div key={task.id} style={{ background: 'white', padding: '16px', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontWeight: '600', color: '#333', fontSize: '15px' }}>{task.title}</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: status.color, marginTop: '4px' }}>
                                            <StatusIcon size={14} />
                                            {status.days}
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                                            {task.frequencyType === 'annual' ? 'Annually' : task.frequencyType === 'whimsy' ? '✨ Magical' : `Every ${task.frequencyDays || 30} days`}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => onComplete(task.id)}
                                        style={{ background: '#f0f0ff', color: '#651fff', border: 'none', padding: '8px 16px', borderRadius: '20px', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}
                                    >
                                        Done
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
