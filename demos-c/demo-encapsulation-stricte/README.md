# Démo : encapsulation stricte avec les void pointers

La démo montre l'intérêt de l'encapsulation stricte via les void*. Un module 'car' fournit un service pour manipuler des modèles de voiture. L'usage du module est montré dans le main.

## Compile

cc -c car.c
cc main.c car.o -o program

## Remarques

L’utilisation de pointeurs void* permet une encapsulation stricte des données et des fonctions en C. L’utilisateur n’a accès qu’aux définitions exposées dans le module car (car.h) et ne peut ni consulter ni modifier directement les objets fournis (on ne peut pas déférencer un void* !), dont la structure interne reste complètement cachée. Cette approche garantit une abstraction totale de l’implémentation tout en fournissant une API claire, sûre et stable pour les utilisateurs.
