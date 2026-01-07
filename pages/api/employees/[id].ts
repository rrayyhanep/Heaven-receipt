
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../lib/firebase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { id } = req.query;

  // Ensure the ID is a string, as it comes from the URL.
  if (typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid ID format.' });
  }

  const employeeDocRef = db.collection('employees').doc(id);

  switch (method) {
    case 'GET':
      try {
        const doc = await employeeDocRef.get();
        if (!doc.exists) {
          return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json({ id: doc.id, ...doc.data() });
      } catch (error) {
        console.error('Firestore GET by ID error:', error);
        res.status(500).json({ message: 'Failed to fetch employee' });
      }
      break;

    case 'PUT':
      try {
        // The 'set' method with { merge: true } will update fields or create the document if it doesn't exist.
        // Using 'update' is stricter and fails if the document doesn't exist.
        await employeeDocRef.update(req.body);
        const updatedDoc = await employeeDocRef.get();
        res.status(200).json({ id: updatedDoc.id, ...updatedDoc.data() });
      } catch (error) {
        console.error('Firestore PUT error:', error);
        res.status(500).json({ message: 'Failed to update employee' });
      }
      break;

    case 'DELETE':
      try {
        const doc = await employeeDocRef.get();
        if (!doc.exists) {
          return res.status(404).json({ message: 'Employee not found' });
        }
        await employeeDocRef.delete();
        res.status(200).json({ message: 'Employee deleted successfully', id: id });
      } catch (error) {
        console.error('Firestore DELETE error:', error);
        res.status(500).json({ message: 'Failed to delete employee' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
