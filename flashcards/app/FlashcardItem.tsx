"use client"; // Adiciona essa linha no topo para marcar o componente como Client Component

import { useState } from "react";

function FlashcardItem({ flashcard }: { flashcard: any }) {
  const [isFront, setIsFront] = useState(true);

  const toggleFlashcard = () => {
    setIsFront(!isFront);
  };

  return (
    /*<div className="flashcard_item" onClick={toggleFlashcard}>
      <p className="flashcard_content">{isFront ? flashcard['front'] : flashcard['back']}</p>
    </div>
    
    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Noteworthy technology acquisitions 2021</h5>
    <p className="font-normal text-gray-700 dark:text-gray-400">Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.</p>
    */
    <div className="m-1.5 block max-w-sm p-6 bg-emerald-300 border border-gray-200 rounded-lg shadow hover:bg-emerald-200 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 cursor-pointer" onClick={toggleFlashcard}>

      {isFront ? <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{flashcard['front']}</h5>
      : <p className="font-normal text-gray-700 dark:text-gray-400">{flashcard['back']}</p>}
    </div>
  );
}

export default FlashcardItem;
