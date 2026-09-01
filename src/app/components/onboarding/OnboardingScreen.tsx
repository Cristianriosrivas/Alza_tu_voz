import React from 'react';
import { ArrowRight } from 'lucide-react';

interface OnboardingScreenProps {
  title: string;
  text: string;
  buttonText: string;
  onNext: () => void;
  step: number;
}

export function OnboardingScreen({ title, text, buttonText, onNext, step }: OnboardingScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#ECE8FF] to-white flex flex-col items-center justify-center px-6">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Ilustración/Icono */}
        <div className="flex justify-center">
          <div className="w-32 h-32 bg-gradient-to-br from-[#6A4AE3] to-[#FF6FAF] rounded-full flex items-center justify-center">
            <div className="text-white text-6xl">
              {step === 1 && '🤝'}
              {step === 2 && '💜'}
              {step === 3 && '✊'}
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="space-y-4">
          <h1 className="text-[#1C1C1E]">{title}</h1>
          <p className="text-[#4A4A4A]">{text}</p>
        </div>

        {/* Indicadores de paso */}
        <div className="flex justify-center gap-2">
          {[1, 2, 3].map((dot) => (
            <div
              key={dot}
              className={`h-2 rounded-full transition-all ${
                dot === step
                  ? 'w-8 bg-[#6A4AE3]'
                  : 'w-2 bg-[#B6B6B6]'
              }`}
            />
          ))}
        </div>

        {/* Botón */}
        <button
          onClick={onNext}
          className="w-full bg-[#6A4AE3] text-white py-4 px-6 rounded-xl hover:bg-[#563AC1] transition-colors flex items-center justify-center gap-2"
        >
          {buttonText}
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}