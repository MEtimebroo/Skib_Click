//start of variables 
const plus = document.getElementById("plus");

//upgrades array
const upgrades = [
    {
        name: "Skibidi Toilet",
        cost: 10,
        income: 1,
        owned: 0,
        button: document.getElementById("one")
    },
    {
        name: "Cameraman",
        cost: 30,
        income: 5,
        owned: 0,
        button: document.getElementById("five")
    },
    {
        name: "Speakerman",
        cost: 80,
        income: 10,
        owned: 0,
        button: document.getElementById("ten")
    },
    {
        name: "Astro Toilet",
        cost: 200,
        income: 30,
        owned: 0,
        button: document.getElementById("three")
    },
    {
        name: "Titan TV Man",
        cost: 500,
        income: 60,
        owned: 0,
        button: document.getElementById("six")
    },
    {
        name: "Titan Speakerman",
        cost: 1000,
        income: 120,
        owned: 0,
        button: document.getElementById("twelve")
    }
];

//cost spans array
const spanVals = [
    document.getElementById("uno"),
    document.getElementById("cinco"),
    document.getElementById("diez"),
    document.getElementById("treinta"),
    document.getElementById("sesenta"),
    document.getElementById("ciento-vente")
];

function updateAllUpgrades() {
    for (let i = 0; i < upgrades.length; i++) {
        upgradeAppearance(i);
    }
}

//score values
const count = document.getElementById("score");
let score = 0;

function upgradeCost(index) {
    spanVals[index].innerText = upgrades[index].cost;
};

for (let i = 0; i < upgrades.length; i++) {
    upgradeCost(i);
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

//buy the upgrade and scale the cost
function buyUpgrade(index) {
    let upgrade = upgrades[index];

    if (score >= upgrade.cost) {
        score -= upgrade.cost;
        upgrade.owned += 1;

        upgrade.cost = Math.floor(upgrade.cost * 1.2);

        updateScore();
        upgradeCost(index);
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

    for (i = 0; i < upgrades.length; i++) {
        totalIncome += upgrades[i].income * upgrades[i].owned;
    }

    score += totalIncome;
    updateScore();
    updateAllUpgrades();
}, 1000);
