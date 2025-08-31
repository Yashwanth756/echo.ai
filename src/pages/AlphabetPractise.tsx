import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
// import { englishWords } from "@/data/englishWords";
import { englishWords } from "@/data/englishWords";
const PIXABAY_API_KEY = "51990311-e11fd7b242b90c9c02303dd64";

const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

function AlphabetPractice() {
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [words, setWords] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [currentWord, setCurrentWord] = useState<string>("");
  const [spokenWord, setSpokenWord] = useState<string>("");
  const [feedback, setFeedback] = useState<string>("");
  const [listening, setListening] = useState(false);
  const [completedWords, setCompletedWords] = useState<Record<string, boolean>>({});
  const [imageCache, setImageCache] = useState<Record<string, string[]>>({});
  const [loadingImages, setLoadingImages] = useState(false);
  const [wordOffset, setWordOffset] = useState(3);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<string[]>([]);

  const handleLetterClick = (letter: string) => {
    setSelectedLetter(letter);
    setWordOffset(3);
    const filtered = englishWords.filter(w => w[0].toUpperCase() === letter);
    setWords(filtered.slice(0, 3));
    setImages([]);
    setCurrentWord("");
    setSpokenWord("");
    setFeedback("");
  };

  const handleLoadMore = async () => {
    if (!selectedLetter) return;
    setLoadingImages(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate loading for UX
    const filtered = englishWords.filter(w => w[0].toUpperCase() === selectedLetter);
    const newOffset = wordOffset + 3;
    setWords(filtered.slice(0, newOffset));
    setWordOffset(newOffset);
    setLoadingImages(false);
  };

  const fetchImages = async (word: string) => {
    setCurrentWord(word);
    setSpokenWord("");
    setFeedback("");
    // Use cached images if available
    if (imageCache[word]) {
      setImages(imageCache[word]);
      return;
    }
    setImages([]);
    setLoadingImages(true);
    try {
      const res = await fetch(
        `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(word)}&image_type=photo&per_page=3&safesearch=true`
      );
      const data = await res.json();
      const urls = (data.hits || []).map((img: any) => img.webformatURL).filter(Boolean);
      const finalUrls = urls.length > 0 ? urls : ["https://via.placeholder.com/96?text=No+Image"];
      setImages(finalUrls);
      setImageCache(prev => ({ ...prev, [word]: finalUrls }));
    } catch {
      setImages(["https://via.placeholder.com/96?text=No+Image"]);
      setImageCache(prev => ({ ...prev, [word]: ["https://via.placeholder.com/96?text=No+Image"] }));
    }
    setLoadingImages(false);
  };

  // Speech Recognition
  const startListening = () => {
    setListening(true);
    setSpokenWord("");
    setFeedback("");
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setFeedback("Speech recognition not supported in this browser.");
      setListening(false);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.trim().toLowerCase();
      setSpokenWord(transcript);
      setListening(false);
    };
    recognition.onerror = () => {
      setFeedback("Error recognizing speech. Try again.");
      setListening(false);
    };
    recognition.onend = () => {
      setListening(false);
    };
    recognition.start();
  };

  const handleSubmit = () => {
    if (!spokenWord) {
      setFeedback("Please speak the word first.");
      return;
    }
    if (spokenWord === currentWord.toLowerCase()) {
      setFeedback("✅ Correct! Great job!");
      setCompletedWords(prev => ({ ...prev, [currentWord]: true }));
    } else {
      setFeedback(`❌ Incorrect. You said: "${spokenWord}". Try again!`);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.trim().toLowerCase();
    setSearchTerm(term);
    if (term.length === 0) {
      setSearchResults([]);
      return;
    }
    const results = englishWords.filter(w => w.toLowerCase().includes(term));
    setSearchResults(results.slice(0, 10)); // Limit to 10 results
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-blue-50 p-4 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-4">Alphabet Practice</h1>
        <div className="flex flex-wrap gap-2 mb-6">
          {alphabet.map((letter) => (
            <button
              key={letter}
              className={`px-3 py-2 rounded font-bold text-lg shadow ${selectedLetter === letter ? "bg-blue-500 text-white" : "bg-white text-blue-500"}`}
              onClick={() => handleLetterClick(letter)}
            >
              {letter}
            </button>
          ))}
        </div>
        <div className="w-full max-w-xl mb-6 flex items-center gap-3">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search for any word..."
            className="px-4 py-2 rounded-lg border-2 border-blue-300 focus:border-blue-500 text-lg w-full bg-white dark:bg-gray-900 dark:text-white dark:border-gray-700"
          />
          {searchResults.length > 0 && (
            <div className="absolute bg-white dark:bg-gray-900 border border-blue-200 dark:border-gray-700 rounded-lg shadow-lg mt-12 w-full z-10">
              {searchResults.map(word => (
                <button
                  key={word}
                  className={`block w-full text-left px-4 py-2 hover:bg-blue-50 dark:hover:bg-gray-800 text-blue-700 dark:text-blue-300 font-semibold border-b last:border-b-0 border-blue-100 dark:border-gray-700 flex items-center justify-between`}
                  onClick={() => {
                    setCurrentWord(word);
                    fetchImages(word);
                    setSearchTerm("");
                    setSearchResults([]);
                  }}
                  disabled={completedWords[word]}
                >
                  {word}
                  {completedWords[word] && <span className="ml-2 text-green-600 dark:text-green-400 text-xl">✔️</span>}
                </button>
              ))}
            </div>
          )}
        </div>
        {selectedLetter && (
          <div className="w-full max-w-xl bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 border-2 border-blue-300 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-4 text-blue-700 dark:text-blue-300">Words starting with "{selectedLetter}"</h2>
            <div className="flex flex-wrap gap-3 mb-4">
              {words.map((word) => (
                <button
                  key={word}
                  className={`px-4 py-2 rounded-lg border-2 font-semibold text-lg shadow transition-all duration-200 flex items-center gap-2
                    ${completedWords[word] ? "bg-green-200 dark:bg-green-900 border-green-500 dark:border-green-400 text-green-700 dark:text-green-300" : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-green-800 dark:text-green-200 hover:bg-green-50 dark:hover:bg-gray-700 hover:border-green-400 dark:hover:border-green-300"}`}
                  onClick={() => { setCurrentWord(word); fetchImages(word); }}
                  disabled={completedWords[word]}
                >
                  {word}
                  {completedWords[word] && (
                    <span className="ml-2 text-green-600 dark:text-green-400 text-xl">✔️</span>
                  )}
                </button>
              ))}
            </div>
            <button
              className="px-4 py-2 rounded-lg border-2 border-blue-400 dark:border-blue-300 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-semibold shadow hover:bg-blue-200 dark:hover:bg-blue-800 transition-all duration-200 mb-4"
              onClick={handleLoadMore}
              disabled={loadingImages}
            >
              {loadingImages ? "Loading..." : "Load More"}
            </button>
            {currentWord && (
              <div className="mt-6 border-2 border-blue-300 dark:border-blue-700 rounded-xl p-4 bg-blue-50 dark:bg-gray-800 shadow-lg">
                <h3 className="text-xl font-bold mb-4 text-blue-700 dark:text-blue-300">Practice: {currentWord}</h3>
                <div className="flex gap-4 mb-4 min-h-[136px] items-center">
                  {loadingImages ? (
                    <div className="flex items-center justify-center w-full">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-blue-300"></div>
                    </div>
                  ) : (
                    images.map((url, idx) => (
                      <img
                        key={idx}
                        src={url}
                        alt={currentWord}
                        className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300 dark:border-gray-700 shadow"
                        onError={e => { e.currentTarget.src = "https://via.placeholder.com/96?text=No+Image"; }}
                      />
                    ))
                  )}
                </div>
                <div className="flex gap-3 mb-4">
                  <button
                    className="px-5 py-2 bg-yellow-400 dark:bg-yellow-600 text-white rounded-lg font-bold shadow hover:bg-yellow-500 dark:hover:bg-yellow-700 transition-all duration-200"
                    onClick={startListening}
                    disabled={listening}
                  >
                    {listening ? "Listening..." : "Speak"}
                  </button>
                  <button
                    className="px-5 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg font-bold shadow hover:bg-blue-700 dark:hover:bg-blue-800 transition-all duration-200"
                    onClick={handleSubmit}
                    disabled={listening || !spokenWord}
                  >
                    Submit
                  </button>
                </div>
                {spokenWord && (
                  <div className="mt-2 text-gray-700 dark:text-gray-200">You said: <span className="font-bold">{spokenWord}</span></div>
                )}
                {feedback && (
                  <div className={`mt-2 text-lg font-semibold ${feedback.includes("Correct") ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>{feedback}</div>
                )}
              </div>
            )}
          </div>
        )}
        <div className="mt-8 text-sm text-gray-500 dark:text-gray-300 max-w-xl text-center border-t pt-4">
          <p className="mt-2">Completed words are marked with <span className="text-green-600 dark:text-green-400 text-xl">✔️</span></p>
        </div>
      </div>
    </AppLayout>
  );
}

export default AlphabetPractice;
