
import type { NextApiRequest, NextApiResponse } from 'next';
import allEmployees from '../../../data.json';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        res.status(200).json(allEmployees.employees);
      } catch (error) {
        res.status(500).json({ message: 'Failed to load employees' });
      }
      break;
    case 'POST':
      try {
        // Note: This only updates the data in memory for this request.
        // It won't persist because there's no database.
        const newEmployee = req.body;
        allEmployees.employees.push(newEmployee);
        res.status(201).json(newEmployee);
      } catch (error) {
        res.status(500).json({ message: 'Failed to add employee' });
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
