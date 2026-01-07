import { promises as fs } from 'fs';
import path from 'path';

export const runtime = 'edge';

const dataFilePath = path.join(process.cwd(), 'json/employees.json');

async function readData() {
  try {
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return []; // Return an empty array if the file doesn't exist
    }
    throw error; // Re-throw other errors
  }
}

async function writeData(data) {
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const employees = await readData();
      res.status(200).json(employees);
    } catch (error) {
      console.error('Error reading data:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else if (req.method === 'POST') {
    try {
      const newEmployee = req.body;
      const employees = await readData();
      newEmployee.id = Date.now().toString(); // Assign a unique ID
      employees.push(newEmployee);
      await writeData(employees);
      res.status(212).json(newEmployee);
    } catch (error) {
      console.error('Error writing data:', error);
      res.status(501).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
