let rooms = JSON.parse(localStorage.getItem('roomspot_rooms')) || [
    { id: 1, name: "Room 101", building: "Main Building", floor: "1st Floor", capacity: "45 seats", facilities: ["Projector", "Air-Conditioned", "Whiteboard"], status: "OCCUPIED", schedule: "ENG 101: Purposive Comm (08:00 AM - 11:00 AM)" },
    { id: 2, name: "Room 102", building: "Main Building", floor: "1st Floor", capacity: "40 seats", facilities: ["Whiteboard", "Smart TV"], status: "VACANT", schedule: "No Class (Vacant Until 1:00 PM)" },
    { id: 3, name: "Lab 201", building: "IT Building", floor: "2nd Floor", capacity: "35 seats", facilities: ["Computers", "Air-Conditioned", "Projector"], status: "VACANT", schedule: "Available All Day" },
    { id: 4, name: "Eng 301", building: "Engineering Bldg", floor: "3rd Floor", capacity: "50 seats", facilities: ["Projector", "Whiteboard"], status: "RESERVED", schedule: "Faculty Meeting @ 1:00 PM" },
    { id: 5, name: "Lab 202", building: "IT Building", floor: "2nd Floor", capacity: "35 seats", facilities: ["Computers", "Air-Conditioned"], status: "OCCUPIED", schedule: "CS 202 (Until 1:00 PM)" }
];

// FIX OLD LOCAL STORAGE DATA
rooms = rooms.map(room => ({
    ...room,
    facilities: room.facilities || ["Whiteboard", "Air-Conditioned"],
    schedule: room.schedule || "Available All Day",
    capacity: typeof room.capacity === 'number'
        ? `${room.capacity} seats`
        : room.capacity
}));

let requests = JSON.parse(localStorage.getItem('roomspot_requests')) || [
    { id: 101, roomId: 2, roomName: "Room 102", studentName: "Juan Dela Cruz", purpose: "Group Study", time: "1:00 PM - 2:00 PM", status: "PENDING" }
];

let users = JSON.parse(localStorage.getItem('roomspot_users')) || [
    { name: "Admin User", email: "admin", password: "adminpassword", role: "ADMIN" },
    { name: "Student User", email: "student", password: "studentpassword", role: "STUDENT" }
];

let currentUser = JSON.parse(localStorage.getItem('roomspot_current_user')) || null;
let currentRole = currentUser ? currentUser.role : 'STUDENT';

document.addEventListener('DOMContentLoaded', () => {
    checkAuthStatus();
});

function saveData() {
    localStorage.setItem('roomspot_rooms', JSON.stringify(rooms));
    localStorage.setItem('roomspot_requests', JSON.stringify(requests));
    localStorage.setItem('roomspot_users', JSON.stringify(users));
}

// CHECK AUTH STATUS
function checkAuthStatus() {
    const authView = document.getElementById('authView');
    const mainApp = document.getElementById('mainAppContainer');
    const studentView = document.getElementById('studentView');
    const adminView = document.getElementById('adminView');
    const toggleRoleBtn = document.getElementById('toggleRoleBtn');

    if (currentUser) {
        authView.classList.add('d-none');
        mainApp.classList.remove('d-none');

        if (currentUser.role === 'ADMIN') {
            currentRole = 'ADMIN';

            if (toggleRoleBtn) {
                toggleRoleBtn.classList.remove('d-none');
                toggleRoleBtn.innerHTML =
                    '<i class="bi bi-person me-1"></i> Switch to Student View';
            }

            adminView.classList.remove('d-none');
            studentView.classList.add('d-none');

            renderAdminTables();

        } else {
            currentRole = 'STUDENT';

            if (toggleRoleBtn) {
                toggleRoleBtn.classList.add('d-none');
            }

            adminView.classList.add('d-none');
            studentView.classList.remove('d-none');

            renderRooms();
        }

    } else {
        authView.classList.remove('d-none');
        mainApp.classList.add('d-none');

        if (studentView) studentView.classList.add('d-none');
        if (adminView) adminView.classList.add('d-none');

        if (toggleRoleBtn) {
            toggleRoleBtn.classList.add('d-none');
        }
    }
}

// SWITCH LOGIN AND SIGNUP
function switchAuthMode(mode) {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const loginTab = document.getElementById('loginTabBtn');
    const signupTab = document.getElementById('signupTabBtn');

    if (mode === 'signup') {
        loginForm.classList.add('d-none');
        signupForm.classList.remove('d-none');

        signupTab.classList.add('active', 'text-white');
        signupTab.style.color = '#fff';

        loginTab.classList.remove('active', 'text-white');
        loginTab.style.color = '#cbd5e1';
    } else {
        signupForm.classList.add('d-none');
        loginForm.classList.remove('d-none');

        loginTab.classList.add('active', 'text-white');
        loginTab.style.color = '#fff';

        signupTab.classList.remove('active', 'text-white');
        signupTab.style.color = '#cbd5e1';
    }
}

// LOGIN
function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    const foundUser = users.find(u =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password
    );

    if (foundUser) {
        currentUser = foundUser;

        localStorage.setItem('roomspot_current_user', JSON.stringify(currentUser));

        document.getElementById('loginForm').reset();

        checkAuthStatus();

        alert(`Welcome back, ${currentUser.name}!`);
    } else {
        alert("Invalid email or username / password. Please try again.");
    }
}

// SIGN UP (UPDATED TO READ ROLE SELECTOR)
function handleSignup(e) {
    e.preventDefault();

    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    
    // Binabasa na nito ang napili mo sa dropdown (<select id="signupRole">)
    const roleSelect = document.getElementById('signupRole');
    const role = roleSelect ? roleSelect.value : 'STUDENT';

    if (!name || !email || !password || !role) {
        alert("Please complete all fields including the role.");
        return;
    }

    const existingUser = users.find(u =>
        u.email.toLowerCase() === email.toLowerCase()
    );

    if (existingUser) {
        alert("This email or username is already registered!");
        return;
    }

    const newUser = { name, email, password, role };

    users.push(newUser);
    saveData();

    currentUser = newUser;

    localStorage.setItem('roomspot_current_user', JSON.stringify(currentUser));

    document.getElementById('signupForm').reset();

    checkAuthStatus();

    alert(`Account created successfully! Welcome, ${name} (${role}).`);
}

// LOGOUT
function logout() {
    currentUser = null;

    localStorage.removeItem('roomspot_current_user');

    checkAuthStatus();
}

// RENDER ROOMS
function renderRooms() {
    const container = document.getElementById('roomContainer');

    if (!container) return;

    const search = document.getElementById('searchInput').value.toLowerCase();
    const statusVal = document.getElementById('statusFilter').value;
    const bldgVal = document.getElementById('buildingFilter').value;
    const floorVal = document.getElementById('floorFilter').value;

    container.innerHTML = '';

    const filtered = rooms.filter(r => {
        const matchesSearch =
            r.name.toLowerCase().includes(search) ||
            r.building.toLowerCase().includes(search) ||
            r.schedule.toLowerCase().includes(search);

        const matchesStatus = statusVal === 'ALL' || r.status === statusVal;
        const matchesBldg = bldgVal === 'ALL' || r.building === bldgVal;
        const matchesFloor = floorVal === 'ALL' || r.floor === floorVal;

        return matchesSearch && matchesStatus && matchesBldg && matchesFloor;
    });

    const countLabel = document.getElementById('roomCountLabel');

    if (countLabel) {
        countLabel.innerText = `Showing ${filtered.length} of ${rooms.length} rooms`;
    }

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5 text-muted">
                <i class="bi bi-search fs-1"></i>
                <p>No rooms found.</p>
            </div>
        `;
        return;
    }

    filtered.forEach(room => {
        let badgeClass = 'badge-vacant';

        if (room.status === 'OCCUPIED') badgeClass = 'badge-occupied';
        if (room.status === 'RESERVED') badgeClass = 'badge-reserved';

        const facilities = room.facilities || ["Whiteboard", "Air-Conditioned"];

        const facilitiesHtml = facilities.map(f =>
            `<span class="facility-badge">${f}</span>`
        ).join(' ');

        const col = document.createElement('div');

        col.className = 'col-md-6 col-lg-4 mb-3';

        col.innerHTML = `
            <div class="card h-100 room-card p-4 shadow-sm d-flex flex-column">

                <div class="d-flex justify-content-between align-items-start mb-2">
                    <div>
                        <h5 class="fw-bold mb-1 text-white">${room.name}</h5>
                        <small class="text-muted">
                            <i class="bi bi-geo-alt me-1"></i>
                            ${room.building} • ${room.floor}
                        </small>
                    </div>

                    <span class="badge ${badgeClass} px-3 py-2 rounded-pill">
                        ${room.status}
                    </span>
                </div>

                <div class="my-2 p-3 rounded-3" style="background-color: #192238;">
                    <small class="text-muted d-block mb-1 text-uppercase fw-bold" style="font-size: 0.7rem;">
                        Current Timetable
                    </small>

                    <span class="small text-light">
                        <i class="bi bi-calendar-event me-1"></i>
                        ${room.schedule || 'Available All Day'}
                    </span>
                </div>

                <div class="mb-3">
                    <small class="text-muted d-block mb-1">
                        <i class="bi bi-people me-1"></i>
                        Capacity: <strong class="text-light">${room.capacity}</strong>
                    </small>

                    <div class="d-flex flex-wrap gap-1 mt-2">
                        ${facilitiesHtml}
                    </div>
                </div>

                <div class="mt-auto pt-2 d-flex justify-content-between align-items-center">

                    <span class="small text-muted">
                        ${room.status === 'VACANT'
                            ? 'Ready for immediate use'
                            : 'Occupied by class'}
                    </span>

                    ${room.status === 'VACANT'
                        ? `
                            <button class="btn btn-primary btn-sm px-4 rounded-3 py-2 fw-semibold"
                                onclick="openReserveModal(${room.id}, '${room.name}')">
                                <i class="bi bi-bookmark-plus me-1"></i>
                                Request Room
                            </button>
                        `
                        : `
                            <button class="btn btn-secondary btn-sm px-4 rounded-3 py-2 text-muted"
                                disabled style="background-color: #1f2937; border-color: #374151;">
                                Unavailable
                            </button>
                        `
                    }

                </div>
            </div>
        `;

        container.appendChild(col);
    });
}

// RENDER ADMIN TABLES
function renderAdminTables() {
    const reqBody = document.getElementById('requestsTableBody');

    if (reqBody) {
        reqBody.innerHTML = '';

        if (requests.length === 0) {
            reqBody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center text-muted py-3">
                        No pending reservation requests.
                    </td>
                </tr>
            `;
        } else {
            requests.forEach(req => {
                let reqBadge =
                    req.status === 'APPROVED' ? 'bg-success' :
                    req.status === 'REJECTED' ? 'bg-danger' :
                    'bg-warning text-dark';

                const tr = document.createElement('tr');

                tr.innerHTML = `
                    <td class="fw-bold text-white">${req.roomName}</td>

                    <td>${req.studentName || req.name}</td>

                    <td>${req.purpose} (${req.time})</td>

                    <td>
                        <span class="badge ${reqBadge}">
                            ${req.status}
                        </span>
                    </td>

                    <td>
                        ${req.status === 'PENDING'
                            ? `
                                <button class="btn btn-sm btn-success me-1"
                                    onclick="approveRequest(${req.id})">
                                    <i class="bi bi-check-lg me-1"></i>
                                    Approve
                                </button>

                                <button class="btn btn-sm btn-outline-danger"
                                    onclick="rejectRequest(${req.id})">
                                    <i class="bi bi-x-lg me-1"></i>
                                    Reject
                                </button>
                            `
                            : `
                                <button class="btn btn-sm btn-outline-danger px-3 py-1"
                                    onclick="deleteRequest(${req.id})">
                                    <i class="bi bi-trash me-1"></i>
                                    Delete
                                </button>
                            `
                        }
                    </td>
                `;

                reqBody.appendChild(tr);
            });
        }
    }

    const tbody = document.getElementById('adminTableBody');

    if (tbody) {
        tbody.innerHTML = '';

        rooms.forEach(room => {
            const tr = document.createElement('tr');

            tr.innerHTML = `
                <td class="fw-bold text-white">${room.name}</td>
                <td>${room.building}</td>
                <td>${room.floor}</td>
                <td>${room.capacity}</td>

                <td>
                    <span class="badge ${
                        room.status === 'VACANT' ? 'bg-success' :
                        room.status === 'OCCUPIED' ? 'bg-danger' :
                        'bg-warning text-dark'
                    } px-2 py-1">
                        ${room.status}
                    </span>
                </td>

                <td>
                    <div class="d-flex gap-1 align-items-center">
                        <div class="btn-group btn-group-sm">

                            <button class="btn btn-outline-success"
                                onclick="changeStatus(${room.id}, 'VACANT')">
                                Vacant
                            </button>

                            <button class="btn btn-outline-danger"
                                onclick="changeStatus(${room.id}, 'OCCUPIED')">
                                Occupied
                            </button>

                            <button class="btn btn-outline-warning"
                                onclick="changeStatus(${room.id}, 'RESERVED')">
                                Reserved
                            </button>

                        </div>

                        <button class="btn btn-danger btn-sm ms-2"
                            onclick="deleteRoom(${room.id})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </td>
            `;

            tbody.appendChild(tr);
        });
    }
}

// APPROVE REQUEST
function approveRequest(reqId) {
    const req = requests.find(r => r.id === reqId);

    if (req) {
        req.status = 'APPROVED';

        const room = rooms.find(r => r.id === req.roomId);

        if (room) {
            room.status = 'RESERVED';
            room.schedule = `${req.purpose} (${req.time})`;
        }

        saveData();
        renderAdminTables();
        renderRooms();

        alert(`Reservation for ${req.roomName} has been APPROVED!`);
    }
}

// REJECT REQUEST
function rejectRequest(reqId) {
    const req = requests.find(r => r.id === reqId);

    if (req) {
        req.status = 'REJECTED';

        saveData();
        renderAdminTables();

        alert(`Reservation for ${req.roomName} was REJECTED.`);
    }
}

// DELETE REQUEST
function deleteRequest(reqId) {
    if (confirm("Are you sure you want to delete this reservation request?")) {
        requests = requests.filter(r => r.id !== reqId);

        saveData();
        renderAdminTables();
    }
}

// CHANGE ROOM STATUS
function changeStatus(id, newStatus) {
    const room = rooms.find(r => r.id === id);

    if (room) {
        room.status = newStatus;

        saveData();
        renderRooms();
        renderAdminTables();
    }
}

// DELETE ROOM
function deleteRoom(id) {
    if (confirm("Are you sure you want to delete this room?")) {
        rooms = rooms.filter(r => r.id !== id);

        saveData();
        renderRooms();
        renderAdminTables();
    }
}

// TOGGLE ROLE VIEW
function toggleRole() {
    const studentView = document.getElementById('studentView');
    const adminView = document.getElementById('adminView');
    const btn = document.getElementById('toggleRoleBtn');

    if (!currentUser || currentUser.role !== 'ADMIN') {
        alert("Only Admin can switch between views.");
        return;
    }

    if (currentRole === 'ADMIN') {
        currentRole = 'STUDENT';

        adminView.classList.add('d-none');
        studentView.classList.remove('d-none');

        if (btn) {
            btn.innerHTML =
                '<i class="bi bi-person-gear me-1"></i> Switch to Admin View';
        }

        renderRooms();

    } else {
        currentRole = 'ADMIN';

        studentView.classList.add('d-none');
        adminView.classList.remove('d-none');

        if (btn) {
            btn.innerHTML =
                '<i class="bi bi-person me-1"></i> Switch to Student View';
        }

        renderAdminTables();
    }
}

function filterRooms() {
    renderRooms();
}

// OPEN RESERVE MODAL
function openReserveModal(id, name) {
    document.getElementById('modalRoomId').value = id;

    document.getElementById('reserveModalTitle').innerText = `Reserve ${name}`;

    if (currentUser) {
        document.getElementById('resName').value = currentUser.name;
    }

    const modal = new bootstrap.Modal(
        document.getElementById('reserveModal')
    );

    modal.show();
}

// SUBMIT RESERVATION
function submitReservation(e) {
    e.preventDefault();

    const id = parseInt(document.getElementById('modalRoomId').value);
    const name = document.getElementById('resName').value;
    const purpose = document.getElementById('resPurpose').value;
    const time = document.getElementById('resTime').value;

    const room = rooms.find(r => r.id === id);

    if (room && room.status === 'VACANT') {
        const newReq = {
            id: Date.now(),
            roomId: room.id,
            roomName: room.name,
            studentName: name,
            purpose: purpose,
            time: time,
            status: 'PENDING'
        };

        requests.push(newReq);

        saveData();

        const modalEl = document.getElementById('reserveModal');
        const modalInstance = bootstrap.Modal.getInstance(modalEl);

        if (modalInstance) modalInstance.hide();

        document.getElementById('reserveForm').reset();

        alert("Reservation request submitted successfully! Waiting for Admin approval.");

        renderAdminTables();
    } else {
        alert("This room is no longer available.");
    }
}

// ADD NEW ROOM
function addNewRoomPrompt() {
    const name = prompt("Enter Room Name (e.g. Room 204):");

    if (!name) return;

    const building = prompt("Enter Building Name (e.g. Main Building):") || "Main Building";
    const floor = prompt("Enter Floor Level (e.g. 1st Floor):") || "1st Floor";
    const capacity = prompt("Enter Capacity (e.g. 40 seats):") || "40 seats";

    const facilitiesInput = prompt(
        "Enter facilities separated by commas (e.g. Projector, Air-Conditioned):"
    );

    let facilities = ["Whiteboard", "Air-Conditioned"];

    if (facilitiesInput && facilitiesInput.trim() !== "") {
        facilities = facilitiesInput
            .split(',')
            .map(f => f.trim())
            .filter(f => f.length > 0);
    }

    const newId = rooms.length
        ? Math.max(...rooms.map(r => r.id)) + 1
        : 1;

    rooms.push({
        id: newId,
        name: name,
        building: building,
        floor: floor,
        capacity: capacity,
        facilities: facilities,
        status: "VACANT",
        schedule: "Available All Day"
    });

    saveData();

    renderRooms();
    renderAdminTables();

    alert(`Room "${name}" added successfully!`);
}


