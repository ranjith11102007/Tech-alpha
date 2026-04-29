function getData(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

function setData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

const patientSignupForm = document.getElementById("patientSignupForm");
const doctorSignupForm = document.getElementById("doctorSignupForm");
const patientLoginForm = document.getElementById("patientLoginForm");
const doctorLoginForm = document.getElementById("doctorLoginForm");
const hospitalList = document.getElementById("hospitalList");
const reminderForm = document.getElementById("reminderForm");
const reminderList = document.getElementById("reminderList");

if (!localStorage.getItem("hospitals")) {
  const defaultHospitals = [
    {
      id: 1,
      name: "Supreme Rural Ortho & Maternity Centre",
      place: "Komarapalayam Main Road, Tiruchengode",
      specialty: "Orthopedic, Maternity",
      open: "Open 24 Hrs",
      tokens: 8,
      wait: "20 min",
      rating: "4.8",
      doctors: 6,
      services: 18,
      image: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/1da7aa4070771d07a2767162e9b66e0741eabd55.jpg"
    },
    {
      id: 2,
      name: "Green Valley Community Clinic",
      place: "Bus Stand Road, Namakkal Rural Belt",
      specialty: "General Medicine, Child Care",
      open: "8 AM - 8 PM",
      tokens: 5,
      wait: "15 min",
      rating: "4.6",
      doctors: 4,
      services: 11,
      image: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/023ce773653a73c00d07306ca8a43601360c13fb.jpg"
    },
    {
      id: 3,
      name: "Maayika Rural Health Hospital",
      place: "Village Junction, Salem Region",
      specialty: "General Medicine, Women Care",
      open: "9 AM - 9 PM",
      tokens: 12,
      wait: "10 min",
      rating: "4.9",
      doctors: 8,
      services: 22,
      image: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/60c285fc4d3986d72d036b932ac3e26fc79b9f03.jpg"
    }
  ];
  setData("hospitals", defaultHospitals);
}

if (patientSignupForm) {
  patientSignupForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const users = getData("patients");
    const name = document.getElementById("patientSignupName").value;
    const email = document.getElementById("patientSignupEmail").value;
    const password = document.getElementById("patientSignupPassword").value;
    const exists = users.find(user => user.email === email);
    if (exists) {
      alert("Patient account already exists.");
      return;
    }
    users.push({ name, email, password, role: "patient" });
    setData("patients", users);
    alert("Patient signup successful. Please login.");
    window.location.href = "patient-login.html";
  });
}

if (doctorSignupForm) {
  doctorSignupForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const doctors = getData("doctors");
    const name = document.getElementById("doctorSignupName").value;
    const email = document.getElementById("doctorSignupEmail").value;
    const password = document.getElementById("doctorSignupPassword").value;
    const specialization = document.getElementById("doctorSpecialization").value;
    const exists = doctors.find(user => user.email === email);
    if (exists) {
      alert("Doctor account already exists.");
      return;
    }
    doctors.push({ name, email, password, specialization, role: "doctor" });
    setData("doctors", doctors);
    alert("Doctor signup successful. Please login.");
    window.location.href = "doctor-login.html";
  });
}

if (patientLoginForm) {
  patientLoginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("patientEmail").value;
    const password = document.getElementById("patientPassword").value;
    const users = getData("patients");
    const match = users.find(user => user.email === email && user.password === password);
    if (match) {
      localStorage.setItem("currentUser", JSON.stringify(match));
      window.location.href = "patient-dashboard.html";
    } else {
      alert("Invalid patient login.");
    }
  });
}

if (doctorLoginForm) {
  doctorLoginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("doctorEmail").value;
    const password = document.getElementById("doctorPassword").value;
    const doctors = getData("doctors");
    const match = doctors.find(user => user.email === email && user.password === password);
    if (match) {
      localStorage.setItem("currentUser", JSON.stringify(match));
      window.location.href = "doctor-dashboard.html";
    } else {
      alert("Invalid doctor login.");
    }
  });
}

function renderHospitals() {
  if (!hospitalList) return;
  const hospitals = getData("hospitals");
  hospitalList.innerHTML = hospitals.map(hospital => `
    <div class="hospital-card">
      <img class="hospital-image" src="${hospital.image}" alt="${hospital.name}" width="1200" height="800" loading="lazy" />
      <div class="card-body">
        <div class="card-header-flex">
          <div>
            <h3>${hospital.name}</h3>
            <p class="address-line">${hospital.place}</p>
          </div>
          <div class="rating-pill">${hospital.rating}<small>Rating</small></div>
        </div>
        <div class="meta-row">
          <span class="meta-tag">${hospital.open}</span>
          <span class="meta-tag">${hospital.specialty}</span>
          <span class="meta-tag">Estimated wait: ${hospital.wait}</span>
        </div>
        <div class="token-box">
          <div>Available tokens: <span class="token-available">${hospital.tokens}</span></div>
          <div class="token-grid">
            <div class="token-mini"><span>Doctors</span><strong>${hospital.doctors}</strong></div>
            <div class="token-mini"><span>Services</span><strong>${hospital.services}</strong></div>
            <div class="token-mini"><span>Queue Time</span><strong>${hospital.wait}</strong></div>
          </div>
        </div>
        <div class="card-actions">
          <button class="btn" onclick="bookToken(${hospital.id})">Book Token</button>
          <button class="btn doctor-btn" onclick="alert('Hospital contact request sent successfully.')">Contact Hospital</button>
        </div>
      </div>
    </div>
  `).join("");
}

function bookToken(id) {
  const hospitals = getData("hospitals");
  const hospital = hospitals.find(h => h.id === id);
  if (!hospital) return;
  if (hospital.tokens <= 0) {
    alert("No tokens available.");
    return;
  }
  hospital.tokens -= 1;
  setData("hospitals", hospitals);
  alert(`Token booked successfully for ${hospital.name}. Remaining tokens: ${hospital.tokens}`);
  renderHospitals();
}

let reminders = getData("patientReminders");

function saveReminders() {
  setData("patientReminders", reminders);
}

function renderReminders() {
  if (!reminderList) return;
  reminderList.innerHTML = "";
  if (reminders.length === 0) {
    reminderList.innerHTML = "<li>No reminders saved.</li>";
    return;
  }
  reminders.forEach((reminder, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${reminder.title}</strong><br>
      Date: ${reminder.date}<br>
      Time: ${reminder.time}<br>
      Status: ${reminder.notified ? "Alerted" : "Pending"}<br>
      <button class="btn small-btn" onclick="deleteReminder(${index})">Delete</button>
    `;
    reminderList.appendChild(li);
  });
}

if (reminderForm) {
  reminderForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const title = document.getElementById("reminderTitle").value;
    const date = document.getElementById("reminderDate").value;
    const time = document.getElementById("reminderTime").value;
    reminders.push({ title, date, time, notified: false });
    saveReminders();
    renderReminders();
    reminderForm.reset();
    alert("Reminder saved successfully.");
  });
}

function deleteReminder(index) {
  reminders.splice(index, 1);
  saveReminders();
  renderReminders();
}

function checkReminders() {
  const now = new Date();
  reminders.forEach(reminder => {
    const reminderDateTime = new Date(`${reminder.date}T${reminder.time}`);
    const diff = reminderDateTime - now;
    if (diff > 0 && diff <= 60000 && !reminder.notified) {
      alert(`Reminder: ${reminder.title} is scheduled at ${reminder.time}`);
      reminder.notified = true;
      saveReminders();
      renderReminders();
    }
  });
}

function increaseTokens() {
  const hospitals = getData("hospitals");
  if (hospitals.length > 0) {
    hospitals[0].tokens += 1;
    setData("hospitals", hospitals);
    updateDoctorView();
    alert("Token count increased.");
  }
}

function resetTokens() {
  const hospitals = getData("hospitals");
  if (hospitals.length > 0) {
    hospitals[0].tokens = 8;
    setData("hospitals", hospitals);
    updateDoctorView();
    alert("Tokens reset successfully.");
  }
}

function updateDoctorView() {
  const hospitals = getData("hospitals");
  const countEl = document.getElementById("availableTokenCount");
  if (countEl && hospitals.length > 0) {
    countEl.textContent = hospitals[0].tokens;
  }
}

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}

renderHospitals();
renderReminders();
updateDoctorView();
setInterval(checkReminders, 10000);


function markNextCompleted() {
  alert("Next patient marked as completed.");
}


function signupUser() {
  const name = document.getElementById("fullname")?.value || "User";
  alert(`Account created successfully for ${name}!`);
  window.location.href = "login.html";
}



// Unified Auth Logic (for auth.html)
let currentRole = 'patient';
let currentMode = 'login';

function setRole(role) {
  currentRole = role;
  document.querySelectorAll('.role-pill').forEach(btn => btn.classList.toggle('active', btn.dataset.role === role));
  updateUnifiedAuthUI();
}

function setAuthMode(mode) {
  currentMode = mode;
  document.querySelectorAll('.mode-tab').forEach(btn => btn.classList.toggle('active', btn.dataset.mode === mode));
  updateUnifiedAuthUI();
}

function updateUnifiedAuthUI() {
  const roleLabel = document.getElementById('roleLabel');
  const authTitle = document.getElementById('authTitle');
  const authSubtitle = document.getElementById('authSubtitle');
  const submitBtn = document.getElementById('authSubmitBtn');
  const patientOnly = document.querySelectorAll('.patient-only');
  const doctorOnly = document.querySelectorAll('.doctor-only');
  const signupOnly = document.querySelectorAll('.signup-only');

  if (!roleLabel || !authTitle || !authSubtitle || !submitBtn) return;

  roleLabel.textContent = currentRole === 'patient' ? 'Patient Access' : 'Doctor Access';

  if (currentMode === 'login') {
    authTitle.textContent = currentRole === 'patient' ? 'Welcome back' : 'Doctor sign in';
    authSubtitle.textContent = currentRole === 'patient'
      ? 'Login to book appointments and track your token status.'
      : 'Login to manage patient flow, queue status, and token availability.';
    submitBtn.textContent = currentRole === 'patient' ? 'Login as Patient' : 'Login as Doctor';
  } else {
    authTitle.textContent = currentRole === 'patient' ? 'Create patient account' : 'Create doctor account';
    authSubtitle.textContent = currentRole === 'patient'
      ? 'Sign up to access hospital listings, appointments, and queue tracking.'
      : 'Sign up to manage doctor sessions, tokens, and patient queue updates.';
    submitBtn.textContent = currentRole === 'patient' ? 'Sign Up as Patient' : 'Sign Up as Doctor';
  }

  signupOnly.forEach(el => el.classList.toggle('hidden-field', currentMode !== 'signup'));
  patientOnly.forEach(el => el.classList.toggle('hidden-field', !(currentRole === 'patient' && currentMode === 'signup')));
  doctorOnly.forEach(el => el.classList.toggle('hidden-field', currentRole !== 'doctor'));
}

document.addEventListener('DOMContentLoaded', updateUnifiedAuthUI);

function handleUnifiedAuth() {
  // Get form values
  const email = document.getElementById('authEmail').value.trim();
  const password = document.getElementById('authPassword').value;
  const confirmPassword = document.getElementById('authConfirmPassword')?.value;
  const name = document.getElementById('authName')?.value?.trim();
  const phone = document.getElementById('authPhone')?.value?.trim();
  const hospitalCode = document.getElementById('hospitalCode')?.value?.trim();
  const village = document.getElementById('authVillage')?.value?.trim();
  const language = document.getElementById('authLanguage')?.value;
  const terms = document.getElementById('authTerms')?.checked;

  // Storage key by role
  const key = currentRole === 'patient' ? 'patients' : 'doctors';
  const users = getData(key);

  if (currentMode === 'signup') {
    // Validation
    if (!email || !password || !confirmPassword || !name) {
      alert('Please fill all required fields.');
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    if (currentRole === 'patient' && (!village || !language)) {
      alert('Please fill all patient details.');
      return;
    }
    if (currentRole === 'doctor' && !hospitalCode) {
      alert('Please enter hospital/staff code.');
      return;
    }
    if (!terms) {
      alert('You must agree to the terms.');
      return;
    }
    if (users.find(u => u.email === email)) {
      alert('Account already exists for this email.');
      return;
    }
    // Save user
    const user = currentRole === 'patient'
      ? { name, email, password, phone, village, language, role: 'patient' }
      : { name, email, password, phone, hospitalCode, role: 'doctor' };
    users.push(user);
    setData(key, users);
    alert('Signup successful! Please login.');
    setAuthMode('login');
    updateUnifiedAuthUI();
    return;
  }

  // LOGIN MODE
  if (!email || !password) {
    alert('Please enter email and password.');
    return;
  }
  const match = users.find(u => u.email === email && u.password === password);
  if (match) {
    localStorage.setItem('currentUser', JSON.stringify(match));
    window.location.href = currentRole === 'patient' ? 'patient-dashboard.html' : 'doctor-dashboard.html';
  } else {
    alert('Invalid credentials.');
  }
}

document.addEventListener('DOMContentLoaded', function() {
  if (document.querySelector('.role-auth-card')) {
    updateUnifiedAuthUI();
  }
});
