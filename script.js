const trains = [
  { id: "123A", name: "Express Capital", time: "06:30 → 11:45", price: 1200, classes: ["AC 1", "AC 2", "Sleeper"] },
  { id: "456B", name: "Coastal Mail", time: "09:15 → 16:00", price: 850, classes: ["AC 2", "Sleeper"] },
  { id: "789C", name: "Night Liner", time: "22:10 → 04:55", price: 650, classes: ["AC 3", "Sleeper"] }
];

function searchTrains() {
  let from = document.getElementById("from").value;
  let to = document.getElementById("to").value;
  let date = document.getElementById("date").value;

  if (!from || !to || !date) {
    alert("Please fill all fields.");
    return;
  }

  let results = document.getElementById("results");
  results.innerHTML = "";

  trains.forEach(train => {
    results.innerHTML += `
      <div class="train-box">
        <div>
          <h3>${train.name} (${train.id})</h3>
          <p>${train.time}</p>
          <p>₹${train.price}</p>
        </div>
        <button class="btn" onclick="openBooking('${train.id}')">Book</button>
      </div>
    `;
  });
}

function openBooking(trainId) {
  const train = trains.find(t => t.id === trainId);

  document.getElementById("trainTitle").innerText = `${train.name} (${train.id})`;
  document.getElementById("classList").innerHTML = train.classes.map(c => `<option>${c}</option>`).join("");

  document.getElementById("bookingModal").style.display = "block";

  document.getElementById("bookingForm").onsubmit = function (e) {
    e.preventDefault();
    alert("✅ Booking Confirmed!\nTrain: " + train.name);
    closeBooking();
  };
}

function closeBooking() {
  document.getElementById("bookingModal").style.display = "none";
}
