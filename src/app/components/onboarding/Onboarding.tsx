import React, { useState } from 'react';
import { OnboardingScreen } from './OnboardingScreen';

interface OnboardingProps {
  onComplete: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(1);

  const screens = [
    {
      title: 'Estamos contigo',
      text: 'Registra incidentes de acoso de forma segura, privada y acompañada.',
      buttonText: 'Comenzar',
    },
    {
      title: 'Nunca estás sola',
      text: 'Recibe orientación legal y emocional justo cuando la necesitas.',
      buttonText: 'Siguiente',
    },
    {
      title: 'Toma control',
      text: 'Haz seguimiento de tus reportes y encuentra apoyo en tu comunidad.',
      buttonText: 'Ir al inicio',
    },
  ];

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const currentScreen = screens[currentStep - 1];

  return (
    <OnboardingScreen
      title={currentScreen.title}
      text={currentScreen.text}
      buttonText={currentScreen.buttonText}
      onNext={handleNext}
      step={currentStep}
    />
  );
}
