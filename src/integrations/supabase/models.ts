
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

// Fixed: Properly cast milestone objects to Json type
export function convertMilestonesToJson(milestones: Milestone[]): Json[] {
  if (!milestones || !Array.isArray(milestones)) return [];
  return milestones.map(milestone => {
    // Convert form fields to plain objects 
    const formFields = milestone.formFields ? milestone.formFields.map(field => ({
      id: field.id,
      name: field.name,
      type: field.type,
      required: field.required,
      validation: field.validation || '',
      placeholder: field.placeholder || '',
      richTextContent: field.richTextContent || '',
      isButton: field.isButton || false,
      buttonAction: field.buttonAction || '',
      buttonApiEndpoint: field.buttonApiEndpoint || '',
      buttonCollectMetrics: field.buttonCollectMetrics || false,
      buttonLabel: field.buttonLabel || '',
      options: field.options || []
    })) : [];
    
    // Create a plain object for the milestone
    const plainObject = {
      id: milestone.id,
      title: milestone.title,
      subtitle: milestone.subtitle || '',
      content: milestone.content || '',
      formFields: formFields,
      isCompleted: milestone.isCompleted || false
    };
    
    // Cast to Json type
    return plainObject as unknown as Json;
  });
}

export function convertStepActionsToJson(actions: StepAction[]): Json[] {
  if (!actions || !Array.isArray(actions)) return [];
  return actions.map(action => {
    // Convert each action to a plain object that's JSON serializable
    const plainObject = {
      id: action.id,
      type: action.type,
      name: action.name,
      endpoint: action.endpoint || '',
      method: action.method || '',
      headers: action.headers || {},
      payload: action.payload || {},
      trigger: action.trigger || '',
      button_id: action.button_id || ''
    };
    
    // Cast to Json type
    return plainObject as unknown as Json;
  });
}

// Convert BrandingConfig to Json for database storage
export function convertBrandingConfigToJson(config: BrandingConfig | null): Json | null {
  if (!config) return null;
  
  // Convert footer links to plain objects
  const footerLinks = config.footer_links ? config.footer_links.map(link => ({
    text: link.text,
    url: link.url
  })) : [];
  
  // Create a plain object for the branding config
  const plainObject = {
    logo_url: config.logo_url || '',
    primary_color: config.primary_color || '',
    secondary_color: config.secondary_color || '',
    background_style: config.background_style || 'color',
    background_color: config.background_color || '',
    background_gradient: config.background_gradient || '',
    background_image_url: config.background_image_url || '',
    animation_style: config.animation_style || '',
    card_style: config.card_style || 'rounded',
    font_family: config.font_family || '',
    footer_links: footerLinks,
    privacy_policy_url: config.privacy_policy_url || '',
    terms_url: config.terms_url || '',
    custom_css: config.custom_css || ''
  };
  
  // Cast to Json type
  return plainObject as unknown as Json;
}

// Convert Json to BrandingConfig
export function convertJsonToBrandingConfig(json: Json | null): BrandingConfig | null {
  if (!json) return null;
  
  const brandingData = json as Record<string, any>;
  
  // Convert footer links from Json
  const footerLinks = brandingData.footer_links && Array.isArray(brandingData.footer_links)
    ? brandingData.footer_links.map((link: any) => ({
        text: link.text || '',
        url: link.url || ''
      }))
    : [];
  
  // Create branding config from Json
  return {
    logo_url: brandingData.logo_url,
    primary_color: brandingData.primary_color,
    secondary_color: brandingData.secondary_color,
    background_style: brandingData.background_style as 'color' | 'gradient' | 'image',
    background_color: brandingData.background_color,
    background_gradient: brandingData.background_gradient,
    background_image_url: brandingData.background_image_url,
    animation_style: brandingData.animation_style as 'fade' | 'slide' | 'zoom' | 'flip' | 'bounce',
    card_style: brandingData.card_style as 'rounded' | 'sharp' | 'floating' | 'bordered',
    font_family: brandingData.font_family,
    footer_links: footerLinks,
    privacy_policy_url: brandingData.privacy_policy_url,
    terms_url: brandingData.terms_url,
    custom_css: brandingData.custom_css
  };
}

// Generate a valid UUID for database compatibility
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0,
        v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Helper function to serialize complex objects for database storage
export function serializeForDatabase(obj: any): any {
  // Handle arrays recursively
  if (Array.isArray(obj)) {
    return obj.map(item => serializeForDatabase(item));
  }
  
  // Handle objects recursively
  if (obj && typeof obj === 'object') {
    const result: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(obj)) {
      // Skip functions and undefined values
      if (typeof value !== 'function' && value !== undefined) {
        result[key] = serializeForDatabase(value);
      }
    }
    
    return result;
  }
  
  // Return primitives as-is
  return obj;
}
