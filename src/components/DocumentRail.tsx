import { FileText, Upload } from 'lucide-react';
import type { PdfDocument } from '../types';

interface Props { documents: PdfDocument[]; activeId?: string; onUpload(files: FileList | null): void; onSelect(id: string): void; }
export function DocumentRail({ documents, activeId, onUpload, onSelect }: Props) {
  return <aside className="document-rail"><div className="rail-head"><span className="wordmark">fieldly</span><span className="privacy">Local only</span></div><label className="upload-button"><Upload size={17} /> Upload PDF<input aria-label="Upload PDF" type="file" accept="application/pdf,.pdf" multiple onChange={(event) => onUpload(event.target.files)} /></label><p className="rail-label">Documents</p><div className="document-list">{documents.length === 0 ? <p className="empty-list">PDFs you add will stay on this device.</p> : documents.map((document) => <button type="button" className={`document-row ${activeId === document.id ? 'selected' : ''}`} key={document.id} onClick={() => onSelect(document.id)}><FileText size={17} /><span><strong>{document.filename}</strong><small>{document.pageCount} {document.pageCount === 1 ? 'page' : 'pages'} · {document.fields.length} fields</small></span></button>)}</div></aside>;
}
