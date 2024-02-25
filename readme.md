### How to start the project
1. Clone the repository
2. docker compose up in the root directory

### Contribution

Nicolas CAPELLA (xxcolas):
Workflow quizz
- notification timer avant de commencer le quizz
- notification timer pour la question en cours
- passage automatique des questions
- sauvegarde automatique des réponses
- verrouillage des réponses a la fin du temps imparti
- sauvegarde des questions/scores pour le classement
- modification du temps imparti: +/- 10s par l'admin
- affichage des scores pour les joueurs à la fin du quizz

Docker compose
- back
- front
- db

J'ai beaucoup réfléchi au processus du quiz, cherchant à le rendre très agréable pour l'expérience utilisateur sans compromettre la qualité du code.
Ce projet m'a beaucoup plu car j'ai appris énormément sur les sockets et le temps réel en général. 
Intégrer Tailwind à notre projet m'a permis de développer rapidement la partie front-end. 
De plus, avec l'aide de Daisy UI, la création de composants s'est déroulée très rapidement.
Dans l'ensemble, ce projet était très intéressant et m'a permis d'acquérir de nouvelles compétences que je pourrai ensuite intégrer dans d'autres projets.



Benoît De Carli (Benoitapps)

Pour ma partie, j'ai dû réaliser plusieurs choses, listées ci-dessous :

- Un formulaire simple pour que les administrateurs puissent créer et gérer des quiz.
- La capacité d'ajouter des questions à choix multiples avec des options et de désigner la bonne réponse.
- Établissement de connexions WebSocket entre le serveur et les clients pour une communication
bidirectionnelle.
- Diffusion des questions et réception des réponses en temps réel.
- Mécanisme permettant aux utilisateurs de participer à un quiz en utilisant un identifiant unique pour la
session.
- Support pour plusieurs salles où différents quiz peuvent se dérouler simultanément.
- Collecte des réponses des clients et verrouillage des réponses à la fin du temps imparti.
- Un retour immédiat aux clients après chaque question, indiquant si leur réponse était correcte ou non.
- Affichage en temps réel du nombre de clients ayant choisi chaque option de réponse.
- Calcul des scores côté serveur basé sur la justesse
- Synchronisation des états de jeu : Assurer que tous les clients reçoivent les mises à jour d'état en temps
réel

Bonus : 
- Intégration avec une base de données pour stocker les données de quizz
- Différents niveaux d'accès pour les participants au quiz et les administrateurs.
- Fonctionnalités pour gérer les salles, comme la protection par mot de passe ou les limites d'utilisateurs.
- Mise à jour et affichage continue des classements des utilisateurs en fonction des scores tout au long du quiz
- ajout d'une limites de temps(pour les questions)lors de la creation du quizz

Défis rencontrés :
Il a été assez compliqué d'initialiser les websockets étant donné que le projet a été réalisé sous Node.js et React.js, alors que durant les cours, nous étions sur d'autres langages.
De plus, la bonne gestion des salles tout en tenant compte des rôles, ainsi que la possibilité d'ouvrir plusieurs salles en même temps, ont demandé une petite réflexion. Enfin, la gestion des scores en temps réel a aussi été un peu compliquée à gérer.
