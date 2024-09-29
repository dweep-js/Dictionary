document.getElementById("actionButton").addEventListener("click", function () {
  const word = document.getElementById("wordInput").value.trim();
  if (!word) return; // Exit if input is empty

  // Fetch word data from the dictionary API
  fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    .then((response) => {
      if (!response.ok) throw new Error("🚫 Word does not exist"); // Error handling
      return response.json();
    })
    .then((data) => {
      const meaningsContainer = document.getElementById("meaningsContainer");
      meaningsContainer.innerHTML = ""; // Clear previous meanings

      data.forEach((entry) => {
        const meanings = entry.meanings;
        let currentMeaningIndex = 0; // Initialize index for meanings

        const meaningCard = document.createElement("div");
        meaningCard.classList.add("meaning");

        const partOfSpeech = document.createElement("div");
        partOfSpeech.classList.add("part-of-speech");
        partOfSpeech.textContent = meanings[currentMeaningIndex].partOfSpeech;

        const definition = document.createElement("div");
        definition.textContent =
          meanings[currentMeaningIndex].definitions[0].definition;

        const audioControl = document.createElement("div");
        audioControl.classList.add("audio-control");
        audioControl.innerHTML = "🔊 Play"; // Audio play button

        // Set up audio playback
        const audioSrc = entry.phonetics[1]?.audio || entry.phonetics[0]?.audio;
        audioControl.addEventListener("click", (e) => {
          e.stopPropagation(); // Prevent click event from bubbling up
          if (audioSrc) {
            const audio = new Audio(audioSrc);
            audio.play(); // Play audio
          } else {
            alert("🔉 Audio not available");
          }
        });

        // Create synonyms, antonyms, and homonyms sections
        const synonyms =
          meanings[currentMeaningIndex].synonyms.join(", ") || "None";
        const antonyms =
          meanings[currentMeaningIndex].antonyms.join(", ") || "None";
        const homonyms = entry.homonyms ? entry.homonyms.join(", ") : "None"; // Assuming homonyms are available

        const synonymsDiv = document.createElement("div");
        synonymsDiv.classList.add("synonyms");
        synonymsDiv.innerHTML = `<strong>🔗 Synonyms:</strong> ${synonyms}`;

        const antonymsDiv = document.createElement("div");
        antonymsDiv.classList.add("antonyms");
        antonymsDiv.innerHTML = `<strong>❌ Antonyms:</strong> ${antonyms}`;

        const homonymsDiv = document.createElement("div");
        homonymsDiv.classList.add("homonyms");
        homonymsDiv.innerHTML = `<strong>👥 Homonyms:</strong> ${homonyms}`;

        meaningCard.appendChild(partOfSpeech);
        meaningCard.appendChild(definition);
        meaningCard.appendChild(audioControl);
        meaningCard.appendChild(synonymsDiv);
        meaningCard.appendChild(antonymsDiv);
        meaningCard.appendChild(homonymsDiv);
        meaningsContainer.appendChild(meaningCard);

        // Click event to switch meanings
        meaningCard.addEventListener("click", () => {
          currentMeaningIndex = (currentMeaningIndex + 1) % meanings.length; // Cycle through meanings
          partOfSpeech.textContent = meanings[currentMeaningIndex].partOfSpeech;
          definition.textContent =
            meanings[currentMeaningIndex].definitions[0].definition;

          // Update synonyms and antonyms
          const newSynonyms =
            meanings[currentMeaningIndex].synonyms.join(", ") || "None";
          const newAntonyms =
            meanings[currentMeaningIndex].antonyms.join(", ") || "None";

          synonymsDiv.innerHTML = `<strong>🔗 Synonyms:</strong> ${newSynonyms}`;
          antonymsDiv.innerHTML = `<strong>❌ Antonyms:</strong> ${newAntonyms}`;
        });
      });
    })
    .catch((error) => {
      console.error(error);
      alert(error.message); // Show error message
    });
});
