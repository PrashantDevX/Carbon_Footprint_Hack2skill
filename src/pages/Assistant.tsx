import { Send, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAI, type ChatMessage } from '@/hooks/useAI';
import { useCarbon } from '@/hooks/useCarbon';
import { uid } from '@/lib/utils';

const prompts = ['What should I do this week?', 'Create a goal for my top category', 'Explain my footprint score'];

export function Assistant() {
  const { result } = useCarbon();
  const ai = useAI(result);
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Your score is ${result.score}. I can help reduce ${result.topCategory.label.toLowerCase()}, your current top source.`
    }
  ]);

  const send = async (prompt = draft) => {
    if (!prompt.trim()) return;
    const userMessage: ChatMessage = { id: uid('msg'), role: 'user', content: prompt };
    setMessages((current) => [...current, userMessage]);
    setDraft('');
    const answer = await ai.mutateAsync(prompt);
    setMessages((current) => [...current, { id: uid('msg'), role: 'assistant', content: answer }]);
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
      <Card className="min-h-[72vh]">
        <div className="mb-4 flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-amber-100 text-clay">
            <Sparkles />
          </span>
          <div>
            <h1 className="text-2xl font-black">AI reduction coach</h1>
            <p className="text-sm text-slate-500">Gemini-enabled when API key is configured</p>
          </div>
        </div>
        <div className="grid max-h-[55vh] gap-3 overflow-y-auto pr-1" aria-live="polite">
          {messages.map((message) => (
            <div key={message.id} className={message.role === 'user' ? 'justify-self-end' : 'justify-self-start'}>
              <div className={message.role === 'user' ? 'max-w-2xl rounded-lg bg-leaf px-4 py-3 text-white' : 'max-w-2xl rounded-lg bg-slate-100 px-4 py-3 text-slate-800'}>
                {message.content}
              </div>
            </div>
          ))}
          {ai.isPending ? <p className="text-sm text-slate-500">Thinking through your latest footprint...</p> : null}
        </div>
        <form className="mt-5 flex gap-2" onSubmit={(event) => { event.preventDefault(); void send(); }}>
          <label className="sr-only" htmlFor="assistant-message">Message</label>
          <input
            id="assistant-message"
            className="min-h-12 flex-1 rounded-md border border-slate-300 px-4 outline-none focus:ring-2 focus:ring-leaf"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Ask for a plan, explanation, or substitution"
          />
          <Button type="submit" icon={<Send size={18} />} disabled={ai.isPending}>Send</Button>
        </form>
      </Card>
      <Card>
        <h2 className="text-lg font-black">Quick prompts</h2>
        <div className="mt-4 grid gap-2">
          {prompts.map((prompt) => (
            <Button key={prompt} variant="secondary" onClick={() => void send(prompt)}>
              {prompt}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
}
