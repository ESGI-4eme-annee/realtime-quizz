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


Melvin Courant (MelvinCourant):
- mise en place des notifications en temps réel durant le quizz
- sauvegarde du score des joueurs dans la base de données et historique
- style de l'application avec Tailwind CSS et Daisy UI

Défis rencontrés :
J'ai eu pas mal de difficultés concernant la sauvegarde des scores des joueurs dans la base de données, mais j'ai finalement réussi à trouver une solution.

Ayant réalisé pas mal le style de l'application, j'ai pu apprendre à utiliser Tailwind CSS et Daisy UI, ce qui a été un gain de temps considérable pour le peu de temps que nous avions.
J'ai également pu apprendre à utiliser SocketIo, ce qui m'a permis de comprendre comment fonctionne la communication en temps réel entre le serveur et les clients.


Alexandre Vauthier (alvauthier) :
Ma partie était sur la fonctionnalité de chat en temps réel lors d'un quiz.
J'ai porté un soin particulier au fait que l'envoi et la réception de messages soient instantanés, et que les messages soient bien envoyés dans les bonnes rooms.
Le chat permet de voir l'email de chaque utilisateur ayant envoyé un message, ainsi que l'heure d'envoi du message.
Les couleurs permettent facilement d'identifier ses messages afin de les dissocier des messages des autres utilisateurs.
J'ai ajouté un système anti-triche, qui bloque l'utilisateur lorsqu'il tente de saisir un message contenant une des réponses possibles lors d'une question. Il reçoit ainsi un avertissement dans le chat.
J'ai pensé également à empêcher l'utilisateur de donner la bonne réponse aux autres d'une autre façon, comme par exemple en indiquant la place de la bonne réponse, que ce soit en chiffre ou en lettre, ou bien en décomposant les lettres de la bonne réponse.
Si l'utilisateur tente de tricher une seconde fois, après le premier avertissement, l'utilisateur est banni pendant 5 secondes du chat.

J'ai rencontré une petite difficulté au début de mon travail sur cette fonctionnalité. En effet, je pensais avoir tout bien mis dans mon back et mon front pour qu'on puisse correctement envoyer le message et bien le réceptionner sur notre serveur pour qu'il puisse le renvoyer aux utilisateurs présents dans la room du quiz, mais cela ne fonctionnait pas. J'ai par la suite compris qu'il fallait passer par le SocketContext, et en adaptant ce que j'avais déjà développé mon chat fonctionnait correctement.
Ce projet m'a aidé à apprendre encore plus l'utilisation de Socket.io.