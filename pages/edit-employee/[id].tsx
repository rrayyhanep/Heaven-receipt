import { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from '../../styles/EditEmployee.module.css';
import { useRouter } from 'next/router';

export default function EditEmployee() {
  const [name, setName] = useState('');
  const [pendingBalance, setPendingBalance] = useState('');
  const [basicSalary, setBasicSalary] = useState('');
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      fetchEmployee();
    }
  }, [id]);

  const fetchEmployee = async () => {
    const res = await fetch(`/api/employees/${id}`);
    const data = await res.json();
    setName(data.name);
    setPendingBalance(data.pendingBalance.toString());
    setBasicSalary(data.basicSalary.toString());
  };

  const updateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !pendingBalance || !basicSalary) {
      alert('Please fill out all fields.');
      return;
    }

    const updatedEmployee = {
      name,
      pendingBalance: parseFloat(pendingBalance),
      basicSalary: parseFloat(basicSalary),
    };

    await fetch(`/api/employees/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedEmployee),
    });

    router.push('/employees');
  };

  return (
    <div className={styles.pageContainer}>
      <Head>
        <title>Edit Employee</title>
      </Head>

      <div className={styles.card}>
        <h1 className={styles.title}>Edit Employee</h1>

        <form onSubmit={updateEmployee} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Employee Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter employee's full name"
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
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="pendingBalance">Pending Balance</label>
            <input
              type="number"
              id="pendingBalance"
              value={pendingBalance}
              onChange={(e) => setPendingBalance(e.target.value)}
              placeholder="0.00"
            />
          </div>
          <button type="submit" className={styles.button}>
            Update Employee
          </button>
        </form>
      </div>
    </div>
  );
}
