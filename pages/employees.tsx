import { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from '../styles/Employees.module.css';

interface Employee {
  id: string;
  name: string;
  pendingBalance: number;
}

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [newEmployeeName, setNewEmployeeName] = useState('');
  const [newEmployeeBalance, setNewEmployeeBalance] = useState('');

  useEffect(() => {
    const storedEmployees = localStorage.getItem('employees');
    if (storedEmployees) {
      setEmployees(JSON.parse(storedEmployees));
    }
  }, []);

  const addEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmployeeName) {
      alert('Please enter a name.');
      return;
    }

    const newEmployee: Employee = {
      id: Date.now().toString(),
      name: newEmployeeName,
      pendingBalance: parseFloat(newEmployeeBalance) || 0,
    };

    const updatedEmployees = [...employees, newEmployee];
    setEmployees(updatedEmployees);
    localStorage.setItem('employees', JSON.stringify(updatedEmployees));
    setNewEmployeeName('');
    setNewEmployeeBalance('');
  };

  const deleteEmployee = (id: string) => {
    const updatedEmployees = employees.filter((emp) => emp.id !== id);
    setEmployees(updatedEmployees);
    localStorage.setItem('employees', JSON.stringify(updatedEmployees));
  };

  return (
    <>
      <Head>
        <title>Manage Employees</title>
      </Head>

      <div className={styles.card}>
        <h1 className={styles.title}>Manage Employees</h1>

        <form onSubmit={addEmployee} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="newEmployeeName">Employee Name</label>
            <input
              type="text"
              id="newEmployeeName"
              value={newEmployeeName}
              onChange={(e) => setNewEmployeeName(e.target.value)}
              placeholder="Enter employee's full name"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="newEmployeeBalance">Initial Pending Balance</label>
            <input
              type="number"
              id="newEmployeeBalance"
              value={newEmployeeBalance}
              onChange={(e) => setNewEmployeeBalance(e.target.value)}
              placeholder="0.00"
              onWheel={(e) => e.currentTarget.blur()}
            />
          </div>
          <button type="submit" className={styles.button}>
            Add Employee
          </button>
        </form>

        <div className={styles.employeeList}>
          <h2 className={styles.subtitle}>Current Employees</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Pending Balance</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id}>
                  <td>{employee.name}</td>
                  <td>{employee.pendingBalance.toFixed(2)}</td>
                  <td>
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
      </div>
    </>
  );
}
