/**
 * Browser-side photo preparation: scales a photo down and re-encodes it as JPEG before upload.
 * Re-encoding also removes metadata such as the location where the photo was taken.
 */

const MAX_SIDE = 2400;
const QUALITY = 0.86;
const MAX_ORIGINAL_BYTES = 60_000_000;

export async function prepareJpeg(file: File): Promise<Blob> {
    if (!file.type.startsWith("image/")) throw new Error("Das ist kein Foto.");
    if (file.size > MAX_ORIGINAL_BYTES) throw new Error("Das Foto ist zu groß.");

    let bitmap: ImageBitmap;
    try {
        // "from-image" applies the camera rotation, so phone photos are not sideways.
        bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    } catch {
        throw new Error("Dieses Foto kann nicht gelesen werden.");
    }

    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Das Foto kann nicht verarbeitet werden.");
    context.fillStyle = "#ffffff"; // transparent PNGs become white instead of black
    context.fillRect(0, 0, width, height);
    context.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", QUALITY));
    if (!blob) throw new Error("Das Foto kann nicht verarbeitet werden.");
    return blob;
}
