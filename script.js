// 最初の画面
function home() {
  document.getElementById('start-screen').style.display = 'block';
  document.getElementById('quiz-screen').style.display = 'none';
  document.getElementById('result-screen').style.display = 'none';
}

let quizData = []; // クイズ内容の保持
let currentQuestionIndex = 0; // インデックス番号の保持

// 問題画面
function startQuiz() {
  currentQuestionIndex = 0;
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

// 問題文・選択肢の表示
function showQuestion(index) {
  currentQuestionIndex = index; // 現在の問題番号
  const question = quizData[index];

  if (!question) {
    console.error('指定された問題が存在しません');
    return;
  }

  // 問題文の表示
  document.getElementById('question-text').textContent = question.question;

  const choicesContainer = document.getElementById('choices');
  choicesContainer.innerHTML = ''; // 前回の選択肢のクリア

  // 選択ボタンの設定
  const inputType = question.type === 'multiple' ? 'checkbox' : 'radio';

  // 選択肢リストのループ処理
  question.choices.forEach((choice, i) => {

    // ラベルでテキストとボタンをセットにする
    const label = document.createElement('label');
    const input = document.createElement('input');

    input.type = inputType;
    input.name = 'choice';
    input.value = choice; // 選択肢のテキストをvalue属性にセット

    // ラベルに選択ボタンとテキストを追加
    label.appendChild(input);
    label.appendChild(document.createTextNode(choice));

    const br = document.createElement('br');
    // 子要素として追加
    choicesContainer.appendChild(label);
    choicesContainer.appendChild(br);
  });
}

// 正誤判定
function checkAnswer(index) {
  const question = quizData[index];
  const inputs = document.querySelectorAll('input[name="choice"]'); // 現在のすべての選択肢の要素を取得
  const selected = [];

  // 選択されているものだけをselectedに追加
  inputs.forEach(input => {
    if (input.checked) {
      selected.push(input.value);
    }
  });

  // 正解の数の変化の対応
  const correct = Array.isArray(question.answer) ? question.answer : [question.answer];

  // 数と選択の一致の確認
  const isCorrect = selected.length === correct.length && selected.every(choice => correct.includes(choice));

  const answerDiv = document.getElementById('answer');
  if (isCorrect) {
    answerDiv.innerText = "正解！";
    answerDiv.style.color = "green";
  } else {
    answerDiv.innerText = "不正解";
    answerDiv.style.color = "red";
  }

}

// 解説
function showResult(index) {
  document.getElementById('result-screen').style.display = 'block';

  const explanationDiv = document.getElementById('explanation');
  const explanation = quizData[index].explanation || "解説はありません";
  explanationDiv.innerText = explanation;

}

// 次の問題
function nextQuestion() {
  currentQuestionIndex++;

  // 問題が残っているか判別
  if (currentQuestionIndex < quizData.length) {
    document.getElementById('result-screen').style.display = 'none';
    document.getElementById('quiz-screen').style.display = 'block';
    showQuestion(currentQuestionIndex);
  } else {
    alert("全ての問題が終了しました。トップに戻ります。");
    home();
  }
}
