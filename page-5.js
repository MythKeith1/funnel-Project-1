
const lead = JSON.parse(
  sessionStorage.getItem("nexoraLead") || "null"
);

const booking = JSON.parse(
  sessionStorage.getItem("nexoraBooking") || "null"
);

function setText(id, value) {
  const element = document.getElementById(id);

  if (element) {
    element.textContent = value || "Not provided";
  }
}

function showClientJourney() {
  const yearElement = document.getElementById("currentYear");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  if (!lead || !booking) {
    const hero = document.querySelector(".hero-content");

    if (hero) {
      hero.innerHTML = `
        <p class="eyebrow">WELCOME TO NEXORA</p>
        <h1>Your journey<br><span>starts here.</span></h1>
        <p class="hero-description">
          Your previous session information is unavailable.
          You can restart the discovery process to prepare
          your personalised client journey.
        </p>
        <a href="page-2.html" class="primary-button">
          Start discovery →
        </a>
      `;
    }

    const profile = document.querySelector(".profile-card");

    if (profile) {
      profile.hidden = true;
    }

    const roadmap = document.querySelector(".roadmap-section");

    if (roadmap) {
      roadmap.hidden = true;
    }

    const preparation = document.querySelector(
      ".preparation-section"
    );

    if (preparation) {
      preparation.hidden = true;
    }

    return;
  }

  setText(
    "welcomeMessage",
    `Thank you, ${lead.fullName}. Your discovery information and consultation details are available in this browser session.`
  );

  setText("profileName", lead.fullName);
  setText("profileBusiness", lead.businessName);
  setText("profileIndustry", lead.industry);
  setText("profileGoal", lead.primaryGoal);
  setText("profileTimeline", lead.timeline);
  setText("profileConsultation", booking.consultation);
}

showClientJourney();
