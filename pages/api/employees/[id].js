import { promises as fs } from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'json/employees.json');

async function readData() {
  const fileContents = await fs.readFile(dataFilePath, 'utf8');
  return JSON.parse(fileContents);
}

async function writeData(data) {
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
}

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    const employees = await readData();
    const employee = employees.find((e) => e.id === parseInt(id));
    if (employee) {
      res.status(200).json(employee);
    } else {
      res.status(404).json({ message: 'Employee not found' });
    }
  } else if (req.method === 'PUT') {
    const employees = await readData();
    const index = employees.findIndex((e) => e.id === parseInt(id));
    if (index !== -1) {
      employees[index] = { ...employees[index], ...req.body, id: parseInt(id) };
      await writeData(employees);
      res.status(200).json(employees[index]);
    } else {
      res.status(404).json({ message: 'Employee not found' });
    }
  } else if (req.method === 'DELETE') {
    let employees = await readData();
    const initialLength = employees.length;
    employees = employees.filter((e) => e.id !== parseInt(id));
    if (employees.length < initialLength) {
      await writeData(employees);
      res.status(200).json({ message: 'Employee deleted' });
    } else {
      res.status(404).json({ message: 'Employee not found' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
