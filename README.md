# Transcendence

Projet final du tronc commun de 42
Ce projet est centré sur la conception, le développement et l'organisation d'une application Web full-stack.

Il se décompose en plusieurs micro-service gérant chacun une tâche spécifique:

## Auth

Gère l'authentification du client, et permet de se connecter au choix avec un compte Google, un compte 42 ou tout simplement avec un nom d'utilisateur et un mot de passe.
A2f est aussi gérer dans ce service.

## Gateway

Filtre et enrichi toutes les requêtes à destination du backend.

## Matchmaking

Point de passage de tous les client voulant rejoindre une partie, le matchmaking se charge de la création des parties ainsi que de la communication entre les clients et le service Game.

## Game 

S'occupe de tous les calculs relatifs à une partie de Pong : les rebonds de la balle, les déplacements des pads, le changement du score ...

## AI

AI algorithmique interagisant avec le jeu de la même manière qu'un joueur à l'exception près qu'elle ne peut voir l'état de la partie qu'une fois par seconde.

## NGINX

Possède les fichiers de configuration de nginx ainsi que tous les fichiers utilisé dans le Front.

## Tournament 

Systéme de tournoi pour 4 ou 8 joueurs passant par Matchmaking pour lancer les parties de tournoi.

## Users-status

Sauvegarde l'état de connexion de tous les utilisateurs en fonction de si ils sont en ligne, hors ligne ou en partie.

## Users

Stocke tous les informations des utilisateurs dans une base de donnée et posséde un systeme de liste d'amis entre les utilisateurs.



Transcendence est un projet de groupe que nous avons réalisé à 4 et personnelement j'ai travaillé presque exclusivement sur les services Matchmaking, Game, AI et Users-status.

![image](https://github.com/user-attachments/assets/af276d2f-eec8-490c-8d95-5e4bd404720d)<!-- Statistiques WakaTime -->
[![wakatime](https://wakatime.com/badge/user/8d356c6a-24fa-43c2-b603-a5b11f187735/project/1b1d51ea-fd78-497d-b113-f09333a444fc.svg)](https://wakatime.com/badge/user/8d356c6a-24fa-43c2-b603-a5b11f187735/project/1b1d51ea-fd78-497d-b113-f09333a444fc)
