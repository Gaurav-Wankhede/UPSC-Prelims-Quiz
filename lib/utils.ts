import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface ParsedTableData {
  headers: string[];
  rows: Array<{
    category1: string;
    category2: string;
    category3: string;
  }>;
}

export function parseTableFromText(text: string): ParsedTableData | null {
  try {
    // Find the table content between the first and last pipe characters
    const tableMatch = text.match(/\|(.*?)\|(?:\s*\|.*?\|)*\s*\n\s*\|(?:[- ]*\|)+\s*\n((?:\s*\|.*?\|(?:\s*\n|$))*)/);
    if (!tableMatch) return null;

    // Extract headers
    const headerRow = tableMatch[1].trim();
    const headers = headerRow.split('|').map(h => h.trim()).filter(Boolean);

    // Extract data rows
    const dataSection = tableMatch[2];
    const dataRows = dataSection
      .trim()
      .split('\n')
      .map(row => {
        const cells = row
          .split('|')
          .map(cell => cell.trim())
          .filter(Boolean);
        
        // Remove any numbering (e.g., "1.", "2.") from the first cell
        const firstCell = cells[0].replace(/^\d+\.\s*/, '');
        
        return {
          category1: firstCell,
          category2: cells[1] || '',
          category3: cells[2] || '',
        };
      })
      .filter(row => row.category1 || row.category2 || row.category3);

    return {
      headers,
      rows: dataRows,
    };
  } catch (error) {
    console.error('Error parsing table:', error);
    return null;
  }
}

// Function to extract the question part before the table
export function extractQuestionPart(text: string): string {
  const beforeTable = text.split('|')[0].trim();
  return beforeTable;
}

// Function to extract the question part after the table
export function extractQuestionAfterTable(text: string): string {
  const afterTable = text.split('\n').filter(line => !line.includes('|')).pop()?.trim() || '';
  return afterTable;
}
