const username = document.getElementById('username');
const saveScoreBtn = document.getElementById('saveScoreBtn');
const finalScore = document.getElementById('finalScore');
const mostRecentScore = localStorage.getItem('mostRecentScore') || 0;  // Default to 0 if null

const highScores = JSON.parse(localStorage.getItem('highScores')) || [];

const MAX_HIGH_SCORES = 5;

finalScore.innerText = mostRecentScore;

username.addEventListener('keyup', () => {
    // Enable save button when the username is typed
    saveScoreBtn.disabled = !username.value;
});

const saveHighScore = (e) => {
    e.preventDefault();

    const score = {
        score: mostRecentScore,
        name: username.value,
    };

    // Add the new score to the highScores array
    highScores.push(score);
    
    // Sort the scores in descending order
    highScores.sort((a, b) => b.score - a.score);

    // Keep only the top 5 scores
    highScores.splice(MAX_HIGH_SCORES);

    // Save the updated highScores array to localStorage
    localStorage.setItem('highScores', JSON.stringify(highScores));

    // Redirect to the home page (use relative path for GitHub Pages)
    window.location.assign('./');
};
