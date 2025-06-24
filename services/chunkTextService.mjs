export function chunkText(text, chunkSize = 1000) {
    const lines = text.split('\n');
    const chunks = [];
    for (let i = 0; i < lines.length; i += chunkSize) {
        const chunk = lines.slice(i, i + chunkSize).join('\n');
        chunks.push(chunk);
    }
    return chunks;
}