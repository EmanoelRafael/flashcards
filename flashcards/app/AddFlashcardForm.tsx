"use client";

import { useState } from 'react';

export default function AddFlashcardForm() {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const handleTagInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      setTags([...tags, tagInput.trim().toUpperCase()]);
      setTagInput('');
    }
  };

  const removeTag = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newFlashcard = { front, back, tags };
    
    const res = await fetch('http://localhost:3002/add_flashcard', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newFlashcard),
    });

    if (res.ok) {
      setFront('');
      setBack('');
      setTags([]);
    } else {
      console.error('Failed to add flashcard');
    }
  };

  return (
    <form className="m-2 flex flex-col items-center rounded-lg border border-gray-900 max-w-sm mx-auto" onSubmit={handleSubmit}>
       <h5 
        className="m-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
        >ADICIONE SEU FLASHCARD</h5>
        
       <div className="flashcards_form_item">
          <input
          type="text"
          value={tagInput}
          onChange={handleTagInput}
          onKeyDown={handleTagKeyDown}
          className="m-2 block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
          placeholder="Enter a tag and press Enter"
          />
        
        <div>
            {tags.map((tag, index) => (
            <button 
              key={index}
              type="button" 
              onClick={() => removeTag(index)}
              className="m-0.5 relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800">
              <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                {tag}
              </span>
            </button>
            ))}
        </div>
      </div>
      <div className="flashcards_form_item">
        <textarea 
          id="message" 
          value={front}  
          rows={4}
          onChange={(e) => setFront(e.target.value)}
          className="m-2 block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
          placeholder="Input the card's front content...">
        </textarea>
      </div>
      <div className="flashcards_form_item">
        
        <textarea 
          id="message" 
          value={back}  
          rows={4}
          onChange={(e) => setBack(e.target.value)}
          className="m-2 block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
          placeholder="Input the card's back content...">
        </textarea>
      </div>
      <button 
        type="submit" 
        className="m-2 relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800">
        <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
         Add Flashcard
        </span>
      </button>
      
      <label className="block mb-2 text-sm font-bold tracking-tight text-gray-900 dark:text-white" htmlFor="file_input">Upload Arquivo de Flashcards</label>
      <input className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 mb-4" id="file_input" type="file">
      </input>

    </form>
  );
}