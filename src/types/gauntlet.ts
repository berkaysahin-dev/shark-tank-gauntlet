export type JurorArchetypeId =
  | "cfo-penny-pincher"
  | "paranoid-ciso"
  | "friction-phobic"
  | "incumbent-loyalist"
  | "hype-tourist";

export type JurorStatus = "AWAITING" | "ACTIVE" | "CONVINCED" | "REJECTED";

export interface JurorConfig {
  id: JurorArchetypeId;
  name: string;
  nameTr: string;
  roleTitle: string;
  roleTitleTr: string;
  archetype: string;
  archetypeTr: string;
  motto: string;
  mottoTr: string;
  coreObjectionTemplate: string;
  coreObjectionTemplateTr: string;
  psychology: string;
  fatalTrigger: string;
  persuasionKey: string;
  initialConviction: number;
  silhouetteIndex: number;
}

export interface PitchData {
  productName: string;
  oneLiner: string;
  targetAudience: string;
  pricingModel: string;
}

export interface TurnExchange {
  jurorId: JurorArchetypeId;
  objection: string;
  userResponse: string;
  jurorReaction: string;
  scoreDelta: number;
  resultingConviction: number;
  isFatal: boolean;
  timestamp: number;
}

export interface JurorRuntimeState {
  conviction: number;
  status: JurorStatus;
  currentObjection: string;
  history: TurnExchange[];
}

export interface VerdictSummary {
  convincedCount: number;
  rejectedCount: number;
  averageConviction: number;
  termSheetStatus: "ACCEPTED" | "CONDITIONAL" | "REJECTED";
  valuationVerdict: string;
  lethalVulnerability: string;
  strategicRemedy: string;
}
