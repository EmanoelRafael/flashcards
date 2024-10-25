"use client";

import { useEffect, useState } from "react";
import FlashcardItem from './FlashcardItem';

export default function FlashcardList(props: any) {

    const flashcards = Array.from(props.flashcards['flashcards']);
    const tags_list = Array.from(props.flashcards['tags']);
    console.log("flashcsdfgsdfgdssdfgsdfgsf")
    console.log(flashcards)
    console.log(tags_list)
    var flashcardsList:any = flashcards;
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    const [filteredFlashcards, setFilteredFlashcards] = useState([]);

    function verifyTags(flashcard: any) {
        
        const isValid = tags.every(tag => {
          if (!flashcard['tags'].includes(tag)) {
            return false; 
          }
          return true; 
        });
      
        return isValid; 
      }

      function onDelete(id: string) {
        
        const isConfirmed = window.confirm('Tem certeza que deseja excluir este flashcard?');
    
        if (!isConfirmed) {
            return;
        }
        console.log(`Excluir flashcard com ID: ${id}`);
    
        fetch(`http://localhost:3002/delete_flashcard/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Erro ao excluir o flashcard');
            }
            console.log('Flashcard excluído com sucesso!');
        
            const updatedFlashcards = flashcardsList.filter((flashcard: any) => flashcard.id !== id);
            setFilteredFlashcards(updatedFlashcards);
        })
        .catch((error) => {
            console.error('Erro:', error);
        });
    }

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

    useEffect(() => {
        const filteredList:any = flashcards.filter(verifyTags);
        setFilteredFlashcards(filteredList);
      }, [tags]);

    const removeTag = (indexToRemove: number) => {
        setTags(tags.filter((_, index) => index !== indexToRemove));
    };

    return (
        <div>
            <div className="flashcard_filter mb-5">
                <input
                type="text"
                value={tagInput}
                onChange={handleTagInput}
                onKeyDown={handleTagKeyDown}
                className="m-2 block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                placeholder="Enter a tag and press Enter or Click on a tag to remove"
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
            <div className="w-[95vw] h-[70vh] overflow-y-auto p-4 mx-auto border-2 border-emerald-300 rounded-2xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                    {
                    filteredFlashcards.map((flashcard: any) => (
                        <FlashcardItem key={flashcard['id']} flashcard={flashcard} onDelete={onDelete} />
                    ))}
                </div>
            </div>
        </div>
    )
}