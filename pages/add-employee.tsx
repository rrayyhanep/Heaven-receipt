import { useState } from 'react';
import Head from 'next/head';
import styles from '../styles/AddEmployee.module.css';
import { useRouter } from 'next/router';

export default function AddEmployee() {
  const [name, setName] = useState('');
  const [pendingBalance, setPendingBalance] = useState('');
  const [basicSalary, setBasicSalary] = useState('');
  const router = useRouter();

  const addEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !pendingBalance || !basicSalary) {
      alert('Please fill out all fields.');
      return;
    }

    const newEmployee = {
      name,
      pendingBalance: parseFloat(pendingBalance),
      basicSalary: parseFloat(basicSalary),
    };

    await fetch('/api/employees', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newEmployee),
    });

    router.push('/employees');
  };

  return (
    <div className={styles.pageContainer}>
      <Head>
        <title>Add Employee</title>
      </Head>

      <div className={styles.card}>
        <h1 className={styles.title}>Add New Employee</h1>

        <form onSubmit={addEmployee} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Employee Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter employee's full name"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="basicSalary">Basic Salary</label>
            <input
              type="number"
              id="basicSalary"
              value={basicSalary}
              onChange={(e) => setBasicSalary(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="pendingBalance">Initial Pending Balance</label>
            <input
              type="number"
              id="pendingBalance"
              value={pendingBalance}
              onChange={(e) => setPendingBalance(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>
          <button type="submit" className={styles.button}>
            Add Employee
          </button>
        </form>
      </div>
    </div>
  );
}
