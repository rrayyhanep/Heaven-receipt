
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../lib/firebase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const employeesCollection = db.collection('employees');

  switch (method) {
    case 'GET':
      try {
        const snapshot = await employeesCollection.get();
        const employees = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(employees);
      } catch (error) {
        console.error('Firestore GET error:', error);
        res.status(500).json({ message: 'Failed to fetch employees from Firestore' });
      }
      break;

    case 'POST':
      try {
        const newEmployeeData = req.body;
        const docRef = await employeesCollection.add(newEmployeeData);
        const newEmployee = { id: docRef.id, ...newEmployeeData };
        res.status(201).json(newEmployee);
      } catch (error) {
        console.error('Firestore POST error:', error);
        res.status(500).json({ message: 'Failed to add employee to Firestore' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
