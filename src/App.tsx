import { useState, useEffect } from 'react';
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Check, Star, ArrowUpRight, MapPin, Phone } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// --- Google Icon SVG ---
const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.7 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);

// --- 1. Loading Screen ---
const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 1500;
    
    const updateCounter = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentCount = Math.floor(progress * 100);
      
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        setTimeout(onComplete, 200);
      }
    };
    requestAnimationFrame(updateCounter);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
      className="fixed inset-0 z-[9999] bg-white flex flex-col justify-center items-center p-8"
    >
        <div className="text-6xl md:text-8xl lg:text-9xl font-display text-accent tabular-nums leading-none">
          {String(count).padStart(3, "0")}
        </div>
        <div className="w-64 h-[2px] bg-stroke mt-8 overflow-hidden relative">
          <div 
            className="absolute inset-y-0 left-0 bg-accent w-full origin-left"
            style={{ transform: `scaleX(${count / 100})` }}
          />
        </div>
    </motion.div>
  );
};

// --- Section Header Component ---
const SectionHeader = ({ eyebrow, title1, title2, subtext }: any) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
      viewport={{ once: true, margin: "-100px" }}
      className="flex flex-col items-center text-center mb-10 md:mb-16"
    >
      <div className="flex items-center gap-4 mb-4 md:mb-6">
        <div className="w-6 md:w-8 h-px bg-accent" />
        <span className="text-[10px] md:text-xs text-accent uppercase tracking-[0.3em] font-bold">{eyebrow}</span>
        <div className="w-6 md:w-8 h-px bg-accent" />
      </div>
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-[#0F172A]">
        {title1} <span className="font-display italic text-accent font-normal">{title2}</span>
      </h2>
      {subtext && <p className="text-gray-800 text-sm md:text-base max-w-lg mt-2 md:mt-4 px-4">{subtext}</p>}
    </motion.div>
  );
};

// --- Navbar ---
const Navbar = () => {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest > previous && latest > 150) {
      setHidden(true); // Hide on scroll down
    } else {
      setHidden(false); // Show on scroll up
    }
    setScrolled(latest > 50);
  });

  return (
    <motion.nav 
      variants={{
        visible: { y: 0, opacity: 1 },
        hidden: { y: "-100%", opacity: 0 }
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 md:pt-6 px-4"
    >
      <div className={`inline-flex items-center rounded-full bg-white/90 backdrop-blur-md px-1.5 md:px-2 py-1.5 md:py-2 transition-all max-w-[95vw] md:w-auto overflow-x-auto no-scrollbar ${scrolled ? 'shadow-lg shadow-black/5 border border-stroke' : 'border border-stroke/50'}`}>
        <div className="min-w-[36px] w-9 h-9 rounded-full bg-accent flex items-center justify-center font-display italic text-[15px] font-bold text-white shadow-[0_0_10px_rgba(37,99,235,0.3)]">EK</div>
        <div className="w-px h-5 bg-stroke mx-2 shrink-0" />
        <div className="flex items-center space-x-0.5 md:space-x-1 shrink-0">
          {["Início", "Sobre", "Diferenciais", "Avaliações"].map((link, i) => (
            <a key={link} href={`#${link.toLowerCase() === 'avaliações' ? 'depoimentos' : link.toLowerCase()}`} className={`text-[10px] sm:text-sm rounded-full px-2 md:px-3 py-1.5 transition-colors ${i===0 ? 'text-accent bg-blue-50 font-medium' : 'text-gray-600 hover:text-accent hover:bg-blue-50/50'}`}>
              {link}
            </a>
          ))}
        </div>
        <div className="w-px h-5 bg-stroke mx-2 hidden sm:block shrink-0" />
        <a href="https://wa.me/5524992311585" target="_blank" rel="noreferrer" className="hidden sm:flex bg-accent hover:bg-[#1d4ed8] transition-colors rounded-full text-xs px-4 py-2 text-white font-medium items-center gap-1.5 shrink-0 shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_20px_rgba(37,99,235,0.5)]">
          Agendar <ArrowUpRight className="w-3 h-3" />
        </a>
      </div>
    </motion.nav>
  );
};

// --- Hero Section ---
const Hero = () => {
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(".hero-reveal", { opacity: 0 }, { opacity: 1, duration: 1.5 })
      .fromTo(".blur-in", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, stagger: 0.1 }, "-=0.8");
  }, []);

  return (
    <section id="início" className="relative w-full min-h-[100svh] flex flex-col justify-center overflow-hidden bg-white">
      <div className="absolute inset-0 z-0 hero-reveal">
        <img 
          src="/images/imag1.png" 
          alt="Dra Edilene" 
          className="w-full h-full object-cover object-center md:object-[50%_20%] scale-[1.02]" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/50 to-transparent md:via-white/40 md:w-[60%]" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </div>

      <div className="relative z-10 w-full px-6 md:px-12 lg:px-24 max-w-[1400px] mx-auto text-left pt-24 md:pt-32 pb-16 flex-1 flex flex-col justify-center">
        <div className="blur-in inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 w-fit mb-6">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-[10px] md:text-xs font-semibold tracking-widest uppercase text-accent">Psicóloga & Terapeuta ABA</span>
        </div>
        
        <h1 className="blur-in text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-[#0F172A] mb-6 max-w-2xl drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">
          Desenvolvimento com <span className="font-display italic text-accent font-normal">ciência</span> e empatia.
        </h1>
        
        <p className="blur-in text-sm sm:text-base md:text-lg text-[#1E293B] max-w-lg mb-8 font-medium drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]">
          Acompanhamento psicológico especializado, psicopedagogia e análise do comportamento aplicada ao autismo (ABA) para crianças e adolescentes.
        </p>

        <div className="blur-in mt-2 flex flex-col sm:flex-row gap-4">
          <a href="https://wa.me/5524992311585" target="_blank" rel="noreferrer" className="bg-accent hover:bg-[#0a4d8f] text-white rounded-full text-sm md:text-base font-bold px-8 py-4 transition-all hover:-translate-y-1 shadow-[0_0_20px_rgba(13,94,175,0.4)] hover:shadow-[0_0_30px_rgba(13,94,175,0.6)] flex items-center justify-center gap-2 text-center w-full sm:w-auto">
            AGENDAR CONSULTA <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

// --- Parceiros e Convênios (Planos Aceitos) ---
const Partners = () => {
  const logos = [
    "/images/MEDISERVICE-768x228.webp",
    "/images/12.-inb.webp",
    "/images/AMILL-768x228.webp",
    "/images/BRADESCOO-768x228.webp",
    "/images/Logo_SulAmerica_RGB-scaled-copiar-768x228.webp"
  ];

  return (
    <div className="py-8 md:py-12 border-y border-[#E2E8F0] overflow-hidden bg-[#EFF6FF] relative z-20">
      <p className="text-center text-[10px] md:text-xs tracking-[0.2em] text-[#0D5EAF] font-bold uppercase mb-6">Convênios e Planos Aceitos</p>
      <div className="overflow-hidden">
        <div className="flex w-max marquee-left">
          {[...logos, ...logos, ...logos, ...logos].map((logo, i) => (
             <img key={i} src={logo} alt="Plano/Convênio" className="h-10 sm:h-14 md:h-16 object-contain opacity-60 hover:opacity-100 transition-opacity duration-300 mix-blend-multiply mx-8 md:mx-16" />
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Diferenciais (Bento Grid) ---
const Diferenciais = () => {
  const p = [
    { title: "Terapia ABA", span: "md:col-span-7", text: "Intervenção comportamental baseada em evidências científicas, focada no desenvolvimento de habilidades em pessoas com autismo." },
    { title: "Psicopedagogia", span: "md:col-span-5", text: "Apoio completo para superar dificuldades de aprendizagem e promover o desenvolvimento escolar." },
    { title: "Psicoterapia Infantil", span: "md:col-span-5", text: "Ambiente lúdico e seguro para trabalhar questões emocionais e comportamentais da criança." },
    { title: "Orientação Parental", span: "md:col-span-7", text: "Treinamento e acolhimento familiar para garantir que as estratégias terapêuticas continuem em casa." }
  ];

  return (
    <section id="diferenciais" className="bg-white py-20 md:py-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-blue-50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 relative z-10">
        <SectionHeader 
          eyebrow="Especialidades"
          title1="Áreas de"
          title2="Atuação"
          subtext="Uma abordagem multidisciplinar completa focada no potencial de cada indivíduo."
        />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
          {p.map((item, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              viewport={{ once: true }}
              key={i} 
              className={`group relative bg-white border border-stroke shadow-xl shadow-blue-900/5 rounded-2xl md:rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_0_30px_rgba(37,99,235,0.15)] p-6 md:p-10 flex flex-col justify-between min-h-[250px] md:min-h-[300px] ${item.span}`}
            >
              <div className="absolute inset-0 opacity-[0.03] mix-blend-multiply pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #0D5EAF 1px, transparent 1px)', backgroundSize: '8px 8px' }} />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-accent mb-6 md:mb-8 group-hover:scale-110 group-hover:bg-accent group-hover:text-white transition-all">
                <span className="font-display italic text-lg md:text-xl font-bold">0{i+1}</span>
              </div>

              <div className="relative z-10 mt-auto">
                <h3 className="text-xl md:text-2xl font-bold mb-2 text-[#0F172A]">{item.title}</h3>
                <p className="text-gray-800 text-sm leading-relaxed">{item.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Alta Performance -> Desenvolvimento Contínuo ---
const Performance = () => {
  return (
    <section className="bg-[#EFF6FF] py-10 md:py-20 overflow-hidden relative border-y border-[#DBEAFE]">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center flex-col-reverse lg:flex-row">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="w-full relative rounded-3xl overflow-hidden shadow-2xl border border-stroke aspect-[4/3] md:aspect-[16/9] lg:aspect-square order-2 lg:order-1"
          >
            <img src="/images/imag2.png" alt="Desenvolvimento Contínuo" className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700" />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-px bg-accent" />
              <span className="text-[10px] md:text-xs text-accent uppercase tracking-[0.2em] font-bold">Metodologia</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-[#0F172A] leading-tight">
              Potencializando a <span className="font-display italic text-accent font-normal">autonomia</span>
            </h2>
            <p className="text-gray-800 text-sm md:text-base mb-8 leading-relaxed font-medium">
              Através da Análise do Comportamento Aplicada (ABA) e do olhar psicopedagógico, 
              criamos planos de ensino individualizados para superar barreiras de aprendizagem, 
              focando na independência e qualidade de vida da criança e sua família.
            </p>
            <ul className="space-y-4 mb-8">
              {['Avaliações precisas de repertório', 'Estratégias lúdicas e engajadoras', 'Monitoramento contínuo de resultados'].map((txt, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                  <Check className="w-4 h-4 text-accent" /> {txt}
                </li>
              ))}
            </ul>
            <a href="https://wa.me/5524992311585" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-accent text-white font-bold px-6 py-3 rounded-full hover:bg-[#1d4ed8] transition-colors text-sm shadow-[0_0_15px_rgba(37,99,235,0.4)]">
               Iniciar Acompanhamento <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

// --- Sobre o Mentor ---
const Sobre = () => {
  return (
    <section id="sobre" className="bg-white py-20 md:py-24">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden group aspect-square shadow-2xl border border-stroke order-1"
          >
            <div className="absolute inset-0 bg-accent/10 group-hover:bg-transparent transition-colors duration-700 z-10 mix-blend-overlay pointer-events-none" />
            <img src="/images/imag3.png" alt="Dra Edilene" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-out" />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            viewport={{ once: true }}
            className="order-2"
          >
            <div className="flex items-center gap-4 mb-4 md:mb-6">
              <div className="w-6 md:w-8 h-px bg-accent" />
              <span className="text-[10px] md:text-xs text-accent uppercase tracking-[0.3em] font-bold">A Profissional</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-[#0F172A]">
              Dra. <span className="font-display italic text-accent font-normal">Edilene</span>
            </h2>
            
            <div className="space-y-4 md:space-y-6 text-gray-800 text-sm md:text-base font-medium mb-8 border-l-2 border-accent pl-4 md:pl-6 bg-gradient-to-r from-blue-50 to-transparent py-2 rounded-r-lg">
              <p>
                <strong>Psicóloga, Psicopedagoga e Terapeuta ABA</strong>, com vasta experiência no atendimento clínico e educacional, atuando no desenvolvimento infantil e no suporte a famílias atípicas.
              </p>
              <p>
                Também atua como Professora e Analista do Comportamento Aplicada ao Autismo (ABA), utilizando a ciência para construir pontes de comunicação, autonomia e inclusão, transformando desafios em grandes conquistas.
              </p>
            </div>

            <a href="https://wa.me/5524992311585" target="_blank" rel="noreferrer" className="inline-flex bg-accent hover:bg-[#1d4ed8] text-white rounded-full px-6 py-3 transition-all hover:-translate-y-1 shadow-[0_0_20px_rgba(37,99,235,0.4)] font-bold items-center gap-2 text-sm md:text-base w-full sm:w-auto justify-center">
               Falar com a Dra. Edilene <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// --- CTA Localização ---
const Localizacao = () => {
  return (
    <section className="bg-[#EFF6FF] py-20 overflow-hidden relative border-y border-[#DBEAFE]">
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[150px] pointer-events-none -translate-y-1/2 translate-x-1/2" />
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center lg:text-left order-2 lg:order-1"
          >
            <div className="flex flex-col items-center lg:items-start mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-px bg-accent" />
                <span className="text-[10px] md:text-xs text-accent uppercase tracking-[0.3em] font-bold">Onde Atendemos</span>
                <div className="w-6 h-px bg-accent lg:hidden" />
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0F172A] leading-tight">Clínica <span className="font-display italic text-accent font-normal">Inspire</span></h2>
            </div>
            <p className="text-gray-800 text-sm md:text-lg mb-10 max-w-md mx-auto lg:mx-0 leading-relaxed font-medium border-l-2 border-accent pl-4">
              Psiquiatria e Psicologia. Localizado na R. Timburiba, 95 - Centro, Resende - RJ. Um espaço acolhedor e preparado para receber você e sua família.
            </p>
            <div className="flex justify-center lg:justify-start">
              <a href="https://www.google.com/maps/dir//Inspire+-+Psiquiatria+e+Psicologia,+R.+Timburiba,+95+-+Centro,+Resende+-+RJ,+27511-050/@-22.4816875,-44.5030786,15z/data=!3m1!4b1!4m8!4m7!1m0!1m5!1m1!1s0x9e7f9e2d61e455:0xafff0a2d075bcb54!2m2!1d-44.446001!2d-22.4695709?entry=ttu&g_ep=EgoyMDI2MDQyOS4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 bg-white border border-stroke text-[#0F172A] hover:bg-gray-50 transition-all hover:-translate-y-1 shadow-lg rounded-full px-8 py-4 font-bold text-sm md:text-base">
                 <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                   <MapPin className="w-4 h-4 text-accent" />
                 </div>
                 Abrir no Google Maps
              </a>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="w-full relative rounded-3xl overflow-hidden shadow-2xl border border-stroke order-1 lg:order-2 aspect-[4/3] lg:aspect-auto"
          >
            <img src="/images/imag4.png" alt="Localização Clínica Inspire" className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

const Depoimentos = () => {
  const reviews = [
    { name: "Mariana Costa", text: "Excelente atendimento na clínica Inspire! Acolhimento impecável." },
    { name: "Roberto Silva", text: "A Dra Edilene tem um cuidado incrível com as crianças. A terapia ABA mudou nossa rotina em casa." },
    { name: "Fernanda Lima", text: "Melhor psicóloga que já fomos. Nosso filho se desenvolveu muito." },
    { name: "Carlos Eduardo", text: "Ótima profissional, extremamente atenciosa e competente." },
    { name: "Patrícia Souza", text: "Acompanhamento impecável, super recomendo para qualquer família." },
    { name: "Ana Beatriz", text: "Profissional maravilhosa, com uma didática que as crianças amam." },
    { name: "Juliana Mendes", text: "Evolução nítida no comportamento do meu filho. Somos gratos!" },
    { name: "Ricardo Alves", text: "Nota 10! A intervenção precoce foi a melhor decisão que tomamos." }
  ];

  const row1 = reviews.slice(0, 4);
  const row2 = reviews.slice(4, 8);

  const ReviewCard = ({ r }: any) => (
    <div className="bg-white rounded-2xl p-5 md:p-6 w-[300px] md:w-[380px] shrink-0 shadow-lg border border-[#E2E8F0] transition-transform duration-300 hover:scale-[1.02] mx-3">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-50 flex items-center justify-center text-accent font-bold text-sm md:text-lg uppercase">
            {r.name.charAt(0)}
          </div>
          <div>
            <h4 className="text-[#0F172A] font-bold text-xs md:text-sm">{r.name}</h4>
            <p className="text-gray-500 text-[10px] md:text-xs mt-0.5">Publicado em Google</p>
          </div>
        </div>
        <GoogleIcon />
      </div>
      <div className="flex gap-1 mb-2 md:mb-3">
        {[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 md:w-4 md:h-4 fill-[#FBBC05] text-[#FBBC05]" />)}
      </div>
      <p className="text-gray-700 text-xs md:text-sm leading-relaxed font-medium">"{r.text}"</p>
    </div>
  );

  return (
    <section id="depoimentos" className="bg-white pt-20 md:pt-28 pb-10 md:pb-16 border-t border-[#E2E8F0] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1000px] h-[500px] bg-blue-50 rounded-[100%] blur-[150px] pointer-events-none" />
      
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 relative z-10 mb-12">
        <SectionHeader 
          eyebrow="Resultados reais"
          title1="O que as famílias"
          title2="dizem"
          subtext="Relatos de quem já transformou sua rotina familiar através de um acompanhamento focado em resultados."
        />
      </div>

      <div className="relative z-10 flex flex-col gap-6 pb-8 group touch-pan-y">
        <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-white to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none" />

        {/* Row 1 — scroll left */}
        <div className="overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing py-4">
          <div className="flex w-max marquee-left group-hover:![animation-play-state:paused] group-active:![animation-play-state:paused]">
            {[...row1, ...row1, ...row1, ...row1].map((r, i) => (
              <ReviewCard key={`r1-${i}`} r={r} />
            ))}
          </div>
        </div>

        {/* Row 2 — scroll right */}
        <div className="overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing py-4">
          <div className="flex w-max marquee-right group-hover:![animation-play-state:paused] group-active:![animation-play-state:paused]">
            {[...row2, ...row2, ...row2, ...row2].map((r, i) => (
              <ReviewCard key={`r2-${i}`} r={r} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Estrutura e Garantias ---
const Garantias = () => {
  const items = [
    "Avaliação Psicológica Especializada",
    "Acompanhamento Terapêutico ABA",
    "Orientação de Pais e Escola",
    "Material Estruturado Personalizado",
    "Treinamento de Acompanhantes Terapêuticos",
    "Feedback constante sobre a evolução"
  ];

  return (
    <section className="bg-[#EFF6FF] pt-10 md:pt-16 pb-20 md:pb-28 relative z-10 overflow-hidden border-t border-[#DBEAFE]">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white p-6 md:p-12 rounded-[30px] md:rounded-[40px] border border-stroke shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-[80px]" />
            
            <h2 className="relative z-10 text-2xl md:text-4xl font-bold mb-8 text-[#0F172A]">
              Estrutura do <span className="font-display italic text-accent font-normal">Acompanhamento:</span>
            </h2>
            
            <div className="flex flex-col gap-4 md:gap-6 text-left relative z-10">
              {items.map((item, i) => (
                <div key={i} className="flex items-center gap-3 md:gap-4">
                  <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-accent flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-gray-700 text-sm md:text-base font-medium">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="flex flex-col gap-6 md:gap-8 justify-center h-full">
             <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="w-full rounded-[30px] md:rounded-[40px] overflow-hidden shadow-2xl border border-stroke p-8 bg-gradient-to-tr from-white to-blue-50 text-center flex flex-col items-center justify-center min-h-[250px]"
             >
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                  <Star className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-2xl font-bold text-[#0F172A] mb-2">Suporte Contínuo</h3>
                <p className="text-gray-800 font-medium text-sm">Estou ao seu lado em cada etapa do desenvolvimento, adaptando estratégias e celebrando vitórias.</p>
             </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Footer Minimalista ---
const Footer = () => {
  return (
    <footer className="bg-white pt-16 pb-8 border-t border-stroke relative z-20">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 flex flex-col md:flex-row justify-between items-center md:items-start gap-10">
        
        {/* Brand */}
        <div className="flex flex-col items-center md:items-start">
          <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center font-display italic text-2xl font-bold text-white mb-4">EK</div>
          <h3 className="text-[#0F172A] text-lg font-bold mb-1">Dra. Edilene</h3>
          <p className="text-gray-600 text-sm font-medium">Psicóloga & Terapeuta ABA</p>
        </div>

        {/* Links */}
        <div className="flex gap-16 text-sm">
           <div className="flex flex-col items-center md:items-start gap-3">
             <span className="text-[#0F172A] font-bold mb-1">Navegação</span>
             <a href="#início" className="text-gray-800 hover:text-accent font-medium transition-colors">Início</a>
             <a href="#sobre" className="text-gray-800 hover:text-accent font-medium transition-colors">A Profissional</a>
             <a href="#diferenciais" className="text-gray-800 hover:text-accent font-medium transition-colors">Especialidades</a>
           </div>
           
           <div className="flex flex-col items-center md:items-start gap-3">
             <span className="text-[#0F172A] font-bold mb-1">Contato</span>
             <a href="https://wa.me/5524992311585" target="_blank" rel="noreferrer" className="text-gray-800 hover:text-accent font-medium transition-colors flex items-center gap-2"><Phone className="w-4 h-4"/> WhatsApp</a>
             <a href="https://www.instagram.com/kermizidis/" target="_blank" rel="noreferrer" className="text-gray-800 hover:text-accent font-medium transition-colors flex items-center gap-2">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
               Instagram
             </a>
           </div>
        </div>

      </div>

      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 mt-16 pt-8 border-t border-stroke flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-600 font-medium">
        <p>© {new Date().getFullYear()} Dra. Edilene Kermizidis. Todos os Direitos Reservados.</p>
        <p>Desenvolvido por: <span className="text-accent font-bold tracking-wide">DK Sistemas</span></p>
      </div>
    </footer>
  );
};

// --- App ---
function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <AnimatePresence>
        {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      <main className={`bg-white min-h-screen ${isLoading ? 'h-screen overflow-hidden' : ''} font-body`}>
        <Navbar />
        <Hero />
        <Partners />
        <Diferenciais />
        <Performance />
        <Sobre />
        <Localizacao />
        <Depoimentos />
        <Garantias />
        <Footer />
      </main>
    </>
  );
}

export default App;
