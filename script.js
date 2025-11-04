// script.js - Handles interactivity for the Railway Ticket Booking UI

// Smooth scrolling for anchor links (e.g., CTA button to booking section)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Handle booking form submission
document.getElementById('bookingForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent default form submission
    
    // Collect form data
    const name = document.getElementById('name').value;
    const from = document.getElementById('from').value;
    const to = document.getElementById('to').value;
    const date = document.getElementById('date').value;
    const travelClass = document.getElementById('class').value;
    
    // Basic validation
    if (!name || !from || !to || !date || !travelClass) {
        alert('Please fill in all fields.');
        return;
    }
    
    // Demo: Show success alert (in a real app, send to server)
    alert(`Booking confirmed!\nName: ${name}\nFrom: ${from}\nTo: ${to}\nDate: ${date}\nClass: ${travelClass}`);
    
    // Reset form
    this.reset();
});

// Add subtle animation on page load for feature cards
window.addEventListener('load', () => {
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200); // Staggered animation
    });
});

// Initial styles for feature cards (for animation)
document.addEventListener('DOMContentLoaded', () => {
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
});