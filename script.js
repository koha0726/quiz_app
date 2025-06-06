function startQuiz() {
  alert("ここでクイズを開始します（仮）");
  document.getElementById('start-screen').style.display = 'none';
  document.getElementById('quiz-screen').style.display = 'block';
  
}

function showResult() {
  document.getElementById('result-screen').style.display = 'block';
}