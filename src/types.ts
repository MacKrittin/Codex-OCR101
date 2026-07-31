export type ExtractionStatus = 'idle' | 'extracting' | 'ready' | 'error';
export interface NormalizedRect { x: number; y: number; width: number; height: number; }
export interface CropArea { id: string; page: number; rect: NormalizedRect; value: string; }
export interface ExtractedField { id: string; name: string; page: number; rect?: NormalizedRect; crops: CropArea[]; value: string; status: ExtractionStatus; error?: string; }
export interface PdfDocument { id: string; filename: string; data: ArrayBuffer; pageCount: number; fields: ExtractedField[]; }
