type SignatureCheck = {
	mime: string;
	checks: Array<{ bytes: number[]; offset?: number }>;
};

const SIGNATURE_MATCHERS: SignatureCheck[] = [
	{ mime: 'image/png', checks: [{ bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] }] },
	{ mime: 'image/jpeg', checks: [{ bytes: [0xff, 0xd8, 0xff] }] },
	{ mime: 'image/gif', checks: [{ bytes: [0x47, 0x49, 0x46, 0x38] }] },
	{
		mime: 'image/webp',
		checks: [
			{ bytes: [0x52, 0x49, 0x46, 0x46] },
			{ bytes: [0x57, 0x45, 0x42, 0x50], offset: 8 },
		],
	},
	{ mime: 'application/pdf', checks: [{ bytes: [0x25, 0x50, 0x44, 0x46] }] },
	{
		mime: 'application/zip',
		checks: [
			{ bytes: [0x50, 0x4b, 0x03, 0x04] },
			{ bytes: [0x50, 0x4b, 0x05, 0x06] },
			{ bytes: [0x50, 0x4b, 0x07, 0x08] },
		],
	},
	{ mime: 'audio/mpeg', checks: [{ bytes: [0x49, 0x44, 0x33] }] },
	{
		mime: 'audio/wav',
		checks: [
			{ bytes: [0x52, 0x49, 0x46, 0x46] },
			{ bytes: [0x57, 0x41, 0x56, 0x45], offset: 8 },
		],
	},
	{
		mime: 'video/mp4',
		checks: [
			{ bytes: [0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70] },
			{ bytes: [0x00, 0x00, 0x00, 0x20, 0x66, 0x74, 0x79, 0x70] },
		],
	},
];

const EXTENSION_TO_MIME: Record<string, string> = {
	avi: 'video/x-msvideo',
	avif: 'image/avif',
	bmp: 'image/bmp',
	csv: 'text/csv',
	doc: 'application/msword',
	docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	eml: 'message/rfc822',
	gif: 'image/gif',
	gz: 'application/gzip',
	ics: 'text/calendar',
	jpe: 'image/jpeg',
	jpeg: 'image/jpeg',
	jpg: 'image/jpeg',
	js: 'application/javascript',
	json: 'application/json',
	md: 'text/markdown',
	mov: 'video/quicktime',
	mp3: 'audio/mpeg',
	mp4: 'video/mp4',
	oga: 'audio/ogg',
	ogg: 'audio/ogg',
	ogv: 'video/ogg',
	pdf: 'application/pdf',
	png: 'image/png',
	svg: 'image/svg+xml',
	text: 'text/plain',
	tif: 'image/tiff',
	tiff: 'image/tiff',
	txt: 'text/plain',
	webm: 'video/webm',
	webp: 'image/webp',
	wmv: 'video/x-ms-wmv',
	xls: 'application/vnd.ms-excel',
	xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
	yaml: 'application/yaml',
	yml: 'application/yaml',
	zip: 'application/zip',
};

const matchesSignature = (buffer: Buffer, check: { bytes: number[]; offset?: number }) => {
	const { bytes, offset = 0 } = check;
	if (buffer.length < offset + bytes.length) return false;
	for (let index = 0; index < bytes.length; index++) {
		if (buffer[offset + index] !== bytes[index]) return false;
	}
	return true;
};

const isLikelyText = (buffer: Buffer) => {
	if (!buffer.length) return false;
	const length = Math.min(buffer.length, 512);
	let readable = 0;
	for (let index = 0; index < length; index++) {
		const byte = buffer[index];
		if (byte === 0x00) return false;
		if (
			(byte >= 0x20 && byte <= 0x7e) ||
			byte === 0x09 ||
			byte === 0x0a ||
			byte === 0x0d
		) {
			readable++;
		}
	}
	return readable / length > 0.9;
};

const detectTextMime = (buffer: Buffer) => {
	const snippet = buffer.toString('utf8', 0, Math.min(buffer.length, 512)).trimStart();
	if (!snippet) return 'text/plain';
	if (snippet.startsWith('{') || snippet.startsWith('[')) return 'application/json';
	if (snippet.startsWith('<?xml')) return 'application/xml';
	if (snippet.startsWith('<svg')) return 'image/svg+xml';
	if (snippet.toLowerCase().startsWith('<!doctype html') || snippet.startsWith('<html'))
		return 'text/html';
	return 'text/plain';
};

export const detectMimeType = (buffer: Buffer, fileName?: string) => {
	for (const matcher of SIGNATURE_MATCHERS) {
		if (matcher.checks.every((check) => matchesSignature(buffer, check))) return matcher.mime;
	}
	const extension = fileName?.split('.').pop()?.toLowerCase() ?? '';
	if (extension && EXTENSION_TO_MIME[extension]) return EXTENSION_TO_MIME[extension];
	if (isLikelyText(buffer)) return detectTextMime(buffer);
	return 'application/octet-stream';
};

