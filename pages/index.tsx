import { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

interface Employee {
  id: string;
  name: string;
  pendingBalance: number;
}

export default function Home() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [monthYear, setMonthYear] = useState('');
  const [basicSalary, setBasicSalary] = useState('');
  const [advance, setAdvance] = useState('');
  const [leaveDeduction, setLeaveDeduction] = useState('');
  const [totalSalary, setTotalSalary] = useState('');
  const [balance, setBalance] = useState('');
  const [pendingBalance, setPendingBalance] = useState(0);

  useEffect(() => {
    const storedEmployees = localStorage.getItem('employees');
    if (storedEmployees) {
      setEmployees(JSON.parse(storedEmployees));
    }
  }, []);

  useEffect(() => {
    if (selectedEmployee) {
      const employee = employees.find((emp) => emp.id === selectedEmployee);
      if (employee) {
        setPendingBalance(employee.pendingBalance);
      }
    } else {
      setPendingBalance(0);
    }
  }, [selectedEmployee, employees]);

  useEffect(() => {
    const total = parseFloat(totalSalary) || 0;
    const adv = parseFloat(advance) || 0;
    const leave = parseFloat(leaveDeduction) || 0;
    const newBalance = pendingBalance + total - adv - leave;
    setBalance(newBalance.toFixed(2));
  }, [totalSalary, advance, leaveDeduction, pendingBalance]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const employee = employees.find((emp) => emp.id === selectedEmployee);
    if (!employee) {
      alert('Please select an employee.');
      return;
    }

    const response = await fetch('/api/generate-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        monthYear,
        employeeName: employee.name,
        basicSalary,
        advance,
        leaveDeduction,
        totalSalary,
        balance,
      }),
    });

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'salary_slip.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();

      // Update pending balance
      const updatedEmployees = employees.map((emp) =>
        emp.id === selectedEmployee ? { ...emp, pendingBalance: parseFloat(balance) } : emp
      );
      setEmployees(updatedEmployees);
      localStorage.setItem('employees', JSON.stringify(updatedEmployees));
      setPendingBalance(parseFloat(balance));

    } else {
      alert('Failed to generate PDF');
    }
  };

  return (
    <>
      <Head>
        <title>Salary Slip Generator</title>
        <meta name="description" content="Generate a PDF salary slip" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.card}>
        <h1 className={styles.title}>Generate Salary Slip</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="employeeName">Employee Name</label>
            <select
              id="employeeName"
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              required
            >
              <option value="" disabled>Select an employee</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="monthYear">Month & Year</label>
            <input
              type="text"
              id="monthYear"
              value={monthYear}
              onChange={(e) => setMonthYear(e.target.value)}
              placeholder="e.g., July 2024"
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
              onWheel={(e) => e.currentTarget.blur()}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="advance">Advance Taken</label>
            <input
              type="number"
              id="advance"
              value={advance}
              onChange={(e) => setAdvance(e.target.value)}
              placeholder="0.00"
              onWheel={(e) => e.currentTarget.blur()}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="leaveDeduction">Leave Deduction</label>
            <input
              type="number"
              id="leaveDeduction"
              value={leaveDeduction}
              onChange={(e) => setLeaveDeduction(e.target.value)}
              placeholder="0.00"
              onWheel={(e) => e.currentTarget.blur()}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="totalSalary">Total Salary</label>
            <input
              type="number"
              id="totalSalary"
              value={totalSalary}
              onChange={(e) => setTotalSalary(e.target.value)}
              placeholder="0.00"
              required
              onWheel={(e) => e.currentTarget.blur()}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="balance">Balance</label>
            <input
              type="number"
              id="balance"
              value={balance}
              readOnly
              className={styles.readOnly}
              onWheel={(e) => e.currentTarget.blur()}
            />
          </div>
          <button type="submit" className={`${styles.button} ${styles.fullWidth}`}>
            Generate Salary Slip
          </button>
        </form>
      </div>
    </>
  );
}
