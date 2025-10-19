# Don't break user space !

1. **Modifier** l'ABI (*Application Binary Interface*). Par exemple : 
- Modifier une signature de fonction
- Supprimer une fonction publique
- Changer la taille d'un type opaque (si client utilise sizeof(Widget))
- Ajouter un champ au début ou au milieu d'une struct publique (décalage mémoire)
2. **Recompiler** la lib partagée. 
3. **Executer** l'app (user). Erreur !

Solution : Modifier et recompiler l'app !

Le *Semantic Versioning* va nous aider à se protéger contre ce genre d'erreurs. On va définir des versions de la lib (par exemple `libwidget.so.1.0.0`) et l'user pourra choisir sa version pour son application sans craindre d'avoir une rupture d'ABI en mettant à jour son système et ses libs.

> "If it's a bug that people rely on, it's not a bug, it's a feature !" ([Linus Torvalds, defconf14](https://www.youtube.com/watch?v=5PmHRSeA2c8&t=601s))
> [WE DO NOT BREAK USERSPACE](https://linuxreviews.org/WE_DO_NOT_BREAK_USERSPACE) (Linus Torvalds)