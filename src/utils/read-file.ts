import fs from 'fs/promises';

export const readFile = async (filePath) => {
  try {
    return await fs.readFile(filePath, 'utf8');
  } catch (err) {
    throw new Error(err.message);
  }
};
