(function() {
  // Prompt for the candidate name or ID
  var candidateInput = prompt("Enter Candidate Name or ID to search:");
  if (!candidateInput) return;

  // Build the endpoint URL based on your input
  var endpoint =
    "https://hcm55preview.sapsf.eu/jsup?query=" +
    encodeURIComponent(candidateInput) +
    "&m=autocomplete&findtype=customUserSearch&maxresults=30&hideusername=1" +
    "&includeInactive=false&includeExternalUsers=true" +
    "&includeExternalUsersNonMtr=false&adminPage=false&groupId=0";

  // Fetch the autocomplete results
  fetch(endpoint, { credentials: "include" })
    .then(response => response.json())
    .then(data => {
      // Parse and show the results
      // The format may be an array of user objects, inspect one if needed
      if (Array.isArray(data) && data.length > 0) {
        var msg = data
          .map(c => (c.displayName || c.name) + " (" + (c.email || "") + ")")
          .join("\n");
        alert("Candidate Matches:\n" + msg);
      } else {
        alert("No candidates found.");
      }
    })
    .catch(error => alert("Search failed: " + error));
})();
