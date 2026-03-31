# 🏴‍☠️ OnePiecedle - One Piece Guessing Game

![Projet Scolaire](https://img.shields.io/badge/PROJET-SCOLAIRE%20ACADÉMIQUE-blueviolet?style=for-the-badge&logo=googlescholar)
![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4fc08d?style=for-the-badge&logo=vue.js)
![Vite](https://img.shields.io/badge/Vite-Latest-646cff?style=for-the-badge&logo=vite)

Un jeu web interactif inspiré de **Wordle**, basé sur l'univers de **One Piece**. Devinez le personnage mystère chaque jour !

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
🔧 Installation & Lancement
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
