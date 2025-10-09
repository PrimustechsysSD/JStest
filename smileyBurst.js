(function () {
  const questions = [
    "What's your favorite programming language?",
    "How many cups of coffee have you had today?",
    "If you could automate one task forever, what would it be?",
    "What's the most satisfying bug you've ever squashed?",
    "Which browser do you trust the most for testing?"
  ];

  for (let i = 0; i < 3; i++) {
    const randomIndex = Math.floor(Math.random() * questions.length);
    const answer = prompt(questions[randomIndex]);
    if (answer === null) {
      alert("You cancelled the flow. No redirect will happen.");
      return;
    }
  }

  window.location.href = "https://hcm-in10-preview.hr.cloud.sap/sf/reportcenter";
})();

