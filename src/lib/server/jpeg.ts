/** Minimal JPEG header reader: confirms the file really is a JPEG and returns its pixel size. */
export function parseJpegSize(bytes: Uint8Array): { width: number; height: number } | null {
    if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) return null;

    let pos = 2;
    while (pos + 4 <= bytes.length) {
        if (bytes[pos] !== 0xff) return null;
        let marker = bytes[pos + 1];
        while (marker === 0xff && pos + 2 < bytes.length) {
            pos++; // fill bytes
            marker = bytes[pos + 1];
        }
        // Start-of-frame markers carry the dimensions (all except DHT C4, JPG C8, DAC CC).
        if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
            if (pos + 9 > bytes.length) return null;
            const height = (bytes[pos + 5] << 8) | bytes[pos + 6];
            const width = (bytes[pos + 7] << 8) | bytes[pos + 8];
            return width > 0 && height > 0 ? { width, height } : null;
        }
        // Markers without a length field
        if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd8)) {
            pos += 2;
            continue;
        }
        if (marker === 0xd9 || marker === 0xda) return null; // end / start of scan before any frame header
        const length = (bytes[pos + 2] << 8) | bytes[pos + 3];
        if (length < 2) return null;
        pos += 2 + length;
    }
    return null;
}
