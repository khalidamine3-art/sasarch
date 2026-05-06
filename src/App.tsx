import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BarChart3, 
  Files, 
  LayoutDashboard, 
  Settings, 
  Users, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  FileText,
  Rocket,
  Zap,
  TrendingUp,
  Download
} from "lucide-react";

// --- Types ---
interface Task { id: number; text: string; done: boolean; }
interface TimelineItem { label: string; status: "completed" | "current" | "pending"; date?: string; }
interface Project {
  id: string;
  nom_projet: string;
  titre_foncier?: string;
  surface_terrain?: number;
  statut: string;
  timeline: TimelineItem[];
  tasks: Task[];
  ged: { id: number; name: string; size: string; }[];
}

// --- Dashboard Component ---
export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  // Simulation de chargement des données "Dossier 360"
  useEffect(() => {
    const timer = setTimeout(() => {
      setProject({
        id: "p1",
        nom_projet: "RÉSIDENCE LES JARDINS D'ANFA",
        titre_foncier: "1234/56 Casa",
        surface_terrain: 2450,
        statut: "AUTORISATION",
        timeline: [
          { label: "Pré-dépôt", status: "completed" },
          { label: "Dépôt Rokhas", status: "completed" },
          { label: "Commissions", status: "current" },
          { label: "Paiement", status: "pending" },
          { label: "Délivrance", status: "pending" },
        ],
        tasks: [
          { id: 1, text: "Vérifier conformité zonage C-1", done: true },
          { id: 2, text: "Étude d'impact environnemental", done: true },
          { id: 3, text: "Dépôt sur plateforme Rokhas", done: true },
          { id: 4, text: "Réponse remarques commission", done: false },
        ],
        ged: [
          { id: 1, name: "Plan_Masse_V2.pdf", size: "2.4 MB" },
          { id: 2, name: "Note_Faisabilite.pdf", size: "850 KB" },
          { id: 3, name: "ICE_Cabinet.pdf", size: "1.1 MB" }
        ]
      });
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const exportPDF = async () => {
    if (!project) return;
    const res = await fetch("/api/pdf/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        project,
        study: {
          envelope: 5500000,
          details: [
            { lot: "Gros Œuvre Fondation", montant: 1430000 },
            { lot: "Terrassement", montant: 83000 },
            { lot: "Cloisons", montant: 653000 }
          ]
        }
      })
    });
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Rapport_${project.nom_projet}.pdf`;
    a.click();
  };

  return (
    <div className="flex h-screen bg-arch-bg font-sans overflow-hidden">
      {/* Sidebar - Fixe à 240px */}
      <aside className="w-[240px] bg-white border-r border-slate-200 p-6 flex flex-col z-20 shadow-sm">
        <div className="flex items-center gap-2 mb-10">
          <div className="bg-arch-primary p-1.5 rounded-lg text-white">
            <Rocket size={20} />
          </div>
          <h1 className="font-bold text-lg tracking-tight text-slate-800">
            ARCHI<span className="text-yellow-500">FLOW</span> PRO
          </h1>
        </div>
        
        <nav className="space-y-1">
          <NavItem icon={<LayoutDashboard size={18}/>} label="Tableau de bord" active={activeTab === "dashboard"} onClick={() => setActiveTab("dashboard")}/>
          <NavItem icon={<Files size={18}/>} label="Mes Dossiers 360°" active={activeTab === "projets"} onClick={() => setActiveTab("projets")}/>
          <NavItem icon={<Zap size={18}/>} label="Moteur Rokhas Sync" active={activeTab === "rokhas"} onClick={() => setActiveTab("rokhas")}/>
          <NavItem icon={<TrendingUp size={18}/>} label="Études de Rentabilité" active={activeTab === "finance"} onClick={() => setActiveTab("finance")}/>
          <NavItem icon={<FileText size={18}/>} label="Plaquettes & PDF" active={activeTab === "pdf"} onClick={() => setActiveTab("pdf")}/>
          <NavItem icon={<Settings size={18}/>} label="Configuration" active={activeTab === "settings"} onClick={() => setActiveTab("settings")}/>
        </nav>

        <div className="mt-auto bg-arch-primary rounded-2xl p-4 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="text-[10px] font-bold opacity-60 uppercase mb-1">Cabinet El Alaoui</div>
            <div className="text-sm font-semibold truncate leading-tight">Architecte Senior</div>
          </div>
          <div className="absolute -right-2 -bottom-2 opacity-10">
            <Rocket size={60} />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-arch-primary text-white flex items-center justify-between px-8 border-b border-white/10 shadow-md z-10">
          <div className="flex items-center gap-4">
            <span className="text-xs font-medium opacity-70 uppercase tracking-widest hidden md:inline">Système Central de Gestion</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
               <div className="text-right">
                  <div className="text-xs font-bold leading-tight uppercase opacity-80">Cabinet El Alaoui</div>
                  <div className="text-[10px] opacity-60">Fès-Meknès, MA</div>
               </div>
               <div className="w-8 h-8 rounded-full bg-yellow-400 border-2 border-white/20" />
            </div>
          </div>
        </header>

        {/* Bento Board */}
        <main className="flex-1 p-5 overflow-y-auto bg-slate-50">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-8 h-8 border-2 border-arch-primary border-t-transparent rounded-full" />
            </div>
          ) : (
            <div className="grid grid-cols-12 grid-rows-8 gap-4 min-h-full max-w-[1400px] mx-auto">
              
              {/* Project Main Card (grid: 1-9 col, 1-5 row) */}
              <Widget className="col-span-8 row-span-4" label="Dossier Actif : #2024-089" statusTag="Phase: Instruction">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 leading-tight uppercase">{project?.nom_projet}</h3>
                    <div className="mt-1 flex items-center gap-2 text-xs text-arch-text-sub">
                      <span>Titre Foncier: {project?.titre_foncier}</span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full" />
                      <span>Zonage: C-1</span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full" />
                      <span>Surface: {project?.surface_terrain} m²</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-extrabold text-arch-primary">5.5 MDH</div>
                    <div className="text-[10px] font-bold text-arch-text-sub uppercase tracking-wider">Investissement Estimé</div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="relative mt-12 mb-4 px-2">
                  <div className="absolute top-3 left-0 right-0 h-[2px] bg-slate-100 z-0" />
                  <div className="flex justify-between relative z-10">
                    {project?.timeline.map((step, i) => (
                      <div key={i} className="flex flex-col items-center gap-2 w-20">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${step.status === 'completed' ? 'bg-arch-primary border-arch-primary text-white' : step.status === 'current' ? 'bg-yellow-400 border-arch-primary' : 'bg-white border-slate-200'}`}>
                           {step.status === 'completed' && <CheckCircle2 size={12} />}
                        </div>
                        <span className={`text-[10px] font-bold text-center leading-tight ${step.status === 'pending' ? 'text-slate-300' : 'text-arch-text-sub'}`}>{step.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Widget>

              {/* Magic Onboarding Card (grid: 9-13 col, 1-4 row) */}
              <Widget className="col-span-4 row-span-3 bg-gradient-to-br from-arch-primary to-[#065f46] text-white border-0" label="Magic Onboarding IA" labelColor="rgba(255,255,255,0.7)">
                <OnboardingIA />
              </Widget>

              {/* Rentability Widget (grid: 1-6 col, 5-9 row) */}
              <Widget className="col-span-12 md:col-span-5 row-span-4" label="Étude de Rentabilité (Groovy Script)">
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <RentItem label="Gros Œuvre (26.13%)" value="1.43 MDH" />
                  <RentItem label="Terrassement (1.51%)" value="83 KDH" />
                  <RentItem label="Cloisons (11.88%)" value="653 KDH" />
                  <RentItem label="Marge Prévue" value="+18.4%" highlight />
                </div>
                <div className="mt-6 flex items-center gap-3">
                   <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="w-[18.4%] h-full bg-emerald-500" />
                   </div>
                   <span className="text-[10px] font-bold text-emerald-600">Objectif Atteint</span>
                </div>
              </Widget>

              {/* Rokhas Widget (grid: 6-9 col, 5-9 row) */}
              <Widget className="col-span-12 md:col-span-3 row-span-4" label="Statut Rokhas Sync">
                <div className="h-full flex flex-col items-center justify-center -mt-4">
                  <div className="w-20 h-20 rounded-full border-[6px] border-slate-100 border-t-arch-primary flex items-center justify-center text-lg font-extrabold text-arch-primary">
                    72%
                  </div>
                  <div className="mt-4 text-[11px] font-bold text-slate-800">Dossier Complet</div>
                  <div className="text-[9px] text-arch-text-sub mt-1">Dernier check: Il y a 12 min</div>
                </div>
              </Widget>

              {/* GED Widget (grid: 9-13 col, 4-9 row) */}
              <Widget className="col-span-12 md:col-span-4 row-span-5 flex flex-col" label="Documents Récents (GED)">
                <div className="space-y-2 flex-1 overflow-y-auto mb-4 scrollbar-hide">
                  <FileItem name="Plan_Masse_V2.pdf" type="PDF" meta="Ajouté par Admin • 2.4 MB" />
                  <FileItem name="Devis_Estimation.xlsx" type="XLS" meta="Ajouté par Gemini • 450 KB" color="#dcfce7" textColor="#166534" />
                  <FileItem name="Coupe_Architecturale.dwg" type="DWG" meta="Ajouté par Dessin • 12.8 MB" color="#e0f2fe" textColor="#0369a1" />
                </div>
                <button 
                  onClick={exportPDF}
                  className="w-full bg-arch-primary text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#054030] transition-colors shadow-lg shadow-emerald-900/5 mt-auto"
                >
                  Générer Rapport PDF
                </button>
              </Widget>

            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// --- Sub-components (Themed) ---

function OnboardingIA() {
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    setResult(null);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        
        const response = await fetch("/api/onboarding/ocr", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileBase64: base64, mimeType: file.type })
        });

        if (!response.ok) throw new Error("Erreur lors de l'analyse");
        
        const data = await response.json();
        setResult(data);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError("Échec de l'analyse. Vérifiez le format du document.");
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <p className="text-xs opacity-90 leading-relaxed mb-6">
        Scannez votre Registre de Commerce ou ICE pour initialiser instantanément les données du cabinet.
      </p>
      
      {result ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/10 p-3 rounded-xl border border-white/20">
          <div className="text-[10px] font-bold uppercase opacity-60 mb-2 text-emerald-300 flex items-center gap-1">
            <CheckCircle2 size={10}/> Importation réussie
          </div>
          <div className="text-sm font-bold truncate">{result.raisonSociale}</div>
          <div className="text-[10px] opacity-80 mt-1">ICE: {result.ice} • RC: {result.rc}</div>
          <button onClick={() => setResult(null)} className="mt-3 text-[9px] font-bold underline opacity-60 hover:opacity-100">Scanner un autre document</button>
        </motion.div>
      ) : (
        <label className={`border-2 border-dashed border-white/20 rounded-2xl h-24 flex flex-col items-center justify-center gap-2 hover:bg-white/5 cursor-pointer transition-colors group relative overflow-hidden ${isUploading ? 'pointer-events-none' : ''}`}>
          <input type="file" className="hidden" onChange={handleFile} accept="image/*,application/pdf" />
          
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
              <span className="text-[10px] font-bold tracking-widest uppercase">Analyse IA en cours...</span>
            </div>
          ) : (
            <>
              <span className="text-[10px] font-bold tracking-widest uppercase">Déposer PDF / Image Ici</span>
              <span className="text-[10px] opacity-60 font-medium whitespace-nowrap">Moteur Gemini 2.0 Flash</span>
            </>
          )}
        </label>
      )}

      {error && <div className="mt-3 text-[10px] text-red-300 font-bold bg-red-900/20 p-2 rounded-lg">{error}</div>}
    </div>
  );
}

function NavItem({ icon, label, active = false, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active ? 'bg-[#f0fdf4] text-arch-primary font-bold' : 'text-arch-text-sub hover:bg-slate-50 hover:text-slate-700'}`}
    >
      <span className={active ? 'text-arch-primary' : 'text-slate-400'}>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function Widget({ children, label, statusTag, className = "", labelColor }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white border border-slate-200 p-5 rounded-2xl shadow-bento flex flex-col ${className}`}
    >
      <div className="flex justify-between items-center mb-4">
        <span style={{ color: labelColor || 'var(--color-arch-text-sub)' }} className="text-[10px] font-extrabold uppercase tracking-widest">{label}</span>
        {statusTag && (
          <span className="bg-[#dcfce7] text-[#166534] px-2 py-0.5 rounded-full text-[10px] font-bold">{statusTag}</span>
        )}
      </div>
      <div className="flex-1">
        {children}
      </div>
    </motion.div>
  );
}

function RentItem({ label, value, highlight }: any) {
  return (
    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 transition-colors hover:border-slate-200">
      <div className="text-[10px] text-arch-text-sub font-bold uppercase mb-1">{label}</div>
      <div className={`text-sm font-extrabold ${highlight ? 'text-emerald-700' : 'text-arch-primary'}`}>{value}</div>
    </div>
  );
}

function FileItem({ name, type, meta, color = "#fee2e2", textColor = "#b91c1c" }: any) {
  return (
    <div className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-50 bg-white hover:border-slate-200 transition-all cursor-default group">
      <div style={{ backgroundColor: color, color: textColor }} className="w-10 h-10 rounded-lg flex items-center justify-center font-black text-[10px] shadow-sm">
        {type}
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="text-[11px] font-bold text-slate-800 truncate group-hover:text-arch-primary transition-colors">{name}</div>
        <div className="text-[9px] text-arch-text-sub font-medium">{meta}</div>
      </div>
    </div>
  );
}
