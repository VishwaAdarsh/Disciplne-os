import { useState, useEffect, useCallback } from 'react';
import {
  FileText,
  Printer,
  Download,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Info,
  RefreshCw,
  Award,
  CheckSquare,
  Heart,
  Brain,
  Utensils,
  Target,
  Database,
  ChevronDown,
} from 'lucide-react';
import { reportsApi } from '../services/reports/reportsApi';
import type { ReportSummaryDTO, ReportPeriod, ReportCategory, CSVDataset } from '../types/reports';

export default function ReportsPage() {
  const [period, setPeriod] = useState<ReportPeriod>('7d');
  const [category, setCategory] = useState<ReportCategory>('overall');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [customError, setCustomError] = useState<string | null>(null);

  const [report, setReport] = useState<ReportSummaryDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [downloadingCSV, setDownloadingCSV] = useState<boolean>(false);
  const [downloadingJSON, setDownloadingJSON] = useState<boolean>(false);
  const [showCSVMenu, setShowCSVMenu] = useState<boolean>(false);

  // Initialize dates for custom picker
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const prevWeek = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    setStartDate(prevWeek);
    setEndDate(today);
  }, []);

  const loadReport = useCallback(
    async (selectedPeriod: ReportPeriod, selectedCat: ReportCategory, customStart?: string, customEnd?: string) => {
      setLoading(true);
      setError(null);
      setCustomError(null);

      try {
        const params: any = {
          period: selectedPeriod,
          category: selectedCat,
        };

        if (selectedPeriod === 'custom') {
          if (!customStart || !customEnd) {
            setCustomError('Please provide both start and end dates');
            setLoading(false);
            return;
          }
          if (customStart > customEnd) {
            setCustomError('Start date must be before or equal to end date');
            setLoading(false);
            return;
          }
          params.startDate = customStart;
          params.endDate = customEnd;
        }

        const data = await reportsApi.getSummary(params);
        setReport(data);
      } catch (err: any) {
        console.error('Failed to generate report:', err);
        setError(err?.response?.data?.message || err?.message || 'Failed to generate report summary');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (period !== 'custom') {
      loadReport(period, category);
    }
  }, [period, category, loadReport]);

  const handleApplyCustomDates = () => {
    loadReport('custom', category, startDate, endDate);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = async (dataset: CSVDataset) => {
    setShowCSVMenu(false);
    setDownloadingCSV(true);
    try {
      await reportsApi.downloadCSV(
        dataset,
        period === 'custom' ? startDate : undefined,
        period === 'custom' ? endDate : undefined
      );
    } catch (err: any) {
      alert('Failed to export CSV: ' + (err?.response?.data?.message || err?.message || 'Unknown error'));
    } finally {
      setDownloadingCSV(false);
    }
  };

  const handleExportJSON = async () => {
    setDownloadingJSON(true);
    try {
      await reportsApi.downloadJSON();
    } catch (err: any) {
      alert('Failed to export JSON backup: ' + (err?.response?.data?.message || err?.message || 'Unknown error'));
    } finally {
      setDownloadingJSON(false);
    }
  };

  return (
    <div className="reports-container" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Print-only CSS Rules */}
      <style>{`
        @media print {
          /* Hide non-printable elements */
          nav, footer, .hide-on-print, .reports-controls, .mobile-only-nav {
            display: none !important;
          }
          body, main, .reports-container {
            background: #ffffff !important;
            color: #000000 !important;
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
            box-shadow: none !important;
          }
          .printable-report {
            border: 1px solid #e5e7eb !important;
            box-shadow: none !important;
            padding: 24px !important;
            background: #ffffff !important;
            color: #111827 !important;
          }
          .printable-card {
            background: #f9fafb !important;
            border: 1px solid #e5e7eb !important;
            color: #111827 !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          .printable-text-muted {
            color: #4b5563 !important;
          }
          .printable-header {
            border-bottom: 2px solid #111827 !important;
            margin-bottom: 20px !important;
            padding-bottom: 15px !important;
          }
          @page {
            size: A4 portrait;
            margin: 15mm;
          }
        }
      `}</style>

      {/* TOP HEADER & ACTIONS (Hidden in Print) */}
      <div className="hide-on-print" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={22} color="#6366F1" />
              <h1 className="font-sekuya" style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                Executive Reports & Data Export
              </h1>
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
              Generate comprehensive performance audits, printable PDFs, CSV dataset exports, and sanitized backups.
            </p>
          </div>

          {/* EXPORT ACTION BUTTONS */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', position: 'relative' }}>
            {/* Print / Save PDF Button */}
            <button
              onClick={handlePrint}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                background: '#6366F1',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(99,102,241,0.25)',
              }}
              title="Print or Save as PDF"
            >
              <Printer size={15} />
              <span>Export PDF / Print</span>
            </button>

            {/* CSV Export Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowCSVMenu(!showCSVMenu)}
                disabled={downloadingCSV}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  background: 'var(--input-bg)',
                  border: '1px solid var(--card-border)',
                  color: 'var(--text-main)',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <Download size={15} />
                <span>{downloadingCSV ? 'Exporting...' : 'Export CSV'}</span>
                <ChevronDown size={14} />
              </button>

              {showCSVMenu && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '6px',
                    width: '210px',
                    background: 'var(--card-bg)',
                    border: '1px solid var(--card-border)',
                    borderRadius: '10px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                    zIndex: 100,
                    padding: '6px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                  }}
                >
                  <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', padding: '6px 8px', textTransform: 'uppercase' }}>
                    Select Dataset
                  </span>
                  {(
                    [
                      { key: 'all', label: 'Complete Dataset (All)' },
                      { key: 'discipline', label: 'Discipline (Tasks & Habits)' },
                      { key: 'body', label: 'Body (Workouts)' },
                      { key: 'mind', label: 'Mind (Mood Logs)' },
                      { key: 'nutrition', label: 'Nutrition (Meals)' },
                      { key: 'goals', label: 'Goals & Milestones' },
                      { key: 'performance', label: 'Performance Snapshots' },
                    ] as const
                  ).map((item) => (
                    <button
                      key={item.key}
                      onClick={() => handleExportCSV(item.key)}
                      style={{
                        textAlign: 'left',
                        padding: '8px 10px',
                        borderRadius: '6px',
                        background: 'none',
                        border: 'none',
                        fontSize: '12px',
                        color: 'var(--text-main)',
                        cursor: 'pointer',
                        fontWeight: 500,
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--input-bg)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* JSON Export Button */}
            <button
              onClick={handleExportJSON}
              disabled={downloadingJSON}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                background: 'var(--input-bg)',
                border: '1px solid var(--card-border)',
                color: 'var(--text-main)',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
              title="Download full sanitized JSON backup"
            >
              <Database size={15} />
              <span>{downloadingJSON ? 'Exporting...' : 'Backup (JSON)'}</span>
            </button>
          </div>
        </div>

        {/* PERIOD CONTROLS BAR */}
        <div
          className="reports-controls"
          style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            borderRadius: '12px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          {/* Period Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginRight: '4px' }}>
              Report Period:
            </span>
            {(
              [
                { key: 'today', label: 'Today' },
                { key: '7d', label: 'Last 7 Days' },
                { key: '30d', label: 'Last 30 Days' },
                { key: '90d', label: 'Last 90 Days' },
                { key: 'custom', label: 'Custom Range' },
              ] as const
            ).map((p) => (
              <button
                key={p.key}
                onClick={() => setPeriod(p.key)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: period === p.key ? '#6366F1' : 'var(--input-bg)',
                  color: period === p.key ? '#FFFFFF' : 'var(--text-muted)',
                  transition: 'all 0.15s',
                }}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Module Filter Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginRight: '4px' }}>
              Focus:
            </span>
            {(
              [
                { key: 'overall', label: 'All Modules' },
                { key: 'discipline', label: 'Discipline' },
                { key: 'body', label: 'Body' },
                { key: 'mind', label: 'Mind' },
                { key: 'nutrition', label: 'Nutrition' },
                { key: 'goals', label: 'Goals' },
              ] as const
            ).map((c) => (
              <button
                key={c.key}
                onClick={() => setCategory(c.key)}
                style={{
                  padding: '5px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: category === c.key ? 'rgba(99,102,241,0.2)' : 'transparent',
                  color: category === c.key ? '#6366F1' : 'var(--text-muted)',
                }}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* CUSTOM DATE RANGE PICKER (If custom period selected) */}
        {period === 'custom' && (
          <div
            style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--card-border)',
              borderRadius: '12px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>From:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{
                  background: 'var(--input-bg)',
                  border: '1px solid var(--card-border)',
                  color: 'var(--text-main)',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  fontSize: '12px',
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>To:</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{
                  background: 'var(--input-bg)',
                  border: '1px solid var(--card-border)',
                  color: 'var(--text-main)',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  fontSize: '12px',
                }}
              />
            </div>

            <button
              onClick={handleApplyCustomDates}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                background: '#6366F1',
                color: '#FFF',
                border: 'none',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Apply Range
            </button>

            {customError && (
              <span style={{ fontSize: '12px', color: '#EF4444', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <AlertTriangle size={14} />
                {customError}
              </span>
            )}
          </div>
        )}
      </div>

      {/* ERROR STATE */}
      {error && (
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertTriangle size={18} color="#EF4444" />
            <span style={{ fontSize: '13px', color: '#EF4444' }}>{error}</span>
          </div>
          <button
            onClick={() => loadReport(period, category, startDate, endDate)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '6px',
              background: 'var(--input-bg)',
              border: '1px solid var(--card-border)',
              color: 'var(--text-main)',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={14} />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* LOADING STATE */}
      {loading && !report && (
        <div
          style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            borderRadius: '16px',
            padding: '60px',
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: '14px',
          }}
        >
          Generating DisciplineOS Executive Report...
        </div>
      )}

      {/* MAIN STRUCTURED REPORT (Printable & Viewable) */}
      {report && (
        <div
          className="printable-report"
          style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            borderRadius: '16px',
            padding: '28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          }}
        >
          {/* REPORT HEADER */}
          <div
            className="printable-header"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              borderBottom: '1px solid var(--card-border)',
              paddingBottom: '20px',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span className="font-sekuya" style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)' }}>
                  Discipline<span className="text-gradient-brand">OS</span>
                </span>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    background: 'rgba(99,102,241,0.15)',
                    color: '#6366F1',
                    padding: '2px 8px',
                    borderRadius: '12px',
                  }}
                >
                  Executive Audit
                </span>
              </div>
              <h2 style={{ fontSize: '16px', fontWeight: 700, margin: '2px 0 6px 0', color: 'var(--text-main)' }}>
                Performance & Operational Summary
              </h2>
              <div className="printable-text-muted" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Operator: <strong style={{ color: 'var(--text-main)' }}>{report.user.name}</strong> ({report.user.email})
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }} className="printable-text-muted">
                Audit Period:
              </div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>
                {report.startDate} → {report.endDate} ({report.daysCount} {report.daysCount === 1 ? 'day' : 'days'})
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }} className="printable-text-muted">
                Generated: {new Date(report.generatedAt).toLocaleString()}
              </div>
            </div>
          </div>

          {/* OVERALL PERFORMANCE SCORECARD */}
          {(category === 'overall' || category === 'discipline') && (
            <div
              className="printable-card"
              style={{
                background: 'var(--input-bg)',
                border: '1px solid var(--card-border)',
                borderRadius: '14px',
                padding: '20px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '16px',
              }}
            >
              <div>
                <span className="printable-text-muted" style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Performance Score
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
                  <span className="font-sekuya text-gradient-score" style={{ fontSize: '32px', fontWeight: 800 }}>
                    {report.performance.score}
                  </span>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>/ 1000</span>
                </div>
                <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 600 }}>
                  Level 0{report.performance.level} · {report.performance.status}
                </span>
              </div>

              <div>
                <span className="printable-text-muted" style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Trajectory
                </span>
                <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)', marginTop: '6px' }}>
                  {report.performance.trend}
                </div>
                <span className="printable-text-muted" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {report.performance.scoreHistory.length} snapshots in window
                </span>
              </div>

              <div>
                <span className="printable-text-muted" style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Streak Consistency
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                  <span style={{ fontSize: '18px' }}>🔥</span>
                  <span className="font-sekuya" style={{ fontSize: '20px', fontWeight: 700, color: '#F59E0B' }}>
                    {report.discipline.currentStreak} Days
                  </span>
                </div>
                <span className="printable-text-muted" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Best: {report.discipline.longestStreak} days
                </span>
              </div>

              <div>
                <span className="printable-text-muted" style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Task Execution
                </span>
                <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-main)', marginTop: '6px' }}>
                  {report.discipline.completionRate}%
                </div>
                <span className="printable-text-muted" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {report.discipline.tasksCompleted} of {report.discipline.tasksCreated} tasks
                </span>
              </div>
            </div>
          )}

          {/* HIGHLIGHTS & OBSERVATIONS */}
          <div className="printable-card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
              Audited Highlights & Observations
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
              {report.highlights.map((h, i) => (
                <div
                  key={i}
                  style={{
                    background:
                      h.type === 'success'
                        ? 'rgba(16, 185, 129, 0.08)'
                        : h.type === 'warning'
                        ? 'rgba(245, 158, 11, 0.08)'
                        : 'rgba(99, 102, 241, 0.08)',
                    border: `1px solid ${
                      h.type === 'success'
                        ? 'rgba(16, 185, 129, 0.25)'
                        : h.type === 'warning'
                        ? 'rgba(245, 158, 11, 0.25)'
                        : 'rgba(99, 102, 241, 0.25)'
                    }`,
                    borderRadius: '10px',
                    padding: '12px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                  }}
                >
                  {h.type === 'success' ? (
                    <CheckCircle2 size={18} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                  ) : h.type === 'warning' ? (
                    <AlertTriangle size={18} color="#F59E0B" style={{ flexShrink: 0, marginTop: '2px' }} />
                  ) : (
                    <Info size={18} color="#6366F1" style={{ flexShrink: 0, marginTop: '2px' }} />
                  )}
                  <div>
                    <strong style={{ fontSize: '13px', color: 'var(--text-main)', display: 'block' }}>{h.title}</strong>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.4 }}>{h.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DETAILED MODULE AUDIT CARDS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* 1. DISCIPLINE */}
            {(category === 'overall' || category === 'discipline') && (
              <div
                className="printable-card"
                style={{
                  background: 'var(--input-bg)',
                  border: '1px solid var(--card-border)',
                  borderRadius: '12px',
                  padding: '16px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <CheckSquare size={16} color="#6366F1" />
                  <h3 style={{ fontSize: '14px', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
                    Discipline Module
                  </h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
                  <div>
                    <span className="printable-text-muted" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Tasks Created</span>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>{report.discipline.tasksCreated}</div>
                  </div>
                  <div>
                    <span className="printable-text-muted" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Tasks Completed</span>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#10B981' }}>{report.discipline.tasksCompleted}</div>
                  </div>
                  <div>
                    <span className="printable-text-muted" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Execution Rate</span>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>{report.discipline.completionRate}%</div>
                  </div>
                  <div>
                    <span className="printable-text-muted" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Active Habits</span>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>{report.discipline.activeHabits}</div>
                  </div>
                  <div>
                    <span className="printable-text-muted" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Habit Consistency</span>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>{report.discipline.habitConsistencyRate}%</div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. BODY */}
            {(category === 'overall' || category === 'body') && (
              <div
                className="printable-card"
                style={{
                  background: 'var(--input-bg)',
                  border: '1px solid var(--card-border)',
                  borderRadius: '12px',
                  padding: '16px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <Heart size={16} color="#10B981" />
                  <h3 style={{ fontSize: '14px', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
                    Body & Health Module
                  </h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
                  <div>
                    <span className="printable-text-muted" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Workouts Logged</span>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>{report.body.workoutsCount}</div>
                  </div>
                  <div>
                    <span className="printable-text-muted" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Training Duration</span>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>{report.body.workoutMinutes} min</div>
                  </div>
                  <div>
                    <span className="printable-text-muted" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Calories Burned</span>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>{report.body.caloriesBurned} kcal</div>
                  </div>
                  <div>
                    <span className="printable-text-muted" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Avg Sleep</span>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>
                      {report.body.avgSleepHours} hrs ({report.body.avgSleepQuality}%)
                    </div>
                  </div>
                  <div>
                    <span className="printable-text-muted" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Avg Daily Water</span>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>{report.body.avgWaterLiters} L</div>
                  </div>
                  <div>
                    <span className="printable-text-muted" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Weight Trend</span>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>
                      {report.body.latestWeightKg ? `${report.body.latestWeightKg} kg` : '—'}
                      {report.body.weightChangeKg !== null && (
                        <span style={{ fontSize: '11px', marginLeft: '4px', color: report.body.weightChangeKg <= 0 ? '#10B981' : '#F59E0B' }}>
                          ({report.body.weightChangeKg > 0 ? `+${report.body.weightChangeKg}` : report.body.weightChangeKg} kg)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. MIND */}
            {(category === 'overall' || category === 'mind') && (
              <div
                className="printable-card"
                style={{
                  background: 'var(--input-bg)',
                  border: '1px solid var(--card-border)',
                  borderRadius: '12px',
                  padding: '16px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <Brain size={16} color="#8B5CF6" />
                  <h3 style={{ fontSize: '14px', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
                    Mind & Mental Resilience
                  </h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
                  <div>
                    <span className="printable-text-muted" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Dominant Mood</span>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>{report.mind.dominantMood}</div>
                  </div>
                  <div>
                    <span className="printable-text-muted" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Avg Stress (1-10)</span>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>
                      {report.mind.avgStress !== null ? report.mind.avgStress : '—'}
                    </div>
                  </div>
                  <div>
                    <span className="printable-text-muted" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Avg Focus (1-100)</span>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>
                      {report.mind.avgFocus !== null ? report.mind.avgFocus : '—'}
                    </div>
                  </div>
                  <div>
                    <span className="printable-text-muted" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Meditation</span>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>
                      {report.mind.meditationSessions} sessions ({report.mind.meditationMinutes}m)
                    </div>
                  </div>
                  <div>
                    <span className="printable-text-muted" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Journals Written</span>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>{report.mind.journalEntriesCount}</div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. NUTRITION */}
            {(category === 'overall' || category === 'nutrition') && (
              <div
                className="printable-card"
                style={{
                  background: 'var(--input-bg)',
                  border: '1px solid var(--card-border)',
                  borderRadius: '12px',
                  padding: '16px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <Utensils size={16} color="#F59E0B" />
                  <h3 style={{ fontSize: '14px', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
                    Nutrition & Caloric Intake
                  </h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
                  <div>
                    <span className="printable-text-muted" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Avg Daily Intake</span>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>
                      {report.nutrition.avgCalories} kcal
                    </div>
                  </div>
                  <div>
                    <span className="printable-text-muted" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Target Calories</span>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>
                      {report.nutrition.targetCalories} kcal
                    </div>
                  </div>
                  <div>
                    <span className="printable-text-muted" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Target Adherence</span>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#10B981' }}>{report.nutrition.adherenceRate}%</div>
                  </div>
                  <div>
                    <span className="printable-text-muted" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Protein / Carbs / Fat</span>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
                      {report.nutrition.avgProtein}g / {report.nutrition.avgCarbs}g / {report.nutrition.avgFat}g
                    </div>
                  </div>
                  <div>
                    <span className="printable-text-muted" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Meals Logged</span>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>{report.nutrition.mealsLogged}</div>
                  </div>
                </div>
              </div>
            )}

            {/* 5. GOALS */}
            {(category === 'overall' || category === 'goals') && (
              <div
                className="printable-card"
                style={{
                  background: 'var(--input-bg)',
                  border: '1px solid var(--card-border)',
                  borderRadius: '12px',
                  padding: '16px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <Target size={16} color="#06B6D4" />
                  <h3 style={{ fontSize: '14px', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
                    Goals & Milestone Targets
                  </h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
                  <div>
                    <span className="printable-text-muted" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Goals Created</span>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>{report.goals.goalsCreated}</div>
                  </div>
                  <div>
                    <span className="printable-text-muted" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Goals Completed</span>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#10B981' }}>{report.goals.goalsCompleted}</div>
                  </div>
                  <div>
                    <span className="printable-text-muted" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Active Goals</span>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>{report.goals.activeGoals}</div>
                  </div>
                  <div>
                    <span className="printable-text-muted" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Overdue Goals</span>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: report.goals.overdueGoals > 0 ? '#EF4444' : 'var(--text-main)' }}>
                      {report.goals.overdueGoals}
                    </div>
                  </div>
                  <div>
                    <span className="printable-text-muted" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Avg Progress</span>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>{report.goals.avgProgressPercent}%</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* REPORT FOOTER */}
          <div
            style={{
              borderTop: '1px solid var(--card-border)',
              paddingTop: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '11px',
              color: 'var(--text-muted)',
            }}
            className="printable-text-muted"
          >
            <span>DisciplineOS Personal Performance Operating System · Confidential User Audit</span>
            <span>Generated from verified local telemetry records</span>
          </div>
        </div>
      )}
    </div>
  );
}
