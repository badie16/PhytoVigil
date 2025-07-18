
// Ce fichier sert uniquement à "tromper" l'IDE pour qu'il comprenne la structure.
// Le compilateur d'Expo l'ignorera et choisira le fichier .native ou .web.

// On importe l'instance depuis le fichier .native pour servir de référence à l'IDE.
// Cela active l'autocomplétion et la vérification des types dans l'éditeur.
import { databaseService } from './databaseService.native';

// On ré-exporte l'instance pour que les autres fichiers puissent l'importer sans erreur.
export { databaseService };