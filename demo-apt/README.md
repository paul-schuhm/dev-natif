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
    - [Procédure manuelle](#procédure-manuelle)
    - [Alternatives](#alternatives)
      - [Faire évoluer la version depuis un tag git dans une pipeline CI/CD](#faire-évoluer-la-version-depuis-un-tag-git-dans-une-pipeline-cicd)
  - [Scripts de maintenance](#scripts-de-maintenance)
  - [Distribution de releases et mises à jour via un dépôt Debian](#distribution-de-releases-et-mises-à-jour-via-un-dépôt-debian)
    - [Créer le dépôt Debian](#créer-le-dépôt-debian)
    - [Exposer le dépôt publié](#exposer-le-dépôt-publié)
    - [Utiliser le dépôt (point de vue user)](#utiliser-le-dépôt-point-de-vue-user)
    - [Mettre à jour la distribution](#mettre-à-jour-la-distribution)
      - [Côté distributeur](#côté-distributeur)
      - [Côté client](#côté-client)
  - [Références utiles](#références-utiles)


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

Notre application dépend de cURL (libcurl). Il faut installer le paquet libcurl4-openssl-dev : 

~~~bash
sudo apt install libcurl4-openssl-dev
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

### Procédure manuelle

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

### Alternatives 

#### Faire évoluer la version depuis un tag git dans une pipeline CI/CD

1. Sur l'arbre des commits on *tag* un commit contenant la version :

~~~bash
git tag -a 1.0.0 -m "Release version 1.0.0"
~~~

2. On pousse le *tag* sur le dépôt remote :

~~~bash
git push origin 1.1.0
~~~

3. Le tag devient accessible aux autres développeur·euses et à la pipeline CI/CD. Dans une pipeline GitLab/GitHub, la tâche `build` peut être déclenchée sur le *push* d'un *tag*:

~~~yaml
#Exemple de .github/workflows/build.yml
name: Build DEB
on:
  push:
    tags:
      - '*'   # déclenche le build sur le push du tag (récupération de la version et injection dans le process de build)
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

5. Publie le `.deb` sur le dépôt ([voir la suite](#publier-sur-un-dépôt-apt)).

## Scripts de maintenance

> À venir...

## Distribution de releases et mises à jour via un dépôt Debian

On va créer un dépôt pour déployer des paquets à destination des distributions [GNU/Linux Debian](https://www.debian.org/intro/why_debian.fr.html)(Ubuntu), utilisant le gestionnaire d'application `apt`.

On se sert du gestionnaire de dépôts debian [aptly](https://www.aptly.info/).

### Créer le dépôt Debian

> Concrètement, un dépôt debian est "un simple serveur de fichiers statiques", à exposer avec n'importe quel serveur http. On le simule en local ici, directement avec aptly.

**Créer** une clef gpg (clé publique/privée pour signer les paquets). [gpg](https://fr.wikipedia.org/wiki/GNU_Privacy_Guard) (*GNU Privacy Guard*) est le programme dédié à la signature des paquets et la gestion des clefs GPG sur Debian.

~~~bash
#Générer clefs (publique/privé), utiliser les valeurs par défaut ici
gpg --full-generate-key
#Lister les clefs générées sur la machine
gpg --list-keys
~~~

**Créer** un nouveau dépôt apt :

~~~bash
#Lister les dépôts locaux
aptly repo list
#Creer un dépôt local nommé 'myrepo'
aptly repo create myrepo
#Lister les paquets présents dans le dépôt (aucun pour l'instant)
aptly repo show -with-packages myrepo
~~~

> Un repo Debian est comme un dépôt git : espace de travail mutable (staging area). Sert à préparer un ensemble cohérent de paquets à publier.

**Ajouter le paquet** précédemment crée au repo (`make deb`) :

~~~bash
#Ajouter paquet : a la racine du projet d'appli (charger le .deb)
aptly repo add myrepo myapp_1.0.0.deb
#Voir le paquet
aptly repo show -with-packages myrepo
~~~

**Créer un snapshot du repo** :

~~~bash
#Créer un snapshot 'version1' (Ce dépôt local sera la source des snapshots. Versionnement du dépot (commit))
aptly snapshot create version1 from repo myrepo
#Voir le snapshot
aptly snapshot show -with-packages version1
#Lister les snapshots
aptly snapshot list
~~~

> Un snapshot est comme un *commit* : permet de figer une version donnée du dépôt. On ne peut ni ajouter ni supprimer de paquets à un snapshot :

**Crée une publication** du *snapshot* (*publishes snapshot as Debian repository ready to be consumed by apt tools*). Une publication contient plusieurs métadonnées :

- **Prefix** : Chemin de publication dans le répertoire `public/`, l’endroit où sera stocké le dépôt publié (valeur par défaut `.`, sera placé dans `~/.aptly/public/`);
- **Distribution** : Regroupement de paquet (premier niveau). ex: `stable`;
- **Component** : `main` (valeur par défaut si non précisée). Le *component* est le niveau de regroupement juste en dessous de la distribution (ex `deb http://deb.debian.org/debian stable main contrib non-free`), ici `main`, `contrib` et `non-free` sont des *components* de la distribution `stable`. Regrouper des paquets par origine ou politique. Permettre plusieurs sous-ensembles dans une même distribution ;
- **Architecture** : détectées automatiquement depuis le snapshot (ex. amd64).

~~~bash
#Publier le nouveau snapshot sous une distribution 'stable', component 'main'
aptly publish snapshot -distribution="stable" -component="main" version1
~~~

> `publish` crée le repertoire `~/.aptly/public` (racine du dépôt) et toute son arborescence standardisée, ainsi que les paquets à distribuer.

Il faut également penser à mettre à disposition **la clé publique** pour que les utilisateurs du paquet puissent vérifier l'intégrité du paquet (via une procédure de signature numérique).

**Publier** la clef publique (à faire qu'une fois):

~~~bash
#On publie la clef publique (fichier 'gpp') dans le dépôt
gpg --armor --output ~/.aptly/public/gpg --export <ID clef publique généré précédemment>
~~~

### Exposer le dépôt publié

Nous avons un dépôt, il suffit à présent de l’héberger sur un serveur. Ici, on le sert en local avec `aptly` directement :

~~~bash
#Par défaut, exposé sur http://localhost:8080
aptly serve
~~~

> `aptly` utilise la cle publique pour générer les fichiers `Release` (manifeste contenant le hash des livrables) et `Release.gpp` (signature)

> En prod, on doit servir statiquement ce site (`~/.aptly/public`) avec n'importe quel serveur web comme Nginx ou Apache.

Imaginons à présent que ce soit un serveur web, avec l'IP suivante `127.0.0.1:8080`.

### Utiliser le dépôt (point de vue user)

Pour utiliser le dépôt de manière sécurisé (vérification signature) :

- **La clef publique** à GPG pour vérifier la signature (`apt` le fera pour nous) ;
- **L'URL du dépôt** à `apt`, pour qu'il puisse l'ajouter à sa liste de dépôts suivis. 

> Note: le nom de domaine/certificat SSL (serveur hébergeant le dépôt) fait office de CA (confiance)

~~~bash
#Télécharger et nommer et placer la clef auprès de gpg
wget -O- http://127.0.0.1:8080/gpg | sudo gpg --dearmor --yes --output /usr/share/keyrings/dev-natif-demo.gpg
#Ajouter le dépot "private" à notre liste de dépots (en mentionnant la clef dl précédemment)
echo "deb [signed-by=/usr/share/keyrings/dev-natif-demo.gpg] http://127.0.0.1:8080 stable main" | sudo tee /etc/apt/sources.list.d/private.list
~~~

**Lister les dépôts** suivis par apt :

~~~bash
cat /etc/apt/sources.list
cat /etc/apt/sources.list.d/*.list
~~~

**Vérifier** la présence de votre dépôt servi par aptly.

**Mettre à jour** les métadonnées sur les paquets et **installer** l'application:

~~~bash
sudo apt update
sudo apt search myapp
sudo apt install myapp
~~~

### Mettre à jour la distribution

> Quand des nouveaux paquets sont prêts, on créé un nouveau snapshot.

#### Côté distributeur

1. Développer et **créer nouvelle version de notre paquet** (`make deb`), par exemple une version `2.0.0` ;
2. **Ajouter** le paquet au dépôt `myrepo` : `aptly repo add myrepo myapp_2.0.0.deb` ;
3. **Créer un nouveau snapshot** (commit du dépot) `version2` : `aptly snapshot create version2 from repo myrepo`;
4. **Créer une nouvelle publication** : remplace l'ancienne publication par le nouveau snapshot (*switch*) :  `aptly publish switch stable version2`;
5. **Servir la publication** (en local) : `aptly serve`

> Visiter le dépôt : http://localhost:8080/dists/stable/main/binary-amd64/Packages

#### Côté client

**Vérifier** la présence de nouvelles mise à jour :

> `apt` est capable de vérifier la présence de mise à jour pour un paquet en se basant sur le nom du paquet et sa version. Il compare la version actuellement installée avec des versions plus récentes publiées sur le dépôt.

~~~bash
#Mettre à jour la liste des paquets
sudo apt update
#Lister les versions disponibles
sudo apt list -a myapp
#Si des mises à jour sont détectées. 
apt list --upgradable
#Vérifier la version installée
apt list --installed myapp
~~~

**Installer** les mises à jour des paquets:

~~~bash
sudo apt upgrade
#ou juste le paquet
sudo apt install --only-upgrade myapp
~~~

*Et voilà !*

**Nous bénéficions d'un système de distribution et de mises à jour** propre à la plateforme Debian (l'une des distributions GNU/Linux, ou distribution enfant comme Ubuntu, les plus utilisées au monde, notamment du point de vue des serveurs web).

## Références utiles

- [Déploiement d’une application (paquet Debian)](http://tvaira.free.fr/projets/activites/activite-mo-paquet.html), de Thierry Vaira
- [Les bases du système de gestion des paquets Debian](https://www.debian.org/doc/manuals/debian-faq/pkg-basics.fr.html), documentation officielle (format paquet, scripts de maintenance)
- [Gestion des paquets avec apt](https://debian-facile.org/doc:systeme:apt:apt), documentation de base sur la gestion des paquets avec Debian;
- [Qu'est ce que le système apt ?](https://www.debian.org/doc/manuals/aptitude/pr01s03.fr.html)
- [Outils de gestion des paquets Debian](https://www.debian.org/doc/manuals/debian-faq/pkgtools.fr.html), documentation officielle Debian;
- [Dépôt debian](https://wiki.debian.org/fr/DebianRepository), définition, utilisation d'un dépôt Debian, documentation officielle;
- [aptly](https://www.aptly.info/), gestionnaire de dépôts Debian;
- Programme [gpg](https://gnupg.org/), Gnu Privacy Guard. Programme implémentant le standard [OpenGPG](https://www.ietf.org/rfc/rfc4880.txt) définissant le chiffrement des données et des communications. Utilisé ici pour signer les paquets, gérer la clé publique et vérifier la signature des paquets (invoqué par `apt` pour vérifier la signature)