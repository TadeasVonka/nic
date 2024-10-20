function testData(soubor, nadpis, info, cas, paticka, pocetGenerovanychOtazek) {
  this.soubor = soubor;
  this.nadpis = nadpis;
  this.info = info;
  this.cas = cas;
  this.paticka = paticka;
  this.pocetGenerovanychOtazek = pocetGenerovanychOtazek;

  var okruh = soubor.split("[");

  this.ziskejNadpis = function () {
    return nadpis;
  };

  this.ziskejInfo = function () {
    return info;
  };

  this.ziskejCas = function () {
    return cas;
  };

  this.ziskejPaticku = function () {
    return paticka;
  };

  this.ziskejPocetOtazek = function () {
    var pocet = 0;
    for (i = 1; i < okruh.length; i++) {
      prvky = okruh[i].split("]")[1].split("\n");
      pocet += (prvky.length - 3) / 7;
    }
    return Math.ceil(pocet);
  };

  this.ziskejPolozky = function () {
    var moznosti = [];
    var odpovedi = [];
    var sumQuestions = 0;
    var randomResult = [];
    var polozky = [];
    var odpoved = "";
    for (i = 1; i < okruh.length; i++) {
      prvky = okruh[i].split("]")[1].split("\n");
      polozky = [];

      for (j = 3; j < prvky.length; j += 7) {
        var moznosti = [];
        var odpovedi = [];

        if (prvky[j + 4].toString().split("/")[1] == "a") {
          odpoved = prvky[j + 1];
        } else if (prvky[j + 4].toString().split("/")[1] == "b") {
          odpoved = prvky[j + 2];
        } else if (prvky[j + 4].toString().split("/")[1] == "c") {
          odpoved = prvky[j + 3];
        }

        moznosti.push(prvky[j + 1]);
        moznosti.push(prvky[j + 2]);
        moznosti.push(prvky[j + 3]);
        odpovedi.push(odpoved);

        polozky.push(new polozka(prvky[j], moznosti, odpovedi));
        sumQuestions++;
      }
      randomResult.push(polozky);
    }
    polozky = [];
    var count = 0;
    for (i = 0; i < randomResult.length; i++) {
      randomResult[i] = randomFrom(
        randomResult[i],
        Math.round(
          randomResult[i].length / (sumQuestions / pocetGenerovanychOtazek)
        )
      );
      if (randomResult[i] != null) {
        insertArrayByItems(randomResult[i], polozky, pocetGenerovanychOtazek);
      }
    }

    return polozky;
  };
}

function randomFrom(array, n) {
  var at = 0;
  var tmp,
    current,
    top = array.length;

  if (n != 0) {
    if (top)
      while (--top && at++ < n) {
        current = Math.floor(Math.random() * (top - 1));
        tmp = array[current];
        array[current] = array[top];
        array[top] = tmp;
      }
    return array.slice(-n);
  } else {
    return null;
  }
}

function insertArrayByItems(source, destination, max) {
  for (k = 0; k < source.length; k++) {
    if (source != null) {
      if (destination.length < max) {
        destination.push(source[k]);
      }
    }
  }
}
