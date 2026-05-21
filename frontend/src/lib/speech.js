// Helper to ensure voices are fully loaded before speaking
async function getVoicesAsync() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return [];
  
  let voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) return voices;

  return new Promise(resolve => {
    let attempts = 0;
    
    // Polling is required because Chrome sometimes fails to fire onvoiceschanged
    const interval = setInterval(() => {
      voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        clearInterval(interval);
        resolve(voices);
      }
      attempts++;
      if (attempts > 10) { // 1 second timeout max
        clearInterval(interval);
        resolve(voices);
      }
    }, 100);

    window.speechSynthesis.onvoiceschanged = () => {
      voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        clearInterval(interval);
        resolve(voices);
      }
    };
  });
}

export async function speak(value) {
  if (typeof window === 'undefined' || !window.speechSynthesis || !value) return;
  
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(value);
  
  // Await the voices instead of getting an empty array
  let voices = await getVoicesAsync();
  
  const esVoices = voices.filter(v => v.lang.startsWith('es'));
  
  // This is the EXACT logic the previous agent added:
  let selectedVoice = esVoices.find(v => 
    v.name.includes('Natural') || 
    v.name.includes('Online') || 
    v.name.includes('Premium') || 
    v.name.includes('Google español')
  );
  
  if (!selectedVoice) {
    selectedVoice = esVoices.find(v => v.name.includes('Sabina') || v.name.includes('Pablo') || v.name.includes('Laura'));
  }
  
  if (!selectedVoice && esVoices.length > 0) {
    selectedVoice = esVoices[0];
  }
  
  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }

  utterance.lang = "es-ES";
  utterance.rate = 0.95;
  window.speechSynthesis.speak(utterance);
}
