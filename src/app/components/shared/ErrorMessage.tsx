import React from 'react';
import { AlertCircle, WifiOff, FileX, Calendar, Type } from 'lucide-react';

interface ErrorMessageProps {
  type: 'general' | 'empty' | 'date' | 'file' | 'offline' | 'long';
  message?: string;
}

export function ErrorMessage({ type, message }: ErrorMessageProps) {
  const errorConfig = {
    general: {
      icon: AlertCircle,
      text: message || 'Algo no salió como esperábamos. Intentemos de nuevo juntos.',
      color: 'red',
    },
    empty: {
      icon: AlertCircle,
      text: 'Faltan algunos datos. Te ayudamos a completarlos.',
      color: 'yellow',
    },
    date: {
      icon: Calendar,
      text: 'La fecha ingresada no es válida. Intenta nuevamente.',
      color: 'red',
    },
    file: {
      icon: FileX,
      text: 'No pudimos subir este archivo. Prueba con otro formato.',
      color: 'red',
    },
    offline: {
      icon: WifiOff,
      text: 'No tienes conexión en este momento. Guardamos tu avance.',
      color: 'blue',
    },
    long: {
      icon: Type,
      text: 'Tu descripción es muy larga. Puedes resumirla un poco.',
      color: 'yellow',
    },
  };

  const config = errorConfig[type];
  const Icon = config.icon;

  const colorClasses = {
    red: 'bg-[#FFECEC] border-[#E34242] text-[#E34242]',
    yellow: 'bg-[#FFF5E2] border-[#FFC04D] text-[#1C1C1E]',
    blue: 'bg-[#ECE8FF] border-[#6A4AE3] text-[#563AC1]',
  };

  return (
    <div className={`border rounded-xl p-4 flex items-start gap-3 ${colorClasses[config.color]}`}>
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <p className="text-sm">{config.text}</p>
    </div>
  );
}