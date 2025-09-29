# Développement natif - Démonstration 2 : développer un programme *natif* en C, fiche de suivi


- [Développement natif - Démonstration 2 : développer un programme *natif* en C, fiche de suivi](#développement-natif---démonstration-2--développer-un-programme-natif-en-c-fiche-de-suivi)
  - [Objectifs](#objectifs)
  - [Situation initiale](#situation-initiale)
  - [Qu'est ce qu'une librairie partagée (shared library) ?](#quest-ce-quune-librairie-partagée-shared-library-)
  - [Créer une librairie partagée](#créer-une-librairie-partagée)
  - [Utiliser la librairie dynamique dans son projet](#utiliser-la-librairie-dynamique-dans-son-projet)
    - [Compiler](#compiler)
    - [Linker](#linker)
  - [Conclusion de cette démo](#conclusion-de-cette-démo)


## Objectifs

- Comprendre la phase de *linkage* avec des librairies (fournie par la plateforme ou les nôtres)
- Créer et distribuer sa propre librairie partagée (*shared library*)

## Situation initiale

> On parlera indistinctement de *library*, librairie ou bibliothèque. On parle souvent de librairie en français malgré le fait que la traduction correcte de library soit bibliothèque. Néanmoins, le mot librairie est plus court et c'est un faux ami qui permet de faire la correspondance du concept dans les deux langues. Et puis, une librairie et une bibliothèque proposent toutes les deux des livres à utiliser donc le sens n'est pas totalement perdu.

Nous avons une *library*, du code, `mylib` que nous souhaiterions distribuer. Cette library contient des fonctions et des structures de données *utiles*. Si nous voulons distribuer ce code, nous n'allons distribuer que le header (`mylib.h`) et le binaire, et non le code source de l'implémentation (`mylib.c`), car l'utilisateur n'a pas à la connaître pour s'en servir. Il a seulement besoin de connaître les *déclarations* (l'API de ma library).

Pour cela, je vais donc distribuer aux utilisateur·ices :

- Le header `mylib.h`, pour que l'utilisateur connaisse les signatures des fonctions
- Mon implémentation compilée sous forme de librairie partagée (*shared library*) (`.so`)

<!-- 
Présenter le projet : mylib.h et mylib.c
Glisser un mot sur l'encapsulation en C (forward declaration)
 -->

## Qu'est ce qu'une librairie partagée (shared library) ?

Une librairie partagée est un *fichier objet* (binaire, *code source compilé*). Sous Unix, les shared libraries sont appelées *shared object* (d'où l'extension `.so`), sous Windows elles sont appelées *dynamic link libraries* (ou DLLs, d'où l'extension `.dll`). Cela permet de partager des implémentations sous forme de binaire : fonctions, structures de données, etc.. 

Le code ainsi compilé peut être utilisé *par plusieurs programmes en même temps* (d'où le *shared library*). La librairie partagée est *linkée* de manière dynamique au *run-time* (chargée en mémoire une fois, au moment de l’exécution).

## Créer une librairie partagée

Pour transformer `mylib` en code distribuable, on crée une librairie partagée (ou *shared library*) `libmylib.so`

~~~bash
#Compilation (vers une plateforme cible)
gcc -c mylib.c -o mylib.o
#Création d'une librairie dynamique en liant des fichiers objets (ici un seul)
gcc -shared mylib.o -o libmylib.so
~~~

<!-- 

gcc -Wall -o nom_du_fichier_objet  -c nom_du_fichier_source_C

gcc invoque différents outils en plus du compilateur : l'assembler (GAS Gnu assembler), le linker (ld), le préprocesseur
gcc avec l'option --verbose
gcc main.c mylib.c --verbose
On peut voir: quel assembleur, ou ils chercher les lib ave "include". /usr/lib/stdio.h. Si on cat/grep stdio.h pour printf on voit sa déclaration 
 -->

La librairie partagée `libmylib.so` est crée. Je distribue `mylib.h` et `libmylib.so` aux utilisateurs. Ma librairie partagée *est spécifique à une plateforme* (c'est du code compilé !). Si elle est compilée pour GNU/Linux, elle ne pourra être éxecutée par Windows ou Android par exemple.

## Utiliser la librairie dynamique dans son projet

En tant qu'utilisateur, je récupère une copie de ces deux fichiers (`mylib.h` et `libmylib.so`) pour les utiliser dans mon propre projet (ici `main.c`)

### Compiler

1. Pour pouvoir utiliser la librairie mylib dans mon projet, quelle est la première chose à faire ?
   
<!-- Je dois include le header pour dire au compilateur que les appels de fonctions ou structure de données que j'utilise sont définies quelque part et que je respecte leur signature. -->

~~~c
#include "mylib.h"
~~~

Je compile mon projet, cela me crée un *object file* `myapp.o`

~~~bash
gcc -o myapp.o -c main.c
~~~

### Linker

Le binaire `main.o` n'est pas encore executable car il contient des *références* vers des libraires : `mylib` (`struct Foo`, `createFoo`, `destroyFoo`) et `stdio.h` (`printf`). Inclure le header a permis de fournir des déclarations, donc lors de la phase de compilation, le compilateur a seulement vérifier que les fonctions et structures existaient et avaient la bonne signature. 

Le fichier objet contient encore ses références, elles doivent à présent être remplacées par le code source (du binaire) pour fabriquer l'executable. C'est l'étape de linkage (*linking*). 

2. Ouvrir le fichier `myapp.o`. Que remarque-t-on ? Que reste-il à faire pour produire l'executable ?

<!-- Si on ouvre le fichier `main.o`, on voit qu'il contient du binaire incompréhensible par l'éditeur de texte. On retrouve les références : `main`, `createFoo`, `printf`, `destroyFoo`. Le linker doit à présent remplacer ces références par le code source. -->

> Le système a des moyens (il est configuré pour) pour trouver tout seul où se trouve la librairie compilée de `stdio.h` (le binaire s'appelle `libc.so`). Mon executable sera linké de manière dynamique par le linker au binaire de `printf` (qu'il sait trouver) qui sera chargé en mémoire.

Il faut donc ici seulement linker le fichier objet `main.o` avec la librairie dynamique `libmylib.so`

~~~bash
#Création de l’exécutable main avec linkage dynamique vers la librairie. Plusieurs options
##Option 1
gcc -L$(pwd) main.o -lmylib -o myapp -Wl,-rpath,$(pwd)
##Option 2 (s'assurer qu'/usr/local/lib est sur LD_LIBRARY_PATH)
sudo cp libmylib.so /usr/local/lib/
gcc -L$(pwd) main.o -lmylib -o myapp
~~~

Executer

~~~bash
./myapp
~~~

<!-- 
Le binaire de la librairie mylib est appelé dynamiqueent au runtime. Il est chargé une fois en mémoire pour tous mes programmes, et seulement les parties utilisées (appelées). Au top !
 -->

<!-- 

export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/usr/local/lib

-Wl,-rpath,$(pwd) : pour passer des options directement au linker (ld), ici le path de la lib qui sera embed directement dans l'executable, mais c'est pas terrible. On préferera placer la lib dans /usr/lib ou usr/local/lib

On indique au linker le répertoire où trouver la lib avec -L (library path) et le nom de la lib avec -l (nom librairie). 

gcc --help pour voir les options
 -->

3. **Écrire** un `Makefile` pour automatiser la compilation de la librairie partagée `mylib` et la compilation de mon programme `myapp` qui utilise cette librairie.

> Pour écrire un Makefile, commencez par vous demander quelle est la cible (fichier à construire), de quoi dépend-il et enfin comment le construire.

> En situation réelle, on séparerait ces deux phases de build dans deux Makefile séparés. Chaque projet (la librairie et l'application) aurait son Makefile et son *dépôt*.


4. Exécutez deux fois d'affilée la règle pour construire la librairie. Que remarquez-vous ?

<!-- 
Make only rebuilds a target if the target does not exist, or the target is older than one of its dependencies
 -->

5. Modifier le code source de la librairie et ajouter une fonction `substract` qui calcule la différence entre deux structures `Foo`. Ré-executer le programme `myapp`.
6. Supposons que je souhaite utiliser `mylib` (`mylib.h` et `mylib.so`) sur Windows. Puis-je l'utiliser telle quelle ? Pourquoi ? Quelles solutions s'offrent à cet utilisateur pour s'en servir ?

<!-- 
Ici je ne pourrai pas distribuer mylib directement à un user windows, car le format .so n'est pas connu de Windows. Il faudrait qu'il la recompile à partir du code source s'il l'a. Sinon je dois donc fournir les binaires pour sa plateforme (mylib.dll)
 -->

## Conclusion de cette démo

- Le linkage consiste à remplacer les références vers des déclarations de fonctions/variables par l'adresse en mémoire de leur code binaire;
- Le linkage est une étape cruciale pour fabriquer un executable. Il permet d'utiliser les librairies fournies par la plateforme (cela fait partie de son SDK)
- Le processus de linkage est spécifique à chaque OS
- Chaque OS a sa propre API (binary format, system calls et fonctions, etc.) 
- Pour executer un programme issu d'un même code source vers une autre plateforme (par exemple de Linux à Windows), il *faut le recompiler* (ou utiliser une couche logicielle d'émulation comme WINE ou Cygwin) et avoir une partie du SDK en commun

<!-- 

Différence entre OS API et OS SDK:

- An API is a set of functions, protocols, and tools provided by an operating system to allow developers to interact with the underlying system. 
- SDK is a set of tools, libraries, documentation, and samples provided by the OS vendor to assist developers in creating applications for a particular operating system. 

L'idée c'est que vous comprenez pourquoi un programme prévu pour Linux ne va pas marcher sur Windows ou macOs ou Android. C'est vrai pour tous les os, sauf ceux qui ont en commun. Car chaque plateforme à son API (ses libraires, son format d'éxecutable, ses fonctions stysteme, etc.). Donc lorsque l'on compile un programme pour en faire un binaire, *on vise une plateforme*. La phase de linkage est par exemple une phase qui va être propre à chaque plateforme. Pour cette raison que Linux n'a toujours pas gagné sur Dekstop, car la distribution d'application ( de binaires) sur Linux est en enfer : chaque distribution a ses libs dans une certaine version et ses propres paths (important pour le linkage). Distribuer sur Linux c'est plutot distribuer pour fedoravX.Y, debianX.Y, etc. un bordel ! D'ou les initiatives comme AppImage, Flatpak ou snap qui sont des conteneurs d'apps linux (bin+deps+path) pour regler le pb. Sinon il ya  la compilation statique mais ca scale mal (binaire embarque ses deps, taille binaire enorme, si modif d'une lib il faut tout recompiler !!)
Voilà, l'idée que vous devez retenir c'est que derrière chaque executable (binaire), il y a énormément de choses spécifique à chaque système.
 -->

<!--

Notes

The process of linking, which involves combining object files and libraries to create an executable program or shared library, is handled differently by different operating systems.

-- Shared library

In C, a shared library is a compiled binary file that contains code and data that can be used by multiple programs at the same time. It provides a way to share functions, variables, and other resources among different programs.

Shared libraries are also known as dynamic link libraries (DLLs) on Windows or shared objects (SO) on Unix/Linux systems.

Here are some key points about shared libraries:

Code Reusability: Shared libraries enable code reusability by allowing multiple programs to use the same set of functions and resources. This reduces duplication and makes maintenance easier.

Dynamic Linking: Unlike static libraries that are linked directly into the executable at compile-time, shared libraries are linked dynamically at runtime. This means that the library code is loaded into memory only when needed, reducing the size of the executable.

Efficiency: Shared libraries are loaded into memory once and can be shared by multiple processes simultaneously. This saves memory compared to having multiple copies of the same library code in each executable.

Versioning: Shared libraries support versioning, allowing developers to update the library without breaking compatibility with existing programs. Different versions of the library can coexist on the system, and programs can specify which version they require.

To use a shared library in your C program, you typically need to include its header file that defines the functions and data structures provided by the library. Then, during compilation, you need to link your program against the shared library using the appropriate linker flags.

At runtime, the operating system loader is responsible for locating and loading the shared library into the memory space of the program. Your program can then access the library's functions and resources through function pointers or by linking them directly.


-- Static library

In C, a static library is a collection of object code that is linked directly into an executable at compile-time. It contains pre-compiled functions, variables, and other resources that can be used by a program.

Here are some key points about static libraries:

Code Reusability: Static libraries allow developers to reuse common code across multiple programs. By statically linking the library into an executable, the functions and resources from the library become part of the final binary.

Linking at Compile-Time: Unlike shared libraries, which are linked dynamically at runtime, static libraries are linked directly into the executable during the compilation process. This means that all the necessary library code becomes part of the final executable, resulting in a standalone binary.

Independence: When using a static library, the executable becomes self-contained and does not rely on external library files. This makes it easier to distribute and deploy the program because all the required code is bundled within the executable itself.

Efficiency: Since the library code is included directly in the executable, there is no need for the overhead of loading and resolving symbols at runtime. This can result in slightly faster execution times compared to using shared libraries.

To use a static library in your C program, you typically need to include its header file(s) that define the functions and data structures provided by the library. During compilation, you need to specify the linker flags to indicate the path to the static library file and link it against your program.

Static libraries have the advantage of simplicity and portability since they do not require the presence of external dependencies at runtime. However, they may result in larger file sizes and lack the flexibility of shared libraries when it comes to updating and versioning.


-- ABI (Application Binary Interface)

L’ABI est la 'compilation' des conventions d’interface binaire : comment passer les arguments, comment retourner les valeurs, comment sont alignées les structures, etc.

Tant que le programme et la librairie partagée respectent la même ABI, le linker dynamique peut connecter les appels aux fonctions sans recompilation et sans risque de crash dû à des incompatibilités binaires.

Si l’ABI change (par exemple, ajout d’un champ dans une struct ou modification de la convention d’appel), un binaire existant peut casser même si le .so est présent.

Linus insiste sur le principe : “don’t break user space !!!!”. En pratique, cela signifie : ne jamais modifier l’ABI d’un composant déjà utilisé par des programmes existants. Une librairie partagée ou le kernel doivent rester compatibles binaires avec tous les programmes compilés précédemment, sinon ces programmes plantent au runtime. C’est pour ça que les évolutions doivent :

- Ajouter des fonctions sans changer celles existantes,
- Ajouter des champs à la fin des structures ou via des mécanismes de versioning,
- Utiliser des flags ou structures d’extension plutôt que de modifier les conventions d’appel.

 -->
