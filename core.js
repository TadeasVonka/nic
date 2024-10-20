//kontrola podpory file API
if (window.File && window.FileReader && window.FileList && window.Blob) {
} else {
  alert(
    "FILE API, nutné pro chod aplikace není ve vašem prohlížeči podporováno, pro spuštění aplikace prosím aktualizujte webový prohlížeč.  "
  );
}

if (window.addEventListener) {
  window.addEventListener("load", checkLastState(), false);
} else if (window.attachEvent) {
  window.attachEvent("onload", checkLastState());
} else {
  window.onload = checkLastState();
}

var answerData = new Array(new Array());
var data = [];
var test;
var testTimeout;
var actualTime;
var time;

function timer(min, timerOutFunction) {
  this.min = min;
  var timer;
  this.start = function () {
    if (min == 0) {
      timer = setTimeout(time.zobraz(), 1000);
    } else {
      timer = setTimeout(timerOutFunction, min * 60 * 1000);
    }
  };
  this.stop = function () {
    clearTimeout(timer);
  };
}

function toSt(n) {
  var s = "";
  if (n < 10) {
    s += "0";
  }
  return s + n.toString();
}

function viewTime(remaningTime) {
  this.remaningTime = remaningTime;
  var cas;
  var div = document.createElement("div");
  div.innerHTML = "<h2 id='time'>Zbývající čas: " + remaningTime + ":0</h2>";
  document.getElementById("head").insertBefore(div, null);
  this.zobraz = function () {
    remaningTime--;
    var sec = toSt(remaningTime % 60);
    cas = Math.floor(remaningTime / 60);
    var min = toSt(cas % 60);
    document.getElementById("time").innerHTML =
      "Zbývající čas: " + min + ":" + sec + "";
  };
}

function checkLastState() {
  //localStorage.clear();
  if (localStorage.getItem("data")) {
    //data = JSON.parse(localStorage.getItem('data'));
    //test = JSON.parse(localStorage.getItem('test'));
    // test.create(testData,JSON.parse(localStorage.getItem('test')));
    //  test = JSON.parse(localStorage.getItem('test'));
    // createTest();
  }
}

function handleFileSelect(evt) {
  //ziskani souboru
  var file = evt.target.files[0]; // FileList object
  //kontrola zda existuje

  if (file) {
    var reader = new FileReader(); //inicializace readeru
    reader.onload = function (e) {
      //cekani na nacteni

      test = new testData(e.target.result);

      createTest();
    };
  }
  reader.readAsText(file);
}

function serverFileLoad(serverFileName, testName, testInfo) {
  var xmlhttp;
  if (window.XMLHttpRequest) {
    // code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp = new XMLHttpRequest();
  } else {
    // code for IE6, IE5
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }
  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      test = new testData(
        xmlhttp.responseText,
        "test",
        "info",
        60,
        "paticka",
        100
      );
      test = new testData(
        xmlhttp.responseText,
        testName,
        testInfo,
        60,
        "SSaMS Liberec",
        getQuantityQuestionByDialog()
      );

      createTest();
    }
  };
  xmlhttp.open("GET", serverFileName, true);
  xmlhttp.send();
}

function createTest() {
  var pole = test.ziskejPolozky();
  data = pole;

  var head = document.createElement("span");
  var info = document.createElement("div");
  var form = document.createElement("div");
  var footer = document.createElement("div");

  head.innerHTML = "<h1>" + test.ziskejNadpis() + "</h1>";
  document.getElementById("head").insertBefore(head, null);

  info.innerHTML = test.ziskejInfo();
  document.getElementById("info").insertBefore(info, null);

  form.innerHTML = createForm(pole);
  document.getElementById("testArticle").insertBefore(form, null);

  document.getElementById("load").hidden = true;

  /* time = new viewTime(test.ziskejCas()*60);
    actualTime = new timer(0,"time.zobraz()");
    actualTime.start();*/

  testTimeout = new timer(test.ziskejCas(), "checkTest()");
  testTimeout.start();

  localStorage.setItem("data", JSON.stringify(data));
  localStorage.setItem("test", JSON.stringify(test));
}

function getQuantityQuestionByDialog() {
  quantityQuestions = prompt(
    "Vyplňte počet generovaných otázek:  max(" + test.ziskejPocetOtazek() + ")",
    "100"
  );
  regNumber = /\d/;
  var check = true;

  while (check) {
    if (
      !regNumber.test(quantityQuestions) ||
      quantityQuestions > test.ziskejPocetOtazek()
    ) {
      quantityQuestions = prompt(
        "Nesprávný parametr! \n Vyplňte počet generovaných otázek:  max(" +
          test.ziskejPocetOtazek() +
          ")",
        "100"
      );
    } else {
      check = false;
    }
  }

  return quantityQuestions;
}

function testData(soubor) {
  this.soubor = soubor;
  var pole = soubor.split("/!/");

  this.ziskejNadpis = function () {
    return pole[0];
  };

  this.ziskejInfo = function () {
    return pole[1];
  };

  this.ziskejCas = function () {
    return pole[2];
  };

  this.ziskejPaticku = function () {
    return pole[4];
  };

  this.ziskejPolozky = function () {
    var helper = pole[3].split("/?/");

    var prvky;
    var moznosti;
    var odpovedi;
    var polozky = [];

    for (i = 1; i < helper.length; i++) {
      prvky = helper[i].split("/*/");
      moznosti = prvky[1].split("/./");
      odpovedi = prvky[2].split("/./");
      polozky.push(new polozka(prvky[0], moznosti, odpovedi));
    }
    return polozky;
  };
}

function mistake(question, answer, correctAnswer) {
  this.question = question;
  this.answer = answer;
  this.correctAnswer = correctAnswer;
}

function polozka(otazka, moznosti, odpovedi) {
  this.otazka = otazka;
  this.moznosti = moznosti;
  this.odpovedi = odpovedi;
}

function createForm(polozky) {
  var form = "<form name='testForm'>";
  for (var i = 0; i < polozky.length; i++) {
    form +=
      "<section class='sectionQuestion' id='polozka" +
      i +
      "'><div class='question' id='question'>" +
      (i + 1) +
      ") " +
      polozky[i].otazka +
      "</div><div class='answers' id='answer'><ul>";
    for (var j = 0; j < polozky[i].moznosti.length; j++) {
      form +=
        "<li><input type='checkbox' name='x" +
        i +
        "x" +
        j +
        "' value='" +
        polozky[i].moznosti[j] +
        "' onchange='saveAnswer(" +
        i +
        ",this.value)' />" +
        polozky[i].moznosti[j] +
        "</li>";
    }
    form += "</ul></div></section>";
  }
  form +=
    "<section class='sectionSubmit' id='submit'><input type='button' value='Vyhodnotit a odeslat' name='check' onclick='checkTest(this.form)'/> </section>";
  form += "</form>";
  return form;
}

function checkTest(form) {
  var spravneOdpovedi = 0;
  var mistakes = new Array();
  var answer = "";
  var result = document.createElement("div");

  testTimeout.stop();

  for (var i = 0; i < data.length; i++) {
    data[i].odpovedi.sort();
    if (answerData[i]) {
      answerData[i].sort();
      //alert("porovnani odpovedi:" + data[i].odpovedi.toString() + "///odpovezeno:" + answerData[i].toString() + "///");
      if (
        data[i].odpovedi.toString().split(")")[0] ==
        answerData[i].toString().split(")")[0]
      ) {
        //tady je problem nejdou porovnat pole?
        spravneOdpovedi++;
      } else {
        if (answerData[i].toString() == "") {
          answer = "nezodpovězeno";
        } else {
          answer = answerData[i].toString();
        }
        mistakes.push(new mistake(data[i].otazka, answer, data[i].odpovedi));
      }
    } else {
      mistakes.push(
        new mistake(data[i].otazka, "nezodpovězeno", data[i].odpovedi)
      );
    }
  }

  document.getElementById("testArticle").hidden = true;

  result.innerHTML = viewTestResult(mistakes, spravneOdpovedi);
  document.getElementById("resultArticle").insertBefore(result, null);
}

function getMark(percentage) {
  if (percentage >= 85) {
    return "1";
  }
  if (percentage >= 70 && percentage <= 84) {
    return "2";
  }
  if (percentage >= 55 && percentage <= 69) {
    return "3";
  }
  if (percentage >= 40 && percentage <= 55) {
    return "4";
  }
  if (percentage < 39) {
    return "5";
  }
}

function viewTestResult(mistakes, correctAnswer) {
  userName = prompt("Vyplňte jméno a příjmení: ", "");

  var view =
    "<section class='testReview' id='review'><h1>Vyhodnocení testu: </h1>";
  view += "<section class='testReview' id='review'><h1>" + userName + " </h1>";

  view +=
    "<div class='percentageReview' id='percentage'><h2>Úspěšnost: <strong>" +
    (correctAnswer / (mistakes.length + correctAnswer)) * 100 +
    "%</strong><h2/><h3>odpovídá známce: <strong>" +
    getMark((correctAnswer / (mistakes.length + correctAnswer)) * 100) +
    "</strong></h3></div>";
  view +=
    "<div class='correctAnswers' id='correct'><p>Správné odpovědi:" +
    correctAnswer +
    "</p></div>";

  view +=
    "<div class='mistakes' id='mistakes'><p>Počet chyb: " +
    mistakes.length +
    "<ul>";
  for (var i = 0; i < mistakes.length; i++) {
    view +=
      "<li>" +
      mistakes[i].question.toString() +
      "<br> zvolená: " +
      mistakes[i].answer.toString() +
      " <br> správná›: " +
      mistakes[i].correctAnswer.toString() +
      "</li>";
  }
  view += "</ul></div></section>";
  return view;
}

function getRadioValue(theRadioGroup) {
  for (var i = 0; i < document.getElementsByName(theRadioGroup).length; i++) {
    if (document.getElementsByName(theRadioGroup)[i].checked) {
      return document.getElementsByName(theRadioGroup)[i].value;
    }
  }
}

function saveAnswer(cisloOtazky, odpoved) {
  var end = false;
  if (!answerData[cisloOtazky]) {
    answerData[cisloOtazky] = new Array();
  }
  for (var i = 0; i < answerData[cisloOtazky].length; i++) {
    if (answerData[cisloOtazky][i] == odpoved) {
      answerData[cisloOtazky].splice(i, 1);
      end = true;
    }
  }
  if (!end) {
    answerData[cisloOtazky].push(odpoved);
    //alert ("ulozena odpoved: " + answerData[cisloOtazky].toString());
  }
  localStorage.setItem("answerData", JSON.stringify(answerData));
}
