const apiUrl = 'http://localhost:3000/employees';
const employeeList = document.getElementById('employee-list');
const employeeForm = document.getElementById('employee-form');
const nameInput = document.getElementById('name');
const positionInput = document.getElementById('position');

const modal = document.getElementById('modal');
const closeModal = document.querySelector('.close');
const updateForm = document.getElementById('update-form');
const updateNameInput = document.getElementById('update-name');
const updatePositionInput = document.getElementById('update-position');

let currentEmployeeId = null;

async function fetchEmployees() {
    const response = await fetch(apiUrl);
    const employees = await response.json();
    displayEmployees(employees);
}

function displayEmployees(employees) {
    employeeList.innerHTML = '';
    employees.forEach(employee => {
        const li = document.createElement('li');
        li.textContent = `${employee.name} - ${employee.position}`;
        li.dataset.id = employee.id;

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.className = 'edit';
        editButton.onclick = () => openUpdateModal(employee);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete';
        deleteButton.onclick = () => deleteEmployee(employee.id);

        li.appendChild(editButton);
        li.appendChild(deleteButton);
        employeeList.appendChild(li);
    });
}

async function addEmployee(name, position) {
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, position })
    });

    const newEmployee = await response.json();
    displayEmployees([...await getEmployees(), newEmployee]);
}

async function deleteEmployee(id) {
    await fetch(`${apiUrl}/${id}`, {
        method: 'DELETE'
    });

    const employees = await getEmployees();
    displayEmployees(employees);
}

async function updateEmployee(id, name, position) {
    await fetch(`${apiUrl}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, position })
    });

    const employees = await getEmployees();
    displayEmployees(employees);
}

async function getEmployees() {
    const response = await fetch(apiUrl);
    return await response.json();
}

function openUpdateModal(employee) {
    modal.style.display = 'block';
    updateNameInput.value = employee.name;
    updatePositionInput.value = employee.position;
    currentEmployeeId = employee.id;
}

closeModal.onclick = () => {
    modal.style.display = 'none';
};

window.onclick = (event) => {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
};

employeeForm.onsubmit = async (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    const position = positionInput.value.trim();

    if (name && position) {
        await addEmployee(name, position);
        nameInput.value = '';
        positionInput.value = '';
    }
};

updateForm.onsubmit = async (e) => {
    e.preventDefault();
    const name = updateNameInput.value.trim();
    const position = updatePositionInput.value.trim();

    if (name && position) {
        await updateEmployee(currentEmployeeId, name, position);
        modal.style.display = 'none';
    }
};

fetchEmployees();
