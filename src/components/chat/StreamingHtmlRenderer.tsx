// import React, { useState, useEffect } from 'react';
// import ReactMarkdown from 'react-markdown';
// import remarkGfm from 'remark-gfm';

// interface StreamingHtmlRendererProps {
//   messageId: string;
//   content: string;
//   streamingContent?: string;
// }

// export const StreamingHtmlRenderer: React.FC<StreamingHtmlRendererProps> = ({ 
//   messageId, 
//   content, 
//   streamingContent 
// }) => {
//   const [processedContent, setProcessedContent] = useState('');

//   useEffect(() => {
//     const contentToRender = streamingContent || content;
//     if (!contentToRender) {
//       setProcessedContent('');
//       return;
//     }

//     let formatted = contentToRender;

//     const producerReportPatterns = [
//       /(\d+\.\s+\*\*([^:]+):\*\*\s*Cases Paid \(7 Days\):\s*(\d+),\s*Recent Premium:\s*([^,]+),\s*YTD Total Premium:\s*([^\n]+))/g,
//       /(\d+\.\s+\*\*([^-]+)\*\*\s*-\s*Cases Paid \(7 Days\):\s*(\d+),\s*Recent Premium:\s*([^,]+),\s*YTD Total Premium:\s*([^\n]+))/g,
//       /(\d+\.\s+([^:]+):\s*Cases Paid \(7 Days\):\s*(\d+),\s*Recent Premium:\s*([^,]+),\s*YTD Total Premium:\s*([^\n]+))/g
//     ];

//     const hasProducerData = formatted.includes('Cases Paid (7 Days):');
//     if (hasProducerData) {
//       const introMatch = formatted.match(/^(.+?)(?=\d+\.\s+)/s);
//       const introText = introMatch ? introMatch[1] : '';

//       const summaryMatch = formatted.match(/(Summary:.*?)(?=<|$)/s);
//       const summaryText = summaryMatch ? summaryMatch[1] : '';

//       const producerRows: string[] = [];

//       producerReportPatterns.forEach(pattern => {
//         formatted = formatted.replace(pattern, (match, rank, name, casesPaid, recentPremium, ytdPremium) => {
//           const cleanName = name.replace(/\*\*/g, '').trim();
//           producerRows.push(`| ${rank} | ${cleanName} | ${casesPaid} | ${recentPremium} | ${ytdPremium} |`);
//           return '';
//         });
//       });

//       if (producerRows.length > 0) {
//         const markdownTable = `
// ${introText}

// | # | Producer Name | Cases Paid (7 Days) | Recent Premium | YTD Total Premium |
// | --- | --- | --- | --- | --- |
// ${producerRows.join('\n')}

// ${summaryText}
//         `;

//         formatted = markdownTable;
//       }
//     }

//     setProcessedContent(formatted);
//   }, [content, streamingContent]);

//   if (!processedContent) {
//     return null;
//   }

//   return (
//     <div className="text-sm leading-relaxed prose prose-sm max-w-none 
//         prose-headings:text-foreground prose-headings:font-semibold prose-headings:mb-3 prose-headings:mt-6 prose-headings:first:mt-0
//         prose-h1:text-xl prose-h1:font-bold prose-h1:mb-4 prose-h1:mt-6
//         prose-h2:text-lg prose-h2:font-semibold prose-h2:mb-3 prose-h2:mt-5
//         prose-h3:text-base prose-h3:font-semibold prose-h3:mb-2 prose-h3:mt-4
//         prose-p:text-foreground prose-p:mb-3 prose-p:leading-relaxed
//         prose-strong:font-semibold prose-strong:text-primary
//         prose-code:text-foreground prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:font-mono
//         prose-pre:bg-muted prose-pre:text-foreground prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto prose-pre:border prose-pre:border-border
//         prose-blockquote:text-muted-foreground prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:bg-muted/30 prose-blockquote:py-2 prose-blockquote:rounded-r
//         prose-ul:text-foreground prose-ul:mb-4 prose-ul:pl-4 prose-ul:space-y-1
//         prose-ol:text-foreground prose-ol:mb-4 prose-ol:pl-4 prose-ol:space-y-1
//         prose-li:text-foreground prose-li:mb-1 prose-li:leading-relaxed
//         prose-a:text-primary prose-a:underline prose-a:decoration-primary/50 prose-a:underline-offset-2 prose-a:font-medium
//       prose-table:text-foreground prose-table:border-collapse prose-table:w-full prose-table:my-4 prose-table:shadow-sm prose-table:rounded-lg prose-table:overflow-hidden
//       prose-th:border prose-th:border-border prose-th:px-4 prose-th:py-3 prose-th:bg-muted prose-th:text-left prose-th:font-semibold prose-th:text-sm prose-th:text-muted-foreground
//       prose-td:border prose-td:border-border prose-td:px-4 prose-td:py-3 prose-td:text-sm prose-td:hover:bg-muted/30 prose-td:transition-colors
//       prose-hr:border-border prose-hr:my-6">
//       <ReactMarkdown 
//         remarkPlugins={[remarkGfm]}
//         components={{
//           table: ({ children, ...props }) => (
//             <div className="overflow-x-auto my-6">
//               <table className="border-collapse w-full bg-background shadow-sm rounded-lg overflow-hidden" {...props}>
//                 {children}
//               </table>
//             </div>
//           ),
//           thead: ({ children, ...props }) => (
//             <thead className="bg-muted border-b border-border" {...props}>
//               {children}
//             </thead>
//           ),
//           tbody: ({ children, ...props }) => (
//             <tbody {...props}>
//               {children}
//             </tbody>
//           ),
//           tr: ({ children, ...props }) => (
//             <tr className="border-b border-border/50 hover:bg-muted/30 transition-colors" {...props}>
//               {children}
//             </tr>
//           ),
//           th: ({ children, ...props }) => (
//             <th className="border border-border px-4 py-3 text-left font-semibold text-sm text-muted-foreground" {...props}>
//               {children}
//             </th>
//           ),
//           td: ({ children, ...props }) => {
//             const content = typeof children === 'string' ? children : '';
//             const isNumber = /^\d+$/.test(content.trim());
//             const isCurrency = /^\$[\d,]+$/.test(content.trim());

//             let className = "border border-border px-4 py-3 text-sm";

//             if (isNumber) {
//               className += " text-center";
//             } else if (isCurrency) {
//               className += " text-right font-medium text-green-600";
//             }

//             return (
//               <td className={className} {...props}>
//                 {children}
//               </td>
//             );
//           }
//         }}
//       >
//         {processedContent}
//       </ReactMarkdown>
//     </div>
//   );
// };

// export default StreamingHtmlRenderer;



import React, { useState, useEffect } from 'react';

interface StreamingHtmlRendererProps {
  messageId: string;
  content: string;
  streamingContent?: string;
}

export const StreamingHtmlRenderer: React.FC<StreamingHtmlRendererProps> = ({
  messageId,
  content,
  streamingContent
}) => {
  const [displayContent, setDisplayContent] = useState('');

  useEffect(() => {
    const contentToRender = streamingContent || content;
    if (!contentToRender) {
      setDisplayContent('');
      return;
    }

    // Format the content with proper HTML markup
    let formatted = contentToRender;

    // Handle headers FIRST (before wrapping in paragraphs)
    // More robust header detection that works with streaming content
    formatted = formatted.replace(/^##\s+(.+)$/gm, '<h2 class="text-lg font-semibold mb-3 !mt-5">$1</h2>');
    formatted = formatted.replace(/^###\s+(.+)$/gm, '<h3 class="text-base font-semibold mb-2 mt-4">$1</h3>');
    formatted = formatted.replace(/^####\s+(.+)$/gm, '<h4 class="text-sm font-semibold mb-2 mt-3">$1</h4>');

    // Handle headers that might be in the middle of content (streaming chunks)
    formatted = formatted.replace(/(\n|^)##\s+(.+?)(?=\n|$)/g, '$1<h2 class="text-lg font-semibold mb-3 mt-5">$2</h2>');
    formatted = formatted.replace(/(\n|^)###\s+(.+?)(?=\n|$)/g, '$1<h3 class="text-base font-semibold mb-2 mt-4">$2</h3>');
    formatted = formatted.replace(/(\n|^)####\s+(.+?)(?=\n|$)/g, '$1<h4 class="text-sm font-semibold mb-2 mt-3">$2</h4>');

    // Debug: Log after header processing
    console.log('StreamingHtmlRenderer - After header processing:', formatted);
    console.log('StreamingHtmlRenderer - Contains <h2> tags:', formatted.includes('<h2'));

    // Convert markdown pipe tables BEFORE we alter newlines or wrap paragraphs
    const convertMarkdownTables = (text: string): string => {
      const lines = text.split(/\r?\n/);
      const outputLines: string[] = [];

      let i = 0;
      while (i < lines.length) {
        const line = lines[i];
        if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
          const tableBlock: string[] = [];
          while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
            tableBlock.push(lines[i].trim());
            i++;
          }

          if (tableBlock.length >= 2) {
            // Remove alignment/separator row if present (---, :---:, etc.)
            const rows = tableBlock
              .map(r => r.split('|').map(c => c.trim()).filter(c => c.length > 0));

            // Detect and drop separator row (second row usually)
            const cleanedRows: string[][] = [];
            for (let idx = 0; idx < rows.length; idx++) {
              const isSeparator = rows[idx].every(cell => /^:?-{3,}:?$/.test(cell));
              if (!isSeparator) cleanedRows.push(rows[idx]);
            }

            if (cleanedRows.length > 0) {
              const header = cleanedRows[0];
              const body = cleanedRows.slice(1);
              const tableHtml = [
                '<table class="border-collapse w-full my-4">',
                '<thead>',
                '<tr>',
                ...header.map(h => `<th class="border border-border px-3 py-2 bg-muted text-left font-semibold text-sm">${h}</th>`),
                '</tr>',
                '</thead>',
                '<tbody>',
                ...body.map(row => '<tr>' + row.map(c => `<td class="border border-border px-3 py-2 text-sm">${c}</td>`).join('') + '</tr>'),
                '</tbody>',
                '</table>'
              ].join('');
              outputLines.push(tableHtml);
              continue;
            }
          }

          // Fallback: if we couldn't parse, push the original lines back
          outputLines.push(...tableBlock);
          continue;
        }

        outputLines.push(line);
        i++;
      }

      return outputLines.join('\n');
    };

    formatted = convertMarkdownTables(formatted);

    // Handle line breaks and paragraphs (after table conversion)
    formatted = formatted.replace(/\n\n/g, '</p><p>');
    formatted = formatted.replace(/\n/g, '<br>');

    // Remove br tags after heading tags
    formatted = formatted.replace(/(<\/h[1-6]>)\s*<br>/g, '$1');

    // Wrap in paragraph tags if not already wrapped, but be careful with headers
    if (!formatted.startsWith('<p>') && !formatted.startsWith('<h')) {
      formatted = '<p>' + formatted + '</p>';
    }

    // Clean up any headers that got wrapped in paragraphs
    formatted = formatted.replace(/<p>(<h[1-6][^>]*>.*?<\/h[1-6]>)<\/p>/g, '$1');
    // Unwrap tables from paragraphs and remove stray <br> around tables
    formatted = formatted.replace(/<p>(\s*)?(<table[\s\S]*?<\/table>)(\s*)?<\/p>/g, '$2');
    formatted = formatted.replace(/(<\/table>)\s*<br>/g, '$1');

    // Handle bold text
    formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-primary">$1</strong>');

    // Handle italic text
    formatted = formatted.replace(/\*(.+?)\*/g, '<em class="italic">$1</em>');

    // Handle lists
    formatted = formatted.replace(/^(\d+\.\s+.+)$/gm, '<li class="mb-1 leading-relaxed">$1</li>');
    formatted = formatted.replace(/^(-\s+.+)$/gm, '<li class="mb-1 leading-relaxed">$1</li>');

    // Wrap consecutive list items in ul/ol
    formatted = formatted.replace(/(<li class="mb-1 leading-relaxed">.*?<\/li>)/gs, (match) => {
      const items = match.match(/<li class="mb-1 leading-relaxed">.*?<\/li>/g) || [];
      if (items.length === 0) return match;

      const isOrdered = items[0].includes('1.') || items[0].includes('2.') || items[0].includes('3.');
      const tag = isOrdered ? 'ol' : 'ul';
      const className = isOrdered
        ? 'mb-4 pl-4 space-y-1 list-decimal'
        : 'mb-4 pl-4 space-y-1 list-disc';

      return `<${tag} class="${className}">${match}</${tag}>`;
    });

    // Handle code blocks
    formatted = formatted.replace(/```([\s\S]*?)```/g, '<pre class="bg-muted text-foreground p-4 rounded-lg overflow-x-auto border border-border"><code class="text-xs font-mono">$1</code></pre>');

    // Handle inline code
    formatted = formatted.replace(/`([^`]+)`/g, '<code class="text-foreground bg-muted px-1.5 py-0.5 rounded text-xs font-mono">$1</code>');

    // Handle structured data that should be converted to tables
    // Look for patterns like "**Key:** Value" that should be in a table
    const structuredDataPattern = /(\*\*([^:]+):\*\*\s*([^\n]+)(?:\n|$))+/g;
    formatted = formatted.replace(structuredDataPattern, (match) => {
      const lines = match.trim().split('\n').filter(line => line.trim());
      if (lines.length < 2) return match; // Not enough data for a table

      // Extract key-value pairs
      const data = lines.map(line => {
        const match = line.match(/\*\*([^:]+):\*\*\s*(.+)/);
        if (match) {
          return { key: match[1].trim(), value: match[2].trim() };
        }
        return null;
      }).filter(Boolean);

      if (data.length === 0) return match;

      // Create table HTML
      const tableHtml = `
        <table class="border-collapse w-full my-4">
          <thead>
            <tr class="border-b border-border">
              <th class="border border-border px-3 py-2 bg-muted text-left font-semibold text-sm">Property</th>
              <th class="border border-border px-3 py-2 bg-muted text-left font-semibold text-sm">Value</th>
            </tr>
          </thead>
          <tbody>
            ${data.map(item => `
              <tr class="border-b border-border/50 hover:bg-muted/30 transition-colors">
                <td class="border border-border px-3 py-2 text-sm font-medium">${item.key}</td>
                <td class="border border-border px-3 py-2 text-sm">${item.value}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;

      return tableHtml;
    });

    // Handle producer data blocks that should be converted to tables
    // Look for patterns like "1. Name - X days overdue" followed by structured data
    const producerDataPattern = /(\d+\.\s+\*\*([^-]+)\*\*\s*-\s*(\d+\s+days?\s+overdue)\s*\n\s*-\s*([^\n]+)\s*\n\s*-\s*([^\n]+)\s*\n\s*-\s*([^\n]+))/g;
    formatted = formatted.replace(producerDataPattern, (match, rank, name, overdue, line1, line2, line3) => {
      // Parse the structured lines
      const parseLine = (line) => {
        const parts = line.split(' | ');
        return parts.map(part => {
          const colonIndex = part.indexOf(':');
          if (colonIndex > -1) {
            return {
              key: part.substring(0, colonIndex).trim(),
              value: part.substring(colonIndex + 1).trim()
            };
          }
          return { key: 'Info', value: part.trim() };
        });
      };

      const data1 = parseLine(line1);
      const data2 = parseLine(line2);
      const data3 = parseLine(line3);

      // Combine all data
      const allData = [
        { key: 'Producer', value: name },
        { key: 'Status', value: overdue },
        ...data1,
        ...data2,
        ...data3
      ];

      // Create table HTML
      const tableHtml = `
        <div class="my-4">
          <h4 class="text-sm font-semibold mb-2 text-foreground">${rank} ${name}</h4>
          <table class="border-collapse w-full">
            <tbody>
              ${allData.map(item => `
                <tr class="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td class="border border-border px-3 py-2 text-sm font-medium bg-muted/30 w-1/3">${item.key}</td>
                  <td class="border border-border px-3 py-2 text-sm">${item.value}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;

      return tableHtml;
    });

    // Handle simple key-value pairs that should be in tables
    // Look for patterns like "- Key: Value" that should be in a table
    const simpleKeyValuePattern = /(-\s*([^:]+):\s*([^\n]+)(?:\n|$))+/g;
    formatted = formatted.replace(simpleKeyValuePattern, (match) => {
      const lines = match.trim().split('\n').filter(line => line.trim());
      if (lines.length < 2) return match; // Not enough data for a table

      // Extract key-value pairs
      const data = lines.map(line => {
        const match = line.match(/-\s*([^:]+):\s*(.+)/);
        if (match) {
          return { key: match[1].trim(), value: match[2].trim() };
        }
        return null;
      }).filter(Boolean);

      if (data.length === 0) return match;

      // Create table HTML
      const tableHtml = `
        <table class="border-collapse w-full my-4">
          <thead>
            <tr class="border-b border-border">
              <th class="border border-border px-3 py-2 bg-muted text-left font-semibold text-sm">Property</th>
              <th class="border border-border px-3 py-2 bg-muted text-left font-semibold text-sm">Value</th>
            </tr>
          </thead>
          <tbody>
            ${data.map(item => `
              <tr class="border-b border-border/50 hover:bg-muted/30 transition-colors">
                <td class="border border-border px-3 py-2 text-sm font-medium">${item.key}</td>
                <td class="border border-border px-3 py-2 text-sm">${item.value}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;

      return tableHtml;
    });

    // Note: We already converted markdown tables above before line-break conversions

    // Handle blockquotes
    formatted = formatted.replace(/^> (.+)$/gm, '<blockquote class="text-muted-foreground border-l-4 border-primary pl-4 italic bg-muted/30 py-2 rounded-r">$1</blockquote>');

    // Handle horizontal rules
    formatted = formatted.replace(/^---$/gm, '<hr class="border-border my-6">');

    // Clean up empty paragraphs
    formatted = formatted.replace(/<p><\/p>/g, '');
    formatted = formatted.replace(/<p>\s*<\/p>/g, '');

    // Clean up multiple consecutive breaks
    formatted = formatted.replace(/(<br>\s*){3,}/g, '<br><br>');

    setDisplayContent(formatted);
  }, [content, streamingContent]);

  if (!displayContent) {
    return null;
  }

  return (
    <div
      className="text-sm leading-relaxed prose prose-sm max-w-none
        prose-headings:text-foreground prose-headings:font-semibold prose-headings:mb-3 prose-headings:mt-6 prose-headings:first:mt-0
        prose-h1:text-xl prose-h1:font-bold prose-h1:mb-4 prose-h1:mt-6
        prose-h2:text-lg prose-h2:font-semibold prose-h2:mb-3 prose-h2:mt-5
        prose-h3:text-base prose-h3:font-semibold prose-h3:mb-2 prose-h3:mt-4
        prose-p:text-foreground prose-p:mb-3 prose-p:leading-relaxed
        prose-strong:font-semibold prose-strong:text-primary
        prose-code:text-foreground prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:font-mono
        prose-pre:bg-muted prose-pre:text-foreground prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto prose-pre:border prose-pre:border-border
        prose-blockquote:text-muted-foreground prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:bg-muted/30 prose-blockquote:py-2 prose-blockquote:rounded-r
        prose-ul:text-foreground prose-ul:mb-4 prose-ul:pl-4 prose-ul:space-y-1
        prose-ol:text-foreground prose-ol:mb-4 prose-ol:pl-4 prose-ol:space-y-1
        prose-li:text-foreground prose-li:mb-1 prose-li:leading-relaxed
        prose-a:text-primary prose-a:underline prose-a:decoration-primary/50 prose-a:underline-offset-2 prose-a:font-medium
        prose-table:text-foreground prose-table:border-collapse prose-table:w-full prose-table:my-4
        prose-th:border prose-th:border-border prose-th:px-3 prose-th:py-2 prose-th:bg-muted prose-th:text-left prose-th:font-semibold prose-th:text-sm
        prose-td:border prose-td:border-border prose-td:px-3 prose-td:py-2 prose-td:text-sm
        prose-hr:border-border prose-hr:my-6"
      dangerouslySetInnerHTML={{ __html: displayContent }}
    />
  );
};

export default StreamingHtmlRenderer;