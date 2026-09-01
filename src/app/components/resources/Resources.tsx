import React from 'react';
import { ArrowLeft, Book, Scale, Phone, Shield, ChevronRight, Lock, Heart } from 'lucide-react';

interface ResourcesProps {
  onBack: () => void;
}

export function Resources({ onBack }: ResourcesProps) {
  const [selectedResource, setSelectedResource] = React.useState<number | null>(null);

  const resources = [
    {
      id: 1,
      title: 'pasos a seguir después de vivir una situación de acoso ',
      icon: Shield,
      color: 'from-[#6A4AE3] to-[#563AC1]',
    },
    {
      id: 2,
      title: 'Guía legal: tus derechos',
      icon: Scale,
      color: 'from-[#3FBF74] to-[#3FBF74]',
    },
    {
      id: 3,
      title: 'Líneas de atención 24/7',
      icon: Phone,
      color: 'from-[#E34242] to-[#E34242]',
    },
    {
      id: 4,
      title: 'Privacidad y seguridad',
      icon: Lock,
      color: 'from-[#6A4AE3] to-[#563AC1]',
    },
  ];

  // Si hay un recurso seleccionado, mostrar el detalle
  if (selectedResource === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#E8FCEF] to-white">
        {/* Header */}
        <div className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
            <button
              onClick={() => setSelectedResource(null)}
              className="flex items-center gap-2 text-[#4A4A4A] hover:text-[#1C1C1E] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Atrás</span>
            </button>
            <h1 className="text-[#3FBF74]">Pasos a seguir</h1>
          </div>
        </div>

        {/* Contenido del artículo */}
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-gradient-to-br from-[#6A4AE3] to-[#563AC1] p-4 rounded-xl">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-[#1C1C1E]">¿Qué hacer después de vivir una situación de acoso? Guía de apoyo y primeros pasos</h2>
            </div>

            <div className="space-y-6 text-[#1C1C1E]">
              <p>
                Vivir una situación de acoso puede generar miedo, confusión, rabia o vergüenza. 
                Estos sentimientos son completamente normales. Lo más importante que debes recordar 
                es que lo que ocurrió no es tu culpa y que tienes derecho a buscar apoyo y protección. 
                A continuación, encontrarás una guía clara sobre qué pasos puedes seguir después de 
                atravesar una experiencia de acoso.
              </p>

              {/* Paso 1 */}
              <div className="bg-gradient-to-r from-[#6A4AE3]/5 to-transparent p-6 rounded-xl border-l-4 border-[#6A4AE3]">
                <h3 className="text-[#6A4AE3] mb-3">1. Reconoce y valida lo que viviste</h3>
                <p className="text-[#4A4A4A]">
                  El acoso es una forma de violencia, y aunque a veces intentemos minimizarlo, es 
                  importante reconocer que lo sucedido fue real y merece atención. Tus emociones son 
                  válidas y no tienes por qué justificar lo que sentiste.
                </p>
              </div>

              {/* Paso 2 */}
              <div className="bg-gradient-to-r from-[#FF6FAF]/5 to-transparent p-6 rounded-xl border-l-4 border-[#FF6FAF]">
                <h3 className="text-[#FF6FAF] mb-3">2. Busca apoyo en alguien de confianza</h3>
                <p className="text-[#4A4A4A]">
                  Hablar con una persona cercana —amigo, familiar, compañero o profesional— puede 
                  ayudarte a liberar carga emocional y recibir orientación. No tienes que enfrentar 
                  esto solo/a. Expresar lo que viviste es un paso clave para recuperar seguridad.
                </p>
              </div>

              {/* Paso 3 */}
              <div className="bg-gradient-to-r from-[#3FBF74]/5 to-transparent p-6 rounded-xl border-l-4 border-[#3FBF74]">
                <h3 className="text-[#3FBF74] mb-3">3. Documenta lo ocurrido</h3>
                <p className="text-[#4A4A4A] mb-3">
                  Si te sientes con la capacidad de hacerlo, registra cualquier evidencia:
                </p>
                <ul className="list-disc list-inside space-y-2 text-[#4A4A4A] ml-4">
                  <li>Capturas de pantalla</li>
                  <li>Mensajes, audios o correos</li>
                  <li>Fechas, horas y lugares</li>
                  <li>Testigos presentes</li>
                </ul>
                <p className="text-[#4A4A4A] mt-3">
                  Esta información puede ayudarte más adelante si decides presentar una denuncia o 
                  informar a una institución.
                </p>
              </div>

              {/* Paso 4 */}
              <div className="bg-gradient-to-r from-[#FFC04D]/5 to-transparent p-6 rounded-xl border-l-4 border-[#FFC04D]">
                <h3 className="text-[#FFC04D] mb-3">4. Toma medidas de protección personal</h3>
                <p className="text-[#4A4A4A] mb-3">
                  Protegerte es una prioridad. Puedes:
                </p>
                <ul className="list-disc list-inside space-y-2 text-[#4A4A4A] ml-4">
                  <li>Bloquear o limitar el contacto con la persona acosadora</li>
                  <li>Ajustar la privacidad en tus redes sociales</li>
                  <li>Evitar espacios donde te sientas vulnerable</li>
                  <li>Pedir acompañamiento si debes verlo/a nuevamente</li>
                </ul>
                <p className="text-[#4A4A4A] mt-3">
                  Tu seguridad física y emocional es lo primero.
                </p>
              </div>

              {/* Paso 5 */}
              <div className="bg-gradient-to-r from-[#6A4AE3]/5 to-transparent p-6 rounded-xl border-l-4 border-[#6A4AE3]">
                <h3 className="text-[#6A4AE3] mb-3">5. Considera realizar una denuncia cuando te sientas preparado/a</h3>
                <p className="text-[#4A4A4A] mb-3">
                  No existe un {'"'}momento correcto{'"'}, solo el que tú decidas. Puedes acudir a:
                </p>
                <ul className="list-disc list-inside space-y-2 text-[#4A4A4A] ml-4">
                  <li>Autoridades locales</li>
                  <li>Entidades de atención y apoyo</li>
                  <li>Instituciones educativas o laborales</li>
                  <li>Líneas de orientación especializadas</li>
                </ul>
                <p className="text-[#4A4A4A] mt-3">
                  Tienes derecho a ser escuchado/a y a recibir acompañamiento.
                </p>
              </div>

              {/* Paso 6 */}
              <div className="bg-gradient-to-r from-[#FF6FAF]/5 to-transparent p-6 rounded-xl border-l-4 border-[#FF6FAF]">
                <h3 className="text-[#FF6FAF] mb-3">6. Cuida tu bienestar emocional</h3>
                <p className="text-[#4A4A4A]">
                  Después del acoso puedes experimentar ansiedad, tristeza, culpa o confusión. Esto 
                  es normal. Si es posible, busca apoyo psicológico. Un profesional puede ayudarte a 
                  comprender lo que sientes y a reconstruir tu confianza.
                </p>
              </div>

              {/* Paso 7 */}
              <div className="bg-gradient-to-r from-[#3FBF74]/5 to-transparent p-6 rounded-xl border-l-4 border-[#3FBF74]">
                <h3 className="text-[#3FBF74] mb-3">7. No te juzgues: sanar es un proceso</h3>
                <p className="text-[#4A4A4A]">
                  Cada persona vive este tipo de experiencias de manera diferente. No te compares, 
                  no te apresures y no te exijas más de lo necesario. Lo importante es que cada paso 
                  que des sea para tu bienestar.
                </p>
              </div>

              {/* Mensaje final */}
              <div className="bg-gradient-to-br from-[#6A4AE3]/10 to-[#FF6FAF]/10 p-8 rounded-2xl mt-8">
                <h3 className="text-[#6A4AE3] mb-4">Mensaje final</h3>
                <p className="text-[#1C1C1E] mb-4">
                  Si llegaste hasta aquí, ya diste un paso importante: buscar información y apoyo. 
                  Recuerda que no estás solo/a, que lo que viviste es válido y que existen caminos 
                  para seguir adelante de forma segura y acompañada.
                </p>
                <p className="text-[#1C1C1E]">
                  Este espacio está abierto para ti. Si necesitas compartir tu historia, pedir 
                  orientación o simplemente desahogarte, aquí puedes hacerlo con respeto y sin juicio.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Vista de Guía Legal
  if (selectedResource === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#E8FCEF] to-white">
        {/* Header */}
        <div className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
            <button
              onClick={() => setSelectedResource(null)}
              className="flex items-center gap-2 text-[#4A4A4A] hover:text-[#1C1C1E] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Atrás</span>
            </button>
            <h1 className="text-[#3FBF74]">Guía Legal</h1>
          </div>
        </div>

        {/* Contenido del artículo */}
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-gradient-to-br from-[#3FBF74] to-[#3FBF74] p-4 rounded-xl">
                <Scale className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-[#1C1C1E]">Guía Legal: Tus Derechos Después de Vivir una Situación de Acoso</h2>
            </div>

            <div className="space-y-6 text-[#1C1C1E]">
              <p>
                Enfrentar una situación de acoso no solo afecta el bienestar emocional, sino que 
                también puede vulnerar tus derechos como persona. Conocer las herramientas legales 
                disponibles te da la posibilidad de protegerte, actuar y recibir apoyo. Esta guía 
                reúne información esencial sobre tus derechos, las rutas legales y los mecanismos 
                de protección que puedes activar después de vivir acoso.
              </p>

              {/* Derecho 1 */}
              <div className="bg-gradient-to-r from-[#3FBF74]/5 to-transparent p-6 rounded-xl border-l-4 border-[#3FBF74]">
                <h3 className="text-[#3FBF74] mb-3">1. Tienes derecho a vivir libre de violencia y acoso</h3>
                <p className="text-[#4A4A4A] mb-3">Toda persona, sin excepción, tiene derecho a:</p>
                <ul className="list-disc list-inside space-y-2 text-[#4A4A4A] ml-4">
                  <li>Ser tratada con respeto y dignidad.</li>
                  <li>No ser intimidada, perseguida o humillada.</li>
                  <li>Estar en entornos seguros: hogar, estudio, trabajo, espacios públicos y redes sociales.</li>
                </ul>
                <p className="text-[#4A4A4A] mt-3">
                  El acoso, en todas sus formas, es una acción que va en contra de estos derechos fundamentales.
                </p>
              </div>

              {/* Derecho 2 */}
              <div className="bg-gradient-to-r from-[#6A4AE3]/5 to-transparent p-6 rounded-xl border-l-4 border-[#6A4AE3]">
                <h3 className="text-[#6A4AE3] mb-3">2. Tienes derecho a denunciar</h3>
                <p className="text-[#4A4A4A] mb-3">Si decides denunciar, la ley te protege. Puedes presentar una denuncia en:</p>
                <ul className="list-disc list-inside space-y-2 text-[#4A4A4A] ml-4">
                  <li>La Policía o Fiscalía (dependiendo del país, puede variar entre Comisaría, Fiscalía General, etc.).</li>
                  <li>Líneas de atención oficiales especializadas en violencia.</li>
                  <li>Instituciones educativas, si el acoso se dio en un entorno escolar o universitario.</li>
                  <li>Entidades laborales, si ocurrió en el trabajo.</li>
                </ul>
                <p className="text-[#4A4A4A] mt-3">
                  La denuncia puede ser verbal o escrita, y no necesitas tener {'\"'}toda la evidencia{'\"'} para hacerlo.
                </p>
              </div>

              {/* Derecho 3 */}
              <div className="bg-gradient-to-r from-[#FF6FAF]/5 to-transparent p-6 rounded-xl border-l-4 border-[#FF6FAF]">
                <h3 className="text-[#FF6FAF] mb-3">3. Tienes derecho a medidas de protección</h3>
                <p className="text-[#4A4A4A] mb-3">Dependiendo del caso, puedes solicitar medidas como:</p>
                <ul className="list-disc list-inside space-y-2 text-[#4A4A4A] ml-4">
                  <li>Orden de alejamiento.</li>
                  <li>Protección policial.</li>
                  <li>Orientación legal y psicológica gratuita.</li>
                  <li>Traslado o cambio de entorno si la seguridad está en riesgo (por ejemplo, cambio de salón, área laboral u horario).</li>
                </ul>
                <p className="text-[#4A4A4A] mt-3">
                  El Estado tiene la responsabilidad de protegerte.
                </p>
              </div>

              {/* Derecho 4 */}
              <div className="bg-gradient-to-r from-[#FFC04D]/5 to-transparent p-6 rounded-xl border-l-4 border-[#FFC04D]">
                <h3 className="text-[#FFC04D] mb-3">4. Tienes derecho a no ser revictimizado/a</h3>
                <p className="text-[#4A4A4A] mb-3">Esto significa que:</p>
                <ul className="list-disc list-inside space-y-2 text-[#4A4A4A] ml-4">
                  <li>No deben culparte por lo sucedido.</li>
                  <li>No pueden obligarte a repetir tu testimonio innecesariamente.</li>
                  <li>No deben cuestionar tu vestimenta, tu conducta o tu vida personal.</li>
                  <li>Tienes derecho a ser atendido/a por personal capacitado en enfoque de género y derechos humanos.</li>
                </ul>
              </div>

              {/* Derecho 5 */}
              <div className="bg-gradient-to-r from-[#3FBF74]/5 to-transparent p-6 rounded-xl border-l-4 border-[#3FBF74]">
                <h3 className="text-[#3FBF74] mb-3">5. Tienes derecho a asesoría legal gratuita</h3>
                <p className="text-[#4A4A4A] mb-3">En muchos países existen servicios que ofrecen:</p>
                <ul className="list-disc list-inside space-y-2 text-[#4A4A4A] ml-4">
                  <li>Orientación jurídica.</li>
                  <li>Acompañamiento en el proceso de denuncia.</li>
                  <li>Información sobre tus opciones legales.</li>
                  <li>Acompañamiento psicológico.</li>
                </ul>
                <p className="text-[#4A4A4A] mt-3">
                  Estas ayudas suelen ser gratuitas y confidenciales.
                </p>
              </div>

              {/* Derecho 6 */}
              <div className="bg-gradient-to-r from-[#6A4AE3]/5 to-transparent p-6 rounded-xl border-l-4 border-[#6A4AE3]">
                <h3 className="text-[#6A4AE3] mb-3">6. Tienes derecho a presentar evidencia, pero no es obligación tenerla para denunciar</h3>
                <p className="text-[#4A4A4A]">
                  Aunque es útil guardar pruebas como mensajes, capturas o testimonios, la falta de 
                  evidencia no anula tus derechos. Tu declaración es válida y debe ser escuchada.
                </p>
              </div>

              {/* Derecho 7 */}
              <div className="bg-gradient-to-r from-[#FF6FAF]/5 to-transparent p-6 rounded-xl border-l-4 border-[#FF6FAF]">
                <h3 className="text-[#FF6FAF] mb-3">7. Tienes derecho a la confidencialidad</h3>
                <p className="text-[#4A4A4A] mb-3">Tu información personal, tu testimonio y tu caso:</p>
                <ul className="list-disc list-inside space-y-2 text-[#4A4A4A] ml-4">
                  <li>No pueden ser divulgados sin tu consentimiento.</li>
                  <li>Deben manejarse con privacidad y seguridad.</li>
                  <li>Solo se compartirán con las autoridades o entidades que intervienen en el proceso.</li>
                </ul>
              </div>

              {/* Derecho 8 */}
              <div className="bg-gradient-to-r from-[#3FBF74]/5 to-transparent p-6 rounded-xl border-l-4 border-[#3FBF74]">
                <h3 className="text-[#3FBF74] mb-3">8. Tienes derecho a apoyo psicológico y emocional</h3>
                <p className="text-[#4A4A4A]">
                  Las instituciones y servicios públicos suelen ofrecer acompañamiento psicológico a 
                  víctimas de acoso y violencia. Este apoyo puede ayudarte a enfrentar el proceso legal 
                  y emocional con más fortaleza.
                </p>
              </div>

              {/* Derecho 9 */}
              <div className="bg-gradient-to-r from-[#6A4AE3]/5 to-transparent p-6 rounded-xl border-l-4 border-[#6A4AE3]">
                <h3 className="text-[#6A4AE3] mb-3">9. Tienes derecho a recibir seguimiento del caso</h3>
                <p className="text-[#4A4A4A] mb-3">Después de denunciar:</p>
                <ul className="list-disc list-inside space-y-2 text-[#4A4A4A] ml-4">
                  <li>Puedes solicitar información del estado del proceso.</li>
                  <li>Tienes derecho a saber qué medidas se han tomado.</li>
                  <li>Puedes pedir actualizaciones y documentos del expediente.</li>
                </ul>
              </div>

              {/* Derecho 10 */}
              <div className="bg-gradient-to-r from-[#FF6FAF]/5 to-transparent p-6 rounded-xl border-l-4 border-[#FF6FAF]">
                <h3 className="text-[#FF6FAF] mb-3">10. Tienes derecho a ser escuchado/a y tomado/a en serio</h3>
                <p className="text-[#4A4A4A] mb-3">
                  No importa tu edad, género, contexto o situación económica. La ley reconoce tu derecho a:
                </p>
                <ul className="list-disc list-inside space-y-2 text-[#4A4A4A] ml-4">
                  <li>Ser tratado/a con respeto.</li>
                  <li>Ser creído/a.</li>
                  <li>Recibir atención adecuada.</li>
                  <li>Expresar lo que sientes y lo que necesitas.</li>
                </ul>
              </div>

              {/* Mensaje final */}
              <div className="bg-gradient-to-br from-[#3FBF74]/10 to-[#6A4AE3]/10 p-8 rounded-2xl mt-8">
                <h3 className="text-[#3FBF74] mb-4">Mensaje final</h3>
                <p className="text-[#1C1C1E] mb-4">
                  Conocer tus derechos es el primer paso para recuperar tu seguridad y tu voz. Si 
                  viviste acoso, recuerda que la ley te respalda, que no estás solo/a y que existen 
                  rutas para protegerte. Puedes tomar decisiones a tu ritmo, y cada paso que des 
                  hacia tu bienestar es valioso.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Vista de Líneas de Atención 24/7
  if (selectedResource === 3) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#E8FCEF] to-white">
        {/* Header */}
        <div className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
            <button
              onClick={() => setSelectedResource(null)}
              className="flex items-center gap-2 text-[#4A4A4A] hover:text-[#1C1C1E] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Atrás</span>
            </button>
            <h1 className="text-[#3FBF74]">Líneas de Atención</h1>
          </div>
        </div>

        {/* Contenido del artículo */}
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-gradient-to-br from-[#E34242] to-[#E34242] p-4 rounded-xl">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-[#1C1C1E]">Líneas de atención 24/7 en Colombia</h2>
            </div>

            <div className="space-y-6">
              {/* ICBF */}
              <div className="bg-gradient-to-r from-[#E34242]/5 to-transparent p-6 rounded-xl border-l-4 border-[#E34242]">
                <div className="flex items-start gap-4">
                  <div className="bg-[#E34242] p-3 rounded-xl min-w-fit">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[#E34242] mb-2">ICBF – Línea 141</h3>
                    <p className="text-[#1C1C1E] mb-3">
                      Teléfono gratuito nacional, disponible 24 horas todos los días. Atiende 
                      emergencias, denuncias o situaciones de violencia hacia niños, niñas y 
                      adolescentes.
                    </p>
                    <a 
                      href="tel:141" 
                      className="inline-flex items-center gap-2 bg-[#E34242] text-white py-2 px-4 rounded-lg hover:bg-[#E34242]/90 transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      Llamar al 141
                    </a>
                  </div>
                </div>
              </div>

              {/* Policía Nacional */}
              <div className="bg-gradient-to-r from-[#6A4AE3]/5 to-transparent p-6 rounded-xl border-l-4 border-[#6A4AE3]">
                <div className="flex items-start gap-4">
                  <div className="bg-[#6A4AE3] p-3 rounded-xl min-w-fit">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[#6A4AE3] mb-2">Policía Nacional de Colombia – Línea 155</h3>
                    <p className="text-[#1C1C1E] mb-3">
                      Línea gratuita nacional para orientación a víctimas de violencia basada en 
                      género y violencia intrafamiliar. Funciona 24 horas al día.
                    </p>
                    <a 
                      href="tel:155" 
                      className="inline-flex items-center gap-2 bg-[#6A4AE3] text-white py-2 px-4 rounded-lg hover:bg-[#6A4AE3]/90 transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      Llamar al 155
                    </a>
                  </div>
                </div>
              </div>

              {/* Línea Púrpura */}
              <div className="bg-gradient-to-r from-[#FF6FAF]/5 to-transparent p-6 rounded-xl border-l-4 border-[#FF6FAF]">
                <div className="flex items-start gap-4">
                  <div className="bg-[#FF6FAF] p-3 rounded-xl min-w-fit">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[#FF6FAF] mb-2">Línea Púrpura (para mujeres víctimas de violencia de género)</h3>
                    <p className="text-[#1C1C1E] mb-3">
                      Atiende las 24 horas del día, todos los días del año. También disponible por WhatsApp.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <a 
                        href="tel:018000112137" 
                        className="inline-flex items-center gap-2 bg-[#FF6FAF] text-white py-2 px-4 rounded-lg hover:bg-[#FF6FAF]/90 transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                        01 8000 112 137
                      </a>
                      <a 
                        href="https://wa.me/573007551846" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-[#25D366] text-white py-2 px-4 rounded-lg hover:bg-[#25D366]/90 transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                        WhatsApp: 300 755 1846
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Línea de Emergencia General */}
              <div className="bg-gradient-to-r from-[#FFC04D]/5 to-transparent p-6 rounded-xl border-l-4 border-[#FFC04D]">
                <div className="flex items-start gap-4">
                  <div className="bg-[#FFC04D] p-3 rounded-xl min-w-fit">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[#FFC04D] mb-2">Línea de emergencia general: 123</h3>
                    <p className="text-[#1C1C1E] mb-3">
                      Válida para situaciones de urgencia, peligro inmediato o cuando se requiere 
                      intervención rápida.
                    </p>
                    <a 
                      href="tel:123" 
                      className="inline-flex items-center gap-2 bg-[#FFC04D] text-white py-2 px-4 rounded-lg hover:bg-[#FFC04D]/90 transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      Llamar al 123
                    </a>
                  </div>
                </div>
              </div>

              {/* Mensaje importante */}
              <div className="bg-gradient-to-br from-[#E34242]/10 to-[#FF6FAF]/10 p-8 rounded-2xl mt-8">
                <h3 className="text-[#E34242] mb-4">Importante</h3>
                <p className="text-[#1C1C1E] mb-4">
                  Todas estas líneas son gratuitas y confidenciales. No dudes en contactarlas si 
                  necesitas ayuda, orientación o acompañamiento. Tu seguridad es lo más importante.
                </p>
                <p className="text-[#1C1C1E]">
                  Recuerda que estas líneas están disponibles las 24 horas del día, los 7 días de 
                  la semana. No estás solo/a.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Vista de Privacidad y Seguridad
  if (selectedResource === 4) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#E8FCEF] to-white">
        {/* Header */}
        <div className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
            <button
              onClick={() => setSelectedResource(null)}
              className="flex items-center gap-2 text-[#4A4A4A] hover:text-[#1C1C1E] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Atrás</span>
            </button>
            <h1 className="text-[#6A4AE3]">Privacidad y Seguridad</h1>
          </div>
        </div>

        {/* Contenido del artículo */}
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-gradient-to-br from-[#6A4AE3] to-[#563AC1] p-4 rounded-xl">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-[#1C1C1E]">Guía de Privacidad y Seguridad Digital</h2>
            </div>

            <div className="space-y-6 text-[#1C1C1E]">
              <p>
                Después de vivir una situación de acoso, proteger tu información personal y tu 
                seguridad digital es fundamental. Esta guía te ayudará a tomar medidas prácticas 
                para resguardar tu privacidad en redes sociales, dispositivos y espacios digitales.
              </p>

              {/* Paso 1 */}
              <div className="bg-gradient-to-r from-[#6A4AE3]/5 to-transparent p-6 rounded-xl border-l-4 border-[#6A4AE3]">
                <h3 className="text-[#6A4AE3] mb-3">1. Ajusta la configuración de privacidad en redes sociales</h3>
                <p className="text-[#4A4A4A] mb-3">
                  Revisa y actualiza la configuración de privacidad en todas tus redes sociales:
                </p>
                <ul className="list-disc list-inside space-y-2 text-[#4A4A4A] ml-4">
                  <li>Cambia tu perfil a privado para que solo personas que apruebes puedan ver tu contenido</li>
                  <li>Revisa quién puede enviarte mensajes directos o solicitudes de amistad</li>
                  <li>Oculta tu lista de amigos o seguidores</li>
                  <li>Desactiva la geolocalización en tus publicaciones</li>
                  <li>Revisa las publicaciones antiguas donde te han etiquetado</li>
                </ul>
              </div>

              {/* Paso 2 */}
              <div className="bg-gradient-to-r from-[#FF6FAF]/5 to-transparent p-6 rounded-xl border-l-4 border-[#FF6FAF]">
                <h3 className="text-[#FF6FAF] mb-3">2. Bloquea y reporta cuentas sospechosas</h3>
                <p className="text-[#4A4A4A] mb-3">
                  No dudes en protegerte de personas que te hacen sentir inseguro/a:
                </p>
                <ul className="list-disc list-inside space-y-2 text-[#4A4A4A] ml-4">
                  <li>Bloquea a la persona acosadora en todas las plataformas</li>
                  <li>Reporta comportamientos abusivos a la plataforma</li>
                  <li>Guarda capturas de pantalla como evidencia antes de bloquear</li>
                  <li>Activa filtros de palabras ofensivas en los comentarios</li>
                  <li>Considera crear perfiles secundarios con información limitada</li>
                </ul>
              </div>

              {/* Paso 3 */}
              <div className="bg-gradient-to-r from-[#3FBF74]/5 to-transparent p-6 rounded-xl border-l-4 border-[#3FBF74]">
                <h3 className="text-[#3FBF74] mb-3">3. Protege tus contraseñas y dispositivos</h3>
                <p className="text-[#4A4A4A] mb-3">
                  La seguridad de tus cuentas comienza con contraseñas fuertes:
                </p>
                <ul className="list-disc list-inside space-y-2 text-[#4A4A4A] ml-4">
                  <li>Cambia todas tus contraseñas, especialmente si crees que alguien pudo acceder a ellas</li>
                  <li>Usa contraseñas únicas y complejas para cada cuenta</li>
                  <li>Activa la verificación en dos pasos en todas las plataformas posibles</li>
                  <li>Utiliza un gestor de contraseñas confiable</li>
                  <li>Revisa los dispositivos conectados a tus cuentas y cierra sesiones desconocidas</li>
                </ul>
              </div>

              {/* Paso 4 */}
              <div className="bg-gradient-to-r from-[#FFC04D]/5 to-transparent p-6 rounded-xl border-l-4 border-[#FFC04D]">
                <h3 className="text-[#FFC04D] mb-3">4. Controla la información que compartes</h3>
                <p className="text-[#4A4A4A] mb-3">
                  Reduce la cantidad de información personal visible en línea:
                </p>
                <ul className="list-disc list-inside space-y-2 text-[#4A4A4A] ml-4">
                  <li>Evita publicar tu ubicación en tiempo real</li>
                  <li>No compartas rutinas, horarios o lugares frecuentes</li>
                  <li>Limita detalles como números de teléfono, dirección o lugar de trabajo</li>
                  <li>Revisa qué información está visible en tu perfil público</li>
                  <li>Ten cuidado con encuestas o juegos que solicitan datos personales</li>
                </ul>
              </div>

              {/* Paso 5 */}
              <div className="bg-gradient-to-r from-[#6A4AE3]/5 to-transparent p-6 rounded-xl border-l-4 border-[#6A4AE3]">
                <h3 className="text-[#6A4AE3] mb-3">5. Documenta de forma segura</h3>
                <p className="text-[#4A4A4A] mb-3">
                  Si decides guardar evidencia de acoso, hazlo de manera segura:
                </p>
                <ul className="list-disc list-inside space-y-2 text-[#4A4A4A] ml-4">
                  <li>Haz capturas de pantalla con fecha y hora visibles</li>
                  <li>Guarda mensajes, correos o cualquier comunicación abusiva</li>
                  <li>Almacena las pruebas en una carpeta protegida con contraseña</li>
                  <li>Considera hacer copias de seguridad en la nube privada o USB</li>
                  <li>No elimines la evidencia original hasta consultar con autoridades</li>
                </ul>
              </div>

              {/* Paso 6 */}
              <div className="bg-gradient-to-r from-[#FF6FAF]/5 to-transparent p-6 rounded-xl border-l-4 border-[#FF6FAF]">
                <h3 className="text-[#FF6FAF] mb-3">6. Revisa aplicaciones y permisos</h3>
                <p className="text-[#4A4A4A] mb-3">
                  Controla qué aplicaciones tienen acceso a tu información:
                </p>
                <ul className="list-disc list-inside space-y-2 text-[#4A4A4A] ml-4">
                  <li>Revisa qué aplicaciones tienen acceso a tu ubicación, cámara y micrófono</li>
                  <li>Desinstala apps que no uses o que soliciten permisos sospechosos</li>
                  <li>Verifica aplicaciones conectadas a tus redes sociales</li>
                  <li>Desactiva el rastreo de ubicación en segundo plano</li>
                  <li>Actualiza regularmente tus aplicaciones y sistema operativo</li>
                </ul>
              </div>

              {/* Paso 7 */}
              <div className="bg-gradient-to-r from-[#3FBF74]/5 to-transparent p-6 rounded-xl border-l-4 border-[#3FBF74]">
                <h3 className="text-[#3FBF74] mb-3">7. Usa herramientas de seguridad</h3>
                <p className="text-[#4A4A4A] mb-3">
                  Aprovecha recursos tecnológicos que protegen tu privacidad:
                </p>
                <ul className="list-disc list-inside space-y-2 text-[#4A4A4A] ml-4">
                  <li>Considera usar una VPN para navegar de forma más privada</li>
                  <li>Usa navegadores con modo incógnito o privado</li>
                  <li>Instala bloqueadores de rastreadores y publicidad invasiva</li>
                  <li>Activa alertas de inicio de sesión en tus cuentas principales</li>
                  <li>Usa aplicaciones de mensajería con cifrado de extremo a extremo</li>
                </ul>
              </div>

              {/* Paso 8 */}
              <div className="bg-gradient-to-r from-[#FFC04D]/5 to-transparent p-6 rounded-xl border-l-4 border-[#FFC04D]">
                <h3 className="text-[#FFC04D] mb-3">8. Protege tu seguridad física</h3>
                <p className="text-[#4A4A4A] mb-3">
                  La seguridad digital también impacta tu seguridad física:
                </p>
                <ul className="list-disc list-inside space-y-2 text-[#4A4A4A] ml-4">
                  <li>Evita publicar sobre viajes, vacaciones o ausencias hasta después</li>
                  <li>No aceptes solicitudes de amistad de desconocidos</li>
                  <li>Ten cuidado al compartir fotos que muestren lugares identificables</li>
                  <li>Desactiva funciones que muestren cuando estás {'\"'}activo/a{'\"'} en línea</li>
                  <li>Informa a personas de confianza si detectas comportamiento sospechoso</li>
                </ul>
              </div>

              {/* Paso 9 */}
              <div className="bg-gradient-to-r from-[#6A4AE3]/5 to-transparent p-6 rounded-xl border-l-4 border-[#6A4AE3]">
                <h3 className="text-[#6A4AE3] mb-3">9. Qué hacer si alguien hackea tus cuentas</h3>
                <p className="text-[#4A4A4A] mb-3">
                  Si sospechas que tu cuenta fue comprometida:
                </p>
                <ul className="list-disc list-inside space-y-2 text-[#4A4A4A] ml-4">
                  <li>Cambia inmediatamente tu contraseña desde un dispositivo seguro</li>
                  <li>Cierra sesión en todos los dispositivos conectados</li>
                  <li>Notifica a tus contactos sobre posible actividad sospechosa</li>
                  <li>Reporta el hackeo a la plataforma correspondiente</li>
                  <li>Si es grave, presenta una denuncia formal a las autoridades</li>
                </ul>
              </div>

              {/* Paso 10 */}
              <div className="bg-gradient-to-r from-[#FF6FAF]/5 to-transparent p-6 rounded-xl border-l-4 border-[#FF6FAF]">
                <h3 className="text-[#FF6FAF] mb-3">10. Cuida tu bienestar emocional digital</h3>
                <p className="text-[#4A4A4A]">
                  Tu salud mental también se ve afectada por lo que consumes en línea. Está bien 
                  tomar descansos de redes sociales, silenciar conversaciones que te generan estrés 
                  o limitar el tiempo en plataformas. Tu bienestar es más importante que estar siempre 
                  conectado/a.
                </p>
              </div>

              {/* Mensaje final */}
              <div className="bg-gradient-to-br from-[#6A4AE3]/10 to-[#FF6FAF]/10 p-8 rounded-2xl mt-8">
                <h3 className="text-[#6A4AE3] mb-4">Mensaje final</h3>
                <p className="text-[#1C1C1E] mb-4">
                  Proteger tu privacidad y seguridad digital es un acto de autocuidado. Nadie tiene 
                  derecho a invadir tu espacio, ni físico ni virtual. Tomar estas medidas te ayudará 
                  a sentirte más seguro/a y en control de tu información.
                </p>
                <p className="text-[#1C1C1E]">
                  Recuerda que no estás solo/a en esto. Si necesitas apoyo técnico o emocional, no 
                  dudes en buscar ayuda. Tu seguridad y bienestar son lo más importante.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E8FCEF] to-white">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#4A4A4A] hover:text-[#1C1C1E] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Atrás</span>
          </button>
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#3FBF74]" />
            <h1 className="text-[#3FBF74]">Recursos de apoyo</h1>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-4">
          {resources.map((resource) => {
            const Icon = resource.icon;
            return (
              <button
                key={resource.id}
                onClick={() => setSelectedResource(resource.id)}
                className="w-full bg-white border border-[#B6B6B6] rounded-2xl p-6 hover:shadow-lg transition-all hover:border-[#3FBF74] text-left"
              >
                <div className="flex items-center gap-4">
                  <div className={`bg-gradient-to-br ${resource.color} p-4 rounded-xl`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[#1C1C1E]">{resource.title}</h3>
                  </div>
                  <ChevronRight className="w-6 h-6 text-[#B6B6B6]" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Ayuda adicional */}
        <div className="mt-8 bg-[#FFECEC] border border-[#E34242]/20 rounded-2xl p-6">
          <h3 className="text-[#E34242] mb-2">¿Necesitas ayuda urgente?</h3>
          <p className="text-[#1C1C1E] mb-4">
            Si estás en una situación de emergencia, contacta inmediatamente a las autoridades.
          </p>
          <button className="bg-[#E34242] text-white py-3 px-6 rounded-xl hover:bg-[#E34242]/90 transition-colors">
            Línea de emergencia
          </button>
        </div>
      </div>
    </div>
  );
}