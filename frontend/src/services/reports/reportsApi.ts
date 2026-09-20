/**
 * Reports & Data Export API Service (SPR-317)
 */

import api from '../../api/client';
import type { ReportSummaryDTO, CSVDataset } from '../../types/reports';

export const reportsApi = {
  /**
   * Fetches the aggregated report summary for the selected period & category.
   */
  async getSummary(params: {
    period: string;
    startDate?: string;
    endDate?: string;
    category?: string;
  }): Promise<ReportSummaryDTO> {
    const res = await api.get('/v1/reports/summary', { params });
    return res.data?.data || res.data;
  },

  /**
   * Triggers a browser download of the tabular CSV export.
   */
  async downloadCSV(dataset: CSVDataset = 'all', startDate?: string, endDate?: string): Promise<void> {
    const params: Record<string, string> = { dataset };
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const res = await api.get('/v1/reports/export/csv', {
      params,
      responseType: 'blob',
    });

    // Extract filename from Content-Disposition header if available
    const disposition = res.headers['content-disposition'];
    let filename = `disciplineos-${dataset}-${new Date().toISOString().split('T')[0]}.csv`;
    if (disposition && disposition.includes('filename=')) {
      const match = disposition.match(/filename="?([^"]+)"?/);
      if (match && match[1]) filename = match[1];
    }

    const blob = new Blob([res.data], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  /**
   * Triggers a browser download of the full sanitized JSON backup.
   */
  async downloadJSON(): Promise<void> {
    const res = await api.get('/v1/reports/export/json', {
      responseType: 'blob',
    });

    const disposition = res.headers['content-disposition'];
    let filename = `disciplineos-export-${new Date().toISOString().split('T')[0]}.json`;
    if (disposition && disposition.includes('filename=')) {
      const match = disposition.match(/filename="?([^"]+)"?/);
      if (match && match[1]) filename = match[1];
    }

    const blob = new Blob([res.data], { type: 'application/json;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};
