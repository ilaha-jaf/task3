const tbody = document.getElementById('user-table-body');
const pageInfo = document.getElementById('pagination-info');
const prev = document.getElementById('previous-button');
const next = document.getElementById('next-button');
const search=document.getElementById('search-input');

let users = [];
let filteredUsers=[];
let currentPage = 1;

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
        const age = now.getFullYear() - this.birthdate.getFullYear();
        return age;
    }
}

class User extends Person {
    constructor(name, address, email, phone_number, birthdate, job, company) {
        super(name, address, email, phone_number, birthdate);
        this.job = job;
        this.company = company;
    }

    retirement(){
        if (this.personAge()>65) {
           return 'Retired';
        }
        else{
            return 'notRetired';
        }
    }
}

function fetchJSONData() {
    fetch("./fake_person_data.json")
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
    const start = (page - 1) * 10;
    const end = start + 10;
    const userLength = filteredUsers.slice(start, end);

    userLength.forEach(user => {
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
        `;
        tbody.appendChild(row);
    });

    pageInfo.innerHTML = `Page ${page} of 5`;
}

prev.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayUsers(currentPage);
    }
});

next.addEventListener('click', () => {
    if (currentPage <5) {
        currentPage++;
        displayUsers(currentPage);
    }
});

search.addEventListener('input', () => {
    const searchTerm = search.value;
            filteredUsers = users.filter(user => user.name.includes(searchTerm));
    displayUsers(currentPage);
});

fetchJSONData();