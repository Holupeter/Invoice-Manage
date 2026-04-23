import React, { useState, useRef, useEffect } from 'react';
import styles from './DatePicker.module.css';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const DatePicker = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  // Parse the current value or default to today
  const currentDate = value ? new Date(value) : new Date();
  const [viewMonth, setViewMonth] = useState(currentDate.getMonth());
  const [viewYear, setViewYear] = useState(currentDate.getFullYear());

  // Close on outside click
  useEffect(() => {
    const handle = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  // Sync view when value changes
  useEffect(() => {
    if (value) {
      const d = new Date(value);
      setViewMonth(d.getMonth());
      setViewYear(d.getFullYear());
    }
  }, [value]);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  };

  const selectDay = (day) => {
    const selected = new Date(viewYear, viewMonth, day);
    const yyyy = selected.getFullYear();
    const mm = String(selected.getMonth() + 1).padStart(2, '0');
    const dd = String(selected.getDate()).padStart(2, '0');
    onChange(`${yyyy}-${mm}-${dd}`);
    setIsOpen(false);
  };

  // Build calendar grid
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  // Monday-start: adjust firstDay (0=Sun → 6, 1=Mon → 0, etc.)
  const startDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const cells = [];

  // Previous month's trailing days
  for (let i = startDay - 1; i >= 0; i--) {
    cells.push({ day: daysInPrevMonth - i, type: 'prev' });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, type: 'current' });
  }

  // Next month's leading days to fill the grid (6 rows max)
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    cells.push({ day: d, type: 'next' });
  }

  // Trim to 5 rows if possible
  const rows = [];
  for (let i = 0; i < cells.length; i += 7) {
    rows.push(cells.slice(i, i + 7));
  }
  // Remove the 6th row if it's entirely "next" month days
  if (rows.length > 5 && rows[5].every(c => c.type === 'next')) {
    rows.pop();
  }

  // Check if a cell is the selected date
  const selectedDate = value ? new Date(value) : null;
  const isSelected = (cell) => {
    if (!selectedDate || cell.type !== 'current') return false;
    return selectedDate.getDate() === cell.day &&
           selectedDate.getMonth() === viewMonth &&
           selectedDate.getFullYear() === viewYear;
  };

  // Format display value
  const displayValue = value
    ? new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : '';

  return (
    <div className={styles.wrapper} ref={ref}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{displayValue || 'Select date'}</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M14 2H13V0H11V2H5V0H3V2H2C0.9 2 0 2.9 0 4V14C0 15.1 0.9 16 2 16H14C15.1 16 14 15.1 14 14V4C16 2.9 15.1 2 14 2Z" fill="#7C5DFA" opacity="0"/>
          <path d="M3.5 4H12.5V5H3.5V4ZM1 7H15V14C15 14.55 14.55 15 14 15H2C1.45 15 1 14.55 1 14V7Z" fill="#7E88C3" opacity="0"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M4 0.5C4 0.223858 3.77614 0 3.5 0C3.22386 0 3 0.223858 3 0.5V1H1.5C0.671573 1 0 1.67157 0 2.5V13.5C0 14.3284 0.671573 15 1.5 15H14.5C15.3284 15 16 14.3284 16 13.5V2.5C16 1.67157 15.3284 1 14.5 1H13V0.5C13 0.223858 12.7761 0 12.5 0C12.2239 0 12 0.223858 12 0.5V1H4V0.5ZM1 4V2.5C1 2.22386 1.22386 2 1.5 2H14.5C14.7761 2 15 2.22386 15 2.5V4H1ZM1 5H15V13.5C15 13.7761 14.7761 14 14.5 14H1.5C1.22386 14 1 13.7761 1 13.5V5Z" fill="#7E88C3"/>
        </svg>
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          {/* Month/Year header with arrows */}
          <div className={styles.header}>
            <button type="button" className={styles.navBtn} onClick={prevMonth}>
              <svg width="7" height="10" viewBox="0 0 7 10"><path d="M6.342.886L1.228 6l5.114 5.114" stroke="#7C5DFA" strokeWidth="2" fill="none"/></svg>
            </button>
            <span className={styles.monthYear}>{MONTHS[viewMonth]} {viewYear}</span>
            <button type="button" className={styles.navBtn} onClick={nextMonth}>
              <svg width="7" height="10" viewBox="0 0 7 10"><path d="M.658.886L5.772 6 .658 11.114" stroke="#7C5DFA" strokeWidth="2" fill="none"/></svg>
            </button>
          </div>

          {/* Day grid */}
          <div className={styles.grid}>
            {rows.map((row, ri) => (
              row.map((cell, ci) => (
                <button
                  key={`${ri}-${ci}`}
                  type="button"
                  className={`${styles.day} ${cell.type !== 'current' ? styles.otherMonth : ''} ${isSelected(cell) ? styles.selected : ''}`}
                  onClick={() => cell.type === 'current' && selectDay(cell.day)}
                  disabled={cell.type !== 'current'}
                >
                  {cell.day}
                </button>
              ))
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
