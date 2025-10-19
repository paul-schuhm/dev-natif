# Démo - Application à déployer sur une machine Debian

- [Démo - Application à déployer sur une machine Debian](#démo---application-à-déployer-sur-une-machine-debian)
  - [Objectifs](#objectifs)
  - [Structure du projet de départ](#structure-du-projet-de-départ)
  - [Application](#application)
  - [Versionement](#versionement)
    - [Alternatives possibles](#alternatives-possibles)
      - [Placer la version directement dans les sources](#placer-la-version-directement-dans-les-sources)
      - [Récupérer la version depuis une autre source (git tag, etc.)](#récupérer-la-version-depuis-une-autre-source-git-tag-etc)
  - [Build](#build)
  - [Tester l'application localement](#tester-lapplication-localement)
  - [Faire évoluer la version](#faire-évoluer-la-version)
  - [Alternative : Faire évoluer depuis un tag git dans une pipeline CI/CD](#alternative--faire-évoluer-depuis-un-tag-git-dans-une-pipeline-cicd)
  - [Scripts de maintenance](#scripts-de-maintenance)


## Objectifs

Savoir développer, compiler et distribuer de manière sécurisée une application versionnée pour une distribution GNU/Linux (Debian).

- Savoir **gérer correctement le versionnement** de son livrable;
- Savoir **créer un paquet pour une plateforme** (`.deb` ici);
- Savoir **utiliser un dépôt** de paquets et y **publier** un paquet;
- Savoir **signer un paquet**;

## Structure du projet de départ

~~~bash
myapp/
├── src/
│   └── main.c
├── VERSION
├── Makefile
├── debian/
│   ├── control
│   ├── postinst
│   └── rules
~~~

[Récupérer le projet de départ]()

## Application

Une application cliente (source [main.c](./src/main.c)) de l'API de Github, qui dépend de cURL.

## Versionement

Le versionement de l'app est centralisé dans un simple fichier `VERSION` placé à la racine du projet, avec le contenu suivant :

~~~
1.0.0
~~~

La version est récupérée au moment de la compilation, réalisée *via* le `Makefile` :

~~~makefile
VERSION := $(shell cat VERSION)
~~~

### Alternatives possibles

#### Placer la version directement dans les sources

La version est gérée ici **manuellement** directement **dans les sources** sous la forme de macros : 

~~~C
#include <stdio.h>

/*Remarque : Généralement placé dans un header séparé*/
#define VERSION_MAJOR 1
#define VERSION_MINOR 0
#define VERSION_PATCH 0

/*Explication : chaîne l'argument sans l'évaluer pour transformer 
les valeurs entières en chaîne de caractères, prêtes à être concaténées*/
#define STRINGIFY0(s) #s
#define STRINGIFY(s) STRINGIFY0(s)

#define VERSION STRINGIFY(VERSION_MAJOR) "." STRINGIFY(VERSION_MINOR) "." STRINGIFY(VERSION_PATCH)

int main(void)
{
    /*....*/
    printf("Version: '%s'\n", VERSION);
}
~~~

> La version est ainsi présente à la fois dans le binaire et dans le code. **Ce qui est important c'est qu'il y ait une SEULE SOURCE DE VERITÉ pour la version**, peu importe son emplacement. Cela dépend si l'on a besoin que la version soit présente dans le binaire et/ou seulement dans les sources.


#### Récupérer la version depuis une autre source (git tag, etc.)

La démarche reste la même, il est possible de récupérer la version depuis un tag git, etc. en la passant directement au compilateur GCC [via une macro](https://gcc.gnu.org/onlinedocs/gcc/Preprocessor-Options.html) (`-D` flag):

~~~C
#include <stdio.h>

int main(int argc, char **argv) {
    /*....*/
    printf("Software Version: %s\n", VERSION);
}
~~~

Puis à la compilation :

~~~
gcc -DVERSION='"1.0.0"' main.c
~~~


## Build

On écrit un `Makefile` pour scripter le build. Compiler et créer le paquet `.deb` :

~~~bash
make clean
make deb
#Tester : lire les métadonnées du paquet
dpkg-deb -I myapp_1.0.0.deb
~~~

## Tester l'application localement

Installer le paquet avec [le gestionnaire de paquets (bas niveau) `dpkg`](https://doc.ubuntu-fr.org/dpkg) ou `apt`:

~~~bash
#dpkg ne résoud par les deps
sudo dpkg -i myapp_1.0.0.deb
#apt résoud les deps et propose de les installer
sudo apt install ./myapp_1.1.0.deb
#afficher les dépendances
apt-cache depends myapp
#Executer
myapp
#Désinstaller
sudo apt remove myapp
~~~

## Faire évoluer la version

On imagine que l'application évolue. On utilise [le versionnement sémantique](https://semver.org) pour documenter les changements dans le numéro de version :

- Changement mineur :

~~~bash
echo 1.1.0 > VERSION
make deb
sudo dpkg -i myapp_1.1.0.deb
myapp
~~~

- Changement majeur :

~~~bash
echo 2.0.0 > VERSION
make deb
sudo dpkg -i myapp_2.0.0.deb
~~~

## Alternative : Faire évoluer depuis un tag git dans une pipeline CI/CD

1. Sur l'arbre des commits on tag un commit contenant la version :

~~~bash
git tag -a 1.0.0 -m "Release version 1.0.0"
~~~

2. On pousse le tag :

~~~bash
git push origin 1.1.0
~~~

3. Le tag devient accessible aux autres développeur·euses et à la pipeline CI/CD. Dans une pipeline GitLab/GitHub, la tâche `build` peut être par exemple déclenchée sur le *push* d'un *tag*:

~~~yaml
#Exemple de .github/workflows/build.yml
name: Build DEB
on:
  push:
    tags:
      - '*'   # déclenche sur **tout tag** poussé
~~~

La tâche de `build` prend le relai :

4. Elle met à jour le fichier `VERSION` automatiquement via un le dernier tag git et crée le paquet `.deb` :

~~~bash
#Principe
#Retourne le tag le plus récent qui précède le commit actuel
git describe --tags --abbrev=0 > VERSION
#Build avec la nouvelle version issue du tag
make deb
~~~

6. Publie le `.deb` sur le dépôt ([voir la suite](#publier-sur-un-dépôt-apt)).

## Scripts de maintenance

> À venir...