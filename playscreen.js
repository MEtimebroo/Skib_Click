//start of variables 
const plus = document.getElementById("plus");
const dark = document.getElementById("dark");


dark.addEventListener("click", function() {
    const dMode = [
        document.body,
        document.getElementById("butleft"),
        document.getElementById("butright"),
        document.getElementById("updiv"),
        document.querySelector("header"),
        document.getElementById("ru"),
        ...document.querySelectorAll(".ui"),
        ...document.querySelectorAll(".but")
    ];

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
        ownSpan: document.getElementById("on"),
        img: document.getElementById("o")
    },
    {
        name: "Cameraman",
        cost: 175,
        income: 1,
        owned: 0,
        button: document.getElementById("five"),
        costSpan: document.getElementById("cinco"),
        incSpan: document.getElementById("fivr"),
        ownSpan: document.getElementById("onf"),
        img: document.getElementById("f")
    },
    {
        name: "Speakerman",
        cost: 1500,
        income: 10,
        owned: 0,
        button: document.getElementById("ten"),
        costSpan: document.getElementById("diez"),
        incSpan: document.getElementById("tenr"),
        ownSpan: document.getElementById("ont"),
        img: document.getElementById("t")
    },
    {
        name: "Astro Toilet",
        cost: 15000,
        income: 100,
        owned: 0,
        button: document.getElementById("three"),
        costSpan: document.getElementById("treinta"),
        incSpan: document.getElementById("thr"),
        ownSpan: document.getElementById("onth"),
        img: document.getElementById("th")
    },
    {
        name: "Titan TV Man",
        cost: 163940,
        income: 1000,
        owned: 0,
        button: document.getElementById("six"),
        costSpan: document.getElementById("sesenta"),
        incSpan: document.getElementById("sixr"),
        ownSpan: document.getElementById("ons"),
        img: document.getElementById("s")
    },
    {
        name: "Titan Speakerman",
        cost: 10485860,
        income: 10000,
        owned: 0,
        button: document.getElementById("twelve"),
        costSpan: document.getElementById("ciento-vente"),
        incSpan: document.getElementById("twelvr"),
        ownSpan: document.getElementById("ontw"),
        img: document.getElementById("tw")
    }
];

const upUps = {
    name: "2 Ply",
    cost: 100,
    effect: 2,
    owned: 0,
    button: document.getElementById("up"),
    twoPly: false
};

const up = {
    name: "4 Ply",
    cost: 500,
    effect: 2,
    owned: 0,
    button: document.getElementById("up1"),
    fourPly: false
};

const upC = {
    name: "50-100mm Lens",
    cost: 1000,
    effect: 2,
    owned: 0,
    button: document.getElementById("up2"),
    lens: false
};

//fix for the reset bug
let isResetting = false;

//score values
const count = document.getElementById("score");
const per = document.getElementById("per");
let score = 0;
let shown = 0;
loadGame();

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
        upUps: {
            owned: upUps.owned,
            twoPly: upUps.twoPly
        },
        up: {
            owned: up.owned,
            fourPly: up.fourPly
        },
        upC: {
            owned: upC.owned,
            lens: upC.lens
        },
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
        upUps.owned = data.upUps.owned;
        upUps.twoPly = data.upUps.twoPly;

        if (data.upUps.twoPly) {
            upUps.button.disabled = true;
        }
    };

    if (data.up) {
        up.owned = data.up.owned;
        up.fourPly = data.up.fourPly;

        if (data.up.fourPly) {
            up.button.disabled = true;
        }
    }

    if (data.upC) {
        upC.owned = data.upC.owned;
        upC.lens = data.upC.lens;

        if (data.upC.lens) {
            upC.button.disabled = "true";
        }
    }

    updateAllUpgrades();
    upUpsAppearance();
    upAppearance();
    upCAppearance();
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

setInterval(saveGame, 1000);

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
    upUpsAppearance();
    upAppearance();
    upCAppearance();
});

//update the appearance of the buttons
function upgradeAppearance(index) {
    let upgrade = upgrades[index];

    if (score >= upgrade.cost || upgrade.owned >= 1) {
        upgrade.button.style.display = "block";
        upgrade.img.style.opacity = "1";
    } else {
        upgrade.button.style.display = "none";
    }

    if (score < upgrade.cost && upgrade.owned >= 1) {
        upgrade.img.style.opacity = "0.5";
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
upUps.button.addEventListener("click", function() {
    upUp();
})

up.button.addEventListener("click", function() {
    upg();
})

upC.button.addEventListener("click", function() {
    upCa();
})

function upUpsAppearance() {
    if (upUps.twoPly == true) {
        upUps.button.style.display = "none";
    } else if (score >= upUps.cost) {
        upUps.button.style.display = "block";
    } else {
        upUps.button.style.display = "none";
    }
};

function upAppearance() {
    if (up.fourPly == true && up.owned >= 1) {
        up.button.style.display = "none";
    } else if (score >= up.cost) {
        up.button.style.display = "block";
    } else {
        up.button.style.display = "none";
    }
}

function upCAppearance() {
    if (upC.lens == true && upC.owned >= 1) {
        upC.button.style.display = "none";
    } else if (score >= upC.cost) {
        upC.button.style.display = "block";
    } else {
        upC.button.style.display = "none";
    }
}

function upUp() {
    if (upUps.twoPly) return;
    if (score < upUps.cost) return;

    upUps.twoPly = true;
    upUps.button.disabled = true;

    if (score >= upUps.cost) {
        score -= upUps.cost;
        upUps.owned++;

        upgrades[0].income = upgrades[0].income * upUps.effect;
        upgradeInc(0);
    }
};

function upg() {
    if (up.fourPly) return;
    if (score < up.cost) return;

    up.fourPly = true;
    up.button.disabled = true;

    if (score >= up.cost) {
        score -= up.cost;
        up.owned++;

        upgrades[0].income = upgrades[0].income * up.effect;
        upgradeInc(0);
    }
};

function upCa() {
    if (upC.lens) return;
    if (score < upC.cost) return;

    upC.lens = true;
    upC.button.disabled = true;

    if (score >= upC.cost) {
        score -= upC.cost;
        upC.owned++;

        upgrades[1].income = upgrades[1].income * upC.effect;
        upgradeInc(1);
    }
};

//passive income
setInterval(function() {
    let totalIncome = 0;

    for (let i = 0; i < upgrades.length; i++) {
        totalIncome += upgrades[i].income * upgrades[i].owned;
    }

    score += totalIncome;
    per.innerText = totalIncome.toFixed(1);
    updateAllUpgrades();

    upUpsAppearance();
    upAppearance();
    upCAppearance();
}, 1000);

updateDisplay();
upUpsAppearance();
upAppearance();
upCAppearance();
updateAllUpgrades();

window.addEventListener("beforeunload", saveGame);
