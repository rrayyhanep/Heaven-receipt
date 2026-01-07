import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data.json');

const readData = () => {
  const jsonData = fs.readFileSync(dataFilePath);
  return JSON.parse(jsonData.toString());
};

const writeData = (data: any) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      const data = readData();
      res.status(200).json(data.employees);
    } catch (error) {
      res.status(500).json({ message: 'Error reading data' });
    }
  } else if (req.method === 'POST') {
    try {
      const data = readData();
      const { name, pendingBalance, basicSalary } = req.body;
      const newEmployee = {
        id: Date.now().toString(),
        name,
        pendingBalance,
        basicSalary,
      };
      data.employees.push(newEmployee);
      writeData(data);
      res.status(201).json(newEmployee);
    } catch (error) {
      res.status(500).json({ message: 'Error writing data' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
