// ------------------
// IMPORT STATEMENTS
// ------------------

import { useState, useEffect, useRef } from "react";
import "./App.css";

// ------------------
// FUNCTION DECLARATION
// ------------------

function App() {
  // ------------------
  // STATE VARIABLES
  // ------------------

  const [animals, setAnimals] = useState(null);
  const [index, setIndex] = useState(0); // Which card is currently centered (for the dots)
  const scrollRef = useRef(null); // Reference to the scrollable ".animals" div

  // ------------------
  // HELPER FUNCTIONS
  // ------------------

  // Fetch all animals from the API
  const getAllAnimals = async () => {
    const response = await fetch("/api/get-all-animals");
    const data = await response.json();
    console.log(data);
    setAnimals(data);
  };

  // Delete one animal
  const deleteOneAnimal = async (id) => {
    await fetch(`/api/delete-one-animal/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Fetch all animals again
    getAllAnimals();
  };

  // Display an emoji based on the animal category
  const categoryEmoji = (category) => {
    const map = {
      mammal: "🐾",
      bird: "🕊️",
      reptile: "🦎",
      fish: "🐟",
      arachnid: "🕷️",
      amphibian: "🐸",
      insect: "🐝",
    };

    return map[category?.toLowerCase()] || "🐾";
  };

  // Scroll left or right by one card
  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;

    el.scrollBy({
      left: direction * el.clientWidth,
      behavior: "smooth",
    });
  };

  // Scroll to a specific card when a dot is clicked
  const scrollToIndex = (i) => {
    const el = scrollRef.current;
    if (!el) return;

    el.scrollTo({
      left: i * el.clientWidth,
      behavior: "smooth",
    });
  };

  // ------------------
  // EFFECTS
  // ------------------

  // Load all animals when the page first loads
  useEffect(() => {
    getAllAnimals();
  }, []);

  // Keep the dots in sync with the currently visible card
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const width = el.clientWidth || 1;
      setIndex(Math.round(el.scrollLeft / width));
    };

    el.addEventListener("scroll", handleScroll);

    return () => {
      el.removeEventListener("scroll", handleScroll);
    };
  }, [animals]);

  // ------------------
  // RENDERING JSX TO THE SCREEN
  // ------------------

  return (
    <>
      <h1>🐾 Full-Stack Animals App 🐾</h1>

      <div className="card">
        <h2>All Animals</h2>

        <div className="carousel-frame">
          <button className="carousel-btn" onClick={() => scroll(-1)}>
            ‹
          </button>

          <div className="animals" ref={scrollRef}>
            {animals?.map((animal) => (
              <div className="animal" key={animal.id}>
                <div className="animal-emoji">
                  {categoryEmoji(animal.category)}
                </div>

                <span className="animal-badge">
                  {animal.category}
                </span>

                <h2>{animal.name}</h2>

                <p>
                  <strong>Id:</strong> {animal.id}
                </p>

                <p>
                  <strong>Lives in:</strong> {animal.lives_in}
                </p>

                <p>
                  <strong>Can fly:</strong>{" "}
                  {animal.can_fly ? "True ✅" : "False ❌"}
                </p>

                <button onClick={() => deleteOneAnimal(animal.id)}>
                  Re-home animal
                </button>
              </div>
            ))}
          </div>

          <button className="carousel-btn" onClick={() => scroll(1)}>
            ›
          </button>
        </div>

        {animals && animals.length > 0 && (
          <div className="carousel-dots">
            {animals.map((animal, i) => (
              <button
                key={animal.id}
                className={`dot ${i === index ? "dot-active" : ""}`}
                onClick={() => scrollToIndex(i)}
                aria-label={`Go to ${animal.name}`}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

// ------------------
// EXPORT STATEMENT
// ------------------

export default App;