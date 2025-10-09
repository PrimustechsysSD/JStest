(function () {
  const questions = [
    "What's your favorite automation tool?",
    "How many scripts have you debugged this week?",
    "If you could fix one SAP SF quirk forever, what would it be?",
    "What's your go-to browser for UI testing?",
    "Which emoji best describes your current mood?"
  ];

  const asked = new Set();
  let count = 0;

  function askRandomQuestion() {
    if (count >= 3) {
      window.location.href = "https://hcm-in10-preview.hr.cloud.sap/sf/reportcenter";
      return;
    }

    let index;
    do {
      index = Math.floor(Math.random() * questions.length);
    } while (asked.has(index));

    asked.add(index);
    const answer = prompt(questions[index]);
    if (answer === null) {
      alert("Flow cancelled. No redirect will happen.");
      return;
    }

    count++;
    askRandomQuestion();
  }

  askRandomQuestion();
})();
