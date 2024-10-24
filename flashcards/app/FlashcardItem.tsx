"use client"; // Adiciona essa linha no topo para marcar o componente como Client Component

import { useState } from "react";

function FlashcardItem({ flashcard }: { flashcard: any }) {
  const [isFront, setIsFront] = useState(true);

  const toggleFlashcard = () => {
    setIsFront(!isFront);
  };

  return (
    <div className="m-1.5 block max-w-sm p-6 bg-emerald-300 border border-gray-200 rounded-lg shadow hover:bg-emerald-200 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 cursor-pointer" onClick={toggleFlashcard}>

      {isFront ? <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{flashcard['front']}</h5>
      : <p className="font-normal text-gray-700 dark:text-gray-400">{flashcard['back']}</p>}
      <div className="flex flex-wrap space-x-2">
        {flashcard['tags'].map((tag:any)=>(
          <p className="mb-2 text-sm font-bold tracking-tight text-gray-900 dark:text-white" >#{tag}</p>
        ))}
      </div>
      
    </div>
  );
}

export default FlashcardItem;
