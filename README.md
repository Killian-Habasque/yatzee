# Yatzee threejs game 


## ✏️ Contexte

Ce projet a été réalisé lors de ma première année en mastère de développement web. L'objectif principal était de renforcer mes compétences en algorithmie JavaScript, tout en explorant la modélisation et l'animation 3D avec Three.js. En combinant la logique du jeu du Yams (ou yatzee/ yathzee) avec un rendu visuel immersif, ce projet m'a permis d'expérimenter des techniques avancées de développement et d'animation.

🚨 **Disclaimer** : Ce projet est loin d'être optimisé, notamment en termes de performance et d'architecture. L'utilisation de technologies plus modernes et adaptées comme React aurait été plus judicieuse pour structurer l'application et gérer l'état, surtout avec des composants interactifs et animés. Cependant, le but de cet exercice était de s'exercer sur du JavaScript natif, ce qui explique les choix technologiques retenus.

## 🏗️ Technologies utilisées

-   **JavaScript** : Gère toute la logique du jeu, incluant le système de dés, de combinaisons, de règles...
-   **Three.js** : Utilisé pour la modélisation et l'animation 3D des éléments, y compris les dés.
-   **Cannon** : Gestion de la gravité et des collisions des éléments 3D.
-   **Tween.js / GSAP** : Appliqués pour animer les modèles 3D et certains éléments du DOM.
-   **SCSS** : Pour le stylisme et la mise en page du projet.
-   **Express** : Serveur backend permettant l’interaction avec les données utilisateur.
-   **Firebase** : Gère l'authentification des utilisateurs et le stockage des scores.
-   **Vercel** : Déploiement continu et hébergement du projet.

## 🔧 Fonctionnalités

-   **Gestion des dés et des lancés** : Les joueurs peuvent lancer les dés jusqu'à trois fois par tour pour obtenir des combinaisons.
-   **Choix des combinaisons** : Les joueurs doivent sélectionner les meilleures combinaisons disponibles à chaque tour.
-   **Gestion des utilisateurs** : Inscription, connexion et authentification via Firebase.
-   **Gestion des scores** : Les scores des parties sont sauvegardés et consultables.

## 📝 Règles du jeu

Le Yatzee est un jeu de dés où chaque joueur cherche à obtenir des combinaisons spécifiques afin de marquer des points. Les joueurs ont jusqu'à trois lancers par tour pour former la meilleure combinaison possible. Chaque combinaison peut être utilisée une seule fois par partie.

### Combinaisons et points :
-   **Total des 1 à 6** : Le joueur marque la somme des dés correspondant au chiffre choisi (1 à 6).
-   **Bonus** : Un bonus de 35 points est accordé si la somme des dés dans les catégories numériques atteint 63 points ou plus.
-   **Chance** : Le joueur additionne tous ses dés, quelle que soit la combinaison.
-   **Petite suite** : Quatre dés consécutifs (points : 30).
-   **Grande suite** : Cinq dés consécutifs (points : 40).
-   **Full** : Trois dés identiques plus deux autres dés identiques (points : 25).
-   **Carré** : Quatre dés identiques (points : somme totale des 5 dés).
-   **Yatzee** : Cinq dés identiques (points : 50).


## 🌐 Liens

- url : [yatzee.fr](https://www.yatzee.fr/)
