const tbody = document.getElementById('user-table-body');
const pageInfo = document.getElementById('pagination-info');
const prev = document.getElementById('previous-button');
const next = document.getElementById('next-button');
const search = document.getElementById('search-input');
const addUserForm = document.getElementById('add-user-form');
const userIdInput = document.getElementById('user-id');
const nameInput = document.getElementById('name');
const addressInput = document.getElementById('address');
const emailInput = document.getElementById('email');
const phoneNumberInput = document.getElementById('phone_number');
const jobInput = document.getElementById('job');
const companyInput = document.getElementById('company');
const ageInput = document.getElementById('age');
const retiredInput = document.getElementById('retired');
const birthInput=document.getElementById('birthday')

let users = [];
let filteredUsers = [];
let currentPage = 1;
let rowNumber = 10;

class Person {
    constructor(name, address, email, phone_number, birthdate) {
        this.name = name;
        this.address = address;
        this.email = email;
        this.phone_number = phone_number;
        this.birthdate = new Date(birthdate);
    }

    personAge() {
        const now = new Date();
        return now.getFullYear() - this.birthdate.getFullYear();
    }
}

class User extends Person {
    constructor(name, address, email, phone_number, birthdate, job, company) {
        super(name, address, email, phone_number, birthdate);
        this.job = job;
        this.company = company;
    }

    retirement() {
        return this.personAge() > 65 ? 'Retired' : 'notRetired';
    }
}

function fetchJSONData() {
    fetch("http://localhost:3000/users")
        .then(response => response.json())
        .then(data => {
            users = data.map(user => {
                const newUser = new User(user.name, user.address, user.email, user.phone_number, user.birthdate, user.job, user.company);
                return {
                    ...user,
                    age: newUser.personAge(),
                    retirement: newUser.retirement()
                };
            });
            filteredUsers = [...users];
            displayUsers(currentPage);
        })
        .catch(error => console.error("Error:", error));
}

function displayUsers(page) {
    tbody.innerHTML = '';
    const start = (page - 1) * rowNumber;
    const end = start + rowNumber;
    const userLength = filteredUsers.slice(start, end);

    userLength.forEach((user, index) => {
        const rowIndex = start + index;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.address}</td>
            <td>${user.email}</td>
            <td>${user.phone_number}</td>
            <td>${user.job}</td>
            <td>${user.company}</td>
            <td>${user.age}</td>
            <td>${user.retirement}</td>
            <td>
            <button onclick="editUser(${rowIndex})">Edit</button>
            <button onclick="deleteUser(${rowIndex})">Delete</button>
            </td>`;
        
        tbody.appendChild(row);
    });

    pageInfo.innerHTML = `Page ${page} of ${Math.ceil(filteredUsers.length / rowNumber)}`;
}

prev.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayUsers(currentPage);
    }});

next.addEventListener('click', () => {
    if (currentPage < Math.ceil(filteredUsers.length / rowNumber)) {
        currentPage++;
        displayUsers(currentPage);
    }});

search.addEventListener('input', () => {
    const searchTerm = search.value.toLowerCase();
    filteredUsers = users.filter(user => user.name.toLowerCase().includes(searchTerm));
    displayUsers(currentPage);
});

addUserForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const id = userIdInput.value;
    const user = {
        name: nameInput.value,
        address: addressInput.value,
        email: emailInput.value,
        phone_number: phoneNumberInput.value,
        job: jobInput.value,
        company: companyInput.value,
        birthdate: birthInput.value,
    };

    if (id) {
        updateUser(id, user);
    } else {
        addUser(user);
    }
});

function addUser(user) {
    fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
    .then(response => response.json())
    .then(data => {
        users.push(data);
        filteredUsers = [...users];
        displayUsers(currentPage);
        addUserForm.reset();
    })
    .catch(error => console.error('Error:', error));
}

function updateUser(id, user) {
    fetch(`http://localhost:3000/users/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
    .then(response => response.json())
    .then(data => {
        const index = users.findIndex(u => u.id == id);
        users[index] = data;
        filteredUsers = [...users];
        displayUsers(currentPage);
        addUserForm.reset();
        userIdInput.value = '';
    })
    .catch(error => console.error('Error:', error));
}

function deleteUser(id) {

    fetch(`http://localhost:3000/users/${id}`, {
        method: 'DELETE'
    })
    .then(() => {
        users.splice(id, 1);
        filteredUsers = [...users];
        displayUsers(currentPage);
    })
    .catch(error => console.error('Error:', error));
}

function editUser(index) {
    const user = users[index];
    userIdInput.value = user.id;
    nameInput.value = user.name;
    addressInput.value = user.address;
    emailInput.value = user.email;
    phoneNumberInput.value = user.phone_number;
    jobInput.value = user.job;
    companyInput.value = user.company;
    birthInput.value=user.birthdate
    ageInput.value = user.age;
    retiredInput.value = user.retirement;
}
fetchJSONData();
