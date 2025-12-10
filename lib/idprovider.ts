import { batch } from "./range";

let currentId = 0;
let maxId = -1;

export async function getNextId(): Promise<number> {
  
  if (currentId > maxId) {
    console.log("new batch");
    
    
    const newBatch = await batch(); 

    
    currentId = newBatch.start;
    maxId = newBatch.end;
  }

  const idToGive = currentId;
  currentId = currentId + 1;

  return idToGive;
}