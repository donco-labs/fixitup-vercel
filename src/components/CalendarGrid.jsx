import React from 'react';

const CalendarGrid = ({ tasks }) => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sunday

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(null); // Empty slots
    }
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(new Date(currentYear, currentMonth, i));
    }

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const getTasksForDay = (date) => {
        if (!date) return [];
        return tasks.filter(task => {
            const due = new Date(task.nextDue);
            return due.getDate() === date.getDate() &&
                due.getMonth() === date.getMonth() &&
                due.getFullYear() === date.getFullYear();
        });
    };

    return (
        <div style={{ background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <h3 style={{ textAlign: 'center', margin: '0 0 20px 0', color: '#333' }}>
                {monthNames[currentMonth]} {currentYear}
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center' }}>
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                    <div key={d} style={{ fontWeight: 'bold', color: '#999', fontSize: '12px', paddingBottom: '8px' }}>{d}</div>
                ))}

                {days.map((date, idx) => {
                    if (!date) return <div key={idx} />;

                    const dayTasks = getTasksForDay(date);
                    const isToday = date.getDate() === today.getDate();

                    return (
                        <div key={idx} style={{
                            aspectRatio: '1',
                            background: isToday ? '#f0f0ff' : '#f9f9f9',
                            borderRadius: '8px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            border: isToday ? '1px solid #651fff' : '1px solid transparent'
                        }}>
                            <span style={{ fontSize: '12px', fontWeight: isToday ? 'bold' : 'normal', color: isToday ? '#651fff' : '#333' }}>
                                {date.getDate()}
                            </span>
                            {dayTasks.length > 0 && (
                                <div style={{ display: 'flex', gap: '2px', marginTop: '4px' }}>
                                    {dayTasks.slice(0, 3).map((t, ti) => (
                                        <div key={ti} style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#ff9800' }} />
                                    ))}
                                    {dayTasks.length > 3 && <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#999' }} />}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CalendarGrid;
