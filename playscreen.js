//start of variables 
const plus = document.getElementById("plus");

//upgrades array
const upgrades = [
    {
        name: "Skibidi Toilet",
        cost: 10,
        income: 1,
        owned: 0,
        button: document.getElementById("one"),
        costSpan: document.getElementById("uno"),
        incSpan: document.getElementById("unr"),
        ownSpan: document.getElementById("on")
    },
    {
        name: "Cameraman",
        cost: 40,
        income: 5,
        owned: 0,
        button: document.getElementById("five"),
        costSpan: document.getElementById("cinco"),
        incSpan: document.getElementById("fivr"),
        ownSpan: document.getElementById("onf")
    },
    {
        name: "Speakerman",
        cost: 160,
        income: 10,
        owned: 0,
        button: document.getElementById("ten"),
        costSpan: document.getElementById("diez"),
        incSpan: document.getElementById("tenr"),
        ownSpan: document.getElementById("ont")
    },
    {
        name: "Astro Toilet",
        cost: 640,
        income: 30,
        owned: 0,
        button: document.getElementById("three"),
        costSpan: document.getElementById("treinta"),
        incSpan: document.getElementById("thr"),
        ownSpan: document.getElementById("onth")
    },
    {
        name: "Titan TV Man",
        cost: 2560,
        income: 60,
        owned: 0,
        button: document.getElementById("six"),
        costSpan: document.getElementById("sesenta"),
        incSpan: document.getElementById("sixr"),
        ownSpan: document.getElementById("ons")
    },
    {
        name: "Titan Speakerman",
        cost: 10240,
        income: 120,
        owned: 0,
        button: document.getElementById("twelve"),
        costSpan: document.getElementById("ciento-vente"),
        incSpan: document.getElementById("twelvr"),
        ownSpan: document.getElementById("ontw")
    }
];

//save game
function saveGame() {
    const saveData = {
        score: score,
        upgrades: upgrades.map(u => ({
            cost: u.cost,
            income: u.income,
            owned: u.owned
        })),
        lastUpdate: Date.now()
    };

    localStorage.setItem("clickerSave", JSON.stringify(saveData));
};

//load game
function loadGame() {
    let save = localStorage.getItem("clickerSave");

    if (!save) return;

    let data = JSON.parse(save);

    score = data.score;

    data.upgrades.forEach((savedUpgrade, index) => {
        upgrades[index].cost = savedUpgrade.cost;
        upgrades[index].income = savedUpgrade.income;
        upgrades[index].owned = savedUpgrade.owned;
    });

    upgrades.forEach((u, i) => {
        upgradeCost(i);
        upgradeInc(i);
        upgradeOwn(i);
    });

    //offline stuff
    let now = Date.now();
    let diff = (now - data.lastUpdate) / 1000;

    let totalIncome = 0;

    upgrades.forEach(up => {
        totalIncome += up.income * up.owned;
    });

    score += totalIncome * diff;
}

//reset the game
function resetGame() {
  localStorage.removeItem("clickerSave");
  location.reload();
}

document.getElementById("reset").addEventListener("click", function(e) {
    e.preventDefault;
    resetGame();
});

setInterval(saveGame, 3000);

function updateAllUpgrades() {
    for (let i = 0; i < upgrades.length; i++) {
        upgradeAppearance(i);
    };
};

//score values
const count = document.getElementById("score");
let score = 0;

//update costs
function upgradeCost(index) {
    upgrades[index].costSpan.innerText = upgrades[index].cost;
};

//update incomes
function upgradeInc(index) {
    upgrades[index].incSpan.innerText = upgrades[index].income;
};

//update amount owned
function upgradeOwn(index) {
    upgrades[index].ownSpan.innerText = upgrades[index].owned;
};

for (let i = 0; i < upgrades.length; i++) {
    upgradeCost(i);
    upgradeInc(i);
};

for (let i = 0; i < upgrades.length; i++) {
        upgradeAppearance(i);
};

//update the score
function updateScore() {
    count.innerText = score;
};

plus.addEventListener("click", function() {
    score++;
    updateScore();

    for (let i = 0; i < upgrades.length; i++) {
        upgradeAppearance(i);
    };
});

//update the appearance of the buttons
function upgradeAppearance(index) {
    let upgrade = upgrades[index];

    if (score >= upgrade.cost) {
        upgrade.button.style.display = "block";
    } else {
        upgrade.button.style.display = "none";
    }
};

//buy the upgrade and scale the cost and income
function buyUpgrade(index) {
    let upgrade = upgrades[index];

    if (score >= upgrade.cost) {
        score -= upgrade.cost;
        upgrade.owned += 1;

        upgrade.cost = Math.floor(upgrade.cost * 1.2);
        upgrade.income = Math.ceil(upgrade.income * 1.1);

        updateScore();
        upgradeCost(index);
        upgradeInc(index);
        upgradeOwn(index);
        for (let i = 0; i < upgrades.length; i++) {
            upgradeAppearance(i);
        };
    }
};

upgrades.forEach((upgrade, index) => {
    upgrade.button.addEventListener("click", function() {
        buyUpgrade(index);
    });
});

//passive income
setInterval(function() {
    let totalIncome = 0;

    for (let i = 0; i < upgrades.length; i++) {
        totalIncome += upgrades[i].income * upgrades[i].owned;
    }

    score += totalIncome;
    updateScore();
    updateAllUpgrades();
}, 1000);

loadGame();
updateScore();
updateAllUpgrades();

window.addEventListener("beforeunload", saveGame());
