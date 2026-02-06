export interface Violation {
  id: number;
  vehicle_id?: number;
  image_gcs_uri: string;
  ocr_result: string;
  detected_speed: number;
  speed_limit: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  detected_at: string;
  location?: string;
  camera_id?: string;
  ocr_confidence?: number;
  processed_at?: string;
  error_message?: string;
  created_at: string;
  updated_at?: string;
}

export interface StatsData {
  totalViolations: number;
  checked: number;
  pendingReview: number;
  avgSpeed: number;
}
