//Processus node.js (main)

const { app, BrowserWindow, ipcMain, utilityProcess } = require("electron");
const path = require("path");

const createWindow = () => {
  //Reference vers la fenetre (processus renderer)
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      //Injecter les scripts preload
      preload: path.join(__dirname, "preload.js"),
    },
  });

  ipcMain.handle("btn:start-heavy-process", async () => {
    console.log("(main) spawn process");
    //Démarrer un processus enfant pour un traitement long
    try {
      const result = await runHeavyProcess();
      return result;
    } catch (e) {}
  });

  win.loadFile("index.html");
};

async function runHeavyProcess() {
  return new Promise((resolve, reject) => {
    //Lancer le processus enfant
    const child = utilityProcess.fork(path.join(__dirname, "heavy.js"), [], {
      serviceName: "heavy process",
      //Configuration i/o service (entrée standard, sortie standard, sortie error)
      stdio: ["ignore", "pipe", "pipe"],
    });

    //Réagir au démarrage du processus
    child.on("spawn", () => {
      console.log(`Utility process PID ${child.pid}`);
    });

    //Gestion d'erreur dans le process (processus écrit sur stderr)
    child.on("error", (error) => {
      console.log(error);
      reject(error);
    });

    //Stocke résultat (écrit par 'bout' sur la sortie standard du processus enfant)
    let result = "";
    //Récupérer les données (resultat du processus : stream => écriture sur la sortie standard)
    child.stdout.on("data", (data) => {
      //Plusieurs manières de gérer le stram (la + simple)
      result += data.toString();
    });

    //Processus va se terminer, résoud la promesse.
    child.on("exit", (code) => {
      //code égal à 0 : tout s'est bien passé. N'importe quel autre nombre : erreur (convention)
      if (code === 0) {
        //Cas réussi
        console.log("Processus terminé avec succès");
        resolve(result);
      } else {
        //Cas erreur
        console.log("Processus a rencontré une erreur");
        //reject
        reject(new Error("Une erreur est survenue"));
      }
    });
  });
}

app.whenReady().then(() => {
  createWindow();
});
