import { RegulatoryAnalysisInput, RegulatoryAnalysisResult } from "@/types/regulatory";

const API_BASE_URL = 'https://bfinax-be.onrender.com/api';

export const regulatoryAnalysisAPI = {
  analyze: async (data: RegulatoryAnalysisInput): Promise<RegulatoryAnalysisResult> => {
    const response = await fetch(`${API_BASE_URL}/regulations/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to analyze regulation');
    }

    return response.json();
  }
};