import React, { useState, useEffect, useRef } from 'react';
import { CalculatorState, Operator, ViewMode, ChatMessage } from './types';
import { initialState, calculate, formatDisplay } from './utils/calculator';
import { solveMathPrompt } from './services/geminiService';
import { Sparkles, Delete, ArrowLeft, Send, History, X } from 'lucide-react';

const App: React.FC = () => {
  const [mode, setMode] = useState<ViewMode>('STANDARD');
  const [calcState, setCalcState] = useState<CalculatorState>(initialState);
  
  // Magic Mode State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // --- Calculator Logic ---

  const handleNumber = (num: string) => {
    if (calcState.waitingForOperand) {
      setCalcState(prev => ({
        ...prev,
        displayValue: num,
        waitingForOperand: false
      }));
    } else {
      setCalcState(prev => ({
        ...prev,
        displayValue: prev.displayValue === '0' ? num : prev.displayValue + num
      }));
    }
  };

  const handleDot = () => {
    if (calcState.waitingForOperand) {
        setCalcState(prev => ({
            ...prev,
            displayValue: '0.',
            waitingForOperand: false
        }));
    } else if (!calcState.displayValue.includes('.')) {
      setCalcState(prev => ({
        ...prev,
        displayValue: prev.displayValue + '.'
      }));
    }
  };

  const handleOperator = (nextOperator: Operator) => {
    const { displayValue, previousValue, operator } = calcState;
    
    if (operator && !calcState.waitingForOperand) {
        // Chain calculations
        const result = calculate(previousValue || '0', displayValue, operator);
        setCalcState({
            displayValue: String(result),
            previousValue: String(result),
            operator: nextOperator,
            waitingForOperand: true
        });
    } else {
        setCalcState(prev => ({
            ...prev,
            previousValue: displayValue,
            operator: nextOperator,
            waitingForOperand: true
        }));
    }
  };

  const handleEqual = () => {
    const { displayValue, previousValue, operator } = calcState;
    if (!operator || !previousValue) return;

    const result = calculate(previousValue, displayValue, operator);
    setCalcState({
        ...initialState,
        displayValue: String(result),
        waitingForOperand: true // So next number clears it
    });
  };

  const handleClear = () => {
    setCalcState(initialState);
  };

  const handleToggleSign = () => {
    setCalcState(prev => ({
        ...prev,
        displayValue: String(parseFloat(prev.displayValue) * -1)
    }));
  };

  const handlePercent = () => {
    setCalcState(prev => ({
        ...prev,
        displayValue: String(parseFloat(prev.displayValue) / 100)
    }));
  };

  // --- AI Logic ---

  const handleAiSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputPrompt.trim()) return;

    const userMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: inputPrompt,
        timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputPrompt('');
    setIsAiThinking(true);
    
    // Scroll to bottom
    setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);

    const result = await solveMathPrompt(userMsg.content);

    const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: result,
        timestamp: Date.now()
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsAiThinking(false);
    setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  // --- Components ---

  const Button = ({ 
    label, 
    onClick, 
    type = 'default', 
    className = '' 
  }: { 
    label: React.ReactNode, 
    onClick: () => void, 
    type?: 'default' | 'orange' | 'light' | 'magic',
    className?: string 
  }) => {
    let bgClass = 'bg-calc-btn text-white';
    if (type === 'orange') bgClass = 'bg-calc-orange text-white font-semibold';
    if (type === 'light') bgClass = 'bg-calc-light text-black font-medium';
    if (type === 'magic') bgClass = 'bg-gradient-to-br from-purple-600 to-blue-600 text-white';

    return (
        <button 
            onClick={onClick}
            className={`${bgClass} active-scale rounded-full w-full h-20 text-3xl flex items-center justify-center select-none ${className}`}
        >
            {label}
        </button>
    );
  };

  return (
    <div className="h-screen w-screen bg-black overflow-hidden relative">
      
      {/* --- Standard Calculator View --- */}
      <div className={`h-full flex flex-col pb-safe transition-opacity duration-300 ${mode === 'MAGIC' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        
        {/* Display Area */}
        <div className="flex-1 flex flex-col justify-end items-end p-6 pb-2">
            <div className="text-white text-7xl font-light tracking-tight break-all">
                {formatDisplay(calcState.displayValue)}
            </div>
        </div>

        {/* Keypad */}
        <div className="p-4 grid grid-cols-4 gap-3">
            <Button label={calcState.displayValue === '0' ? 'AC' : 'C'} type="light" onClick={handleClear} />
            <Button label="+/-" type="light" onClick={handleToggleSign} />
            <Button label="%" type="light" onClick={handlePercent} />
            <Button label="÷" type="orange" onClick={() => handleOperator('/')} />

            <Button label="7" onClick={() => handleNumber('7')} />
            <Button label="8" onClick={() => handleNumber('8')} />
            <Button label="9" onClick={() => handleNumber('9')} />
            <Button label="×" type="orange" onClick={() => handleOperator('*')} />

            <Button label="4" onClick={() => handleNumber('4')} />
            <Button label="5" onClick={() => handleNumber('5')} />
            <Button label="6" onClick={() => handleNumber('6')} />
            <Button label="-" type="orange" onClick={() => handleOperator('-')} />

            <Button label="1" onClick={() => handleNumber('1')} />
            <Button label="2" onClick={() => handleNumber('2')} />
            <Button label="3" onClick={() => handleNumber('3')} />
            <Button label="+" type="orange" onClick={() => handleOperator('+')} />

            <Button label="0" className="col-span-2 w-auto rounded-full pl-8 justify-start" onClick={() => handleNumber('0')} />
            <Button label="." onClick={handleDot} />
            <Button label="=" type="orange" onClick={handleEqual} />
        </div>
        
        {/* Magic Toggle Area */}
        <div className="px-4 pb-6">
            <button 
                onClick={() => setMode('MAGIC')}
                className="w-full py-3 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center gap-2 text-purple-400 font-medium active-scale"
            >
                <Sparkles size={18} />
                Ask Magic AI
            </button>
        </div>
      </div>

      {/* --- Magic AI View Overlay --- */}
      <div 
        className={`absolute inset-0 bg-magic-dark z-50 flex flex-col transition-transform duration-300 ease-out ${mode === 'MAGIC' ? 'translate-y-0' : 'translate-y-full'}`}
      >
        {/* Header */}
        <div className="p-4 pt-12 flex items-center justify-between bg-black/20 backdrop-blur-md">
            <button 
                onClick={() => setMode('STANDARD')}
                className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20"
            >
                <X size={24} />
            </button>
            <h2 className="text-white font-bold flex items-center gap-2">
                <Sparkles className="text-purple-400" />
                Magic Calc
            </h2>
            <div className="w-10"></div> {/* Spacer */}
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
            {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-white/50 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                        <History size={32} />
                    </div>
                    <p>Ask me anything...</p>
                    <div className="flex flex-wrap gap-2 justify-center max-w-xs">
                        <span className="px-3 py-1 bg-white/5 rounded-full text-xs">150 USD to EUR</span>
                        <span className="px-3 py-1 bg-white/5 rounded-full text-xs">Square root of 1452</span>
                        <span className="px-3 py-1 bg-white/5 rounded-full text-xs">15% tip on $85</span>
                    </div>
                </div>
            )}

            {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div 
                        className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                            msg.role === 'user' 
                            ? 'bg-purple-600 text-white rounded-tr-none' 
                            : 'bg-white/10 text-gray-200 rounded-tl-none border border-white/5'
                        }`}
                    >
                        {msg.content}
                    </div>
                </div>
            ))}
            
            {isAiThinking && (
                <div className="flex justify-start">
                    <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none flex gap-1">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                </div>
            )}
            <div ref={scrollRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 pb-8 bg-black/40 backdrop-blur-md">
            <form onSubmit={handleAiSubmit} className="relative">
                <input
                    type="text"
                    value={inputPrompt}
                    onChange={(e) => setInputPrompt(e.target.value)}
                    placeholder="Calculate or convert..."
                    className="w-full bg-white/10 border border-white/10 text-white rounded-full py-4 pl-6 pr-14 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-white/30"
                    autoFocus={mode === 'MAGIC'}
                />
                <button 
                    type="submit"
                    disabled={!inputPrompt.trim() || isAiThinking}
                    className="absolute right-2 top-2 p-2 bg-purple-600 rounded-full text-white disabled:opacity-50 disabled:bg-gray-700 transition-colors"
                >
                    <Send size={20} />
                </button>
            </form>
        </div>

      </div>

    </div>
  );
};

export default App;