// Mock train data with more details
const trains = [
    { name: 'HyperLoop Express', from: 'Delhi', to: 'Mumbai', departure: '08:00', arrival: '12:00', duration: '4h', classes: ['Sleeper', 'AC 3-Tier'], price: { Sleeper: 500, 'AC 3-Tier': 1200 } },
    { name: 'Quantum Rajdhani', from: 'Delhi', to: 'Kolkata', departure: '16:00', arrival: '08:00', duration: '16h', classes: ['AC 2-Tier'], price: { 'AC 2-Tier': 1800 } },
    { name: 'Sonic Shatabdi', from: 'Mumbai', to: 'Pune', departure: '06:00', arrival: '09:00', duration: '3h', classes: ['Sleeper'], price: { Sleeper: 300 } }
];

// Load data
let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
let selectedTrain = null;
let selectedSeats = [];

// Dark mode toggle
document.getElementById('darkModeToggle').addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const icon = document.querySelector('#darkModeToggle i');
    icon.className = document.body.classList.contains('dark') ? 'fas fa-sun' : 'fas fa-moon';
});

// Show sections with animation
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(sec => sec.classList.add('hidden'));
    document.getElementById(sectionId).classList.remove('hidden');
    if (sectionId === 'bookings') renderBookings();
}

// Voice search
function voiceSearch() {
    if ('webkitSpeechRecognition' in window) {
        const recognition = new webkitSpeechRecognition();
        recognition.onresult = (event) => {
            document.getElementById('from').value = event.results[0][0].transcript;
        };
        recognition.start();
    } else {
        alert('Voice search not supported in this browser.');
    }
}

// Search trains
document.getElementById('searchForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const from = document.getElementById('from').value.toLowerCase();
    const to = document.getElementById('to').value.toLowerCase();
    const classFilter = document.getElementById('classFilter').value;
    let filteredTrains = trains.filter(train => train.from.toLowerCase() === from && train.to.toLowerCase() === to);
    if (classFilter) filteredTrains = filteredTrains.filter(train => train.classes.includes(classFilter));
    renderTrains(filteredTrains);
    document.getElementById('results').classList.remove('hidden');
});

// Render trains
function renderTrains(trainList) {
    const container = document.getElementById('trainList');
    container.innerHTML = '';
    if (trainList.length === 0) {
        container.innerHTML = '<p>No trains found. Try adjusting filters.</p>';
        return;
    }
    trainList.forEach((train, index) => {
        const card = document.createElement('div');
        card.className = 'train-card';
        card.innerHTML = `
            <div>
                <h4>${train.name}</h4>
                <p>${train.from} → ${train.to} | ${train.departure} - ${train.arrival} (${train.duration})</p>
                <p>Classes: ${train.classes.join(', ')} | From ₹${Math.min(...Object.values(train.price))}</p>
            </div>
            <button onclick="selectTrain(${index})">Select</button>
        `;
        container.appendChild(card);
    });
}

// Select train
function selectTrain(index) {
    selectedTrain = trains[index];
    document.getElementById('trainDetails').innerHTML = `
        <h3>${selectedTrain.name}</h3>
        <p>${selectedTrain.from} → ${selectedTrain.to} | ${selectedTrain.departure} - ${selectedTrain.arrival}</p>
        <select id="classSelect" onchange="showSeatMap()">
            <option value="">Choose Class</option>
            ${selectedTrain.classes.map(cls => `<option value="${cls}">${cls} - ₹${selectedTrain.price[cls]}</option>`).join('')}
        </select>
    `;
    showSection('booking');
}

// Show seat map
function showSeatMap() {
    const classSelect = document.getElementById('classSelect').value;
    if (!classSelect) return;
    document.getElementById('seatMap').classList.remove('hidden');
    document.getElementById('bookingForm').classList.remove('hidden');
    const seatsContainer = document.getElementById('seats');
    seatsContainer.innerHTML = '';
    for (let i = 1; i <= 50; i++) {
        const seat = document.createElement('div');
        seat.className = 'seat';
        seat.textContent = i;
        if (Math.random() > 0.7) seat.classList.add('occupied');
        seat.addEventListener('click', () => {
            if (!seat.classList.contains('occupied')) {
                seat.classList.toggle('selected');
                const seatNum = parseInt(seat.textContent);
                if (seat.classList.contains('selected')) {
                    selectedSeats.push(seatNum);
                } else {
                    selectedSeats = selectedSeats.filter(s => s !== seatNum);
                }
            }
        });
        seatsContainer.appendChild(seat);
    }
}

// Book ticket
document.getElementById('bookingForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const passengers = document.getElementById('passengers').value;
    const classType = document.getElementById('classSelect').value;
    if (selectedSeats.length < passengers) {
        alert('Please select enough seats for all passengers.');
        return;
    }
    const booking = {
        train: selectedTrain.name,
        class: classType,
        passengers: passengers,
        seats: selectedSeats.slice(0, passengers),
        date: new Date().toLocaleDateString(),
        price: selectedTrain.price[classType] * passengers
    };
    bookings.push(booking);

    // persist bookings, reset selection and show confirmation
    localStorage.setItem('bookings', JSON.stringify(bookings));
    alert('Booking successful!');

    // reset state
    selectedTrain = null;
    selectedSeats = [];
    const seatMap = document.getElementById('seatMap');
    if (seatMap) seatMap.classList.add('hidden');
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) bookingForm.reset();

    // show bookings section (if present)
    showSection('bookings');
});
