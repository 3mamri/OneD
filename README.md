<h1 align="center"> 🏴‍☠️ OnePiecedle - One Piece Guessing Game </h1>

<p align="center">
<img src="https://img.shields.io/badge/FORMATION-BTS%20SIO%20SLAM-blue?style=for-the-badge" alt="BTS SIO SLAM"> <img src="https://img.shields.io/badge/Vue.js-3.x-4fc08d?style=for-the-badge&logo=vue.js" alt="Vue.js"> <img src="https://img.shields.io/badge/Vite-Latest-646cff?style=for-the-badge&logo=vite" alt="Vite">
</p>

<h3 align="center"> Un jeu web interactif inspiré de <a href="https://onepiecedle.net/">OnePiecedle</a>, basé sur l'univers de <strong>One Piece</strong>.</h3>

---

## 🚀 Démo en ligne
Retrouvez la version déployée du projet ici :
### 👉 [https://oned-fgr4.onrender.com](https://oned-fgr4.onrender.com)

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
👨‍💻 Auteur
🔗 GitHub : 3mamri

🏁 Licence
Projet académique
Ce projet est réalisé dans le cadre de ma foramtion de mon bts sio slam
