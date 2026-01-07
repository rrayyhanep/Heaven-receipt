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
  const { request, params } = context;
  const { method } = request;
  const { id } = params;

  const employeeIndex = allEmployees.employees.findIndex((e) => e.id === id);

  switch (method) {
    case 'GET':
      if (employeeIndex > -1) {
        return new Response(JSON.stringify(allEmployees.employees[employeeIndex]), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      } else {
        return new Response(JSON.stringify({ message: 'Employee not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    case 'PUT':
      if (employeeIndex > -1) {
        const body = await request.json();
        const updatedEmployee = { ...allEmployees.employees[employeeIndex], ...body };
        allEmployees.employees[employeeIndex] = updatedEmployee;
        return new Response(JSON.stringify(updatedEmployee), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      } else {
        return new Response(JSON.stringify({ message: 'Employee not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    case 'DELETE':
      if (employeeIndex > -1) {
        const deletedEmployee = allEmployees.employees.splice(employeeIndex, 1);
        return new Response(JSON.stringify(deletedEmployee[0]), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      } else {
        return new Response(JSON.stringify({ message: 'Employee not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    default:
      return new Response(`Method ${method} Not Allowed`, {
        status: 405,
        headers: {
          'Allow': 'GET, PUT, DELETE',
        },
      });
  }
}
