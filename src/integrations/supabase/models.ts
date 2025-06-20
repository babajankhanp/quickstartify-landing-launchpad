
// This file contains type definitions for our database models
import { Json } from "./types";

export interface Flow {
  id: string;
  name: string;
  description?: string;
  status: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  branding_config?: BrandingConfig;
  published_url?: string;
  embed_code?: string;
  is_published?: boolean;
}

export interface FlowStep {
  id: string;
  flow_id: string;
  title: string;
  content?: string;
  step_type: string; 
  position: number;
  created_at: string;
  updated_at: string;
  styling?: Record<string, any>;
}

export interface FlowAnalytics {
  id: string;
  flow_id: string;
  step_id: string;
  event_type: string;
  created_at: string;
  metadata?: Record<string, any>;
  session_id?: string;
  user_identifier?: string;
}

export interface FlowVariation {
  id: string;
  flow_id: string;
  name: string;
  description?: string;
  is_control?: boolean;
  traffic_allocation?: number;
  created_at: string;
  updated_at: string;
  settings?: Record<string, any>;
}

export interface Milestone {
  id: string;
  title: string;
  subtitle?: string;
  content?: string;
  formFields?: FormField[];
}

export interface FormField {
  id: string;
  name: string;
  type: string;
  required: boolean;
  placeholder?: string;
  validation?: string;
  options?: { label: string; value: string }[];
  isButton?: boolean;
  buttonLabel?: string;
  buttonAction?: string;
  buttonCollectMetrics?: boolean;
}

export interface BrandingConfig {
  primary_color?: string;
  secondary_color?: string;
  background_style?: 'color' | 'gradient' | 'image';
  background_color?: string;
  background_gradient?: string;
  background_image_url?: string;
  logo_url?: string;
  font_family?: string;
  card_style?: 'rounded' | 'sharp' | 'floating' | 'bordered';
  animation_style?: 'fade' | 'slide' | 'zoom' | 'flip' | 'none';
  custom_css?: string;
  privacy_policy_url?: string;
  terms_url?: string;
  footer_links?: { text: string; url: string }[];
}

// Helper function to convert JSON to typed objects
export function convertJsonToMilestones(json: Json): Milestone[] {
  if (!json || !Array.isArray(json)) {
    return [];
  }

  return json.map((item: any) => {
    return {
      id: item.id || '',
      title: item.title || '',
      subtitle: item.subtitle || '',
      content: item.content || '',
      formFields: Array.isArray(item.formFields) 
        ? item.formFields.map((field: any) => ({
            id: field.id || '',
            name: field.name || '',
            type: field.type || 'text',
            required: !!field.required,
            placeholder: field.placeholder || '',
            validation: field.validation || '',
            options: field.options || [],
            isButton: field.isButton || false,
            buttonLabel: field.buttonLabel || '',
            buttonAction: field.buttonAction || '',
            buttonCollectMetrics: field.buttonCollectMetrics || false
          }))
        : []
    };
  });
}

// Helper function to convert JSON to BrandingConfig
export function convertJsonToBrandingConfig(json: Json): BrandingConfig {
  if (!json) {
    return {};
  }

  const config = json as Record<string, any>;
  
  return {
    primary_color: config.primary_color || '',
    secondary_color: config.secondary_color || '',
    background_style: config.background_style as ('color' | 'gradient' | 'image') || 'gradient',
    background_color: config.background_color || '',
    background_gradient: config.background_gradient || '',
    background_image_url: config.background_image_url || '',
    logo_url: config.logo_url || '',
    font_family: config.font_family || '',
    card_style: config.card_style as ('rounded' | 'sharp' | 'floating' | 'bordered') || 'rounded',
    animation_style: config.animation_style as ('fade' | 'slide' | 'zoom' | 'flip' | 'none') || 'none',
    custom_css: config.custom_css || '',
    privacy_policy_url: config.privacy_policy_url || '',
    terms_url: config.terms_url || '',
    footer_links: Array.isArray(config.footer_links) ? config.footer_links : []
  };
}

// Helper function to generate a UUID
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}