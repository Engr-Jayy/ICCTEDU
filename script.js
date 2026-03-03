const API_BASE = "http://localhost:5000/api";

let roomSchedules = {};
let myBookings = 0;
let occupiedRooms = 0;
let availableRooms = 88;

async function fetchAvailability(room, date) {
  const res = await fetch(
    `${API_BASE}/availability?room=${encodeURIComponent(room)}&date=${date}`
  );
  return await res.json();
}

function generateRooms() {
  const roomGrid = document.getElementById("roomGrid");
  roomGrid.innerHTML = "";

  for (let i = 12; i <= 55; i++) addRoom(`B2-${i}`, roomGrid);
  for (let i = 12; i <= 55; i++) addRoom(`B4-${i}`, roomGrid);
}
generateRooms();

function addRoom(name, grid) {
  const box = document.createElement("div");
  box.className = "room-box available";
  box.id = name;
  box.textContent = name;
  box.onclick = () => openRoomModal(name);
  grid.appendChild(box);
}

async function openRoomModal(room) {
  document.getElementById("modalRoomName").textContent =
    `Availability for ${room}`;

  const timeSlots = document.getElementById("timeSlots");
  timeSlots.innerHTML = "";

  const today = new Date().toISOString().split("T")[0];
  const bookedSlots = await fetchAvailability(room, today);

  const slots = [
    "08:00-09:00","09:00-10:00","10:00-11:00",
    "11:00-12:00","13:00-14:00","14:00-15:00",
    "15:00-16:00","16:00-17:00"
  ];

  slots.forEach(slot => {
    const li = document.createElement("li");

    if (bookedSlots.includes(slot)) {
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

async function bookRoom(room, slot) {
  const today = new Date().toISOString().split("T")[0];

  const res = await fetch(`${API_BASE}/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      room,
      date: today,
      time_slot: slot
    })
  });

  if (!res.ok) {
    const err = await res.json();
    alert(err.message || "Booking failed");
    return;
  }

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

  closeModal();
  alert("Room booked successfully!");
}
