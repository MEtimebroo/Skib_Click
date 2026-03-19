//start of variables 
const plus = document.getElementById("plus");
const dark = document.getElementById("dark");
const dMode = [
    document.body,
    document.getElementById("butleft"),
    document.getElementById("butright"),
    document.getElementById("updiv"),
    document.getElementById("reset"),
    document.querySelector("header")
];

dark.addEventListener("click", function() {
    dMode.forEach(el => {
        if (!el) return;
        const curBg = getComputedStyle(el).backgroundColor;
        const curBo = getComputedStyle(el).borderColor;
        const curCo = getComputedStyle(el).color;
        const heBo = getComputedStyle(el).borderBottomColor;

        if (curBg === "rgb(255, 228, 196)") {
            el.style.backgroundColor = "#001B3B";
        } else if (curBg === "rgb(255, 235, 205)") {
            el.style.backgroundColor = "#001432";
        } else if (curBg === "rgb(0, 27, 59)") {
            el.style.backgroundColor = "#FFE4C4";
        } else if (curBg === "rgb(0, 20, 50)") {
            el.style.backgroundColor = "#FFEBCD";
        }
        
        if (curBo === "rgb(245, 245, 245)") {
            el.style.borderColor = "#0A0A0A";
        } else if (curBo === "rgb(10, 10, 10)") {
            el.style.borderColor = "#F5F5F5";
        }
        
        if (curCo === "rgb(47, 79, 79)") {
            el.style.color = "#D0B0B0";
        } else if (curCo === "rgb(208, 176, 176)") {
            el.style.color = "#2F4F4F";
        }

        if (heBo === "rgb(245, 245, 245)") {
            el.style.borderBottomColor = "#0A0A0A";
        } else if (heBo === "rgb(10, 10, 10)") {
            el.style.borderBottomColor = "#F5F5F5";
        }
    })
});

//upgrades array
const upgrades = [
    {
        name: "Skibidi Toilet",
        cost: 10,
        income: 0.1,
        owned: 0,
        button: document.getElementById("one"),
        costSpan: document.getElementById("uno"),
        incSpan: document.getElementById("unr"),
        ownSpan: document.getElementById("on")
    },
    {
        name: "Cameraman",
        cost: 150,
        income: 4,
        owned: 0,
        button: document.getElementById("five"),
        costSpan: document.getElementById("cinco"),
        incSpan: document.getElementById("fivr"),
        ownSpan: document.getElementById("onf")
    },
    {
        name: "Speakerman",
        cost: 1500,
        income: 32,
        owned: 0,
        button: document.getElementById("ten"),
        costSpan: document.getElementById("diez"),
        incSpan: document.getElementById("tenr"),
        ownSpan: document.getElementById("ont")
    },
    {
        name: "Astro Toilet",
        cost: 15000,
        income: 512,
        owned: 0,
        button: document.getElementById("three"),
        costSpan: document.getElementById("treinta"),
        incSpan: document.getElementById("thr"),
        ownSpan: document.getElementById("onth")
    },
    {
        name: "Titan TV Man",
        cost: 163940,
        income: 16384,
        owned: 0,
        button: document.getElementById("six"),
        costSpan: document.getElementById("sesenta"),
        incSpan: document.getElementById("sixr"),
        ownSpan: document.getElementById("ons")
    },
    {
        name: "Titan Speakerman",
        cost: 10485860,
        income: 1048576,
        owned: 0,
        button: document.getElementById("twelve"),
        costSpan: document.getElementById("ciento-vente"),
        incSpan: document.getElementById("twelvr"),
        ownSpan: document.getElementById("ontw")
    }
];

const upUps = [
    {
        name: "2 Ply",
        cost: 100,
        effect: 2,
        owned: 0,
        button: document.getElementById("up")
    }
];

//fix for the rest bug
let isResetting = false;

//score values
const count = document.getElementById("score");
let score = 0;
let shown = 0;

//save game
function saveGame() {
    if (isResetting) return;

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
    shown = score;

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
    score = Math.floor(score);
};

//reset the game
function resetGame() {
    isResetting = true;
    localStorage.removeItem("clickerSave");
    location.reload()
};

document.getElementById("reset").addEventListener("click", function(e) {
    console.log("[RESETTING]");
    e.preventDefault();
    resetGame();
});

setInterval(saveGame, 3000);

function updateAllUpgrades() {
    for (let i = 0; i < upgrades.length; i++) {
        upgradeAppearance(i);
    };
};

//update costs visually
function upgradeCost(index) {
    upgrades[index].costSpan.innerText = upgrades[index].cost;
};

//update incomes visually
function upgradeInc(index) {
    upgrades[index].incSpan.innerText = upgrades[index].income;
};

//update amount owned visually
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
    if (upgrades[0].income >= 5) {
        count.innerText = Math.floor(shown);
    } else {
        count.innerText = shown.toFixed(1);
    }
};

function updateDisplay() {
    shown += (score - shown) * 0.1;
    updateScore();
    requestAnimationFrame(updateDisplay);
}

plus.addEventListener("click", function() {
    score++;

    for (let i = 0; i < upgrades.length; i++) {
        upgradeAppearance(i);
    };

    for (let i = 0; i < upUps.length; i++) {
        upUpsAppearance(i);
    }
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
        upgrade.owned++;

        upgrade.cost = Math.ceil(upgrade.cost * 1.3);

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

//logic for the upgrades' upgrades
upUps.forEach((upUps, index) => {
    upUps.button.addEventListener("click", function() {
        upUp(index);
    })
})

function upUpsAppearance(index) {
    let up = upUps[index];

    if (score >= up.cost) {
        up.button.style.display = "block";
    } else {
        up.button.style.display = "none";
    }
};

function upUp(index) {
    let up = upUps[index];

    if (score >= up.cost) {
        score -= up.cost;
        up.owned++;

        up.cost = Math.ceil(up.cost * 1.3);
        upgrades[0].income = upgrades[0].income * 2;
        upgradeInc(0);
    }
};

//passive income
setInterval(function() {
    let totalIncome = 0;

    for (let i = 0; i < upgrades.length; i++) {
        totalIncome += upgrades[i].income * upgrades[i].owned;
    }

    score += totalIncome;
    updateAllUpgrades();

    for (let i = 0; i < upUps.length; i++) {
        upUpsAppearance(i);
    }
}, 1000);

loadGame();
updateDisplay();
for (let i = 0; i < upUps.length; i++) {
    upUpsAppearance(i);
}
updateAllUpgrades();

window.addEventListener("beforeunload", saveGame);
