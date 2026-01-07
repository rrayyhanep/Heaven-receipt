const allEmployees = {
  "employees": [
    {
      "id": "1767769923992",
      "name": "Raihan E P",
      "pendingBalance": 6000,
      "basicSalary": 4000
    }
  ]
};

export async function onRequest(context) {
  const { request } = context;
  const { method } = request;

  switch (method) {
    case 'GET':
      try {
        return new Response(JSON.stringify(allEmployees.employees), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (error) {
        return new Response(JSON.stringify({ message: 'Failed to load employees' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    case 'POST':
      try {
        const newEmployee = await request.json();
        allEmployees.employees.push(newEmployee);
        return new Response(JSON.stringify(newEmployee), {
          status: 201,
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (error) {
        return new Response(JSON.stringify({ message: 'Failed to add employee' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    default:
      return new Response(`Method ${method} Not Allowed`, {
        status: 405,
        headers: {
          'Allow': 'GET, POST',
        },
      });
  }
}