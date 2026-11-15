
const lead = JSON.parse(
  sessionStorage.getItem("nexoraLead") || "null"
);

const booking = JSON.parse(
  sessionStorage.getItem("nexoraBooking") || "null"
);

const confirmationContainer = document.querySelector(
  ".confirmation-container"
);

function showMissingBooking() {
  confirmationContainer.innerHTML = `
    <section class="success-heading">
      <div class="success-icon">!</div>
      <p class="eyebrow">BOOKING INFORMATION UNAVAILABLE</p>
      <h1>Let's get your journey <span>back on track.</span></h1>
      <p class="intro">
        We couldn't find your booking details in this browser session.
        Please complete the booking process before viewing your confirmation.
      </p>
      <a href="page-2.html" class="primary-button">
        Start the process →
      </a>
      <a href="page-3.html" class="secondary-link">
        Return to booking
      </a>
    </section>
  `;
}

function setText(id, value) {
  const element = document.getElementById(id);

  if (element) {
    element.textContent = value || "Not provided";
  }
}

function displayConfirmation() {
  if (!lead || !booking) {
    showMissingBooking();
    return;
  }

  setText("bookingReference", booking.bookingReference);
  setText("clientName", booking.clientName);
  setText("businessName", booking.business);
  setText("consultationType", booking.consultation);
  setText(
    "consultationDuration",
    booking.duration ? `${booking.duration} minutes` : "Not specified"
  );
  setText("bookingDate", booking.formattedDate);
  setText("bookingTime", booking.formattedTime);
  setText("bookingTimezone", booking.timezone);
  setText("clientEmail", booking.email);

  const yearElement = document.getElementById("currentYear");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

displayConfirmation();
