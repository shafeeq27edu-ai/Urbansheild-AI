"use client";

import { MessageSquare, Bot, Send, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useRiskIntelligence } from '@/hooks/useRiskIntelligence';
import { useSimulationStore } from '@/store/useSimulationStore';

import { getFloodRiskStyle, getHeatRiskStyle } from '@/lib/styles';

export default function CIAssistantPanel() {
    const [messages, setMessages] = useState([
        { role: 'bot', content: 'Intelligence Hub active. I am monitoring hyper-local climate deltas. How can I assist with your urban resilience strategy?' }
    ]);
    const [input, setInput] = useState('');
    const { topRiskZone } = useRiskIntelligence();
    const { viewMode } = useSimulationStore();

    const currentRisk = viewMode === 'flood' ? topRiskZone.flood : topRiskZone.heat;
    const styles = viewMode === 'flood' ? getFloodRiskStyle(currentRisk.score) : getHeatRiskStyle(currentRisk.score);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');

        // Simulate AI reasoning
        setTimeout(() => {
            let response = "";
            if (input.toLowerCase().includes('risk') || input.toLowerCase().includes('why')) {
                const risk = currentRisk;
                response = `### INTELLIGENCE REPORT
1. **Interpretation**: Risk in ${topRiskZone.name} is ${risk.category} (${(risk.score * 100).toFixed(1)}%).
2. **Key Factors**: Elevated ${viewMode === 'flood' ? 'precipitation runoff beyond drainage capacity' : 'urban albedo effect and density'}.
3. **Immediate Mitigation**: Activate hyper-local ${viewMode === 'flood' ? 'drainage bypass' : 'cooling mist'} systems.
4. **Policy Recommendation**: Incentivize ${viewMode === 'flood' ? 'permeable paving' : 'cool-roof paint'} retrofitting.
5. **Scenario Impact**: Current parameters show a ${(risk.delta ? risk.delta * 100 : 0).toFixed(1)}% shift from baseline.`;
            } else if (input.toLowerCase().includes('mitigation') || input.toLowerCase().includes('do')) {
                response = `Strategic countermeasures for ${viewMode} risk:
- Deploy rapid response barriers.
- Initiate zone-specific grid balancing.
- Trigger adaptive civic alerts via AI mesh.`;
            } else {
                response = "I am processing the Digital Twin data. Specify if you require a Rationale [Score Interpretation] or a Strategic Intervention [Mitigation Steps].";
            }

            setMessages(prev => [...prev, { role: 'bot', content: response }]);
        }, 1000);
    };

    return (
        <div className={`glass-panel flex flex-col h-[500px] w-80 shadow-[0_0_30px_rgba(168,85,247,0.1)] transition-all duration-500 border border-white/5 ${styles.glow}`}>
            <div className="p-4 border-b border-white/10 flex items-center gap-2">
                <div className={`p-2 bg-purple-500/10 rounded-lg`}>
                    <Bot className={`w-4 h-4 text-purple-400`} />
                </div>
                <div>
                    <h3 className="text-sm font-black tracking-tight italic">CI ASSISTANT</h3>
                    <p className="text-[10px] text-purple-400 font-mono font-black">REASONING_CORE_V2</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 font-bold text-[11px] uppercase tracking-tight">
                {messages.map((m, i) => (
                    <motion.div
                        initial={{ opacity: 0, x: m.role === 'user' ? -10 : 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={i}
                        className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-[85%] p-3 rounded-2xl ${m.role === 'bot'
                                ? 'bg-white/5 border border-white/10 text-slate-300'
                                : 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                            }`}>
                            {m.role === 'bot' && <Sparkles className="w-3 h-3 mb-1 text-purple-400" />}
                            {m.content}
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="p-3 border-t border-white/10 bg-white/5">
                <div className="relative flex items-center">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask AI for strategy..."
                        className="w-full bg-slate-900/50 border border-white/10 rounded-full py-2 pl-4 pr-10 text-[10px] focus:outline-none focus:border-purple-500/50 transition-colors"
                    />
                    <button
                        onClick={handleSend}
                        className="absolute right-2 p-1.5 bg-purple-600 rounded-full hover:bg-purple-500 transition-colors"
                    >
                        <Send className="w-3 h-3 text-white" />
                    </button>
                </div>
            </div>
        </div>
    );
}
