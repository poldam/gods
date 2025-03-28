# Mythical Battle Arena

## Live Version
[Click here to play](https://www.estros.gr/gods/)

## Overview
**Mythical Battle Arena** is a strategic battle simulation where legendary deities, heroes, titans, and creatures clash in dynamic encounters. Players select fighters, artifacts, battle conditions, and corruption status to determine the victor through a calculated scoring system.

## ⚔️ Combat Scoring System

### 📖 Overview
The combat system calculates a fighter's **score** based on multiple factors, including **base stats, artifacts, stage effects, weather conditions, corruption, elemental synergies, and opponent type interactions**. This score determines the fighter's **overall effectiveness** in a battle.

---

## 🏆 Score Calculation Breakdown
The final **score** is determined by summing various **modifiers**, including **base stats, bonuses, penalties, and interactions**. Below are the details of each rule that contributes to the final score.

---

## 📊 1️⃣ Base Stats Contribution
Each fighter has **base stats**, and each stat contributes to the final score using a **weighted multiplier**.

### 🎯 **Stat Weights**
| Stat               | Weight |
|--------------------|--------|
| Strength          | 0.2    |
| Stamina           | 0.15   |
| Speed            | 0.1    |
| Healing           | 0.1    |
| Influence         | 0.15   |
| Sneakiness        | 0.05   |
| Agility           | 0.1    |
| Defense          | 0.15   |
| Magic Power       | 0.2    |
| Critical Hit Chance | 0.1  |
| Resilience        | 0.15   |
| Intimidation      | 0.1    |
| Adaptability      | 0.1    |
| Elemental Resistance | 0.1 |

### 🔢 **Calculation:**
For each stat:
score += (fighter.stats[stat] * statWeights[stat])

---

## 🏹 2️⃣ Artifact Bonuses
Artifacts provide **percentage-based bonuses** to specific stats.

### ⚡ **Artifact Bonus Rules**
- If the fighter **equips an artifact**, it grants **stat bonuses**.
- If the artifact is **unique to the fighter**, it gives an **extra special bonus** (+50).

### 🔢 **Calculation:**
fighter.stats[stat] += (fighter.stats[stat] * artifactBonus / 100) score += artifactBonus

---

## 🏞️ 3️⃣ Stage Modifiers
Fighters **gain bonuses or penalties** based on the battlefield stage.

### 🌍 **Stage Effects**
| Stage       | Bonus Elements                   | Penalty Elements | Bonus Score | Penalty Score |
|------------|--------------------------------|-----------------|-------------|---------------|
| Land      | Earth, Land                   | Water          | +20        | -10          |
| Sea       | Water                         | Fire          | +30        | -20          |
| Sky       | Thunder, Air                  | Earth         | +35        | -15          |
| Desert    | Fire, Sun                     | Water         | +25        | -20          |
| Underworld | Darkness, Death, Judgment     | Light         | +40        | -25          |
| Forest    | Earth, Strategy               | Darkness      | +25        | -15          |
| Mountains | Earth, Strategy               | Darkness      | +25        | -15          |

### 🎯 **Special Bonus for Egyptian Fighters in Desert**
If a **fighter is Egyptian**, they get a **+15 bonus** in the desert stage.

---

## 🌦️ 4️⃣ Weather Modifiers
Certain **weather conditions** benefit or hinder fighters based on their elements.

| Weather   | Bonus Elements            | Penalty Elements | Bonus Score | Penalty Score |
|-----------|---------------------------|------------------|-------------|--------------|
| Sunny     | Light, Sun                 | Darkness         | +20        | -10         |
| Rainy     | Water, Thunder             | Fire            | +30        | -20         |
| Snowy     | Ice                         | Fire            | +25        | -15         |
| Windy     | Air                         | Earth           | +20        | -10         |
| Stormy    | Thunder, Darkness          | Light           | +30        | -20         |
| Foggy     | Darkness, Sneakiness       | Light           | +15        | -10         |
| Eclipse   | Darkness, Sun              | None            | +35        | 0           |

---

## 🛑 5️⃣ Corruption Mechanics
If a **fighter is corrupted**, they gain **stat boosts** but also suffer **penalties**.

### 🔥 **Boosts (+)**
| Stat         | Multiplier |
|-------------|------------|
| Strength    | 1.2x       |
| Magic Power | 1.25x      |
| Intimidation | 1.3x      |
| Sneakiness  | 1.15x      |

### ❄️ **Penalties (-)**
| Stat        | Multiplier |
|------------|------------|
| Healing    | 0.75x      |
| Influence  | 0.7x       |
| Resilience | 0.8x       |
| Agility    | 0.85x      |

#### ✨ **Purity Resistance (Anti-Corruption)**
- If the **opponent is NOT corrupted**, their **Influence & Resilience** reduce the corrupted fighter's power.

### 🔢 **Calculation:**
fighter.stats[stat] *= corruptionBoosts[stat] score -= purityPenalty

---

## 🔥 6️⃣ Elemental Synergies
Some **elements counter others**, granting **bonus scores**.

### 🌌 **Elemental Advantage Rules**
| Element   | Counters      | Bonus Score |
|-----------|-------------|-------------|
| Water    | Fire        | +25        |
| Light    | Darkness    | +25        |
| Earth    | Air         | +25        |
| Fire     | Ice, Nature | +25        |
| Lightning | Metal       | +25        |

### 🔢 **Calculation:**
if (elementSynergies[element] && elementSynergies[element].includes(opponentElement)) { score += 25; }

---

## 🚀 Conclusion
This system ensures a **fair, strategic, and engaging combat experience** by considering multiple factors such as **stats, matchups, synergies, and artifacts**.

## License
This project is open-source and can be modified freely. Contributions are welcome!
