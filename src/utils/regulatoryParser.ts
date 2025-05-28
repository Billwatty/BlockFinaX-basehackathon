import { ParsedAnalysisResult, RegulatoryAnalysisResult } from "@/types/regulatory";

export const parseAnalysisResult = (result: RegulatoryAnalysisResult): ParsedAnalysisResult => {
  const summary = result.summary;
  const citations = result.citations;
  
  // Extract key requirements from summary
  const requirementPatterns = [
    /certificate of origin/i,
    /commercial invoice/i,
    /packing list/i,
    /bill of lading/i,
    /export license/i,
    /import permit/i,
    /quality certificate/i,
    /phytosanitary certificate/i,
  ];

  const detectedRequirements = requirementPatterns
    .filter(pattern => pattern.test(summary))
    .map(pattern => {
      const match = pattern.source.replace(/[/\\^$.*+?()[\]{}|]/g, '');
      return match.charAt(0).toUpperCase() + match.slice(1).replace(/([A-Z])/g, ' $1');
    });

  // Extract tariff information
  const tariffMatch = summary.match(/(\d+(?:\.\d+)?%?\s*(?:duty|tariff|tax))/gi);
  const detectedTariffs = tariffMatch || [];

  // Determine restriction level
  let restrictionLevel: 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
  if (summary.toLowerCase().includes('restricted') || 
      summary.toLowerCase().includes('prohibited') || 
      summary.toLowerCase().includes('license required')) {
    restrictionLevel = 'HIGH';
  } else if (summary.toLowerCase().includes('permit') || 
             summary.toLowerCase().includes('approval') ||
             detectedTariffs.length > 0) {
    restrictionLevel = 'MEDIUM';
  }

  return {
    summary: result.summary,
    restrictionLevel,
    keyRequirements: detectedRequirements.length > 0 ? detectedRequirements : [
      'Standard export documentation required',
      'Customs declaration necessary',
      'Commercial invoice and packing list',
    ],
    citations: result.citations,
    lastUpdated: result.lastUpdated,
    _id: result._id,
  };
};
