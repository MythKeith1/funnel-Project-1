
/* =========================================
   NEXORA — PAGE 03 JAVASCRIPT
   CONSULTATION BOOKING SYSTEM
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  const bookingForm = document.getElementById("bookingForm");

  if (!bookingForm) return;


  /* ELEMENTS */

  const bookingLayout = document.getElementById("bookingLayout");
  const profileWarning = document.getElementById("profileWarning");

  const bookingDate = document.getElementById("bookingDate");
  const bookingTime = document.getElementById("bookingTime");

  const timeSlots = document.getElementById("timeSlots");
  const selectedDateLabel = document.getElementById("selectedDateLabel");

  const bookingMessage = document.getElementById("bookingMessage");
  const confirmButton = document.getElementById("confirmButton");

  const summaryName = document.getElementById("summaryName");
  const summaryBusiness = document.getElementById("summaryBusiness");
  const summaryConsultation = document.getElementById("summaryConsultation");
  const summaryDate = document.getElementById("summaryDate");
  const summaryTime = document.getElementById("summaryTime");

  const currentYear = document.getElementById("currentYear");


  /* CURRENT YEAR */

  currentYear.textContent = new Date().getFullYear();


  /* LOAD LEAD PROFILE */

  let lead = null;

  try {

    const storedLead = sessionStorage.getItem("nexoraLead");

    if (storedLead) {
      lead = JSON.parse(storedLead);
    }

  } catch (error) {

    console.error("Could not retrieve NEXORA profile:", error);

  }


  if (!lead || !lead.name || !lead.email || !lead.business) {

    bookingLayout.hidden = true;
    profileWarning.hidden = false;

    return;

  }


  /* DISPLAY CLIENT PROFILE */

  summaryName.textContent = lead.name;
  summaryBusiness.textContent = lead.business;


  /* LOCAL DATE HELPERS */

  function getLocalDateString(date = new Date()) {

    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(2, "0");

    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;

  }


  function formatDate(dateString) {

    if (!dateString) return "Not selected";

    const [year, month, day] = dateString.split("-").map(Number);

    const date = new Date(year, month - 1, day);

    return new Intl.DateTimeFormat("en-ZA", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(date);

  }


  /* DATE CONFIGURATION */

  const today = getLocalDateString();

  const maximumDate = new Date();

  maximumDate.setDate(maximumDate.getDate() + 60);

  bookingDate.min = today;
  bookingDate.max = getLocalDateString(maximumDate);


  /* DEMONSTRATION TIME SLOTS */

  const availableSlots = [
    "09:00",
    "10:00",
    "11:30",
    "13:00",
    "14:30",
    "16:00"
  ];


  function formatTime(time) {

    const [hours, minutes] = time.split(":").map(Number);

    const date = new Date();

    date.setHours(hours, minutes, 0, 0);

    return new Intl.DateTimeFormat("en-ZA", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    }).format(date);

  }


  /* FEEDBACK */

  function showMessage(message, type = "error") {

    bookingMessage.textContent = message;

    bookingMessage.className = `booking-message ${type}`;

  }


  function clearMessage() {

    bookingMessage.textContent = "";

    bookingMessage.className = "booking-message";

  }


  /* CONSULTATION SELECTION */

  const consultationOptions = [
    ...bookingForm.querySelectorAll(
      'input[name="consultation"]'
    )
  ];


  consultationOptions.forEach(option => {

    option.addEventListener("change", () => {

      summaryConsultation.textContent = option.value;

      clearMessage();

    });

  });


  /* DATE SELECTION */

  bookingDate.addEventListener("change", () => {

    const selectedDate = bookingDate.value;

    bookingTime.value = "";

    summaryDate.textContent = selectedDate
      ? formatDate(selectedDate)
      : "Not selected";

    summaryTime.textContent = "Not selected";

    selectedDateLabel.textContent = selectedDate
      ? formatDate(selectedDate)
      : "Select a date first";

    renderTimeSlots(selectedDate);

    clearMessage();

  });


  /* RENDER DEMONSTRATION SLOTS */

  function renderTimeSlots(dateString) {

    timeSlots.replaceChildren();

    if (!dateString) {

      const message = document.createElement("p");

      message.className = "empty-slots";

      message.textContent =
        "Choose a date to view the demonstration slots.";

      timeSlots.appendChild(message);

      return;

    }


    const selectedDate = new Date(
      `${dateString}T00:00:00`
    );

    if (
      Number.isNaN(selectedDate.getTime()) ||
      dateString < today ||
      dateString > getLocalDateString(maximumDate) ||
      selectedDate.getDay() === 0 ||
      selectedDate.getDay() === 6
    ) {

      const message = document.createElement("p");

      message.className = "empty-slots";

      message.textContent =
        "Please choose a valid weekday within the next 60 days.";

      timeSlots.appendChild(message);

      return;

    }


    let slotsToDisplay = [...availableSlots];


    // On the current day, hide earlier demonstration times.

    if (dateString === today) {

      const currentTime = new Date();

      const currentMinutes =
        currentTime.getHours() * 60 +
        currentTime.getMinutes();

      slotsToDisplay = slotsToDisplay.filter(time => {

        const [hours, minutes] = time.split(":").map(Number);

        return hours * 60 + minutes > currentMinutes;

      });

    }


    if (slotsToDisplay.length === 0) {

      const message = document.createElement("p");

      message.className = "empty-slots";

      message.textContent =
        "No remaining demonstration slots for this date. Please choose another date.";

      timeSlots.appendChild(message);

      return;

    }


    slotsToDisplay.forEach(time => {

      const button = document.createElement("button");

      button.type = "button";

      button.className = "time-slot";

      button.textContent = formatTime(time);

      button.setAttribute("aria-pressed", "false");

      button.addEventListener("click", () => {

        bookingTime.value = time;

        timeSlots.querySelectorAll(".time-slot").forEach(slot => {

          slot.classList.remove("selected");

          slot.setAttribute("aria-pressed", "false");

        });

        button.classList.add("selected");

        button.setAttribute("aria-pressed", "true");

        summaryTime.textContent = formatTime(time);

        clearMessage();

      });

      timeSlots.appendChild(button);

    });

  }


  /* CONSULTATION VALIDATION */

  function validateBooking() {

    const consultation = bookingForm.querySelector(
      'input[name="consultation"]:checked'
    );

    if (!consultation) {

      showMessage(
        "Please select a consultation type."
      );

      return false;

    }


    if (!bookingDate.value) {

      showMessage(
        "Please choose your preferred consultation date."
      );

      bookingDate.focus();

      return false;

    }


    if (
      bookingDate.value < today ||
      bookingDate.value > getLocalDateString(maximumDate)
    ) {

      showMessage(
        "Please select a valid date within the next 60 days."
      );

      bookingDate.focus();

      return false;

    }


    const selectedDay = new Date(
      `${bookingDate.value}T00:00:00`
    ).getDay();

    if (selectedDay === 0 || selectedDay === 6) {

      showMessage(
        "Please choose a weekday for your consultation."
      );

      return false;

    }


    if (!availableSlots.includes(bookingTime.value)) {

      showMessage(
        "Please select one of the available demonstration time slots."
      );

      return false;

    }


    if (
      bookingDate.value === today &&
      bookingTime.value <=
        `${String(new Date().getHours()).padStart(2, "0")}:${String(new Date().getMinutes()).padStart(2, "0")}`
    ) {

      showMessage(
        "That time has already passed. Please choose another slot."
      );

      renderTimeSlots(bookingDate.value);

      return false;

    }


    return true;

  }


  /* COLLECT BOOKING */

  function collectBooking() {

    const consultation = bookingForm.querySelector(
      'input[name="consultation"]:checked'
    );

    return {

      bookingReference:
        "NEX-" + Date.now().toString(36).toUpperCase(),

      clientName: lead.name,

      email: lead.email,

      phone: lead.phone || "",

      business: lead.business,

      consultation: consultation.value,

      duration: consultation.dataset.duration,

      date: bookingDate.value,

      formattedDate: formatDate(bookingDate.value),

      time: bookingTime.value,

      formattedTime: formatTime(bookingTime.value),

      notes: document.getElementById("bookingNotes").value.trim(),

      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,

      createdAt: new Date().toISOString(),

      status: "Demo booking — not externally confirmed",

      source: "NEXORA Page 03"

    };

  }


  /* CONFIRM BOOKING */

  bookingForm.addEventListener("submit", event => {

    event.preventDefault();

    clearMessage();

    if (!validateBooking()) return;


    const booking = collectBooking();

    confirmButton.disabled = true;

    confirmButton.textContent = "Preparing Confirmation...";


    try {

      // Store the booking for Page 04.

      sessionStorage.setItem(
        "nexoraBooking",
        JSON.stringify(booking)
      );


      // Preserve the business profile.

      sessionStorage.setItem(
        "nexoraLead",
        JSON.stringify(lead)
      );


      window.nexoraBooking = booking;


      showMessage(
        "Your booking details have been saved. Continue to review your confirmation.",
        "success"
      );


      confirmButton.textContent = "Continue to Confirmation ↗";

      confirmButton.disabled = false;

      confirmButton.type = "button";

      confirmButton.onclick = () => {

        window.location.href = "page-4.html";

      };

    } catch (error) {

      console.error("NEXORA booking storage error:", error);

      showMessage(
        "We could not save your booking in this browser. Please check your browser storage settings and try again."
      );

      confirmButton.disabled = false;

      confirmButton.type = "submit";

      confirmButton.textContent = "Confirm Consultation ↗";

    }

  });


  /* INITIALIZE */

  bookingLayout.hidden = false;

  profileWarning.hidden = true;

  summaryName.textContent = lead.name;

  summaryBusiness.textContent = lead.business;

  summaryConsultation.textContent = "Not selected";

  summaryDate.textContent = "Not selected";

  summaryTime.textContent = "Not selected";

});
