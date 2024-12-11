# Distribution de releases et mises à jour via un dépôt Debian

Dans cette démo, on va créer un dépôt pour déployer des paquets à destination des distributions [GNU/Linux Debian](https://www.debian.org/intro/why_debian.fr.html)(Ubuntu), utilisant le gestionnaire d'application apt.

On se sert du gestionnaire de dépôts debian [aptly](https://www.aptly.info/).


- [Distribution de releases et mises à jour via un dépôt Debian](#distribution-de-releases-et-mises-à-jour-via-un-dépôt-debian)
  - [Créer le dépôt debian](#créer-le-dépôt-debian)
      - [Exposer le serveur](#exposer-le-serveur)
  - [Utiliser le dépôt (point de vue user)](#utiliser-le-dépôt-point-de-vue-user)
  - [Mettre à jour la distribution](#mettre-à-jour-la-distribution)
    - [Côté publisher](#côté-publisher)
    - [Côté user](#côté-user)
  - [Références utiles](#références-utiles)


## Créer le dépôt debian

> Concrètement, un dépôt debian est "un simple serveur de fichiers statiques", à exposer avec n'importe quel serveur http. On le simule en local ici, directement avec aptly.

Créer une clef gpg (clé publique/privée pour signer les paquets). [gpg](https://fr.wikipedia.org/wiki/GNU_Privacy_Guard) (*GNU Privacy Guard*) est le programme dédié à la signature des paquets et la gestion des clefs GPG sur Debian.

~~~bash
#Générer clefs, utiliser les valeurs par défaut ici
gpg --full-generate-key
gpg --list-keys
~~~

~~~bash
#Creer un dépôt local nommé 'stable'
aptly repo create stable
#Lister les paquets présents dans le dépôt (aucun pour l'instant)
aptly repo show -with-packages stable
~~~

Créer une nouvelle release avec un nouveau numéro de version. Avec Electron, `npm run make`.

~~~bash
#Ajouter paquet : a la racine du projet d'appli (charger le .deb)
aptly repo add stable out/make/deb/x64/
#Voir le paquet
aptly repo show -with-packages stable
#Créer un snapshot 'version1' (Ce dépôt local sera la source des snapshots. Versionnement du dépot (commit))
aptly snapshot create version1 from repo stable
#Voir le snapshot
aptly snapshot show -with-packages version1
#Lister les snapshots
aptly snapshot list
~~~

Il faut également penser à mettre à disposition la clé publique pour que les utilisateurs du paquet puissent vérifier son intégrité et l'authenticité de son publisher.

Publier la clef publique (à faire qu'une fois):

~~~bash
#On publie la clef publique dans le site web servir par aptly en local
gpg --armor --output ~/.aptly/public/gpg --export <votre clef publique>
~~~

Publier le snapshot:

~~~bash
#Publier le nouveau snapshot sous une distribution 'stable'
aptly publish snapshot -distribution="stable" version1
~~~


#### Exposer le serveur

Nous avons un dépôt, il suffit à présent de l'heberger sur un serveur. Ici, on le sert en local avec `aptly` directement :

~~~bash
#Par défaut, exposé sur http://localhost:8080
aptly serve
~~~

> En prod, on doit servir statiquement ce site (`~/.aptly/public`) avec n'importe quel serveur web comme Nginx ou Apache.

Imaginons à présent que ce soit un serveur web, avec l'IP suivante `127.0.0.1:8080`.

## Utiliser le dépôt (point de vue user)

Il faut que j'ajoute:

- **La clef publique** a gpg pour vérifier la signature (`apt` le fera pour nous) ;
- **L'url du dépot à ma liste de depots** debian pour le gestionnaire de paquets `apt`. 

> Note: le nom de domaine/certificat SSL (serveur hebergeant le dépôt) fait office de CA (confiance)

~~~bash
#Télécharger et nommer et placer la clef auprès de gpg
wget -O- http://127.0.0.1:8080/gpg | sudo gpg --dearmor --yes --output /usr/share/keyrings/dev-natif-demo.gpg
#Ajouter le dépot à notre liste de dépots (en mentionnant la clef dl précédemment)
echo "deb [signed-by=/usr/share/keyrings/dev-natif-demo.gpg] http://127.0.0.1:8080 stable main" | sudo tee /etc/apt/sources.list.d/private.list
~~~

Mettre à jour les métadonnées sur les paquets et installer l'application:

~~~bash
sudo apt update
sudo apt install <nom de votre application sur le dépot>
~~~

## Mettre à jour la distribution

> Quand des nouveaux paquets sont prêts, on cree un nouveau snapshot.


### Côté publisher

1. Dev, publie nouvelle version de notre paquet (*make* avec *forge*) ;
2. On ajoute le paquet au depot ;
3. Publie un nouveau snapshot (commit du dépot) `version2` ;
4. Publie nouvelle version : remplace l'ancienne par le nouveau snapshot (*switch*) : 

~~~bash
`aptly publish switch stable version2`
~~~
5. Servir (en local) : `aptly serve`

### Côté user

Vérifier la présence de nouvelles mise à jour :

> apt est capable de vérifier la présence de mise à jour pour un paquet en se basant sur le nom du paquet et sa version. Il compare la version actuellement installée avec des versions plus récentes publiées sur le dépôt.

~~~bash
sudo apt update
#Si des mises à jour sont détectées
apt list --upgradable
~~~

Installer les mises à jour des paquets:

~~~bash
sudo apt upgrade
~~~

Et voilà !

**Nous bénéficions d'un système de distribution et de mises à jour natif**, propre à la plateforme Debian (l'une des distributions GNU/Linux (ou distribution enfant comme Uubuntu) les plus utilisées au monde, notamment du point de vue des serveurs web)

## Références utiles

- [Gestion des paquets avec apt](https://debian-facile.org/doc:systeme:apt:apt), documentation de base sur la gestion des paquets avec Debian;
- [Qu'est ce que le système apt ? ](https://www.debian.org/doc/manuals/aptitude/pr01s03.fr.html)
- [Outils de gestion des paquets Debian](https://www.debian.org/doc/manuals/debian-faq/pkgtools.fr.html), documentation oficielle Debian
- [Dépôt debian](https://wiki.debian.org/fr/DebianRepository), définition, utilisation d'un dépôt debian, documentation officielle
- [aptly](https://www.aptly.info/), gestionnaire de dépôts debian
- [gpg](https://gnupg.org/), Gnu Privacy Guard. Programme implémentant le standard [OpenGPG](https://www.ietf.org/rfc/rfc4880.txt) définissant le chiffrement des données et des communications. Utilisé ici pour signer les paquets, gérer la clé publique et vérifier la signature des paquets (invoqué par apt pour vérifier la signature)