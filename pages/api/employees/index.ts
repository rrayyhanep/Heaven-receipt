import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

// The data file is in the project root.
const dataFilePath = path.join(process.cwd(), 'data.json');

const readData = () => {
  try {
    // Ensure the file exists before reading.
    if (!fs.existsSync(dataFilePath)) {
      // If not, create it with an empty employees array.
      fs.writeFileSync(dataFilePath, JSON.stringify({ employees: [] }, null, 2));
      console.log('Data file not found, created a new one.');
    }
    const jsonData = fs.readFileSync(dataFilePath);
    return JSON.parse(jsonData.toString());
  } catch (error) {
    console.error('[API] Error reading data:', error);
    // If reading fails, return a default structure to avoid crashing.
    return { employees: [] };
  }
};

const writeData = (data: any) => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('[API] Error writing data:', error);
    // Propagate the error to be handled by the API route.
    throw new Error('Failed to write data to file.');
  }
};

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const data = readData();
      const { name, pendingBalance, basicSalary } = req.body;

      if (!name || pendingBalance === undefined || basicSalary === undefined) {
        return res.status(400).json({ message: 'Missing required fields.' });
      }

      const newEmployee = {
        id: Date.now().toString(),
        name,
        pendingBalance,
        basicSalary,
      };
      data.employees.push(newEmployee);
      writeData(data);
      res.status(201).json(newEmployee);
    } catch (error: any) {
      console.error('[API] Error processing POST request:', error);
      res.status(500).json({ message: error.message || 'An internal server error occurred.' });
    }
  } else if (req.method === 'GET') {
    try {
      const data = readData();
      res.status(200).json(data.employees);
    } catch (error: any) {
      console.error('[API] Error processing GET request:', error);
      res.status(500).json({ message: error.message || 'An internal server error occurred.' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
