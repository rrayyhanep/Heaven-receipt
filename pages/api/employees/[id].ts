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
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const data = readData();
      const employee = data.employees.find((emp: any) => emp.id === id);
      if (employee) {
        res.status(200).json(employee);
      } else {
        res.status(404).json({ message: 'Employee not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error reading data' });
    }
  } else if (req.method === 'PUT') {
    try {
      const data = readData();
      const employeeIndex = data.employees.findIndex((emp: any) => emp.id === id);
      if (employeeIndex !== -1) {
        const employee = data.employees[employeeIndex];
        const { name, pendingBalance, basicSalary } = req.body;

        if (name !== undefined) {
          employee.name = name;
        }
        if (pendingBalance !== undefined) {
          employee.pendingBalance = pendingBalance;
        }
        if (basicSalary !== undefined) {
          employee.basicSalary = basicSalary;
        }

        data.employees[employeeIndex] = employee;
        writeData(data);
        res.status(200).json(employee);
      } else {
        res.status(404).json({ message: 'Employee not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error writing data' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const data = readData();
      const employeeIndex = data.employees.findIndex((emp: any) => emp.id === id);
      if (employeeIndex !== -1) {
        data.employees.splice(employeeIndex, 1);
        writeData(data);
        res.status(204).end();
      } else {
        res.status(404).json({ message: 'Employee not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error writing data' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
