import { Download, PanelRightClose, PanelRightOpen, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { ExtractedField } from '../types';

interface Props { fields: ExtractedField[]; onFieldChange(id: string, patch: Partial<ExtractedField>): void; onDelete(id: string): void; onExport(): void; onStartField?(name: string): void; onCreateField?(name: string): void; onSelectField?(id: string): void; selectedFieldId?: string; drawing?: boolean; expanded?: boolean; onExpandedChange?(expanded: boolean): void; }

function fieldMessage(field: ExtractedField) {
  if (field.status === 'extracting') return 'Reading scanned text…';
  if (field.status === 'error') return field.error ?? 'Could not read this crop';
  if (field.crops?.length) return `${field.crops.length} crop area${field.crops.length > 1 ? 's' : ''} · Click to add another`;
  return 'Click to place';
}

export function FieldsPanel({ fields, onFieldChange, onDelete, onExport, onStartField, onCreateField, onSelectField, selectedFieldId, expanded = false, onExpandedChange }: Props) {
  const [name, setName] = useState('');
  const add = () => { const value = name.trim(); if (value) { (onCreateField ?? onStartField)?.(value); setName(''); } };
  return <aside className="fields-panel"><div className="panel-title"><div><p className="eyebrow">Extraction fields</p><h2>Capture details</h2></div><div className="panel-actions"><span>{fields.length}</span><button className="panel-expand" aria-label={expanded ? 'Collapse Capture details' : 'Expand Capture details'} type="button" onClick={() => onExpandedChange?.(!expanded)}>{expanded ? <PanelRightClose size={17} /> : <PanelRightOpen size={17} />}</button></div></div><div className="new-field"><input aria-label="New field name" value={name} placeholder="e.g. Invoice number" onChange={(event) => setName(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && add()} /><button type="button" disabled={!name.trim()} onClick={add}><Plus size={17} /> Add field</button></div><p className="ocr-note">Scanned PDF crops are read locally in your browser.</p><div className="field-list">{fields.length === 0 ? <div className="empty-fields"><strong>No fields yet</strong><p>Name a field, then draw its area on the PDF.</p></div> : fields.map((field) => <section className={`field-card ${selectedFieldId === field.id ? 'selected' : ''}`} key={field.id} onClick={() => onSelectField?.(field.id)}><div className="field-card-head"><input aria-label={`${field.name} name`} value={field.name} onClick={(event) => event.stopPropagation()} onChange={(event) => onFieldChange(field.id, { name: event.target.value })} /><button aria-label={`Delete ${field.name}`} type="button" onClick={(event) => { event.stopPropagation(); onDelete(field.id); }}><Trash2 size={16} /></button></div><p className={`field-meta ${field.status}`}>{fieldMessage(field)}</p><textarea aria-label={`${field.name} value`} value={field.value} placeholder="Text will appear here" onClick={(event) => event.stopPropagation()} onChange={(event) => onFieldChange(field.id, { value: event.target.value, status: 'ready' })} /></section>)}</div><button className="export-button" type="button" disabled={fields.length === 0} onClick={onExport}><Download size={17} /> Export SI form</button></aside>;
}
