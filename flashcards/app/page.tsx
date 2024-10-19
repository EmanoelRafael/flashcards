import { useState } from "react";
import Image from "next/image";
import AddFlashcardForm from './AddFlashcardForm';
import { Alert } from "flowbite-react";
import NavBar from './NavBar';
import FlashcardList from "./FlashcardList";

export default async function Home() {
  const res = await fetch('http://localhost:3002/flashcards_list', { cache: 'no-store' });
  const flashcards = await res.json();
  console.log("flashcardssssssssss")
  console.log(flashcards)
  return (
    <main>
      <header>
        <NavBar />
      </header>
      <div>
        <div className="flashcard_list">
          <FlashcardList flashcards={flashcards}/>
        </div>
        <div className="flashcard_input">
          <AddFlashcardForm />
        </div>
      </div>
    </main>
  );
}
