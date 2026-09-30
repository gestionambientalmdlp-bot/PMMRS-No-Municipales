import React from 'react';
import { parseMarkdownTableStrings } from '../utils/excelAnnexes';

interface FormattedChapterContentProps {
  content: string;
}

export const FormattedChapterContent: React.FC<FormattedChapterContentProps> = ({ content }) => {
  if (!content || !content.trim()) {
    return <p className="text-gray-400 italic">[Contenido pendiente de formulación]</p>;
  }

  const segments = parseMarkdownTableStrings(content);

  return (
    <div className="space-y-4 text-justify">
      {segments.map((seg, idx) => {
        if (seg.type === 'table' && seg.headers && seg.headers.length > 0) {
          return (
            <div key={idx} className="my-4 overflow-x-auto rounded-xl border border-gray-300 shadow-xs bg-white">
              <table className="w-full text-left text-xs border-collapse font-sans">
                <thead>
                  <tr className="bg-[#6C0053] text-white">
                    {seg.headers.map((h, i) => (
                      <th key={i} className="p-2.5 border border-[#51003d] font-bold text-[11px] whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(seg.rows || []).map((row, rIdx) => (
                    <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-pink-50/30'}>
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="p-2 border border-gray-200 text-gray-800 text-[11px] whitespace-nowrap">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        // Narrative text block (may have headers like ### or quotes)
        const paragraphs = seg.content.split('\n');
        return (
          <div key={idx} className="space-y-2">
            {paragraphs.map((para, pIdx) => {
              const trimmed = para.trim();
              if (!trimmed) return null;

              if (trimmed.startsWith('### ')) {
                return (
                  <h4 key={pIdx} className="font-sans font-bold text-sm text-[#6C0053] mt-3 mb-1 border-b border-pink-100 pb-1">
                    {trimmed.replace('### ', '')}
                  </h4>
                );
              }

              if (trimmed.startsWith('> *') && trimmed.endsWith('*')) {
                return (
                  <p key={pIdx} className="font-sans text-xs text-gray-500 italic bg-gray-50 px-3 py-1.5 rounded-lg border-l-4 border-[#70BA74]">
                    {trimmed.replace(/^>\s*\*/, '').replace(/\*$/, '')}
                  </p>
                );
              }

              return (
                <p key={pIdx} className="whitespace-pre-line text-gray-800 leading-relaxed font-serif text-sm">
                  {trimmed}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
