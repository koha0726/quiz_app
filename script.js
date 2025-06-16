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
      // 選択したジャンルの取得
      const selectedCategory = Array.from(document.querySelectorAll('input[name="category"]:checked'))
      .map(el => el.value);

      // 全ジャンル選択 or 未選択時は全データ使用
      if (selectedCategory.length > 0) {
        quizData = data.filter(q => selectedCategory.includes(q.category));
      } else {
        quizData = data;
      }

      // デバッグログ
      console.log("選択されたカテゴリ:", selectedCategory);
      console.log("データのカテゴリ一覧:", data.map(q => q.category));


      // 一時表示
      showQuestion(0);
    })
    .catch(err => {
      console.error('JSONの読み込みに失敗:', err);
    });

}

// 選択肢のシャッフル
function shuffleArray(array) {
  for (let i = array.length -1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// 問題文・選択肢の表示
function showQuestion(index) {
  currentQuestionIndex = index; // 現在の問題番号
  const question = quizData[index];

  if (!question) {
    console.error('指定された問題が存在しません');
    return;
  }

  const choices = [...question.choices];
  shuffleArray(choices); // 選択肢シャッフル

  // 記号ラベル
  const kanaLabels = ['ア', 'イ', 'ウ', 'エ', 'オ', 'カ', 'キ', 'ク', 'ケ', 'コ'];
  const labelMap = {};

  // 問題文の表示
  document.getElementById('question-text').textContent = question.question;

  const choicesContainer = document.getElementById('choices');
  choicesContainer.innerHTML = ''; // 前回の選択肢のクリア

  // 選択ボタンの設定
  const inputType = question.type === 'multiple' ? 'checkbox' : 'radio';

  // 選択肢リストのループ処理
  choices.forEach((choice, i) => {

    const kana = kanaLabels[i];
    labelMap[kana] = choice; // カナと選択肢の紐づけ

    // ラベルでテキストとボタンをセットにする
    const label = document.createElement('label');
    const input = document.createElement('input');

    input.type = inputType;
    input.name = 'choice';
    input.value = kana; // ラベル記号をvalue属性にセット

    // ラベルに選択ボタンとテキストを追加
    label.appendChild(input);
    label.appendChild(document.createTextNode(`${kana}.${choice}`));

    const br = document.createElement('br');
    // 子要素として追加
    choicesContainer.appendChild(label);
    choicesContainer.appendChild(br);
  });

  question._labelMap = labelMap;

  // 問題数の表示
  const progressDiv = document.getElementById('progress');
  if (progressDiv) {
    progressDiv.textContent = `${index + 1}問目／全${quizData.length}問`;
  }
}

// 正誤判定
function checkAnswer(index) {
  const question = quizData[index];
  const inputs = document.querySelectorAll('input[name="choice"]'); // 現在のすべての選択肢の要素を取得
  const selectedLabels = [];

  // 選択されているものだけをselectedに追加
  inputs.forEach(input => {
    if (input.checked) {
      selectedLabels.push(input.value);
    }
  });
  
  //ラベルからテキストへの変換
  const selected = selectedLabels.map(label => question._labelMap[label]);

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

  // テキスト→ラベル
  const reverseLabelMap = {};
  for (const [label, text] of Object.entries(question._labelMap)) {
    reverseLabelMap[text] = label;
  }

  const correctLabels = correct.map(answer => reverseLabelMap[answer]);

  const detailDiv = document.createElement('div');
  detailDiv.innerHTML = `あなたの選択: ${selectedLabels.join('、') || '(未選択)'}<br>
  正解: ${correctLabels.join('、')}<br>`;

  // 前回の表示があれば消す
  const existingDetail = answerDiv.querySelector('div');
  if (existingDetail) {
    answerDiv.removeChild(existingDetail);
  }

  answerDiv.appendChild(detailDiv);
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
