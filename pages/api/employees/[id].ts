
import type { NextApiRequest, NextApiResponse } from 'next';
import allEmployees from '../../../../data.json';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { id } = req.query;

  const employeeIndex = allEmployees.employees.findIndex((e) => e.id === id);

  switch (method) {
    case 'GET':
      if (employeeIndex > -1) {
        res.status(200).json(allEmployees.employees[employeeIndex]);
      } else {
        res.status(404).json({ message: 'Employee not found' });
      }
      break;
    case 'PUT':
      if (employeeIndex > -1) {
        // Note: This only updates the data in memory for this request.
        const updatedEmployee = { ...allEmployees.employees[employeeIndex], ...req.body };
        allEmployees.employees[employeeIndex] = updatedEmployee;
        res.status(200).json(updatedEmployee);
      } else {
        res.status(404).json({ message: 'Employee not found' });
      }
      break;
    case 'DELETE':
      if (employeeIndex > -1) {
        // Note: This only updates the data in memory for this request.
        const deletedEmployee = allEmployees.employees.splice(employeeIndex, 1);
        res.status(200).json(deletedEmployee[0]);
      } else {
        res.status(404).json({ message: 'Employee not found' });
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
