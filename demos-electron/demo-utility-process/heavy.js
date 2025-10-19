/**
 * Executer ce code dans le processus enfant
 * Simuler un traitement long (traitement d'image, calcul, batch processing, etc.)
 * Processus node
 */

//Transmettre des données === écrire sur la sortie standard

setTimeout(() => {
  //Ecrire le résultat sur la sortie standard sous forme de chaine de caractères (données communiquées entre processus sont du texte !)
  const res = "Resultat : " + Math.round(Math.random() * 100);
  process.stdout.write(res);
  //Terminer le processus avec un code égal à 0
  process.exit(0);
}, 2 * 1000);
