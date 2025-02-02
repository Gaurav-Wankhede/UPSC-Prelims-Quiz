import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { TableData, PairMatchData } from "@/lib/schemas";

interface QuestionTableProps {
  type: 'table-match' | 'pair-match';
  tableData?: TableData;
  pairMatchData?: PairMatchData;
  className?: string;
}

const ListsTable: React.FC<{ data: PairMatchData }> = ({ data }) => (
  <div className="rounded-lg overflow-x-auto border border-border">
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/50 border-b border-border">
          <TableHead className="text-center py-2 text-sm font-semibold text-foreground whitespace-nowrap">List-I</TableHead>
          <TableHead className="text-center py-2 text-sm font-semibold text-foreground whitespace-nowrap">List-II</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.listI.map((item, index) => (
          <TableRow key={item.id} className="border-b border-border">
            <TableCell className="py-2 px-4 min-w-[180px] sm:min-w-[200px]">
              {`${index + 1}. ${item.text}`}
            </TableCell>
            <TableCell className="py-2 px-4 min-w-[180px] sm:min-w-[200px]">
              {data.listII[index] && (
                `${String.fromCharCode(65 + index)}. ${data.listII[index].text}`
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

const PairsTable: React.FC<{ data: PairMatchData }> = ({ data }) => (
  <div className="space-y-4 w-full">
    <div className="text-sm font-medium mb-2">Consider the following pairs:</div>
    <div className="grid grid-cols-1 gap-2">
      {[
        { num: '1', letter: 'B' },
        { num: '2', letter: 'A' },
        { num: '3', letter: 'D' },
        { num: '4', letter: 'C' }
      ].map((pair, index) => (
        <div key={index} className="flex items-start space-x-2">
          <span className="text-sm font-medium">{index + 1}.</span>
          <div className="flex-1">
            <span className="text-sm">
              {data.listI[Number(pair.num) - 1].text} : {data.listII[pair.letter.charCodeAt(0) - 65].text}
            </span>
          </div>
        </div>
      ))}
    </div>
    <div className="text-sm mt-4">Which of the above pairs are correctly matched?</div>
    <div className="grid grid-cols-1 gap-2">
      {[
        { label: 'a', text: 'All pairs' },
        { label: 'b', text: '1 and 4 only' },
        { label: 'c', text: '2 and 3 only' },
        { label: 'd', text: '3 only' }
      ].map((option) => (
        <div key={option.label} className="flex items-center space-x-2">
          <div className="text-sm">{`(${option.label})`}</div>
          <div className="text-sm">{option.text}</div>
        </div>
      ))}
    </div>
  </div>
);

export function QuestionTable({ type, tableData, pairMatchData, className }: QuestionTableProps) {
  if (type === 'table-match' && tableData) {
    return (
      <div className={cn("my-6 overflow-x-auto", className)}>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[100px] text-center whitespace-nowrap">#</TableHead>
              {tableData.headers.map((header, index) => (
                <TableHead key={index} className="text-center font-semibold whitespace-nowrap min-w-[150px]">
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.rows.map((row, rowIndex) => (
              <TableRow key={rowIndex} className="hover:bg-muted/50">
                <TableCell className="text-center font-medium whitespace-nowrap">
                  {rowIndex + 1}.
                </TableCell>
                <TableCell className="text-center whitespace-nowrap">{row.category1}</TableCell>
                <TableCell className="text-center whitespace-nowrap">{row.category2}</TableCell>
                {row.category3 && (
                  <TableCell className="text-center whitespace-nowrap">{row.category3}</TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (type === 'pair-match' && pairMatchData) {
    return (
      <div className={cn("space-y-6 w-full overflow-x-auto", className)}>
        <PairsTable data={pairMatchData} />
        <ListsTable data={pairMatchData} />
      </div>
    );
  }

  return null;
}
