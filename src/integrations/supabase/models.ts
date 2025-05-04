
export interface Flow {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  is_active: boolean;
  is_draft: boolean;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface FlowStep {
  id: string;
  flow_id: string;
  title: string;
  content: string | null;
  step_type: 'tooltip' | 'modal' | 'hotspot' | 'slideout' | 'checklist';
  dom_selector: string | null;
  page_url: string | null;
  position: number;
  targeting_rules: Record<string, any>;
  styling: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface FlowVariation {
  id: string;
  flow_id: string;
  name: string;
  traffic_percentage: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FlowAnalytic {
  id: string;
  flow_id: string;
  step_id: string | null;
  variation_id: string | null;
  user_id: string | null;
  event_type: 'view' | 'complete' | 'skip' | 'click';
  created_at: string;
}
