const API_BASE = "http://localhost:5000/api";
let roomSchedules = {};
let bookings = [];
let myBookings = 0;
let occupiedRooms = 0;
let availableRooms = 88;

// Generate rooms dynamically
function generateRooms() {
  const roomGrid = document.getElementById("roomGrid");
  roomGrid.innerHTML = "";

  for (let i = 12; i <= 55; i++) {
    addRoom(`B2-${i}`, roomGrid);
  }
  for (let i = 12; i <= 55; i++) {
    addRoom(`B4-${i}`, roomGrid);
  }
}

function addRoom(name, grid) {
  const box = document.createElement("div");
  box.className = "room-box available";
  box.id = name;
  box.textContent = name;
  box.onclick = () => openRoomModal(name);
  grid.appendChild(box);

  roomSchedules[name] = {}; 
}

generateRooms();

function updateClock() {
  const now = new Date();
  document.getElementById("clock").textContent = now.toLocaleString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long',
    day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
  });
}
setInterval(updateClock, 1000);
updateClock();

function openRoomModal(room) {
  document.getElementById("modalRoomName").textContent = `Availability for ${room}`;
  const timeSlots = document.getElementById("timeSlots");
  timeSlots.innerHTML = "";

  const slots = [
    "08:00-09:00","09:00-10:00","10:00-11:00",
    "11:00-12:00","13:00-14:00","14:00-15:00",
    "15:00-16:00","16:00-17:00"
  ];

  slots.forEach(slot => {
    const li = document.createElement("li");
    if (roomSchedules[room][slot]) {
      li.textContent = `${slot} - In Use`;
      li.className = "inuse-slot";
    } else {
      li.textContent = `${slot} - Available`;
      li.className = "available-slot";
      li.onclick = () => bookRoom(room, slot);
    }
    timeSlots.appendChild(li);
  });

  document.getElementById("roomModal").style.display = "block";
}

function closeModal() {
  document.getElementById("roomModal").style.display = "none";
}

function bookRoom(room, slot) {
  roomSchedules[room][slot] = true;
  myBookings++;
  occupiedRooms++;
  availableRooms--;

  document.getElementById("myBookings").textContent = myBookings;
  document.getElementById("occupiedRooms").textContent = occupiedRooms;
  document.getElementById("availableRooms").textContent = availableRooms;

  const roomBox = document.getElementById(room);
  roomBox.classList.remove("available");
  roomBox.classList.add("inuse");
  roomBox.textContent = `${room}\nIn Use`;

  bookings.push({ room, slot });
  updateHistory();

  closeModal();
  alert(`Room`) }