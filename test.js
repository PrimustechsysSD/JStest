(function() {
  // --- Basic CSS for modal and dropdown ---
  var style = document.createElement('style');
  style.innerHTML = `
    #candidateModalBox {
      position: fixed; left: 50%; top: 20%; transform: translateX(-50%);
      background: #fff; border: 1px solid #ccc; padding: 20px; z-index: 9999; box-shadow: 2px 2px 10px #888;
      min-width: 350px;
    }
    #candidateInput { width: 100%; margin-bottom: 8px; }
    #candidateSuggestList { background: #f9f9f9; border: 1px solid #ccc; max-height: 180px; overflow-y: auto; }
    #candidateSuggestList div { padding: 6px 10px; cursor: pointer; }
    #candidateSuggestList .selected { background: #bde1ff; }
    #candidateModalClose, #candidateGoBtn { margin-top: 10px; }
  `;
  document.head.appendChild(style);

  // --- Modal HTML ---
  var modal = document.createElement('div');
  modal.id = 'candidateModalBox';
  modal.innerHTML = `
    <strong>Candidate Search</strong><br>
    <input type="text" id="candidateInput" placeholder="Type Candidate Name or ID..."/>
    <div id="candidateSuggestList"></div>
    <button id="candidateGoBtn" disabled>Go</button>
    <button id="candidateModalClose">Cancel</button>
  `;
  document.body.appendChild(modal);

  var input = document.getElementById('candidateInput');
  var suggestList = document.getElementById('candidateSuggestList');
  var goBtn = document.getElementById('candidateGoBtn');
  var closeBtn = document.getElementById('candidateModalClose');
  var candidates = [], selectedIndex = -1;

  closeBtn.onclick = function() {
    modal.remove();
    style.remove();
  };

  // --- Helper: Fetch suggestions ---
  function fetchSuggestions(q) {
    var endpoint =
      'https://hcm55preview.sapsf.eu/jsup?query=' +
      encodeURIComponent(q) +
      '&m=autocomplete&findtype=customUserSearch&maxresults=30&hideusername=1' +
      '&includeInactive=false&includeExternalUsers=true' +
      '&includeExternalUsersNonMtr=false&adminPage=false&groupId=0';

    fetch(endpoint, { credentials: 'include' })
      .then(resp => resp.json())
      .then(data => {
        // Parse expected structure: { ResultSet: { Result: [ ... ] } }
        candidates = (data && data.ResultSet && Array.isArray(data.ResultSet.Result)) 
          ? data.ResultSet.Result : [];
        suggestList.innerHTML = '';
        candidates.forEach((c, i) => {
          var div = document.createElement('div');
          div.textContent = (c.FullName || c.FirstName) 
            + (c.EmailAddress ? ' (' + c.EmailAddress + ')' : '')
            + (c.candId ? ' [ID: ' + c.candId + ']' : '');
          div.onclick = function() { selectCandidate(i); };
          if (i === selectedIndex) div.className = 'selected';
          suggestList.appendChild(div);
        });
        selectedIndex = candidates.length ? 0 : -1;
        goBtn.disabled = !candidates.length;
      })
      .catch(() => {
        suggestList.innerHTML = '<div style="color:red;">Error fetching candidates.</div>';
        goBtn.disabled = true;
      });
  }

  input.oninput = function() {
    var q = input.value.trim();
    if (q.length >= 2) {
      fetchSuggestions(q);
    } else {
      suggestList.innerHTML = '';
      goBtn.disabled = true;
      candidates = [];
      selectedIndex = -1;
    }
  };

  function selectCandidate(idx) {
    selectedIndex = idx;
    Array.from(suggestList.children).forEach((div, i) =>
      div.className = (i === idx ? 'selected' : '')
    );
    goBtn.disabled = false;
  }

  input.onkeydown = function(e) {
    if (!candidates.length) return;
    if (e.key === 'ArrowDown') {
      selectedIndex = Math.min(selectedIndex + 1, candidates.length - 1);
      selectCandidate(selectedIndex);
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      selectedIndex = Math.max(selectedIndex - 1, 0);
      selectCandidate(selectedIndex);
      e.preventDefault();
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      goBtn.click();
      e.preventDefault();
    }
  };

  goBtn.onclick = function() {
    var c = candidates[selectedIndex];
    if (c && c.candId) {
      // Adjust URL pattern to your environment if needed
      window.location = '/acme?recruiting_ns=candidate%20profile&candidateId=' + c.candId;
    } else {
      alert('Cannot locate candidate profile URL!');
    }
    modal.remove();
    style.remove();
  };
})();
