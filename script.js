// 最初の画面
function home() {
  document.getElementById('start-screen').style.display = 'block';
  document.getElementById('quiz-screen').style.display = 'none';
  document.getElementById('result-screen').style.display = 'none';
}

let quizData = []; // クイズ内容の保持

// 問題画面
function startQuiz() {
  alert("ここでクイズを開始します（仮）");
  document.getElementById('start-screen').style.display = 'none';
  document.getElementById('quiz-screen').style.display = 'block';

  fetch('data/sql.json')
    .then(res => res.json())
    .then(data => {
      quizData = data;
      console.log(data); 

      // 一時表示
      showQuestion(0);
    })
    .catch(err => {
      console.error('JSONの読み込みに失敗:', err);
    });

}

function showQuestion(index) {
  const question = quizData[index];

  if (!question) {
    console.error('指定された問題が存在しません');
    return;
  }

  // 問題文の表示
  document.getElementById('question-text').textContent = question.question;
}

// 解説
function showResult() {
  document.getElementById('result-screen').style.display = 'block';
}
