"use client";

import { Bot, Send, X } from "lucide-react";
import { FormEvent, useRef, useEffect, useState, useTransition } from "react";

import { chatWithDataset } from "@/lib/api";
import type { ChatMessage } from "@/lib/types";

type ChatPanelProps = {
  datasetId: string;
  suggestions: string[];
  isOpen: boolean;
  onToggle: () => void;
};

export function ChatPanel({ datasetId, suggestions, isOpen, onToggle }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi! Ask me anything about your data — row counts, averages, trends, anomalies, or business questions.",
    },
  ]);
  const [question, setQuestion] = useState("");
  const [isPending, startTransition] = useTransition();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isPending]);

  const submitQuestion = (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;

    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setQuestion("");

    startTransition(async () => {
      try {
        const res = await chatWithDataset(datasetId, trimmed);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `${res.answer}\n\n${res.reasoning}` },
        ]);
      } catch (err) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: err instanceof Error ? err.message : "Unable to answer right now.",
          },
        ]);
      }
    });
  };

  return (
    <>
      {/* FAB */}
      <button
        id="chat-fab"
        type="button"
        className="chat-fab"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls="ai-chat-widget"
      >
        <Bot size={16} />
        Ask AI
      </button>

      {/* Overlay */}
      {isOpen && <div className="chat-overlay" onClick={onToggle} />}

      {/* Widget */}
      <section
        id="ai-chat-widget"
        className={`chat-widget ${isOpen ? "open" : ""}`}
        role="dialog"
        aria-label="AI chat"
      >
        <div className="chat-widget-head">
          <div>
            <span className="eyebrow">AI Copilot</span>
            <h2>Chat with your data</h2>
          </div>
          <button
            id="chat-close-btn"
            type="button"
            className="chat-close"
            onClick={onToggle}
            aria-label="Close chat"
          >
            <X size={15} />
          </button>
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="chat-suggestions">
            {suggestions.slice(0, 4).map((s) => (
              <button
                key={s}
                type="button"
                className="suggestion-pill"
                onClick={() => submitQuestion(s)}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Messages */}
        <div className="chat-messages" ref={scrollRef}>
          {messages.map((msg, i) => (
            <article
              key={`${msg.role}-${i}`}
              className={`chat-bubble ${msg.role}`}
            >
              <span className="bubble-label">
                {msg.role === "assistant" ? "AI" : "You"}
              </span>
              <p>{msg.content}</p>
            </article>
          ))}
          {isPending && (
            <div className="chat-bubble assistant pending">Thinking…</div>
          )}
        </div>

        {/* Input */}
        <form
          className="chat-form"
          onSubmit={(e: FormEvent) => {
            e.preventDefault();
            submitQuestion(question);
          }}
        >
          <input
            id="chat-input"
            className="chat-input"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask about totals, trends, anomalies…"
            disabled={isPending}
          />
          <button id="chat-send-btn" className="btn-primary" type="submit" disabled={isPending}>
            <Send size={14} />
          </button>
        </form>
      </section>
    </>
  );
}
