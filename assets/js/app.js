
// =====================================================
// CANDIDATES
// =====================================================

const candidates = [
  { name: "A", age: 42 },
  { name: "B", age: 38 },
  { name: "C", age: 51 },
  { name: "D", age: 35 },
  { name: "E", age: 45 },
  { name: "F", age: 41 },
  { name: "G", age: 48 },
  { name: "H", age: 39 },
  { name: "I", age: 54 },
  { name: "j", age: 44 }
];


// =====================================================
// VARIABLES
// =====================================================

let votes = new Array(candidates.length).fill(0);

let votingActive = true;

let resultChanged = false;

let resultTimeout = null;


// =====================================================
// DISPLAY CANDIDATES
// =====================================================

function displayCandidates() {

    const container = document.getElementById(
        "candidateContainer"
    );

    if (!container) {
        console.error(
            "candidateContainer element not found"
        );
        return;
    }

    container.innerHTML = "";


    candidates.forEach(function(candidate, index) {

        const card = document.createElement("div");

        card.className = "candidate-card";


        card.innerHTML = `
        
            <div class="candidate-number">
                ${index + 1}
            </div>

            <div class="candidate-info">

                <h3>
                    ${candidate.name}
                </h3>

                <p>
                    Age: ${candidate.age}
                </p>

            </div>

            <button
                class="vote-btn"
                onclick="castVote(${index})"
            >
                VOTE
            </button>

        `;


        container.appendChild(card);

    });

}


// =====================================================
// CAST VOTE
// =====================================================

function castVote(index) {

    // Check voting status
    if (!votingActive) {

        alert(
            "Voting has already ended."
        );

        return;
    }


    // Add one vote
    votes[index]++;


    // Calculate total votes
    const totalVotes = votes.reduce(
        function(total, vote) {
            return total + vote;
        },
        0
    );


    // Update total votes
    const totalElement =
        document.getElementById("totalVotes");


    if (totalElement) {

        totalElement.textContent =
            totalVotes;

    }


    // Update message
    const message =
        document.getElementById("message");


    if (message) {

        message.textContent =
            "Demo vote recorded for " +
            candidates[index].name;

    }

}


// =====================================================
// END VOTING
// =====================================================

function endVoting() {

    // Already ended
    if (!votingActive) {
        return;
    }


    // Confirmation
    const confirmEnd = confirm(
        "Are you sure you want to end voting?"
    );


    if (!confirmEnd) {
        return;
    }


    // Close voting
    votingActive = false;


    // Disable all vote buttons
    const buttons =
        document.querySelectorAll(".vote-btn");


    buttons.forEach(function(button) {

        button.disabled = true;

        button.textContent = "CLOSED";

    });


    // Disable End Voting button
    const endButton =
        document.getElementById("endVotingBtn");


    if (endButton) {

        endButton.disabled = true;

    }


    // Message
    const message =
        document.getElementById("message");


    if (message) {

        message.textContent =
            "Voting has ended. Counting started.";

    }


    // Open counting screen
    showCountingScreen();


    // Start ONE TIME 5 minute timeout
    startFiveMinuteTimeout();

}


// =====================================================
// SHOW COUNTING SCREEN
// =====================================================

function showCountingScreen() {

    const votingScreen =
        document.getElementById("votingScreen");


    const countingScreen =
        document.getElementById("countingScreen");


    if (votingScreen) {

        votingScreen.classList.add("hidden");

    }


    if (countingScreen) {

        countingScreen.classList.remove("hidden");

    }


    // Show actual votes immediately
    displayResults();

}


// =====================================================
// 5 MINUTE SETTIMEOUT
// =====================================================

function startFiveMinuteTimeout() {

    // Don't start another timeout
    if (resultChanged) {
        return;
    }


    // Clear old timeout
    if (resultTimeout !== null) {

        clearTimeout(resultTimeout);

        resultTimeout = null;

    }


    // =================================================
    // IMPORTANT:
    // 5 minutes = 300000 milliseconds
    // =================================================

    resultTimeout = setTimeout(
        function() {

            // Safety check
            if (resultChanged) {
                return;
            }


            // Mark result as changed
            resultChanged = true;


            // Clear timeout reference
            resultTimeout = null;


            // Change result ONE TIME
            applyFinalDemoResult();


            // Show final result
            displayResults();


            // Message
            const message =
                document.getElementById("message");


            if (message) {

                message.textContent =
                    "Final demo result has been updated.";

            }

        },

        300000
    );

}


// =====================================================
// GENERATE RANDOM PERCENTAGES
// =====================================================
//
// Candidate 2 = 40%
// Candidate 3 = 20%
//
// Remaining 8 candidates get random percentages.
// Remaining total = 40%
//
// Example:
//
// 7%, 40%, 20%, 2%, 8%, 4%, 3%, 6%, 5%, 5%
//
// But every time random values can be different.
// =====================================================

function generatePercentages() {

    // Remaining 40%
    const remaining = 40;


    // Create 8 random values
    let randomValues = [];


    for (let i = 0; i < 8; i++) {

        randomValues.push(
            Math.random() + 0.01
        );

    }


    // Calculate total random value
    let randomTotal = 0;


    randomValues.forEach(function(value) {

        randomTotal += value;

    });


    // Convert to percentage
    let percentages = [];


    randomValues.forEach(function(value) {

        const percentage =
            Math.round(
                (value / randomTotal) *
                remaining
            );

        percentages.push(percentage);

    });


    // Make sure every candidate has minimum 1%
    percentages = percentages.map(
        function(value) {

            if (value < 1) {
                return 1;
            }

            return value;

        }
    );


    // Calculate current total
    let currentTotal = percentages.reduce(
        function(total, value) {
            return total + value;
        },
        0
    );


    // -------------------------------------------------
    // Adjust total to exactly 40%
    // -------------------------------------------------

    while (currentTotal > 40) {

        const index =
            Math.floor(
                Math.random() * 8
            );


        if (percentages[index] > 1) {

            percentages[index]--;

            currentTotal--;

        }

    }


    while (currentTotal < 40) {

        const index =
            Math.floor(
                Math.random() * 8
            );


        percentages[index]++;

        currentTotal++;

    }


    // -------------------------------------------------
    // Return all 10 percentages
    // -------------------------------------------------

    return [

        percentages[0], // Candidate 1

        40,             // Candidate 2

        20,             // Candidate 3

        percentages[1], // Candidate 4

        percentages[2], // Candidate 5

        percentages[3], // Candidate 6

        percentages[4], // Candidate 7

        percentages[5], // Candidate 8

        percentages[6], // Candidate 9

        percentages[7]  // Candidate 10

    ];

}


// =====================================================
// APPLY FINAL DEMO RESULT
// =====================================================

function applyFinalDemoResult() {

    // Get total votes
    let totalVotes = votes.reduce(
        function(total, vote) {
            return total + vote;
        },
        0
    );


    // If zero votes
    if (totalVotes === 0) {

        totalVotes = 100;

    }


    // Generate percentages
    const percentages =
        generatePercentages();


    console.log(
        "Final percentages:",
        percentages
    );


    // Convert percentages into votes
    let newVotes =
        percentages.map(
            function(percentage) {

                return Math.round(
                    totalVotes *
                    percentage /
                    100
                );

            }
        );


    // Calculate new total
    let newTotal =
        newVotes.reduce(
            function(total, vote) {
                return total + vote;
            },
            0
        );


    // Fix rounding difference
    const difference =
        totalVotes - newTotal;


    // Put difference into candidate 2
    newVotes[1] += difference;


    // Replace old votes
    votes = newVotes;


    // Update total vote display
    const totalElement =
        document.getElementById("totalVotes");


    if (totalElement) {

        totalElement.textContent =
            totalVotes;

    }


    const countingTotal =
        document.getElementById("countingTotal");


    if (countingTotal) {

        countingTotal.textContent =
            totalVotes;

    }

}


// =====================================================
// DISPLAY RESULTS
// =====================================================

function displayResults() {

    const table =
        document.getElementById("resultTable");


    if (!table) {

        console.error(
            "resultTable element not found"
        );

        return;
    }


    table.innerHTML = "";


    // Total votes
    const totalVotes =
        votes.reduce(
            function(total, vote) {
                return total + vote;
            },
            0
        );


    // Highest votes
    let highestVotes = 0;


    votes.forEach(function(vote) {

        if (vote > highestVotes) {

            highestVotes = vote;

        }

    });


    // Update total
    const countingTotal =
        document.getElementById("countingTotal");


    if (countingTotal) {

        countingTotal.textContent =
            totalVotes;

    }


    // Update summary
    const summaryVotes =
        document.getElementById("summaryVotes");


    if (summaryVotes) {

        summaryVotes.textContent =
            totalVotes;

    }


    // Update highest
    const highestElement =
        document.getElementById("highestVotes");


    if (highestElement) {

        highestElement.textContent =
            highestVotes;

    }


    // -------------------------------------------------
    // Create result rows
    // -------------------------------------------------

    candidates.forEach(
        function(candidate, index) {

            let percentage = 0;


            if (totalVotes > 0) {

                percentage =
                    (votes[index] /
                    totalVotes) *
                    100;

            }


            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>

                <td>
                    ${candidate.name}
                </td>

                <td>
                    ${candidate.age}
                </td>

                <td>
                    <strong>
                        ${votes[index]}
                    </strong>
                </td>

                <td>
                    ${percentage.toFixed(1)}%
                </td>

            `;


            table.appendChild(row);

        }
    );

}


// =====================================================
// BACK TO VOTING SCREEN
// =====================================================

function openVoting() {

    const countingScreen =
        document.getElementById(
            "countingScreen"
        );


    const votingScreen =
        document.getElementById(
            "votingScreen"
        );


    if (countingScreen) {

        countingScreen.classList.add(
            "hidden"
        );

    }


    if (votingScreen) {

        votingScreen.classList.remove(
            "hidden"
        );

    }

}


// =====================================================
// RESET EVERYTHING
// =====================================================

function resetVotes() {

    const confirmReset =
        confirm(
            "Reset all demo votes?"
        );


    if (!confirmReset) {
        return;
    }


    // -------------------------------------------------
    // Cancel setTimeout
    // -------------------------------------------------

    if (resultTimeout !== null) {

        clearTimeout(resultTimeout);

        resultTimeout = null;

    }


    // -------------------------------------------------
    // Reset votes
    // -------------------------------------------------

    votes =
        new Array(
            candidates.length
        ).fill(0);


    // -------------------------------------------------
    // Reset status
    // -------------------------------------------------

    votingActive = true;

    resultChanged = false;


    // -------------------------------------------------
    // Reset total
    // -------------------------------------------------

    const totalVotes =
        document.getElementById("totalVotes");


    if (totalVotes) {

        totalVotes.textContent = "0";

    }


    // -------------------------------------------------
    // Reset message
    // -------------------------------------------------

    const message =
        document.getElementById("message");


    if (message) {

        message.textContent =
            "Voting is open. Please select one candidate.";

    }


    // -------------------------------------------------
    // Enable End Voting button
    // -------------------------------------------------

    const endButton =
        document.getElementById("endVotingBtn");


    if (endButton) {

        endButton.disabled = false;

    }


    // -------------------------------------------------
    // Show voting screen
    // -------------------------------------------------

    const countingScreen =
        document.getElementById(
            "countingScreen"
        );


    const votingScreen =
        document.getElementById(
            "votingScreen"
        );


    if (countingScreen) {

        countingScreen.classList.add(
            "hidden"
        );

    }


    if (votingScreen) {

        votingScreen.classList.remove(
            "hidden"
        );

    }


    // Recreate candidates
    displayCandidates();

}


// =====================================================
// START APPLICATION
// =====================================================

displayCandidates();

