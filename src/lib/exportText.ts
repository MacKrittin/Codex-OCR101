export interface ExportDocument { filename: string; fields: { name: string; value: string }[]; }
export const formatExportText = (documents: ExportDocument[]) => documents.map(({ filename, fields }) => `${filename}\n${fields.map(({ name, value }) => `${name}: ${value}`).join('\n')}\n`).join('\n');
export function downloadText(filename: string, content: string) { const url = URL.createObjectURL(new Blob([content], { type: 'text/plain;charset=utf-8' })); const link = document.createElement('a'); link.href = url; link.download = filename; link.click(); URL.revokeObjectURL(url); }
