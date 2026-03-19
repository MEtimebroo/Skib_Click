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
        income: 1,
        owned: 0,
        button: document.getElementById("five"),
        costSpan: document.getElementById("cinco"),
        incSpan: document.getElementById("fivr"),
        ownSpan: document.getElementById("onf")
    },
    {
        name: "Speakerman",
        cost: 1500,
        income: 10,
        owned: 0,
        button: document.getElementById("ten"),
        costSpan: document.getElementById("diez"),
        incSpan: document.getElementById("tenr"),
        ownSpan: document.getElementById("ont")
    },
    {
        name: "Astro Toilet",
        cost: 15000,
        income: 100,
        owned: 0,
        button: document.getElementById("three"),
        costSpan: document.getElementById("treinta"),
        incSpan: document.getElementById("thr"),
        ownSpan: document.getElementById("onth")
    },
    {
        name: "Titan TV Man",
        cost: 163940,
        income: 1000,
        owned: 0,
        button: document.getElementById("six"),
        costSpan: document.getElementById("sesenta"),
        incSpan: document.getElementById("sixr"),
        ownSpan: document.getElementById("ons")
    },
    {
        name: "Titan Speakerman",
        cost: 10485860,
        income: 10000,
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
        button: document.getElementById("up"),
        twoPly: false
    }
]

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
        upUps: upUps.map(u => ({
            owned: u.owned,
            twoPly: u.twoPly
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

    if (data.upUps) {
        data.upUps.forEach((saved, index) => {
            upUps[index].owned = saved.owned;
            upUps[index].twoPly = saved.twoPly;

            if (saved.twoPly) {
                upUps[index].button.disabled = true;
            }
        });
    }
};

//reset the game
function resetGame() {
    isResetting = true;
    localStorage.removeItem("clickerSave");
    location.reload()
};

document.getElementById("reset").addEventListener("click", function(e) {
    const ru = document.getElementById("ru");
    const yes = document.getElementById("y");
    const no = document.getElementById("n");
    ru.style.display = "block";
    
    yes.addEventListener("click", function() {
        console.log("[RESETTING]");
        e.preventDefault();
        resetGame();
    });

    no.addEventListener("click", function() {
        ru.style.display = "none";
        return;
    });
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

//makes score more pleasing to look at as it goes up.
function formatScore(shown) {
    if (shown >= 1e24) {
        return (shown / 1e24).toFixed(2).replace(/\.0$/, "") + "Sp";
    } else if (shown >= 1e21) {
        return (shown / 1e21).toFixed(2).replace(/\.0$/, "") + "Sx";
    } else if (shown >= 1e18) {
        return (shown / 1e18).toFixed(2).replace(/\.0$/, "") + "Qi";
    } else if (shown >= 1e15) {
        return (shown / 1e15).toFixed(2).replace(/\.0$/, "") + "Qa";
    } else if (shown >= 1e12) {
        return (shown / 1e12).toFixed(2).replace(/\.0$/, "") + "T";
    } else if (shown >= 1e9) {
        return (shown / 1e9).toFixed(2).replace(/\.0$/, "") + "B";
    } else if (shown >= 1e6) {
        return (shown / 1e6).toFixed(2).replace(/\.0$/, "") + "M";
    } else if (shown >= 1e3) {
        return (shown / 1e3).toFixed(2).replace(/\.0$/, "") + "K";
    } else {
        return shown.toFixed(1).toString();
    }
}

//update the score
function updateScore() {
    count.innerText = formatScore(shown);
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

    if (score >= upgrade.cost || upgrade.owned >= 1) {
        upgrade.button.style.display = "block";
        upgrade.button.style.backgroundColor = "transparent";
    } else {
        upgrade.button.style.display = "none";
    }

    if (score < upgrade.cost && upgrade.owned >= 1) {
        upgrade.button.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
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

    if (up.twoPly == true) {
        up.button.style.display = "none";
    } else if (score >= up.cost) {
        up.button.style.display = "block";
    } else {
        up.button.style.display = "none";
    }
};

function upUp(index) {
    let up = upUps[index];
    if (up.twoPly) return;
    if (score < up.cost) return;

    up.twoPly = true;
    up.button.disabled = true;

    if (score >= up.cost) {
        score -= up.cost;
        up.owned++;

        up.cost = Math.ceil(up.cost * 1.3);
        upgrades[0].income = upgrades[0].income * up.effect;
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
