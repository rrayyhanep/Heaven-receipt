
import { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { useRouter } from 'next/router';

interface Employee {
  id: string;
  name: string;
  basicSalary: number | null;
  pendingBalance: number | null;
}

export default function Home() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [monthYear, setMonthYear] = useState<string>('');
  const [advance, setAdvance] = useState<string>('0');
  const [leaveDeduction, setLeaveDeduction] = useState<string>('0');
  const [basicSalary, setBasicSalary] = useState<string>('0');
  const [pendingBalance, setPendingBalance] = useState<string>('0');
  const router = useRouter();

  useEffect(() => {
    fetchEmployees();
    // Set the monthYear to the current month and year by default, in YYYY-MM format.
    const now = new Date();
    setMonthYear(now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0'));
  }, []);

  useEffect(() => {
    const employee = employees.find((e) => e.id === selectedEmployee);
    if (employee) {
      setBasicSalary(employee.basicSalary?.toString() || '0');
      setPendingBalance(employee.pendingBalance?.toString() || '0');
    } else {
      setBasicSalary('0');
      setPendingBalance('0');
    }
  }, [selectedEmployee, employees]);

  const fetchEmployees = async () => {
    try {
      const res = await fetch('/api/employees');
      const data = await res.json();
      setEmployees(data);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
      alert("Could not fetch employees. Please check the network or API status.");
    }
  };

  const generateSalarySlip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee) {
      alert('Please select an employee.');
      return;
    }

    const salaryData = {
      employeeId: selectedEmployee,
      monthYear,
      advance: parseFloat(advance) || 0,
      leaveDeduction: parseFloat(leaveDeduction) || 0,
    };

    try {
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
        a.download = `salary_slip_${selectedEmployee}_${monthYear}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();

        // Since the backend now handles the balance update, we just need to refresh the data
        fetchEmployees();
        // Reset fields after successful generation
        setAdvance('0');
        setLeaveDeduction('0');

      } else {
        const errorText = await res.text();
        alert(`Failed to generate PDF: ${errorText}`);
      }
    } catch (error) {
      console.error("PDF Generation Error:", error);
      alert("An error occurred while trying to generate the PDF.");
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
            <label htmlFor="monthYear">Salary Month</label>
            <input
              type="month"
              id="monthYear"
              value={monthYear}
              onChange={(e) => setMonthYear(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="basicSalary">Basic Salary</label>
            <input type="text" id="basicSalary" value={`₹${basicSalary}`} readOnly className={styles.readOnly} />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="pendingBalance">Old Balance</label>
            <input type="text" id="pendingBalance" value={`₹${pendingBalance}`} readOnly className={styles.readOnly} />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="advance">Advance Taken</label>
            <input
              type="number"
              id="advance"
              value={advance}
              onChange={(e) => setAdvance(e.target.value)}
              placeholder="0.00"
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
            />
          </div>

          <button type="submit" className={styles.button}>
            Generate & Download Salary Slip
          </button>
        </form>

        <button onClick={() => router.push('/employees')} className={styles.button} style={{ marginTop: '1.5rem' }}>
          Manage Employees
        </button>
      </div>
    </>
  );
}

