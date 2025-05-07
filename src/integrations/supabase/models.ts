
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
  branding_config?: BrandingConfig | null;
}

export interface BrandingConfig {
  logo_url?: string;
  primary_color?: string;
  secondary_color?: string;
  background_style?: 'color' | 'gradient' | 'image';
  background_color?: string;
  background_gradient?: string;
  background_image_url?: string;
  animation_style?: 'fade' | 'slide' | 'zoom' | 'flip' | 'bounce';
  card_style?: 'rounded' | 'sharp' | 'floating' | 'bordered';
  font_family?: string;
  footer_links?: FooterLink[];
  privacy_policy_url?: string;
  terms_url?: string;
  custom_css?: string;
}

export interface FooterLink {
  text: string;
  url: string;
}

export interface FlowStep {
  id: string;
  flow_id: string;
  title: string;
  content: string | null;
  step_type: 'tooltip' | 'modal' | 'hotspot' | 'slideout' | 'checklist';
  position: number;
  created_at: string;
  updated_at: string;
  dom_selector?: string | null;
  page_url?: string | null;
  targeting_rules?: Record<string, any>;
  styling?: Record<string, any>;
  milestones?: Milestone[];
  actions?: StepAction[];
}

export interface Milestone {
  id: string;
  title: string;
  subtitle?: string;
  content?: string;
  formFields?: FormField[];
  isCompleted?: boolean;
}

export interface FormField {
  id: string;
  name: string;
  type: string;
  required: boolean;
  validation?: string;
  placeholder?: string;
  richTextContent?: string;
  isButton?: boolean;
  buttonAction?: string;
  buttonApiEndpoint?: string;
  buttonCollectMetrics?: boolean;
  buttonLabel?: string;
  options?: {label: string, value: string}[];
}

export interface StepAction {
  id: string;
  type: 'api_call' | 'analytics' | 'navigation' | 'custom';
  name: string;
  endpoint?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  payload?: Record<string, any>;
  trigger?: 'on_view' | 'on_complete' | 'on_skip' | 'on_button_click';
  button_id?: string;
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

// Import Json type for type casting
import { Json } from './types';

// Type guards for safe type conversions
export function isMilestone(obj: any): obj is Milestone {
  return obj && typeof obj === 'object' && 'id' in obj && 'title' in obj;
}

export function isStepAction(obj: any): obj is StepAction {
  return obj && typeof obj === 'object' && 'id' in obj && 'type' in obj && 'name' in obj;
}

// Helper functions to convert Json types to our model types
export function convertJsonToMilestones(json: Json | null): Milestone[] {
  if (!json || !Array.isArray(json)) return [];
  return json.map(item => {
    const milestone = item as Record<string, any>;
    return {
      id: milestone.id || `milestone-${Date.now()}`,
      title: milestone.title || 'Untitled',
      subtitle: milestone.subtitle,
      content: milestone.content,
      formFields: milestone.formFields as FormField[],
      isCompleted: milestone.isCompleted
    };
  });
}

export function convertJsonToStepActions(json: Json | null): StepAction[] {
  if (!json || !Array.isArray(json)) return [];
  return json.map(item => {
    const action = item as Record<string, any>;
    return {
      id: action.id || `action-${Date.now()}`,
      type: action.type || 'custom',
      name: action.name || 'Unnamed Action',
      endpoint: action.endpoint,
      method: action.method,
      headers: action.headers,
      payload: action.payload,
      trigger: action.trigger,
      button_id: action.button_id
    };
  });
}
