const fighter1Select = document.getElementById("fighter1");
const fighter2Select = document.getElementById("fighter2");
const stageSelect = document.getElementById("stage");
const weatherSelect = document.getElementById("weather");
const artifactSelect = document.getElementById("artifact");
const fighter1Image = document.getElementById("fighter1Image");
const fighter2Image = document.getElementById("fighter2Image");
const fighter1Bio = document.getElementById("fighter1Bio");
const fighter2Bio = document.getElementById("fighter2Bio");

const battleResultModalLabel = document.getElementById("battleResultModalLabel");

const fighterTitle1 = document.getElementById("fighterTitle1");
const fighterTitle2 = document.getElementById("fighterTitle2");

const corruption1Switch = document.getElementById("corruption1");
const corruption2Switch = document.getElementById("corruption2");
const resultDiv = document.getElementById("result");

const stageInfo = document.getElementById("stageInfo");

var stageChoices = new Choices(stageSelect, {
    searchEnabled: true,
    itemSelectText: '',
    shouldSort: false,
});

var weatherChoices = new Choices(weatherSelect, {
    searchEnabled: true,
    itemSelectText: '',
    shouldSort: false,
});

populateUniqueArtifacts();

const artifacts = [...new Set(entities.flatMap((entity) => entity.artifacts))]; // Unique artifacts
artifacts.forEach((artifact) => {
    const option = document.createElement("option");
    option.value = artifact;
    option.textContent = artifact;
    artifactSelect.appendChild(option);
});

var artifactChoices = new Choices(artifactSelect, {
    searchEnabled: true,
    itemSelectText: '',
    shouldSort: false,
});

entities.forEach((entity) => {
    const option1 = document.createElement("option");
    const option2 = document.createElement("option");

    option1.value = entity.name;
    option1.textContent = entity.name + " (" + entity.bio.nationality + " " + entity.type + ")";

    option2.value = entity.name;
    option2.textContent = entity.name + " (" + entity.bio.nationality + " " + entity.type + ")";

    fighter1Select.appendChild(option1);
    fighter2Select.appendChild(option2);
});

var fighter1choices = new Choices(fighter1Select, {
    searchEnabled: true,
    itemSelectText: '',
    shouldSort: false,
});

var fighter2choices = new Choices(fighter2Select, {
    searchEnabled: true,
    itemSelectText: '',
    shouldSort: false,
});

fighter1Select.addEventListener("change", () => {
    const selectedFighter = entities.find((e) => e.name === fighter1Select.value);
    if (selectedFighter) {
        fighter1Image.src = selectedFighter.image;
        fighter1Bio.innerHTML = generateBioHTML(selectedFighter);
        fighterTitle1.innerHTML = selectedFighter.name;
    } else {
        fighter1Image.src = "images/placeholder.jpg";
        fighter1Bio.innerHTML = "";
        fighterTitle1.innerHTML = "Fighter 1"
    }
});

fighter2Select.addEventListener("change", () => {
    const selectedFighter = entities.find((e) => e.name === fighter2Select.value);
    if (selectedFighter) {
        fighter2Image.src = selectedFighter.image;
        fighter2Bio.innerHTML = generateBioHTML(selectedFighter);
        fighterTitle2.innerHTML = selectedFighter.name;
    } else {
        fighter2Image.src = "images/placeholder.jpg";
        fighter2Bio.innerHTML = "";
        fighterTitle2.innerHTML = "Fighter 2";
    }
});

fighter1Select.addEventListener("change", () => updateFighterImage(1));
fighter2Select.addEventListener("change", () => updateFighterImage(2));
corruption1Switch.addEventListener("change", () => updateFighterImage(1));
corruption2Switch.addEventListener("change", () => updateFighterImage(2));

document.getElementById("fightButton").addEventListener("click", () => {
    const fighter1Name = fighter1Select.value;
    const fighter2Name = fighter2Select.value;
    const stage = document.getElementById("stage").value;
    const weather = document.getElementById("weather").value;
    const artifact = document.getElementById("artifact").value;

    const fighter1 = entities.find((e) => e.name === fighter1Name);
    const fighter2 = entities.find((e) => e.name === fighter2Name);

    const corruption1 = corruption1Switch.checked;
    const corruption2 = corruption2Switch.checked;

    if (!fighter1 || !fighter2) {
        resultDiv.innerHTML = `<p class="text-danger">Please select both fighters.</p>`;
        return;
    }

    // Call the calculateScore function for both fighters
    const result1 = calculateScore(fighter1, stage, weather, corruption1, artifact, fighter2);
    const result2 = calculateScore(fighter2, stage, weather, corruption2, artifact, fighter1);

    // Extract the scores and fight summaries
    const score1 = result1.score;
    const summary1 = result1.fightSummary;

    const score2 = result2.score;
    const summary2 = result2.fightSummary;

    // Determine the winner and print out the fight details
    let fightOutcome = "";

    if (score1 > score2) {
        fightOutcome = `${fighter1.name} dominates the battle with a score of ${score1} versus ${fighter2.name}'s ${score2}.`;
    } else if (score2 > score1) {
        fightOutcome = `${fighter2.name} emerges victorious with a score of ${score2}, overpowering ${fighter1.name}'s ${score1}.`;
    } else {
        fightOutcome = `The fight between ${fighter1.name} and ${fighter2.name} ends in a draw, with both scoring ${score1}.`;
    }

    battleResultModalLabel.innerHTML = `${weather} ${stage} battle results`;

    // Display the results in the console or on your UI
    console.log("\n=== Fight Details ===");
    console.log(`Stage: ${stage}`);
    console.log(`Weather: ${weather}`);
    console.log(`Artifact: ${artifact}`);
    // console.log("Fighter 1 Summary:");
    if (summary1)
        console.log(summary1);
    // console.log("Fighter 2 Summary:");
    if (summary2)
        console.log(summary2);
    console.log("Outcome:");
    console.log(fightOutcome);

    let winner, loser, winnerCorrupted, loserCorrupted;

    if (score1 > score2) {
        winner = fighter1;
        loser = fighter2;
        winnerCorrupted = corruption1;
        loserCorrupted = corruption2;
    } else if (score2 > score1) {
        winner = fighter2;
        loser = fighter1;
        winnerCorrupted = corruption2;
        loserCorrupted = corruption1;
    } else {
        // Handle tie
        document.getElementById("battleResultHeading").textContent = "It's a tie!";
        document.getElementById("battleResultImage").style.display = "none"; // Hide image for a tie
        const resultModal = new bootstrap.Modal(document.getElementById("battleResultModal"));
        resultModal.show();
        return;
    }

    const winnerCode = winner.code;
    const loserCode = loser.code;
    const winnerSuffix = winnerCorrupted ? "2" : "";
    const loserSuffix = loserCorrupted ? "2" : "";
    const resultImageName = `${winnerCode}${winnerSuffix}vs${loserCode}${loserSuffix}.webp`;

    const imagePath = `./images/${resultImageName}`;

    document.getElementById("battleResultHeading").textContent = fightOutcome;

    const resultImage = document.getElementById("battleResultImage");
    const img = new Image();
    img.src = imagePath;

    img.onload = function () {
        // If the image exists, display it
        resultImage.src = imagePath;
        resultImage.style.display = "block";
    };

    img.onerror = function () {
        // If the image does not exist, hide the image element or display a fallback
        resultImage.style.display = "none";
        // document.getElementById("battleResultHeading").textContent += " (No image available)";
    };

    // Show the modal
    const resultModal = new bootstrap.Modal(document.getElementById("battleResultModal"));
    resultModal.show();
});

document.addEventListener("DOMContentLoaded", randomizeSelections);

///////////////////////////////////////////////////////////////
//////////// FUNCTIONS ////////////////////////////////////////
///////////////////////////////////////////////////////////////

function populateUniqueArtifacts() {
    // Clear existing options
    artifactSelect.innerHTML = "";

    // Add a default "No Artifact" option
    const defaultOption = document.createElement("option");
    defaultOption.value = "none";
    defaultOption.textContent = "No Artifact";
    artifactSelect.appendChild(defaultOption);

    // Collect all artifacts from entities and make them unique
    const allArtifacts = new Set();
    entities.forEach((fighter) => {
        fighter.artifacts.forEach((artifact) => {
            allArtifacts.add(artifact); // Add artifact to the Set to ensure uniqueness
        });
    });

    // Populate the dropdown with unique artifacts
    allArtifacts.forEach((artifact) => {
        const option = document.createElement("option");
        option.value = artifact;
        option.textContent = artifact;
        artifactSelect.appendChild(option);
    });
}

function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function generateBioHTML(entity) {
    if (!entity) return "";
    return `
        <p><strong>Nationality:</strong> ${entity.bio.nationality}</p>
        <p><strong>Famous for:</strong>  ${entity.bio.description} </p>
        <p><strong>Powers:</strong> ${entity.bio.powers}</p>
        <p><strong>Influence:</strong> ${entity.bio.influence}</p>
    `;
}

function updateFighterImage(fighter) {
    const select = fighter === 1 ? fighter1Select : fighter2Select;
    const image = fighter === 1 ? fighter1Image : fighter2Image;
    const corruption = fighter === 1 ? corruption1Switch : corruption2Switch;

    const selectedEntity = entities.find((e) => e.name === select.value);

    if (selectedEntity) {
        image.src = corruption.checked ? selectedEntity.corruptimage : selectedEntity.image;
    } else {
        image.src = "images/placeholder.jpg";
    }
}

// Randomly select a fighter, stage, weather, and artifact on page load
function randomizeSelections() {
    const randomFighter1 = getRandomElement(entities);
    let randomFighter2;
    do {
        randomFighter2 = getRandomElement(entities);
    } while (randomFighter1.name === randomFighter2.name);

    const stages = Array.from(stageSelect.options).map((option) => option.value);
    const weathers = Array.from(weatherSelect.options).map((option) => option.value);
    const artifactsWithNone = ["none", ...artifacts];

    const randomStage = getRandomElement(stages);
    const randomWeather = getRandomElement(weathers);
    const randomArtifact = getRandomElement(artifactsWithNone);

    // Update UI
    fighter1choices.setChoiceByValue(randomFighter1.name);
    fighter2choices.setChoiceByValue(randomFighter2.name);

    stageChoices.setChoiceByValue(randomStage);
    weatherChoices.setChoiceByValue(randomWeather);

    artifactChoices.setChoiceByValue(randomArtifact);

    fighterTitle1.innerHTML = randomFighter1.name;
    fighterTitle2.innerHTML = randomFighter2.name;

    fighter1Image.src = randomFighter1.image;
    fighter2Image.src = randomFighter2.image;

    fighter1Bio.innerHTML = generateBioHTML(randomFighter1);

    fighter2Bio.innerHTML = generateBioHTML(randomFighter2);
}

// stats: {
//     strength: 90,       // Raw physical power
//     stamina: 85,        // Endurance for prolonged combat
//     speed: 95,          // Movement and reflex speed
//     healing: 70,        // Ability to recover or regenerate
//     influence: 95,      // Charisma, leadership, and inspiring others
//     sneakiness: 60,     // Stealth and ability to remain undetected
//     agility: 80,        // Evasion and precision in movement
//     defense: 75,        // Resistance to physical and magical attacks
//     magicPower: 90,     // Strength of magical or elemental abilities
//     criticalHitChance: 10, // Percentage chance for extra damage
//     resilience: 85,     // Resistance to debuffs or negative effects
//     intimidation: 80,   // Ability to lower enemy morale or performance
//     adaptability: 75,   // Performance in non-favorable environments
//     elementalResistance: 70 // Resistance to specific elemental attacks
// }

// Base Stat Contributions
const statWeights = {
    strength: 0.2,
    stamina: 0.15,
    speed: 0.1,
    healing: 0.1,
    influence: 0.15,
    sneakiness: 0.05,
    agility: 0.1,
    defense: 0.15,
    magicPower: 0.2,
    criticalHitChance: 0.1,
    resilience: 0.15,
    intimidation: 0.1,
    adaptability: 0.1,
    elementalResistance: 0.1,
};

const artifactStatBonuses = {
    // Combat Artifacts
    "Axe of Perun": { strength: 10, criticalHitChance: 5 },
    "Spear of Ares": { strength: 12, speed: 5 },
    "Golden Axe": { strength: 8 },
    "Twin Blades of Tengu": { speed: 10, criticalHitChance: 5 },
    "Sword of Victory": { strength: 15, criticalHitChance: 7 },
    "Mjölnir": { strength: 12, magicPower: 10 },
    "Lightning Bolt": { magicPower: 15, speed: 5 },

    // Defense Artifacts
    "Adamantine Shield": { defense: 15, resilience: 5 },
    "Aegis Shield": { defense: 20 },
    "Armor of Invincibility": { defense: 20, resilience: 10 },
    "Sacred Samurai Armor": { defense: 10, stamina: 10 },
    "Cursed Oni Armor": { defense: 10, intimidation: 15 },
    "Nemean Lion Pelt": { resilience: 20 },
    "Golden Shield of Asgard": { defense: 18, resilience: 8 },

    // Magic Artifacts
    "Celestial Orb": { magicPower: 15, elementalResistance: 10 },
    "Phoenix Feather Crown": { magicPower: 10, healing: 10 },
    "Staff of Creation": { magicPower: 20 },
    "Sudarshana Chakra": { magicPower: 15, criticalHitChance: 5 },
    "Yata no Kagami": { magicPower: 12, resilience: 5 },

    // Stealth & Agility Artifacts
    "Cloak of Shadows": { sneakiness: 15, agility: 5 },
    "Shadow Kunai": { sneakiness: 10, criticalHitChance: 8 },
    "Wind Cutter Blade": { speed: 12, agility: 8 },
    "Traveler's Cloak": { adaptability: 15, agility: 5 },
    "Winged Sandals": { speed: 15, agility: 10 },
    "Tengu Fan": { speed: 12, sneakiness: 5 },

    // Divine Influence Artifacts
    "Halo of Immortality": { influence: 15, healing: 15 },
    "Celestial Crown": { influence: 20 },
    "Blessings of Rama": { healing: 15, stamina: 10 },
    "Book of Life and Death": { influence: 12, magicPower: 10 },
    "Scythe of Cronos": { intimidation: 20 },
    "Divine War Banner": { influence: 15, resilience: 5 },

    // Special Elemental Artifacts
    "Flame of Enlightenment": { magicPower: 10, elementalResistance: 10 },
    "Ocean King's Helm": { waterAffinity: 20 },
    "Storm Bracers": { thunderAffinity: 15, speed: 5 },
    "Trident of Poseidon": { waterAffinity: 20, strength: 5 },
    "Gada of Hanuman": { strength: 10, agility: 5 },

    // ======= Defense & Protection =======
    "Ankh of Life": { healing: 15, resilience: 10 },
    "Armor of Righteousness": { defense: 20, influence: 10 },
    "Bident of Hades": { intimidation: 15, elementalResistance: 10 },
    "Bronze Shield": { defense: 12, resilience: 8 },
    "Celestial Armor": { defense: 15, magicPower: 10 },
    "Celestial Feathered Cloak": { agility: 12, adaptability: 10 },
    "Celestial Fox Mask": { sneakiness: 15, illusionPower: 10 }, // Special Illusion Boost
    "Celestial Headdress": { influence: 12, magicPower: 8 },
    "Celestial Robe": { elementalResistance: 15, adaptability: 10 },
    "Chains of Fate": { magicPower: 10, controlPower: 15 }, // Special Control Boost
    "Chains of Judgment": { influence: 12, judgmentPower: 10 }, // Judgment Boost
    "Chains of Olympus": { defense: 15, stamina: 10 },
    "Chains of the Forgotten": { sneakiness: 12, adaptability: 8 },
    "Chains of the Underworld": { intimidation: 15, resilience: 10 },

    // ======= Strength & Battle =======
    "Axe of Ganesh": { strength: 12, resilience: 5 },
    "Battle Chariot of Cats": { speed: 15, agility: 10 },
    "Bear Skin Cloak": { resilience: 15, intimidation: 8 },
    "Belt of Strength": { strength: 15, stamina: 10 },
    "Blade of Shadows": { sneakiness: 15, criticalHitChance: 10 },
    "Bow of Odysseus": { agility: 12, criticalHitChance: 8 },
    "Bow of Ram": { speed: 10, magicPower: 5 },
    "Club of Hercules": { strength: 18, defense: 10 },
    "Demon Club (Kanabō)": { strength: 15, intimidation: 10 },
    "Divine Spear": { strength: 12, speed: 10 },
    "Flaming Spear of Ra": { fireAffinity: 15, magicPower: 10 }, // Fire Elemental Bonus
    "Gale Bracers": { speed: 12, windAffinity: 10 }, // Wind Elemental Bonus
    "Gauntlet of Valor": { strength: 10, adaptability: 8 },
    "Gauntlets of Power": { strength: 15, magicPower: 8 },
    "Giant Club": { strength: 20, stamina: 8 },
    "Golden Boar Gullinbursti": { speed: 12, resilience: 10 },
    "Gungnir": { strength: 12, criticalHitChance: 12 },
    "Hammer of Hephaestus": { strength: 18, forgeMastery: 10 }, // Special Forge Bonus

    // ======= Magic & Elemental =======
    "Bag of Winds": { windAffinity: 15, adaptability: 10 },
    "Brísingamen": { influence: 15, charmPower: 12 }, // Special Charm Boost
    "Caduceus": { healing: 12, speed: 8 },
    "Chudamani": { magicPower: 10, wisdom: 8 },
    "Crown of Frost": { iceAffinity: 15, magicPower: 10 },
    "Divine Arrows": { precision: 15, agility: 10 }, // Special Precision Bonus
    "Divine Coin Pouch": { fortune: 15, prosperity: 12 }, // Fortune Boost
    "Divine Peacock": { influence: 10, beautyPower: 10 }, // Special Beauty Boost
    "Draupnir": { fortune: 15, wealth: 12 }, // Wealth Bonus
    "Elixir Gourd": { healing: 15, immortality: 10 }, // Immortality Boost
    "Elixir of Longevity": { healing: 18, stamina: 10 },
    "Emerald Tablet": { wisdom: 15, magicPower: 12 },
    "Eye of Horus": { resilience: 12, perception: 10 }, // Perception Boost
    "Flute of Enchantment": { charmPower: 15, illusionPower: 12 },
    "Foxfire Orb": { fireAffinity: 15, illusionPower: 10 },
    "Fortune Scepter": { influence: 12, prosperity: 12 },
    "Four Faces of Insight": { wisdom: 15, strategy: 10 },

    // ======= Trickery & Stealth =======
    "Cloak of Abundance": { prosperity: 15, fortune: 10 },
    "Cloak of Purity": { purity: 15, healing: 10 },
    "Cloud-Walking Boots": { speed: 15, agility: 12 },
    "Cunning Cloak": { sneakiness: 15, adaptability: 10 },
    "Damaru Drum": { intimidation: 12, influence: 8 },
    "Falcon Cloak": { speed: 12, agility: 10 },
    "Feather Fan of Resurrection": { resurrection: 15, healing: 10 },
    "Feather of Truth": { influence: 10, judgmentPower: 10 },
    "Feathered Cloak": { agility: 12, sneakiness: 10 },
    "Feathered Cloak of the Tengu": { speed: 12, sneakiness: 8 },
    "Flame Cloak": { fireAffinity: 15, magicPower: 10 },
    "Flame Collar": { fireResistance: 12, magicPower: 8 },
    "Folding Donkey": { adaptability: 12, travelSkill: 10 }, // Special Travel Bonus
    "Goblet of Ecstasy": { charmPower: 15, intoxicationPower: 10 },
    "Gorgon Amulet": { intimidation: 15, petrificationChance: 10 }, // Special Petrification Chance
    "Huginn and Muninn": { wisdom: 15, perception: 10 }, // Special Insight Bonus
    "Iron Crutch": { resilience: 12, fortitude: 10 },
    "Jade Hairpin": { beautyPower: 12, charmPower: 8 },

    // ======= Divinity & Cosmic =======
    "Golden Ankh": { immortality: 15, resurrection: 10 },
    "Golden Crown of Radiance": { influence: 15, charisma: 10 },
    "Golden Ingot of Transmutation": { transmutation: 15, fortune: 12 },
    "Golden Phoenix Robe": { fireAffinity: 15, resurrection: 10 },
    "Golden Rose": { beautyPower: 15, charmPower: 12 },
    "Harmony Tiara": { balance: 12, wisdom: 10 },
    "Lunar Mirror": { moonAffinity: 15, magicPower: 10 },
    "Lyre of Apollo": { influence: 12, musicPower: 10 },
    "Ocean King's Helm": { waterAffinity: 15, resilience: 10 },
    "Pagoda of Fortune": { fortune: 15, prosperity: 12 },
    "Peach Blade": { strength: 12, vitality: 10 },
    "Peaches of Immortality": { immortality: 15, healing: 12 },
    "Scepter of Ra": { sunAffinity: 15, magicPower: 10 },
    "Thunder Gauntlets": { thunderAffinity: 15, strength: 10 },
    "Trident of Shiva": { destructionPower: 15, resilience: 10 },
    "Wings of Protection": { defense: 15, agility: 10 },
    "Yin-Yang Drum": { balance: 12, adaptability: 10 },

    // ======= Leadership & Strategy =======
    "Captain's Helm": { leadership: 15, adaptability: 10 },
    "Compass of Ithaca": { travelSkill: 15, wisdom: 10 }, // Improves Navigation
    "Crown of the All-Mother": { influence: 18, healing: 10 },
    "Crown of the Earth": { earthAffinity: 15, resilience: 10 },
    "Crown of the Two Lands": { influence: 15, prosperity: 10 },
    "Golden Bridle": { animalMastery: 15, agility: 10 }, // Improves Mounted Combat
    "Golden Coin Pouch": { fortune: 15, prosperity: 12 },
    "Golden Ruyi Scepter": { wisdom: 15, magicPower: 12 },
    "Imperial Seal of Heaven": { influence: 20, resilience: 10 },
    "Jade Seal of Harmony": { balance: 15, wisdom: 10 },
    "Jade Seal of Prosperity": { prosperity: 15, fortune: 10 },
    "Jade Tablet of Imperial Decree": { leadership: 15, judgmentPower: 10 },

    // ======= Magic & Divinity =======
    "Celestial Lyre": { influence: 15, musicPower: 12 }, // Special Music Boost
    "Celestial Robes": { magicPower: 15, elementalResistance: 10 },
    "Celestial Thread": { adaptability: 12, resilience: 10 },
    "Cosmic Lotus": { cosmicEnergy: 15, magicPower: 12 }, // Cosmic Power Boost
    "Disc of Vishnu": { balance: 15, defense: 10 },
    "Flaming Spear": { fireAffinity: 15, strength: 10 },
    "Gourd of Wisdom": { wisdom: 18, perception: 12 },
    "Jewel of the Celestial": { magicPower: 15, healing: 10 },
    "Sacred Lotus": { purity: 15, healing: 12 },
    "Sacred Pearl": { immortality: 15, magicPower: 10 },
    "Sacred Sun Robe": { sunAffinity: 15, elementalResistance: 10 },
    "Solar Disk": { lightAffinity: 15, influence: 12 },
    "Soul Gem": { soulPower: 20, magicPower: 10 }, // Absorbs Souls of Defeated Opponents

    // ======= Combat & Warfare =======
    "Flaming Anvil": { forgeMastery: 15, fireResistance: 10 },
    "Flying Sword of Lü Dongbin": { agility: 15, criticalHitChance: 10 },
    "Forge Hammer": { strength: 15, forgeMastery: 12 },
    "Gjallarhorn": { intimidation: 15, battleRally: 12 }, // Boosts Allies in Combat
    "Golden Fleece": { defense: 15, resilience: 12 },
    "Head of Medusa": { intimidation: 18, petrificationChance: 15 }, // Chance to Turn Opponents to Stone
    "Heavenly Bow": { precision: 15, agility: 10 },
    "Heavenly Seal": { magicPower: 15, divineProtection: 10 }, // Grants Divine Protection
    "Hellfire Crown": { fireAffinity: 18, intimidation: 10 },
    "Helm of Darkness": { sneakiness: 20, intimidation: 10 },
    "Helmet of Rage": { strength: 15, battleFury: 12 }, // Gains Strength When Taking Damage
    "Horn of Veles": { wisdom: 15, deceptionPower: 10 },
    "Horned Crown of Hathor": { beautyPower: 15, charmPower: 10 },
    "Horned Helm": { intimidation: 15, battleRage: 12 }, // Special Battle Fury Boost
    "Kusanagi-no-Tsurugi": { strength: 18, magicPower: 10 },
    "Lightning Seal": { thunderAffinity: 15, speed: 10 },
    "Lioness Crown": { courage: 15, resilience: 10 },
    "Maelstrom Amulet": { waterAffinity: 15, adaptability: 12 }, // Enhances Water Control
    "Molten Gauntlets": { fireAffinity: 15, strength: 10 },
    "Moonlight Blade": { speed: 15, criticalHitChance: 12 },
    "Mystic Robes of the Frog Sage": { adaptability: 15, magicPower: 12 },
    "Ogre Mask of Terror": { intimidation: 20, fearPower: 12 }, // Strikes Fear in Opponents
    "Panchajanya Conch": { battleRally: 15, divineProtection: 10 },
    "Pearl of the Tides": { waterAffinity: 15, healing: 12 },
    "Poisonous Breath": { poisonPower: 15, intimidation: 10 },
    "Regenerative Blood": { healing: 18, resilience: 10 }, // Passively Restores Health
    "Rudraksha Beads": { meditationPower: 15, spiritualEnergy: 12 },

    // ======= Trickery & Stealth =======
    "Mask of Revelry": { charmPower: 15, deceptionPower: 10 },
    "Mistletoe Shard": { fateManipulation: 15, resilience: 10 }, // Grants Protection from Fate
    "Owl of Athena": { wisdom: 15, perception: 10 },
    "Red Armillary Sash": { speed: 15, adaptability: 12 },
    "Scribe’s Staff": { intelligence: 15, influence: 10 },
    "Shapeshifter's Robes": { sneakiness: 15, adaptability: 12 },
    "Silver Veil": { sneakiness: 18, deceptionPower: 12 }, // Enhances Disguises
    "Throne of Osiris": { influence: 15, judgmentPower: 12 },
    "Veil of Secrets": { deceptionPower: 15, intelligence: 12 },

    // ======= Elemental & Cosmic Power =======
    "Tome of Life and Death": { soulPower: 15, necromancy: 12 }, // Controls Life & Death
    "Torch of Defiance": { fireAffinity: 15, resilience: 10 },
    "Trishul of Shiva": { destructionPower: 18, resilience: 10 },
    "Underworld Crown": { darknessAffinity: 18, intimidation: 12 },
    "Vajra": { thunderAffinity: 15, strength: 10 },
    "Venomous Fang": { poisonPower: 15, criticalHitChance: 12 },
    "Vine Crown": { natureAffinity: 15, healing: 12 },
    "Wind Fire Wheels": { speed: 18, fireAffinity: 10 },
    "Windborne Cloak": { windAffinity: 15, agility: 12 },
    "Winged Crown": { airAffinity: 15, adaptability: 10 },
    // ======= Leadership, Strategy & Divine Rule =======
    "Crook and Flail": { leadership: 15, resilience: 10 }, // Symbol of Kingship
    "Golden Abacus": { fortune: 15, prosperity: 12 }, // Increases wealth calculation
    "Golden Sun Disk": { sunAffinity: 15, influence: 12 }, // Light & Solar Power
    "Hourglass of Eternity": { timeManipulation: 18, wisdom: 10 }, // Alters time perception
    "Kingly Crown": { influence: 18, prosperity: 12 }, // Symbol of Royal Power
    "Labyrinth Key": { adaptability: 15, intelligence: 10 }, // Unlocks the paths of mystery
    "Shield of Oaths": { resilience: 15, influence: 12 }, // Grants divine protection for the honorable
    "Ship Skíðblaðnir": { travelSkill: 18, speed: 12 }, // Enhances journeying & naval combat
    "Sky Piercer Armor": { defense: 15, thunderAffinity: 10 }, // Protects against aerial attacks
    "Stone of Stability": { earthAffinity: 15, resilience: 12 }, // Strengthens foundations
    "Thread of Ariadne": { intelligence: 18, adaptability: 10 }, // Guides through confusing situations

    // ======= Magic & Spiritual Artifacts =======
    "Flute of Harmony": { magicPower: 15, charmPower: 12 }, // Soothing musical influence
    "Golden Sistrum": { influence: 12, spiritualEnergy: 10 }, // Used in divine rituals
    "Lotus Staff": { healing: 15, purification: 12 }, // Enhances life energy
    "Lotus of Compassion": { healing: 12, influence: 10 }, // Increases benevolence
    "Magical Lotus Flower": { magicPower: 15, elementalResistance: 10 }, // Enhances meditation power
    "Modaks of Blessing": { fortune: 12, healing: 10 }, // Brings divine luck
    "Saraswati's Manuscript": { wisdom: 18, magicPower: 12 }, // Grants deep understanding of knowledge
    "Soulbinding Chains": { soulPower: 18, controlPower: 12 }, // Captures enemy souls
    "Spindle of Destiny": { fateManipulation: 15, adaptability: 10 }, // Alters destiny
    "Staff of Radiance": { lightAffinity: 18, influence: 12 }, // Bestows holy light
    "Staff of Souls": { necromancy: 15, magicPower: 12 }, // Controls spirits
    "Starry Staff": { cosmicEnergy: 18, magicPower: 10 }, // Celestial influence
    "Sun Chariot": { speed: 18, sunAffinity: 12 }, // Moves like the sun across the sky
    "Taoist Feathered Hat": { wisdom: 15, spiritualEnergy: 10 }, // Enhances mystical understanding

    // ======= Strength, War & Battle =======
    "Kaumodaki Mace": { strength: 15, resilience: 10 }, // Mace of divine power
    "Spear of Wisdom": { wisdom: 15, precision: 12 }, // Sharpens intellect & battle strategy
    "Spear of the Skies": { thunderAffinity: 18, agility: 10 }, // Commands the power of storms
    "Storm Bringer Trident": { waterAffinity: 15, stormPower: 12 }, // Controls storms and waves
    "Sword of Justice": { strength: 15, judgmentPower: 12 }, // Wielded by righteous warriors
    "Sword of Theseus": { adaptability: 15, agility: 10 }, // Ensures survival & perseverance
    "Sword of the Argo": { speed: 12, strategy: 10 }, // Wielded by heroic sailors
    "Tengu Charm": { sneakiness: 15, windAffinity: 10 }, // Grants agility and deception
    "Tenkei Spear": { criticalHitChance: 15, magicPower: 10 }, // Infused with celestial energy
    "Thunderbolt": { thunderAffinity: 20, speed: 12 }, // Divine lightning strike
    "Thunderbolt Crown": { thunderAffinity: 18, influence: 10 }, // Bestows control over storms
    "Tidal Crown": { waterAffinity: 18, resilience: 12 }, // Enhances command over oceans
    "Vel Spear": { strength: 15, divineProtection: 10 }, // Pierces all evil

    // ======= Trickery, Stealth & Transformation =======
    "Orb of Chaos": { chaosPower: 18, deceptionPower: 12 }, // Unleashes unpredictable effects
    "Peacock Feather Crown": { beautyPower: 15, charmPower: 10 }, // Grants hypnotic allure
    "Petal Amulet": { healing: 12, charmPower: 10 }, // Subtle charm and restoration
    "Purification Mirror": { purity: 15, resilience: 10 }, // Dispels illusions and curses
    "Ruyi Jingu Bang": { strength: 18, adaptability: 12 }, // Weapon of Sun Wukong
    "Sacred Armor of the East": { defense: 15, divineProtection: 12 }, // Protects against evil forces
    "Sacred Kibidango": { fortune: 12, battleRally: 10 }, // Increases loyalty of allies
    "Sacred Sea Bream": { prosperity: 15, healing: 10 }, // Brings divine fortune
    "Sacred Stones of Restoration": { healing: 18, magicPower: 10 }, // Restores health and vitality
    "Samurai Armor of Virtue": { resilience: 15, honorPower: 10 }, // Strengthens one's warrior code
    "Scale of the Abyss": { waterAffinity: 18, darknessAffinity: 12 }, // Grants deep-sea power
    "Shell of the Tides": { waterAffinity: 15, purification: 12 }, // Washes away evil
    "Shield of Chaos": { defense: 15, chaosPower: 12 }, // Deflects unpredictable attacks
    "Staff of Eternal Winter": { iceAffinity: 18, resilience: 10 }, // Controls winter's power
    "Staff of Transformation": { shapeshifting: 15, adaptability: 12 }, // Grants the ability to change form
    "Staff of the Dead": { necromancy: 18, darknessAffinity: 10 }, // Raises the fallen

    // ======= Unique and Mythical =======
    "Taiko Drums of Storms": { thunderAffinity: 18, battleRally: 12 }, // Calls forth thunder in battle
    "Toad Summoning Scroll": { animalMastery: 15, agility: 10 }, // Allows summoning of giant toads

    // ======= Prosperity, Fertility & Growth =======
    "Fertility Chalice": { fertility: 18, healing: 12 }, // Enhances fertility & life energy
    "Floral Basket": { natureAffinity: 15, healing: 12 }, // Restores vitality and life essence
    "Lucky Fishing Rod": { fortune: 18, prosperity: 12 }, // Boosts luck in acquiring resources

    // ======= Strength & Titan Power =======
    "Stone of the Cyclops": { strength: 20, resilience: 15 }, // Grants immense physical power

};

// Stage Modifiers
const stageModifiers = {
    land: {
        bonus: ["earth", "land", "strength", "strategy", "fortitude", "warrior", "battle", "order", "prosperity"],
        penalty: ["water", "sea", "storm", "ice", "darkness"],
        bonusScore: 20, penaltyScore: 10
    },
    sea: {
        bonus: ["water", "sea", "fishing", "travel", "storm", "prosperity", "life", "ocean", "fortune"],
        penalty: ["fire", "sun", "metal", "earth", "desert"],
        bonusScore: 30, penaltyScore: 20
    },
    sky: {
        bonus: ["thunder", "air", "storm", "wind", "lightning", "celestial", "pegasus", "cosmic energy"],
        penalty: ["earth", "underworld", "metal"],
        bonusScore: 35, penaltyScore: 15
    },
    desert: {
        bonus: ["fire", "sun", "light", "purification", "sunlight", "resurrection", "order", "creation"],
        penalty: ["water", "ice", "flowers", "nurture"],
        bonusScore: 25, penaltyScore: 20
    },
    underworld: {
        bonus: ["darkness", "death", "judgment", "underworld", "destruction", "chaos", "rebirth", "vengeance", "madness"],
        penalty: ["light", "divine", "heaven", "purity"],
        bonusScore: 40, penaltyScore: 25
    },
    forest: {
        bonus: ["earth", "strategy", "nature", "healing", "life", "flowers", "hidden power", "wisdom"],
        penalty: ["darkness", "destruction", "fire"],
        bonusScore: 25, penaltyScore: 15
    },
    mountains: {
        bonus: ["earth", "strategy", "order", "wisdom", "courage", "guardian", "honor"],
        penalty: ["darkness", "underworld", "chaos"],
        bonusScore: 25, penaltyScore: 15
    },
};

// Weather Modifiers
const weatherModifiers = {
    sunny: {
        bonus: ["light", "sun", "sunlight", "fire", "prosperity", "life", "blessings", "creation", "purification", "festival"],
        penalty: ["darkness", "underworld", "storm", "ice"],
        bonusScore: 20, penaltyScore: 10
    },
    rainy: {
        bonus: ["water", "thunder", "storm", "fishing", "sea", "nature", "renewal", "rebirth"],
        penalty: ["fire", "light", "metal", "desert"],
        bonusScore: 30, penaltyScore: 20
    },
    snowy: {
        bonus: ["ice", "winter", "fortitude", "preservation", "resilience"],
        penalty: ["fire", "sun", "light", "healing"],
        bonusScore: 25, penaltyScore: 15
    },
    windy: {
        bonus: ["air", "wind", "storm", "travel", "ninjutsu", "adventure", "freedom"],
        penalty: ["earth", "desert", "metal", "stability"],
        bonusScore: 20, penaltyScore: 10
    },
    stormy: {
        bonus: ["thunder", "darkness", "chaos", "destruction", "vengeance", "trickery"],
        penalty: ["light", "balance", "harmony"],
        bonusScore: 30, penaltyScore: 20
    },
    foggy: {
        bonus: ["darkness", "sneakiness", "illusion", "trickery", "hidden power", "ninjutsu"],
        penalty: ["light", "wisdom", "divine knowledge"],
        bonusScore: 15, penaltyScore: 10
    },
    eclipse: {
        bonus: ["darkness", "sun", "cosmic balance", "judgment", "immortality"],
        penalty: [],
        bonusScore: 35, penaltyScore: 0
    },
};

const elementSynergies = {
    "water": ["fire"],
    "light": ["darkness"],
    "earth": ["air"],
    "fire": ["ice", "nature"],
    "lightning": ["metal"],
    "wisdom": ["madness"],
    "heroism": ["fear"],
    "strategy": ["brutality"],
    "divine": ["underworld"],
    "creation": ["destruction"],
    "healing": ["poison"],
    "judgment": ["chaos"],
    "guardian": ["trickery"],
    "storm": ["sea"],
    "strength": ["finesse"],
    "fate": ["rebellion"],
    "courage": ["fear"],
    "illusion": ["purification"],
    "alchemy": ["transmutation"],
    "valor": ["cowardice"],
    "love": ["vengeance"],
    "time": ["resurrection"],
    "archery": ["warrior"],
    "fortune": ["misfortune"],
    "heaven": ["underworld"],
    "celestial": ["cosmic balance"],
    "justice": ["lawlessness"],
    "leadership": ["rebellion"],
    "music": ["silence"],
    "meditation": ["madness"],
    "metal": ["nature"],
    "monkey": ["order"],
    "samurai": ["ninjutsu"],
    "spirit": ["materialism"],
    "prosperity": ["poverty"],
    "cosmos": ["chaos"]
};

function calculateScore(fighter, stage, weather, isCorrupted, selectedArtifact, opponent) {
    let score = 0;
    let details = [];
    let narrative = [];

    // === APPLY ARTIFACT BONUSES ===
    if (selectedArtifact && artifactStatBonuses[selectedArtifact]) {
        let bonuses = artifactStatBonuses[selectedArtifact];

        for (let stat in bonuses) {
            if (fighter.stats[stat] !== undefined) {
                let actualbonus = Math.round((fighter.stats[stat] * bonuses[stat]) / 100, 2);
                fighter.stats[stat] += fighter.stats[stat] * bonuses[stat] / 100;
                details.push(`Artifact Bonus (${selectedArtifact}): +${actualbonus} (+${bonuses[stat]}%) to ${stat}`);
            }
        }
    }

    for (let stat in fighter.stats) {
        const statContribution = fighter.stats[stat] * (statWeights[stat] || 0);
        score += statContribution;
        details.push(`${stat}: ${fighter.stats[stat]} × ${statWeights[stat]} = ${statContribution.toFixed(2)}`);
        // narrative.push(`Using their ${stat}, ${fighter.name} demonstrated impressive ${stat.toLowerCase()} in the battle.`);
    }

    if (stageModifiers[stage]) {
        fighter.elements.forEach((element) => {
            if (stageModifiers[stage].bonus.includes(element)) {
                score += stageModifiers[stage].bonusScore + fighter.stats.adaptability * 0.2;
                details.push(`Stage Bonus (${stage}, ${element}): +${stageModifiers[stage].bonusScore}`);
                narrative.push(`${fighter.name} adapted excellently to the ${stage}, leveraging their affinity with ${element}.`);
            }
            if (stageModifiers[stage].penalty.includes(element)) {
                score -= stageModifiers[stage].penaltyScore;
                details.push(`Stage Penalty (${stage}, ${element}): -${stageModifiers[stage].penaltyScore}`);
                narrative.push(`However, the ${stage} proved challenging for ${fighter.name}, reducing their effectiveness.`);
            }
        });
    }

    if (stage == 'desert' && fighter.bio.nationality == 'Egyptian') {
        const egyptianBonus = 15;
        score += egyptianBonus;
        details.push(`Desert bonus for Egyptian entities (+${egyptianBonus})`);

    }

    // Corruption Mechanics
    if (isCorrupted) {
        let corruptionBoosts = {
            strength: 1.2, magicPower: 1.25, intimidation: 1.3, sneakiness: 1.15,
        };

        let corruptionPenalties = {
            healing: 0.75, influence: 0.7, resilience: 0.8, agility: 0.85,
        };

        for (let stat in fighter.stats) {
            if (corruptionBoosts[stat]) {
                let increase = fighter.stats[stat] * (corruptionBoosts[stat] - 1);
                fighter.stats[stat] *= corruptionBoosts[stat];
                details.push(`Corruption Boost: ${stat} increased by +${increase.toFixed(2)}`);
                // narrative.push(`${fighter.name}, consumed by corruption, gained unnatural ${stat}.`);
            }
            if (corruptionPenalties[stat]) {
                let decrease = fighter.stats[stat] * (1 - corruptionPenalties[stat]);
                fighter.stats[stat] *= corruptionPenalties[stat];
                details.push(`Corruption Penalty: ${stat} reduced by -${decrease.toFixed(2)}`);
                // narrative.push(`The dark power weakened ${fighter.name}'s ${stat}, making them unstable.`);
            }
        }

        if (opponent && !opponent.isCorrupted) {
            let purityResistance = (opponent.stats.influence * 0.3) + (opponent.stats.resilience * 0.25);
            let purityPenalty = purityResistance / 5;
            score -= purityPenalty;
            details.push(`Corruption vs. Purity: -${purityPenalty.toFixed(2)} (Opponent's influence & resilience resist corruption)`);
            narrative.push(`The purity of ${opponent.name} resisted ${fighter.name}'s corruption, diminishing its power.`);
        }
    }

    if (weatherModifiers[weather]) {
        fighter.elements.forEach((element) => {
            if (weatherModifiers[weather].bonus.includes(element)) {
                score += weatherModifiers[weather].bonusScore + fighter.stats.elementalResistance * 0.2;
                details.push(`Weather Bonus (${weather}, ${element}): +${weatherModifiers[weather].bonusScore}`);
                narrative.push(`${fighter.name} thrived under the ${weather} conditions, drawing strength from ${element}.`);
            }
            if (weatherModifiers[weather].penalty.includes(element)) {
                score -= weatherModifiers[weather].penaltyScore;
                details.push(`Weather Penalty (${weather}, ${element}): -${weatherModifiers[weather].penaltyScore}`);
                narrative.push(`${weather} conditions hindered ${fighter.name}'s performance (${element}).`);
            }
        });
    }

    // God vs. Creature 30% Bonus
    if ((fighter.type === "god" || fighter.type === "goddess") && opponent && opponent.type === "creature") {
        score += 20
        details.push(`God vs Creature Bonus: +20`);
        let overlappingElements = fighter.elements.filter(element => opponent.elements.includes(element));

        if (overlappingElements.length > 0) {
            let godBonus = score * 0.3;
            score += Math.round(godBonus);
            details.push(`God Elemental Bonus: +${Math.round(godBonus)} (due to shared elements: ${overlappingElements.join(", ")})`);
            narrative.push(`${fighter.name}, being a divine entity, gained an upper hand over ${opponent.name} due to their overlapping elemental affinity.`);
        }
    }

    // Hero/Immortal vs. Creature 15% Bonus
    if ((fighter.type === "hero" || opponent.type === "immortal") && opponent && opponent.type === "creature") {
        let overlappingElements = fighter.elements.filter(element => opponent.elements.includes(element));
        score += 10
        details.push(`Hero vs Creature Bonus: +10`);
        if (overlappingElements.length > 0) {
            let heroBonus = score * 0.15;
            score += Math.round(heroBonus);
            details.push(`Hero Elemental Bonus: +${Math.round(heroBonus)} (due to shared elements: ${overlappingElements.join(", ")})`);
            narrative.push(`${fighter.name}, as a legendary hero, leveraged their experience to gain an advantage over ${opponent.name}.`);
        }
    }

    // God vs. Hero 20% Bonus
    if ((fighter.type === "god" || fighter.type === "goddess") && opponent && (opponent.type === "hero" || opponent.type === "immortal")) {
        let overlappingElements = fighter.elements.filter(element => opponent.elements.includes(element));
        score += 10
        details.push(`God vs Hero Bonus: +10`);
        if (overlappingElements.length > 0) {
            let godHeroBonus = score * 0.2;
            score += Math.round(godHeroBonus);
            details.push(`God Elemental Bonus (vs. Hero): +${Math.round(godHeroBonus)} (due to shared elements: ${overlappingElements.join(", ")})`);
            narrative.push(`${fighter.name}, being a god, asserted dominance over ${opponent.name} due to their divine nature.`);
        }
    }

    // Artifact Modifiers
    if (selectedArtifact && selectedArtifact !== "none") {
        if (fighter.artifacts.includes(selectedArtifact)) {
            const artifactSpecialBonus = 25;
            score += artifactSpecialBonus;
            details.push(`Artifact Bonus (Special for ${fighter.name} with ${selectedArtifact}): +${artifactSpecialBonus}`);
            narrative.push(`The ${selectedArtifact} synergized perfectly with ${fighter.name}'s abilities.`);
        }
    }

    // Synergy: Opponent Interaction Modifiers
    if (opponent) {
        for (let element of fighter.elements) {
            for (let opponentElement of opponent.elements) {
                if (elementSynergies[element] && elementSynergies[element].includes(opponentElement)) {
                    const synergyBonus = 25;
                    score += synergyBonus;
                    details.push(`Element Synergy (${element} vs ${opponentElement}): +${synergyBonus}`);
                    narrative.push(`${fighter.name}'s ${element} proved to be a perfect counter to ${opponent.name}'s ${opponentElement}.`);
                }
            }
        }
    }

    // Critical Hit Modifier
    const criticalHitChance = fighter.stats.criticalHitChance / 100;
    if (Math.random() < criticalHitChance) {
        const criticalHitBonus = fighter.stats.strength * 0.5;
        score += criticalHitBonus;
        details.push(`Critical Hit Bonus: +${criticalHitBonus.toFixed(2)}`);
        narrative.push(`A powerful critical strike by ${fighter.name} turned the tide of the battle.`);
    }

    // Assemble Fight Narrative
    const fightSummary = narrative.join("\n");
    // console.log(`Fight Summary: ${fightSummary}`);
    console.log(`Score Calculation for ${fighter.name}:`);
    details.forEach((detail) => console.log(`  - ${detail}`));
    console.log(`  -> Final Score: ${Math.round(score)}`);

    return {
        score: Math.round(score),
        fightSummary: fightSummary,
    };
}

////////////////////////////////////////////
////////////// DEBUG ///////////////////////
////////////////////////////////////////////

function logAllUniqueElements(entities) {
    let uniqueElements = new Set();

    entities.forEach(entity => {
        if (entity.elements && Array.isArray(entity.elements)) {
            entity.elements.forEach(element => uniqueElements.add(element));
        }
    });

    console.log("=== Unique Elements in the Game ===");
    console.log(Array.from(uniqueElements).sort().join(", "));
}

function logAllUniqueArtifacts(entities) {
    let uniqueArtifacts = new Set();

    entities.forEach(entity => {
        if (entity.artifacts && Array.isArray(entity.artifacts)) {
            entity.artifacts.forEach(artifact => uniqueArtifacts.add(artifact));
        }
    });

    console.log("=== Unique Artifacts in the Game ===");
    console.log(Array.from(uniqueArtifacts).sort().join(", "));
}

function logUndefinedArtifacts(entities) {
    let uniqueArtifacts = new Set();

    // Collect all artifacts from entities
    entities.forEach(entity => {
        if (entity.artifacts && Array.isArray(entity.artifacts)) {
            entity.artifacts.forEach(artifact => uniqueArtifacts.add(artifact));
        }
    });

    // Find artifacts that are not in artifactStatBonuses
    let missingArtifacts = Array.from(uniqueArtifacts).filter(artifact => !artifactStatBonuses.hasOwnProperty(artifact));

    console.log("=== Undefined Artifacts (Not in artifactStatBonuses) ===");
    if (missingArtifacts.length > 0) {
        console.log(missingArtifacts.sort().join(", "));
    } else {
        console.log("✅ All artifacts are properly defined in artifactStatBonuses.");
    }
}

// logAllUniqueElements(entities);
// logAllUniqueArtifacts(entities)
// logUndefinedArtifacts(entities)

////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////
