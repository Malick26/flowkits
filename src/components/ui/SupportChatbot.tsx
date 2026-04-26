"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";

type Message = { id: string; role: "bot" | "user"; text: string };
type IssueStep = "none" | "name" | "phone" | "type" | "details" | "submitting" | "done";

export function SupportChatbot() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [issueStep, setIssueStep] = React.useState<IssueStep>("none");
  const [formData, setFormData] = React.useState({ customerName: "", phone: "", issueType: "", details: "" });
  const [inputValue, setInputValue] = React.useState("");
  
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages, issueStep]);

  // Initial messages when opened
  React.useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        { id: "1", role: "bot", text: "Bonjour ! 👋 Comment puis-je vous aider aujourd'hui ?" }
      ]);
    }
  }, [isOpen, messages.length]);

  const addMessage = (role: "bot" | "user", text: string) => {
    setMessages((prev) => [...prev, { id: Date.now().toString() + Math.random(), role, text }]);
  };

  const handleStartAlreadyOrdered = () => {
    addMessage("user", "J'ai déjà commandé, que faire ?");
    setTimeout(() => {
      addMessage("bot", "Si vous avez effectué votre commande, nous allons vous contacter dans les plus brefs délais pour organiser la livraison. Merci de votre patience ! 🚚");
      setIssueStep("done");
    }, 500);
  };

  const handleStartIssue = () => {
    addMessage("user", "Problème de commande / de taille");
    setTimeout(() => {
      addMessage("bot", "Désolé pour ce désagrément. Quel est votre Nom et Prénom ?");
      setIssueStep("name");
    }, 500);
  };

  const handleIssueTypeSelect = (typeValue: string, typeLabel: string) => {
    addMessage("user", typeLabel);
    setFormData((prev) => ({ ...prev, issueType: typeValue }));
    setTimeout(() => {
      addMessage("bot", "Pouvez-vous me donner plus de détails (ex: taille reçue, erreur exacte) ?");
      setIssueStep("details");
    }, 500);
  };

  const handleSubmitInput = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const val = inputValue.trim();
    setInputValue("");

    if (issueStep === "name") {
      addMessage("user", val);
      setFormData((prev) => ({ ...prev, customerName: val }));
      setTimeout(() => {
        addMessage("bot", "Merci. Quel est votre numéro de téléphone ?");
        setIssueStep("phone");
      }, 500);
    } else if (issueStep === "phone") {
      addMessage("user", val);
      setFormData((prev) => ({ ...prev, phone: val }));
      setTimeout(() => {
        addMessage("bot", "Quel est le problème rencontré ?");
        setIssueStep("type");
      }, 500);
    } else if (issueStep === "details") {
      addMessage("user", val);
      const finalData = { ...formData, details: val };
      setFormData(finalData);
      setIssueStep("submitting");

      try {
        const res = await fetch("/api/support", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(finalData),
        });

        if (!res.ok) throw new Error("Erreur serveur");
        
        setTimeout(() => {
          addMessage("bot", "Merci ! Votre demande a bien été envoyée. ✅ Nous vous contacterons très rapidement.");
          setIssueStep("done");
        }, 800);
      } catch (err) {
        setTimeout(() => {
          addMessage("bot", "Une erreur est survenue lors de l'envoi. Veuillez réessayer plus tard.");
          setIssueStep("done");
        }, 800);
      }
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setMessages([]);
      setIssueStep("none");
      setFormData({ customerName: "", phone: "", issueType: "", details: "" });
      setInputValue("");
    }, 300);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-white text-black shadow-lg shadow-black/50 transition-transform hover:scale-110 active:scale-95"
        aria-label="Aide et Support"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-6 w-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 flex h-[500px] max-h-[80vh] w-[90vw] max-w-sm flex-col overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 shadow-2xl sm:w-[400px]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-5 py-4">
              <div>
                <h3 className="font-semibold text-white">Support FlowKits</h3>
                <p className="text-xs text-white/50">Nous répondons rapidement</p>
              </div>
              <button onClick={handleClose} className="text-white/50 transition hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                    msg.role === "bot"
                      ? "mr-auto rounded-tl-none bg-white/10 text-white"
                      : "ml-auto rounded-tr-none bg-white text-black"
                  }`}
                >
                  {msg.text}
                </motion.div>
              ))}

              {/* Action Buttons (Initial State) */}
              {issueStep === "none" && messages.length > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-2 mt-2">
                  <button onClick={handleStartAlreadyOrdered} className="self-end rounded-2xl rounded-tr-none bg-white/20 border border-white/30 px-4 py-2 text-sm text-white transition hover:bg-white/30">
                    J'ai déjà commandé, que faire ?
                  </button>
                  <button onClick={handleStartIssue} className="self-end rounded-2xl rounded-tr-none bg-white/20 border border-white/30 px-4 py-2 text-sm text-white transition hover:bg-white/30">
                    Problème de commande / de taille
                  </button>
                </motion.div>
              )}

              {/* Action Buttons (Issue Type Selection) */}
              {issueStep === "type" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-2 mt-2">
                  {[
                    { value: "taille_petite", label: "Taille trop petite" },
                    { value: "taille_grande", label: "Taille trop grande" },
                    { value: "mauvais_maillot", label: "Mauvais maillot reçu" },
                    { value: "autre", label: "Autre problème" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleIssueTypeSelect(opt.value, opt.label)}
                      className="self-end rounded-2xl rounded-tr-none bg-white/20 border border-white/30 px-4 py-2 text-sm text-white transition hover:bg-white/30 text-right"
                    >
                      {opt.label}
                    </button>
                  ))}
                </motion.div>
              )}

              {issueStep === "submitting" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mr-auto rounded-2xl rounded-tl-none bg-white/10 px-4 py-3 text-sm text-white/50">
                  <span className="animate-pulse">Envoi en cours...</span>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            {(issueStep === "name" || issueStep === "phone" || issueStep === "details") && (
              <div className="border-t border-white/10 bg-black/20 p-4">
                <form onSubmit={handleSubmitInput} className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={
                      issueStep === "name" ? "Votre Nom et Prénom..." :
                      issueStep === "phone" ? "Votre numéro..." :
                      "Précisez (ex: reçu M, je veux L)..."
                    }
                    className="flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder-white/40 focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/20"
                    autoFocus
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim()}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-black transition disabled:opacity-50"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 -ml-0.5">
                      <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
                    </svg>
                  </button>
                </form>
              </div>
            )}
            
            {/* Reset / Restart option */}
            {issueStep === "done" && (
               <div className="border-t border-white/10 bg-black/20 p-3 flex justify-center">
                 <button onClick={() => {
                    setMessages([{ id: Date.now().toString(), role: "bot", text: "Bonjour ! 👋 Comment puis-je vous aider aujourd'hui ?" }]);
                    setIssueStep("none");
                    setFormData({ customerName: "", phone: "", issueType: "", details: "" });
                 }} className="text-xs text-white/50 hover:text-white underline transition">
                    Nouvelle conversation
                 </button>
               </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
