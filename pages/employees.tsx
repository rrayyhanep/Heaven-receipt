import { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from '../styles/Employees.module.css';
import { useRouter } from 'next/router';

interface Employee {
  id: string;
  name: string;
  pendingBalance: number | null;
  basicSalary: number | null;
}

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const res = await fetch('/api/employees');
    const data = await res.json();
    setEmployees(data);
  };

  const deleteEmployee = async (id: string) => {
    await fetch(`/api/employees/${id}`, {
      method: 'DELETE',
    });
    fetchEmployees();
  };

  const editEmployee = (id: string) => {
    router.push(`/edit-employee/${id}`);
  };

  return (
    <div className={styles.pageContainer}>
      <Head>
        <title>Manage Employees</title>
      </Head>

      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Manage Employees</h1>
          <button onClick={() => router.push('/add-employee')} className={styles.button}>
            Add New Employee
          </button>
        </div>

        <div className={styles.employeeList}>
          <h2 className={styles.subtitle}>Current Employees</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Basic Salary</th>
                <th>Pending Balance</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id}>
                  <td>{employee.name}</td>
                  <td>{employee.basicSalary ? `₹${employee.basicSalary.toFixed(2)}` : '₹0.00'}</td>
                  <td>{employee.pendingBalance ? `₹${employee.pendingBalance.toFixed(2)}` : '₹0.00'}</td>
                  <td className={styles.actionCell}>
                    <button
                      className={styles.editButton}
                      onClick={() => editEmployee(employee.id)}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => deleteEmployee(employee.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button onClick={() => router.push('/')} className={styles.button} style={{ marginTop: '1.5rem' }}>
          Go to Home
        </button>
      </div>
    </div>
  );
}
