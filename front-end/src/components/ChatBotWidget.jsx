import { useEffect } from 'react';

/**
 * ChatBotWidget Component
 * 
 * Integrates the Chatling AI chatbot into the Essora platform.
 * This component handles the script injection and configuration 
 * required for the chatbot to answer basic client questions.
 */
export default function ChatBotWidget() {
  useEffect(() => {
    // 1. Set the chatbot configuration
    const chatbotId = import.meta.env.VITE_CHATBOT_ID;
    window.chtlConfig = { chatbotId };

    // 2. Create the script element
    const script = document.createElement('script');
    script.src = "https://chatling.ai/js/embed.js";
    script.async = true;
    script.dataset.id = chatbotId;
    script.id = "chtl-script";
    script.type = "text/javascript";

    // 3. Append to body to initialize the widget
    document.body.appendChild(script);

    // Cleanup function to remove script and config if component unmounts
    return () => {
      const existingScript = document.getElementById('chtl-script');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
      // Also clean up any elements created by the widget if possible (usually they are added to the end of body)
      const widgetContainer = document.querySelector('.chtl-container');
      if (widgetContainer) {
        widgetContainer.remove();
      }
    };
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-[50] group pointer-events-none">
       <div className="relative flex items-center justify-end">
          <span className="mr-3 bg-white text-slate-900 px-4 py-2 rounded-full shadow-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0 pointer-events-none whitespace-nowrap border border-slate-100">
            AI Chatbot
          </span>
          {/* This invisible area sits right over the chatbot bubble to trigger the hover state */}
          <div className="w-16 h-16 pointer-events-auto cursor-pointer" />
       </div>
    </div>
  );
}
