(function () {
  const questions = [
    "What's your favorite automation tool?",
    "How many scripts have you debugged this week?",
    "If you could fix one SAP SF quirk forever, what would it be?"
  ];

  let current = 0;
  const answers = [];

  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100vw';
  overlay.style.height = '100vh';
  overlay.style.background = 'rgba(0,0,0,0.6)';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.zIndex = '9999';
  document.body.appendChild(overlay);

  const box = document.createElement('div');
  box.style.background = '#fff';
  box.style.padding = '20px';
  box.style.borderRadius = '8px';
  box.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
  box.style.maxWidth = '400px';
  box.style.textAlign = 'center';
  overlay.appendChild(box);

  const questionText = document.createElement('div');
  questionText.style.marginBottom = '10px';
  questionText.style.fontSize = '16px';
  box.appendChild(questionText);

  const input = document.createElement('input');
  input.type = 'text';
  input.style.width = '100%';
  input.style.padding = '8px';
  input.style.marginBottom = '10px';
  input.style.border = '1px solid #ccc';
  input.style.borderRadius = '4px';
  box.appendChild(input);

  const button = document.createElement('button');
  button.textContent = 'Next';
  button.style.padding = '8px 16px';
  button.style.border = 'none';
  button.style.background = '#007bff';
  button.style.color = '#fff';
  button.style.borderRadius = '4px';
  button.style.cursor = 'pointer';
  box.appendChild(button);

  function showQuestion() {
    questionText.textContent = questions[current];
    input.value = '';
  }

  button.onclick = () => {
    answers.push(input.value);
    current++;
    if (current < questions.length) {
      showQuestion();
    } else {
      document.body.removeChild(overlay);
      window.location.href = "https://hcm-in10-preview.hr.cloud.sap/sf/reportcenter";
    }
  };

  showQuestion();
})();
