import { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { useRouter } from 'next/router';

interface Employee {
  id: string;
  name: string;
  pendingBalance: number | null;
  basicSalary: number | null;
}

export default function Home() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [basicSalary, setBasicSalary] = useState<string>('0');
  const [pendingBalance, setPendingBalance] = useState<string>('0');
  const [advance, setAdvance] = useState<string>('0');
  const [leaveDeduction, setLeaveDeduction] = useState<string>('0');
  const [netSalary, setNetSalary] = useState<string>('0');
  const [totalSalary, setTotalSalary] = useState<string>('0');
  const [balanceToReceive, setBalanceToReceive] = useState<string>('0');
  const router = useRouter();

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    const employee = employees.find((e) => e.id === selectedEmployee);
    if (employee) {
      setBasicSalary(employee.basicSalary?.toString() || '0');
      setPendingBalance(employee.pendingBalance?.toString() || '0');
    }
  }, [selectedEmployee, employees]);

  useEffect(() => {
    const currentPending = parseFloat(pendingBalance) || 0;
    const currentBasic = parseFloat(basicSalary) || 0;
    const currentAdvance = parseFloat(advance) || 0;
    const currentLeaveDeduction = parseFloat(leaveDeduction) || 0;

    const newNetSalary = currentPending + currentBasic - currentAdvance - currentLeaveDeduction;
    setNetSalary(newNetSalary.toFixed(2));
  }, [pendingBalance, basicSalary, advance, leaveDeduction]);

  useEffect(() => {
    const currentNet = parseFloat(netSalary) || 0;
    const currentTotal = parseFloat(totalSalary) || 0;

    const newBalanceToReceive = currentNet - currentTotal;
    setBalanceToReceive(newBalanceToReceive.toFixed(2));
  }, [netSalary, totalSalary]);

  const fetchEmployees = async () => {
    const res = await fetch('/api/employees');
    const data = await res.json();
    setEmployees(data);
  };

  const generateSalarySlip = async (e: React.FormEvent) => {
    e.preventDefault();
    const employee = employees.find((emp) => emp.id === selectedEmployee);
    if (!employee) return;

    const salaryData = {
      employeeName: employee.name,
      basicSalary: parseFloat(basicSalary),
      pendingBalance: parseFloat(pendingBalance),
      advance: parseFloat(advance),
      leaveDeduction: parseFloat(leaveDeduction),
      netSalary: parseFloat(netSalary),
      totalSalary: parseFloat(totalSalary),
      balanceToReceive: parseFloat(balanceToReceive),
    };

    const res = await fetch('/api/generate-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(salaryData),
    });

    if (res.ok) {
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'salary_slip.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();

      // Update pending balance
      const updateRes = await fetch(`/api/employees/${selectedEmployee}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ pendingBalance: parseFloat(balanceToReceive) }),
        }
      );

      if (updateRes.ok) {
        fetchEmployees(); // Refresh employee data
      } else {
        alert('Failed to update pending balance');
      }

    } else {
      alert('Failed to generate PDF');
    }
  };

  return (
    <>
      <Head>
        <title>Salary Slip Generator</title>
      </Head>

      <div className={styles.card}>
        <h1 className={styles.title}>Salary Slip Generator</h1>

        <form onSubmit={generateSalarySlip} className={styles.form}>
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="employee">Select Employee</label>
            <select
              id="employee"
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
            <label htmlFor="basicSalary">Basic Salary</label>
            <input
              type="number"
              id="basicSalary"
              value={basicSalary}
              readOnly
              className={styles.readOnly}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="pendingBalance">Pending Balance</label>
            <input
              type="number"
              id="pendingBalance"
              value={pendingBalance}
              readOnly
              className={styles.readOnly}
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
              required
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
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="netSalary">Net Salary</label>
            <input
              type="number"
              id="netSalary"
              value={netSalary}
              readOnly
              className={styles.readOnly}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="totalSalary">Total Salary to be Paid</label>
            <input
              type="number"
              id="totalSalary"
              value={totalSalary}
              onChange={(e) => setTotalSalary(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="balanceToReceive">Balance to Receive</label>
            <input
              type="number"
              id="balanceToReceive"
              value={balanceToReceive}
              readOnly
              className={styles.readOnly}
            />
          </div>

          <button type="submit" className={styles.button}>
            Generate Salary Slip
          </button>
        </form>

        <button onClick={() => router.push('/employees')} className={styles.button} style={{ marginTop: '1.5rem' }}>
          Manage Employees
        </button>
      </div>
    </>
  );
}
