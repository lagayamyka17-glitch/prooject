
<?php
include 'db.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RoomSpot - Campus Vacant Room Finder & Reservation</title>

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- Bootstrap Icons -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet">

    <!-- Custom CSS -->
    <link rel="stylesheet" href="style.css">
</head>

<body>


<div id="authView" class="container-fluid py-5 d-flex align-items-center justify-content-center"
     style="min-height:100vh; background-color:#0b0f19;">

    <div class="row justify-content-center w-100">
        <div class="col-md-5 col-lg-4">

            <div class="auth-card p-4 p-md-5 shadow-lg">

                <div class="text-center mb-4">
                    <div class="brand-badge mx-auto mb-3 shadow">
                        <i class="bi bi-door-open-fill text-white"></i>
                    </div>

                    <h3 class="fw-bold text-white mb-1">RoomSpot</h3>

                    <p class="text-muted small">
                        Campus Vacant Room Finder & Reservation
                    </p>
                </div>

                <!-- LOGIN / SIGNUP TABS -->

                <ul class="nav nav-pills nav-fill mb-4 p-1 custom-tabs rounded-pill">

                    <li class="nav-item">
                        <button type="button"
                                class="nav-link active py-2 fw-semibold rounded-pill"
                                id="loginTabBtn"
                                onclick="switchAuthMode('login')">
                            Login
                        </button>
                    </li>

                    <li class="nav-item">
                        <button type="button"
                                class="nav-link py-2 fw-semibold rounded-pill"
                                id="signupTabBtn"
                                onclick="switchAuthMode('signup')">
                            Sign Up
                        </button>
                    </li>

                </ul>

                <!-- LOGIN FORM -->

                <form id="loginForm" onsubmit="handleLogin(event)">

                    <div class="mb-3">
                        <label class="form-label text-secondary small fw-bold">
                            Email or Username
                        </label>

                        <div class="input-group custom-input-group">
                            <span class="input-group-text border-end-0">
                                <i class="bi bi-person"></i>
                            </span>

                            <input type="text"
                                   id="loginEmail"
                                   class="form-control border-start-0 ps-0"
                                   required
                                   placeholder="Enter your email or username">
                        </div>
                    </div>

                    <div class="mb-4">
                        <label class="form-label text-secondary small fw-bold">
                            Password
                        </label>

                        <div class="input-group custom-input-group">
                            <span class="input-group-text border-end-0">
                                <i class="bi bi-lock"></i>
                            </span>

                            <input type="password"
                                   id="loginPassword"
                                   class="form-control border-start-0 ps-0"
                                   required
                                   placeholder="Enter your password">
                        </div>
                    </div>

                    <button type="submit"
                            class="btn btn-primary w-100 py-2 fw-semibold shadow-sm rounded-3">
                        Login to Account
                    </button>

                </form>

                <!-- SIGN UP FORM -->

                <form id="signupForm" class="d-none" onsubmit="handleSignup(event)">

                    <div class="mb-3">
                        <label class="form-label text-secondary small fw-bold">
                            Full Name
                        </label>

                        <div class="input-group custom-input-group">
                            <span class="input-group-text border-end-0">
                                <i class="bi bi-card-text"></i>
                            </span>

                            <input type="text"
                                   id="signupName"
                                   class="form-control border-start-0 ps-0"
                                   required
                                   placeholder="Enter your full name">
                        </div>
                    </div>

                    <div class="mb-3">
                        <label class="form-label text-secondary small fw-bold">
                            Email or Username
                        </label>

                        <div class="input-group custom-input-group">
                            <span class="input-group-text border-end-0">
                                <i class="bi bi-envelope"></i>
                            </span>

                            <input type="text"
                                   id="signupEmail"
                                   class="form-control border-start-0 ps-0"
                                   required
                                   placeholder="Enter email or username">
                        </div>
                    </div>

                    <!-- ROLE SELECTION -->

                    <div class="mb-3">
                        <label class="form-label text-secondary small fw-bold">
                            Role
                        </label>

                        <div class="input-group custom-input-group">
                            <span class="input-group-text border-end-0">
                                <i class="bi bi-person-badge"></i>
                            </span>

                            <select id="signupRole"
                                    class="form-select border-start-0 ps-0"
                                    required>

                                <option value="" disabled selected>
                                    Select user role
                                </option>

                                <option value="STUDENT">
                                    Student / Faculty
                                </option>

                                <option value="ADMIN">
                                    Admin
                                </option>

                            </select>
                        </div>
                    </div>

                    <div class="mb-4">
                        <label class="form-label text-secondary small fw-bold">
                            Password
                        </label>

                        <div class="input-group custom-input-group">
                            <span class="input-group-text border-end-0">
                                <i class="bi bi-shield-lock"></i>
                            </span>

                            <input type="password"
                                   id="signupPassword"
                                   class="form-control border-start-0 ps-0"
                                   required
                                   placeholder="Create a password">
                        </div>
                    </div>

                    <button type="submit"
                            class="btn btn-primary w-100 py-2 fw-semibold shadow-sm rounded-3">
                        Create Account
                    </button>

                </form>

            </div>
        </div>
    </div>
</div>



<div id="mainAppContainer" class="d-none">

    <!-- NAVBAR -->

    <nav class="navbar navbar-expand-lg navbar-dark sticky-top py-3"
         style="background-color:#0b0f19; border-bottom:1px solid #1f2937;">

        <div class="container">

            <div class="d-flex align-items-center">

                <div class="brand-badge me-3">
                    <i class="bi bi-door-open-fill text-white"></i>
                </div>

                <div>
                    <h1 class="h5 text-white mb-0 fw-bold">
                        RoomSpot
                    </h1>

                    <small class="text-muted fs-7">
                        Campus Vacant Room Finder & Reservation
                    </small>
                </div>

            </div>

            <!-- NAVBAR BUTTONS -->

            <div class="d-flex align-items-center gap-2">

                <!-- ADMIN / STUDENT SWITCH -->

                <button type="button"
                        class="btn btn-outline-light btn-sm px-3 rounded-pill"
                        id="toggleRoleBtn"
                        onclick="toggleRole()">

                    <i class="bi bi-person-gear me-1"></i>
                    Switch to Admin View

                </button>

                <!-- LOGOUT -->

                <button type="button"
                        class="btn btn-outline-danger btn-sm px-3 rounded-pill"
                        onclick="logout()">

                    <i class="bi bi-box-arrow-right me-1"></i>
                    Logout

                </button>

            </div>

        </div>
    </nav>


    <div class="container py-4">


        <div id="studentView">

            <!-- SEARCH AND FILTERS -->

            <div class="card dark-card p-4 mb-4 shadow-sm">

                <div class="row g-3">

                    <div class="col-md-6">
                        <label class="form-label small fw-bold">
                            Search Room
                        </label>

                        <div class="input-group">

                            <span class="input-group-text bg-transparent border-secondary text-muted">
                                <i class="bi bi-search"></i>
                            </span>

                            <input type="text"
                                   id="searchInput"
                                   class="form-control border-secondary text-white"
                                   placeholder="Search room code, subject, building..."
                                   onkeyup="filterRooms()">

                        </div>
                    </div>


                    <div class="col-md-6">
                        <label class="form-label small fw-bold">
                            Building
                        </label>

                        <select id="buildingFilter"
                                class="form-select border-secondary text-white"
                                onchange="filterRooms()">

                            <option value="ALL">All Buildings</option>
                            <option value="Main Building">Main Building</option>
                            <option value="Engineering Bldg">Engineering Bldg</option>
                            <option value="IT Building">IT Building</option>

                        </select>
                    </div>


                    <div class="col-md-6">
                        <label class="form-label small fw-bold">
                            Floor Level
                        </label>

                        <select id="floorFilter"
                                class="form-select border-secondary text-white"
                                onchange="filterRooms()">

                            <option value="ALL">All Floors</option>
                            <option value="1st Floor">1st Floor</option>
                            <option value="2nd Floor">2nd Floor</option>
                            <option value="3rd Floor">3rd Floor</option>

                        </select>
                    </div>


                    <div class="col-md-6">
                        <label class="form-label small fw-bold">
                            Availability Status
                        </label>

                        <select id="statusFilter"
                                class="form-select border-secondary text-white"
                                onchange="filterRooms()">

                            <option value="ALL">All Statuses</option>
                            <option value="VACANT">Vacant Only</option>
                            <option value="OCCUPIED">Occupied Only</option>
                            <option value="RESERVED">Reserved Only</option>

                        </select>
                    </div>

                </div>
            </div>


            <!-- ROOM DIRECTORY HEADER -->

            <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 px-1 gap-2">

                <div>
                    <h5 class="fw-bold mb-0 text-white">
                        Campus Rooms Directory

                        <span class="fs-6 text-muted ms-2 px-2 py-1 rounded-3"
                              style="background-color:#121929; border:1px solid #1f2937;"
                              id="roomCountLabel">
                            Showing rooms
                        </span>
                    </h5>

                    <small class="text-muted">
                        Click on any
                        <span class="text-success fw-semibold">Vacant</span>
                        room card to quickly submit a reservation request.
                    </small>
                </div>


                <!-- STATUS LEGEND -->

                <div class="d-flex align-items-center gap-3 small px-3 py-2 rounded-3"
                     style="background-color:#111827; border:1px solid #1f2937;">

                    <span>
                        <i class="bi bi-circle-fill text-success small me-1"></i>
                        Vacant
                    </span>

                    <span>
                        <i class="bi bi-circle-fill text-danger small me-1"></i>
                        Occupied
                    </span>

                    <span>
                        <i class="bi bi-circle-fill text-warning small me-1"></i>
                        Reserved
                    </span>

                </div>

            </div>


            <!-- ROOM CARDS -->

            <div class="row g-3" id="roomContainer"></div>

        </div>


        <div id="adminView" class="d-none">

            <!-- PENDING RESERVATION REQUESTS -->

            <div class="card dark-card p-4 mb-4 shadow-sm">

                <h5 class="fw-bold mb-3 text-primary">
                    <i class="bi bi-clock-history me-2"></i>
                    Pending Reservation Requests
                </h5>

                <div class="table-responsive">

                    <table class="table table-dark table-hover align-middle mb-0">

                        <thead>
                            <tr>
                                <th>Room</th>
                                <th>Requested By</th>
                                <th>Purpose / Time</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody id="requestsTableBody"></tbody>

                    </table>

                </div>
            </div>


            <!-- ROOM MANAGEMENT -->

            <div class="card dark-card p-4 mb-4 shadow-sm">

                <div class="d-flex justify-content-between align-items-center mb-3">

                    <h5 class="fw-bold mb-0 text-success">
                        <i class="bi bi-sliders me-2"></i>
                        Quick Room Status & Directory Management
                    </h5>

                    <button type="button"
                            class="btn btn-sm btn-success px-3 rounded-pill"
                            onclick="addNewRoomPrompt()">

                        <i class="bi bi-plus-lg me-1"></i>
                        Add Room

                    </button>

                </div>


                <div class="table-responsive">

                    <table class="table table-dark table-hover align-middle mb-0">

                        <thead>
                            <tr>
                                <th>Room Name</th>
                                <th>Building</th>
                                <th>Floor</th>
                                <th>Capacity</th>
                                <th>Current Status</th>
                                <th>Quick Actions</th>
                            </tr>
                        </thead>

                        <tbody id="adminTableBody"></tbody>

                    </table>

                </div>

            </div>

        </div>

    </div>
</div>

<div class="modal fade" id="reserveModal" tabindex="-1" aria-hidden="true">

    <div class="modal-dialog modal-dialog-centered">

        <div class="modal-content dark-card border-secondary">

            <div class="modal-header border-secondary"
                 style="background-color:#121929;">

                <h5 class="modal-title fw-bold text-white"
                    id="reserveModalTitle">
                    Reserve Room
                </h5>

                <button type="button"
                        class="btn-close btn-close-white"
                        data-bs-dismiss="modal"
                        aria-label="Close">
                </button>

            </div>


            <div class="modal-body p-4">

                <form id="reserveForm" onsubmit="submitReservation(event)">

                    <input type="hidden" id="modalRoomId">


                    <div class="mb-3">
                        <label class="form-label small fw-bold text-muted">
                            Your Name / Faculty
                        </label>

                        <input type="text"
                               id="resName"
                               class="form-control text-white"
                               required
                               placeholder="Enter your name">
                    </div>


                    <div class="mb-3">
                        <label class="form-label small fw-bold text-muted">
                            Purpose / Subject
                        </label>

                        <input type="text"
                               id="resPurpose"
                               class="form-control text-white"
                               required
                               placeholder="Enter purpose or subject">
                    </div>


                    <div class="mb-3">
                        <label class="form-label small fw-bold text-muted">
                            Duration / Time Window
                        </label>

                        <input type="text"
                               id="resTime"
                               class="form-control text-white"
                               required
                               placeholder="Enter time window">
                    </div>


                    <button type="submit"
                            class="btn btn-success w-100 rounded-3 py-2 fw-semibold">

                        Submit Reservation Request

                    </button>

                </form>

            </div>

        </div>

    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>

<script src="script.js"></script>

</body>
</html>


