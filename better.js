//make resetting false from the beginning
let isResetting = false;

//score values
const score = document.getElementById("score");
const per = document.getElementById("per");
let saved = 0;
let shown = 0;

//format the score
function formatScore(shown) {
    if (shown >= 1e27) {
        return (shown / 1e27).toFixed(2).replace(/\.?0+$/, "") + "Oc";
    } else if (shown >= 1e24) {
        return (shown / 1e24).toFixed(2).replace(/\.?0+$/, "") + "Sp";
    } else if (shown >= 1e21) {
        return (shown / 1e21).toFixed(2).replace(/\.?0+$/, "") + "Sx";
    } else if (shown >= 1e18) {
        return (shown / 1e18).toFixed(2).replace(/\.?0+$/, "") + "Qi";
    } else if (shown >= 1e15) {
        return (shown / 1e15).toFixed(2).replace(/\.?0+$/, "") + "Qa";
    } else if (shown >= 1e12) {
        return (shown / 1e12).toFixed(2).replace(/\.?0+$/, "") + "T";
    } else if (shown >= 1e9) {
        return (shown / 1e9).toFixed(2).replace(/\.?0+$/, "") + "B";
    } else if (shown >= 1e6) {
        return (shown / 1e6).toFixed(2).replace(/\.?0+$/, "") + "M";
    } else if (shown >= 1e3) {
        return (shown / 1e3).toFixed(2).replace(/\.?0+$/, "") + "K";
    } else {
        return shown.toFixed(1).toString();
    };
};

//update the score
function updateScore() {
    score.innerText = formatScore(shown);
};

//numbers increase in a visually appealing manner
function updateDisplay() {
    if (saved < shown) {
        shown = saved;
    } else {
        shown += (saved - shown) * 0.1;

        if (Math.abs(saved - shown) < 0.01) {
            shown = saved;
        }
    };

    updateScore();
    requestAnimationFrame(updateDisplay);
};

const plus = document.getElementById("plus");

//score increases per click
plus.addEventListener("click", () => {
    saved++;
    shown = saved;

    updateAllUpgrades();
    updateAllOne();
})

//save game
function saveGame() {
    if (isResetting) return;

    const saveData = {
        score: saved,
        upgrades: upgrades.map(u => ({
            cost: u.cost,
            income: u.income,
            owned: u.owned
        })),
        one: one.map(o => ({
            active: o.active
        })),
        lastUpdate: Date.now()
    };

    localStorage.setItem("clickerSave", JSON.stringify(saveData));
};

function loadGame() {
    let save = localStorage.getItem("clickerSave");

    if (!save) return;

    let data = JSON.parse(save);

    saved = data.score;

    //reassign the cost, income, and amount owned after loading
    data.upgrades.forEach((savedUpgrade, index) => {
        upgrades[index].cost = savedUpgrade.cost;
        upgrades[index].income = savedUpgrade.income;
        upgrades[index].owned = savedUpgrade.owned;
    });

    //make sure the costs, incomes, and amount owned are the same after saving and loading
    upgrades.forEach((u, i) => {
        upgradeCost(i);
        upgradeInc(i);
        upgradeOwn(i);
    });

    //offline continuity
    let now = Date.now();
    let diff = (now - data.lastUpdate) / 1000;
    diff = Math.max(0, Math.min(diff, 3600));

    let totalIncome = 0;

    upgrades.forEach(u => {
        totalIncome += u.income * u.owned;
    });

    saved += totalIncome * diff;
    saved = Math.floor(saved);

    if (data.one) {
        data.one.forEach((savedOne, index) => {
            one[index].active = savedOne.active;
        })

        one.forEach(o => {
            if (o.active) {
                o.button.disabled = true;
            };
        });
    };

    shown = saved;
    
    //visual continuity
    updateAllUpgrades();
    updateAllOne();
};

//resetting function
function resetGame() {
    isResetting = true;
    localStorage.removeItem("clickerSave");
    location.reload();
};

//handle reset button press
document.getElementById("reset").addEventListener("click", function(e) {
    const ru = document.getElementById("ru");
    const yes = document.getElementById("y");
    const no = document.getElementById("n");

    //prompt with y/n reassurance
    ru.style.display = "block";

    //handle yes button press
    yes.addEventListener("click", () => {
        console.log("[RESETTING]");
        e.preventDefault();
        resetGame();
    });

    //handle no button press
    no.addEventListener("click", () => {
        ru.style.display = "none";
        return;
    });
});

//dark mode button
const dark = document.getElementById("dark");

//handle dark mode button press
dark.addEventListener("click", function() {
    //array for all of the elements that must change
    const dMode = [
        document.body,
        document.getElementById("butleft"),
        document.getElementById("butright"),
        document.getElementById("updiv"),
        document.querySelector("header"),
        document.getElementById("ru"),
        ...document.querySelectorAll(".ui"),
        ...document.querySelectorAll(".but"),
        ...document.querySelectorAll(".up")
    ];

    dMode.forEach(el => {
        if (!el) return;
        //current styles of each element
        const cBg = getComputedStyle(el).backgroundColor;
        const cBo = getComputedStyle(el).borderColor;
        const cCo = getComputedStyle(el).color;
        const hBo = getComputedStyle(el).borderBottomColor;

        //invert the colors to switch between light and dark mode
        if (cBg === "rgb(255, 228, 196)") {
            el.style.backgroundColor = "#001B3B";
        } else if (cBg === "rgb(255, 235, 205)") {
            el.style.backgroundColor = "#001432";
        } else if (cBg === "rgb(0, 27, 59)") {
            el.style.backgroundColor = "#FFE4C4";
        } else if (cBg === "rgb(0, 20, 50)") {
            el.style.backgroundColor = "#FFEBCD";
        };

        if (cBo === "rgb(245, 245, 245)") {
            el.style.borderColor = "#0A0A0A";
        } else if (cBo === "rgb(10, 10, 10)") {
            el.style.borderColor = "#F5F5F5";
        };

        if (cCo === "rgb(47, 79, 79)") {
            el.style.color = "#D0B0B0";
        } else if (cCo === "rgb(208, 176, 176)") {
            el.style.color = "#2F4F4F";
        };

        if (hBo === "rgb(245, 245, 245)") {
            el.style.borderBottomColor = "#0A0A0A";
        } else if (hBo === "rgb(10, 10, 10)") {
            el.style.borderBottomColor = "#F5F5F5";
        };
    });
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
        income: 50,
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
        income: 275,
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
        income: 1500,
        owned: 0,
        button: document.getElementById("twelve"),
        costSpan: document.getElementById("ciento-vente"),
        incSpan: document.getElementById("twelvr"),
        ownSpan: document.getElementById("ontw"),
        img: document.getElementById("tw")
    }
];

//one-time upgrades array
const one = [
    {
        name: "2 Ply",
        cost: 100,
        effect: 2,
        target: 0,
        button: document.getElementById("up"),
        active: false
    },
    {
        name: "4 Ply",
        cost: 500,
        effect: 2,
        target: 0,
        button: document.getElementById("up1"),
        active: false
    },
    {
        name: "50-100mm Lens",
        cost: 1000,
        effect: 2,
        target: 1,
        button: document.getElementById("up2"),
        active: false
    },
    {
        name: "2-4mm Lens",
        cost: 5000,
        effect: 2,
        target: 1,
        button: document.getElementById("up3"),
        active: false
    },
    {
        name: "Industrial Roll",
        cost: 10000,
        effect: 2,
        target: 0,
        button: document.getElementById("up4"),
        active: false
    }
];

//load game at the beginning
loadGame();

setInterval(saveGame, 300000);

//update appearances of the upgrades
function upgradeAppearance(index) {
    let upgrade = upgrades[index];

    if (upgrade.owned === 0) {
        if (saved >= upgrade.cost) {
            upgrade.button.style.display = "block";
            upgrade.img.style.opacity = "1";
        } else {
            upgrade.button.style.display = "none";
        };

        return;
    } else {
        if (saved >= upgrade.cost) {
            upgrade.button.style.display = "block";
            upgrade.img.style.opacity = "1";
        } else {
            upgrade.img.style.opacity = "0.5";
        }
    };
};

function oneAppearance(index) {
    let o = one[index];

    if (o.active) {
        o.button.style.display = "none";
        o.button.disabled = true;
    } else if (saved >= o.cost) {
        o.button.style.display = "block";
    } else {
        o.button.style.display = "none";
    };
};

function updateAllUpgrades() {
    for (let i = 0; i < upgrades.length; i++) {
        upgradeAppearance(i);
    };
};

//update cost of upgrades visually
function upgradeCost(index) {
    upgrades[index].costSpan.innerText = upgrades[index].cost;
};

//update income of upgrades visually
function upgradeInc(index) {
    upgrades[index].incSpan.innerText = upgrades[index].income;
};

//update amount of upgrades owned visually
function upgradeOwn(index) {
    upgrades[index].ownSpan.innerText = upgrades[index].owned;
};

function updateAllOne() {
    for (let i = 0; i < one.length; i++) {
        oneAppearance(i);
    };
};

//function for upgrade purchase
function buyUpgrade(index) {
    let upgrade = upgrades[index];

    if (saved >= upgrade.cost) {
        saved -= upgrade.cost;
        upgrade.owned++;

        upgrade.cost = Math.ceil(upgrade.cost * 1.3);

        upgradeCost(index);
        upgradeInc(index);
        upgradeOwn(index);
        updateAllUpgrades();
    };
};

//function for one-time upgrade purchase
function buyOne(index) {
    let o = one[index];

    if (o.active) return;
    if (saved < o.cost) return;

    saved -= o.cost;
    o.active = true;
    o.button.disabled = true;

    let upgrade = upgrades[o.target];

    upgrade.income *= o.effect;
    upgradeInc(o.target);

    updateAllOne();
};

//purchase upgrades
upgrades.forEach((upgrade, index) => {
    upgrade.button.addEventListener("click", () => {
        buyUpgrade(index);
    });
});

//purchase one time upgrades
one.forEach((o, index) => {
    o.button.addEventListener("click", () => {
        buyOne(index);
    });
});

//passive income
setInterval(() => {
    let totalIncome = 0;

    for (let i = 0; i < upgrades.length; i++) {
        totalIncome += upgrades[i].income * upgrades[i].owned;
    };

    saved += totalIncome;
    per.innerText = totalIncome.toFixed(1);
    updateAllUpgrades();
    updateAllOne();
}, 1000);

updateDisplay();
updateAllUpgrades();
updateAllOne();

window.addEventListener("beforeunload", saveGame);
