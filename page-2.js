
/* =========================================
   NEXORA — PAGE 02 JAVASCRIPT
   MULTI-STEP LEAD QUALIFICATION
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("nexoraIntake");

  if (!form) return;

  const steps = [...form.querySelectorAll(".form-step")];

  const nextButton = document.getElementById("nextButton");
  const backButton = document.getElementById("backButton");
  const submitButton = document.getElementById("submitButton");

  const progressFill = document.getElementById("progressFill");
  const progressTrack = document.getElementById("progressTrack");

  const stepIndicator = document.getElementById("stepIndicator");
  const formMessage = document.getElementById("formMessage");

  const currentYear = document.getElementById("currentYear");

  let currentStep = 0;

  const totalSteps = steps.length;


  /* COPYRIGHT YEAR */

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }


  /* FORM FEEDBACK */

  function showMessage(message, type = "error") {

    formMessage.textContent = message;

    formMessage.className = `form-message ${type}`;

  }


  function clearMessage() {

    formMessage.textContent = "";
    formMessage.className = "form-message";

  }


  /* UPDATE STEP DISPLAY */

  function updateStep() {

    steps.forEach((step, index) => {

      const active = index === currentStep;

      step.hidden = !active;
      step.classList.toggle("active", active);

    });


    const progress = ((currentStep + 1) / totalSteps) * 100;

    progressFill.style.width = `${progress}%`;

    progressTrack.setAttribute(
      "aria-valuenow",
      String(currentStep + 1)
    );

    stepIndicator.textContent =
      `0${currentStep + 1} / 0${totalSteps}`;


    backButton.hidden = currentStep === 0;

    nextButton.hidden = currentStep === totalSteps - 1;

    submitButton.hidden = currentStep !== totalSteps - 1;


    clearMessage();

    const legend = steps[currentStep].querySelector("legend");

    if (legend) {
      legend.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });
    }

  }


  /* VALIDATE CURRENT STEP */

  function validateCurrentStep() {

    const currentFields = [
      ...steps[currentStep].querySelectorAll(
        "input:not([type='checkbox']), select, textarea"
      )
    ];

    for (const field of currentFields) {

      if (!field.checkValidity()) {

        field.reportValidity();

        return false;

      }

    }


    // STEP 03: Require at least one challenge.

    if (currentStep === 2) {

      const challenges = form.querySelectorAll(
        'input[name="challenges"]:checked'
      );

      if (challenges.length === 0) {

        showMessage(
          "Please select at least one business challenge."
        );

        return false;

      }

    }


    // STEP 04: Require at least one service.

    if (currentStep === 3) {

      const services = form.querySelectorAll(
        'input[name="services"]:checked'
      );

      if (services.length === 0) {

        showMessage(
          "Please select at least one service that interests you."
        );

        return false;

      }

      const consent = document.getElementById("consent");

      if (!consent.checked) {

        showMessage(
          "Please confirm your consent before submitting your enquiry."
        );

        consent.focus();

        return false;

      }

    }

    return true;

  }


  /* NEXT STEP */

  nextButton.addEventListener("click", () => {

    if (!validateCurrentStep()) return;

    if (currentStep < totalSteps - 1) {

      currentStep++;

      updateStep();

    }

  });


  /* PREVIOUS STEP */

  backButton.addEventListener("click", () => {

    if (currentStep > 0) {

      currentStep--;

      updateStep();

    }

  });


  /* COLLECT MULTIPLE SELECTIONS */

  function getSelectedValues(name) {

    return [
      ...form.querySelectorAll(
        `input[name="${name}"]:checked`
      )
    ].map(input => input.value);

  }


  /* COLLECT COMPLETE BUSINESS PROFILE */

  function collectLeadData() {

    const data = new FormData(form);

    return {

      name: data.get("name")?.trim() || "",

      email: data.get("email")?.trim() || "",

      phone: data.get("phone")?.trim() || "",

      business: data.get("business")?.trim() || "",

      website: data.get("website")?.trim() || "",

      industry: data.get("industry") || "",

      businessStage: data.get("businessStage") || "",

      teamSize: data.get("teamSize") || "",

      location: data.get("location")?.trim() || "",

      challenges: getSelectedValues("challenges"),

      primaryGoal: data.get("primaryGoal") || "",

      businessVision: data.get("businessVision")?.trim() || "",

      services: getSelectedValues("services"),

      investment: data.get("investment") || "",

      timeline: data.get("timeline") || "",

      consent: document.getElementById("consent").checked,

      submittedAt: new Date().toISOString(),

      source: "NEXORA Page 02"

    };

  }


  /* SUBMIT BUSINESS PROFILE */

  form.addEventListener("submit", event => {

    event.preventDefault();

    if (currentStep !== totalSteps - 1) return;

    if (!validateCurrentStep()) return;

    const lead = collectLeadData();

    submitButton.disabled = true;

    submitButton.textContent = "Preparing Your Profile...";


    try {

      // Store profile for Page 03.
      // This is local browser storage, not a live CRM.

      sessionStorage.setItem(
        "nexoraLead",
        JSON.stringify(lead)
      );

      // Make available to scripts on the current page.

      window.nexoraLead = lead;

      showMessage(
        "Your business profile has been saved successfully. Your information is ready for the consultation booking stage.",
        "success"
      );


      submitButton.textContent = "Continue to Booking ↗";
      submitButton.disabled = false;
      submitButton.type = "button";

      submitButton.onclick = () => {
        window.location.href = "page-3.html";
        
      };

    } catch (error) {

      console.error("NEXORA profile storage error:", error);

      showMessage(
        "We could not save your profile in this browser. Please check your browser storage settings and try again."
      );

      submitButton.disabled = false;
      submitButton.textContent = "Submit Business Profile ↗";

    }

  });


  /* INITIALIZE */

  updateStep();

});
