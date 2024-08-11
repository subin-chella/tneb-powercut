import { createWorker } from 'tesseract.js';

export const readCaptcha = async (imagePath: string): Promise<string> => {
    const worker = await createWorker();
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    const { data: { text } } = await worker.recognize(imagePath);
    await worker.terminate();
    return text.trim();
  }