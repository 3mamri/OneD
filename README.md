<h1 align="center"> 🏴‍☠️ OnePiecedle </h1>

<p align="center">
  <strong>Jeu de Devinettes One Piece • Quotidien</strong>
</p>
<p align="center">
<img src="https://img.shields.io/badge/FORMATION-BTS%20SIO%20SLAM-blue?style=for-the-badge" alt="BTS SIO SLAM"> 
  <img src="https://img.shields.io/badge/Statut-Projet%20Étudiant-blue?style=for-the-badge" />
</p>

<h3 align="center"> Un jeu web interactif inspiré de <a href="https://onepiecedle.net/">OnePiecedle</a>, basé sur l'univers de <strong>One Piece</strong>.</h3>
<p align="center">
  OneD est une application web interactive inspirée du concept Onepiecedle, permettant aux fans de tester leurs connaissances sur l'univers de One Piece à travers un défi quotidien dynamique.
</p>

<p align="center">
  ⚡ <strong>Stack :</strong> Vue.js 3 / Vite<br>
  🎨 <strong>Frontend :</strong> CSS3 (Animations Flashy) / JavaScript (ES6+)
</p>

## 🚀 Démo en ligne
Retrouvez la version déployée du projet ici : 👉 [https://oned-fgr4.onrender.com](https://oned-fgr4.onrender.com)

---
## 🧠 Concept & Gameplay

À chaque proposition, le jeu compare les attributs du personnage choisi avec ceux du personnage du jour :

| Indicateur | Signification | Résultat |
| :---: | :--- | :--- |
| 🟩 | **Correct** | Correspondance parfaite |
| 🟧 | **Partiel** | Correspondance proche |
| 🟥 | **Incorrect** | Aucune correspondance |

---

## 📁 Structure du Projet

```text
src/
├── api/
│   └── onePieceService.js   # Appels API
├── components/
│   └── Game/
│       ├── DailyGame.vue    # Logique du jeu
│       ├── GuessInput.vue   # Autocomplétion
│       └── GuessTable.vue   # Tableau des indices
├── styles.css               # Design & Animations
├── App.vue                  # Racine
└── main.js                  # Initialisation
```
## 🔧 Installation & Lancement
```text

Bash
# Cloner le dépôt
git clone [https://github.com/3mamri/OneD.git](https://github.com/3mamri/OneD.git)

# Accéder au dossier
cd OneD

# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev
```
🔗 GitHub : 3mamri

🏁 Licence
Projet académique
Ce projet est réalisé dans le cadre de ma foramtion de mon bts sio slam
