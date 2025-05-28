import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Book, 
  BookOpen, 
  Globe, 
  Loader2, 
  Check, 
  ArrowLeft,
  Download,
  Share2,
  Printer,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ACTIVITY_TYPES, COUNTRIES, PRODUCT_CATEGORIES, RegulatoryAnalysisInput, RegulatoryAnalysisResult } from '@/types/regulatory';
import { parseAnalysisResult } from '@/utils/regulatoryParser';

// API Configuration
const API_BASE_URL = 'https://bfinax-be.onrender.com/api';

// API Service
const regulatoryAnalysisAPI = {
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

const RegulatoryAITabContent: React.FC = () => {
  const queryClient = useQueryClient();
  
  const [showForm, setShowForm] = useState(true);
  const [product, setProduct] = useState('');
  const [destinationCountry, setDestinationCountry] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [activityType, setActivityType] = useState('Export');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [currentAnalysisId, setCurrentAnalysisId] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState('summary');
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Toast utility function
  const showToast = (type: 'success' | 'error', message: string) => {
    setToastMessage({ type, message });
    setTimeout(() => setToastMessage(null), 5000);
  };

  // Mutation for analyzing regulations
  const analysisMutation = useMutation({
    mutationFn: regulatoryAnalysisAPI.analyze,
    onSuccess: (data) => {
      setCurrentAnalysisId(data._id);
      setShowForm(false);
      showToast('success', 'Analysis completed successfully!');
      // Cache the result for potential future use
      queryClient.setQueryData(['regulatory-analysis', data._id], data);
    },
    onError: (error: Error) => {
      showToast('error', error.message || 'Failed to analyze regulatory requirements');
    },
  });

  // Query for fetching specific analysis (if needed)
  const { data: analysisResult } = useQuery({
    queryKey: ['regulatory-analysis', currentAnalysisId],
    queryFn: () => queryClient.getQueryData(['regulatory-analysis', currentAnalysisId]),
    enabled: !!currentAnalysisId && !showForm,
  });

  // Handle form submission
  const handleAnalyzeClick = () => {
    if (!product || !destinationCountry || !productCategory || !activityType) {
      showToast('error', 'Please fill in all required fields');
      return;
    }

    // Build query string
    const query = `What are the ${activityType.toLowerCase()} requirements for ${product} (${productCategory}) to ${COUNTRIES.find(c => c.code === destinationCountry)?.name}?${additionalDetails ? ` Additional details: ${additionalDetails}` : ''}`;

    const analysisData: RegulatoryAnalysisInput = {
      query,
      country: COUNTRIES.find(c => c.code === destinationCountry)?.name || destinationCountry,
      productCategory,
      activityType,
    };

    analysisMutation.mutate(analysisData);
  };

  // Handle reset/new analysis
  const handleReset = () => {
    setCurrentAnalysisId(null);
    setShowForm(true);
    setCurrentTab('summary');
  };

  // Form View
  const renderFormView = () => (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
      {/* Toast Messages */}
      {toastMessage && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg ${
          toastMessage.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 
          'bg-red-100 text-red-800 border border-red-200'
        }`}>
          <div className="flex items-center">
            {toastMessage.type === 'success' ? 
              <Check className="w-4 h-4 mr-2" /> : 
              <AlertCircle className="w-4 h-4 mr-2" />
            }
            {toastMessage.message}
          </div>
        </div>
      )}

      <Card className="border-2 shadow-lg md:col-span-5 xl:col-span-4 border-primary/10 bg-gradient-to-b from-white to-primary/5">
        <CardHeader className="pb-2">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-primary/10">
              <Globe className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle>Export Compliance Check</CardTitle>
              <CardDescription>Verify regulatory requirements for your trade</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label htmlFor="product-quick" className="block mb-1 text-sm font-medium">
                Product Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="product-quick"
                placeholder="e.g. Coffee Beans"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="destination-quick" className="block mb-1 text-sm font-medium">
                  Destination Country <span className="text-red-500">*</span>
                </label>
                <Select
                  value={destinationCountry}
                  onValueChange={setDestinationCountry}
                >
                  <SelectTrigger id="destination-quick">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label htmlFor="activity-type" className="block mb-1 text-sm font-medium">
                  Activity Type <span className="text-red-500">*</span>
                </label>
                <Select
                  value={activityType}
                  onValueChange={setActivityType}
                >
                  <SelectTrigger id="activity-type">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {ACTIVITY_TYPES.map((activity) => (
                      <SelectItem key={activity} value={activity}>
                        {activity}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <label htmlFor="category-quick" className="block mb-1 text-sm font-medium">
                Product Category <span className="text-red-500">*</span>
              </label>
              <Select
                value={productCategory}
                onValueChange={setProductCategory}
              >
                <SelectTrigger id="category-quick">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label htmlFor="details" className="block mb-1 text-sm font-medium">
                Additional Details (Optional)
              </label>
              <Textarea
                id="details"
                placeholder="Add specific details (specifications, intended use, etc.)"
                value={additionalDetails}
                onChange={(e) => setAdditionalDetails(e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <Button 
            className="justify-between w-full" 
            onClick={handleAnalyzeClick}
            disabled={analysisMutation.isPending}
          >
            {analysisMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing Requirements...
              </>
            ) : (
              <>
                Analyze Requirements
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      <Card className="border border-blue-100 shadow-md md:col-span-7 xl:col-span-8 bg-blue-50/30">
        <CardHeader className="pb-2">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle>About Export Regulatory Assistant</CardTitle>
              <CardDescription>
                AI-powered guidance for navigating international trade regulations
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>
              Our Export Regulatory Assistant helps traders navigate the complex landscape of African trade regulations 
              by providing guidance tailored to specific products and destinations across African countries.
            </p>
            
            <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
              <div className="flex items-start">
                <div className="p-2 mr-3 rounded-full bg-primary/10">
                  <Check className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">Required Documentation</h4>
                  <p className="text-sm text-muted-foreground">
                    Understand what paperwork is needed for your trade
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="p-2 mr-3 rounded-full bg-primary/10">
                  <Check className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">Compliance Requirements</h4>
                  <p className="text-sm text-muted-foreground">
                    Learn about relevant regulations and standards
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="p-2 mr-3 rounded-full bg-primary/10">
                  <Check className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">Real-time Analysis</h4>
                  <p className="text-sm text-muted-foreground">
                    Get up-to-date regulatory information from our API
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="p-2 mr-3 rounded-full bg-primary/10">
                  <Check className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">Citations & Sources</h4>
                  <p className="text-sm text-muted-foreground">
                    View official regulations and legal references
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
  
  // Analysis Results View
  const renderAnalysisResults = () => {
    if (!analysisResult) return null;
    
    const parsedResult = parseAnalysisResult(analysisResult as RegulatoryAnalysisResult);
    
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Toast Messages */}
        {toastMessage && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg ${
            toastMessage.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 
            'bg-red-100 text-red-800 border border-red-200'
          }`}>
            <div className="flex items-center">
              {toastMessage.type === 'success' ? 
                <Check className="w-4 h-4 mr-2" /> : 
                <AlertCircle className="w-4 h-4 mr-2" />
              }
              {toastMessage.message}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleReset}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              New Analysis
            </Button>
            <Badge variant="outline" className="ml-2 text-sm">
              Analysis ID: {parsedResult._id.slice(-6)}
            </Badge>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
          </div>
        </div>
        
        <Card className="overflow-hidden border-2 shadow-lg border-primary/10">
          <div className="h-2 bg-gradient-to-r from-primary via-primary/70 to-blue-400"></div>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="p-2.5 bg-primary/10 rounded-full">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Regulatory Analysis Results</CardTitle>
                  <CardDescription className="mt-1">
                    {product} - {activityType} to {COUNTRIES.find(c => c.code === destinationCountry)?.name}
                  </CardDescription>
                </div>
              </div>
              {parsedResult.restrictionLevel && (
                <Badge className={`
                  ${parsedResult.restrictionLevel === 'HIGH' ? 'bg-red-100 text-red-800 hover:bg-red-100' : ''}
                  ${parsedResult.restrictionLevel === 'MEDIUM' ? 'bg-amber-100 text-amber-800 hover:bg-amber-100' : ''}
                  ${parsedResult.restrictionLevel === 'LOW' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}
                  px-3 py-1 text-sm font-medium
                `}>
                  {parsedResult.restrictionLevel === 'HIGH' ? 'High Restrictions' : ''}
                  {parsedResult.restrictionLevel === 'MEDIUM' ? 'Medium Restrictions' : ''}
                  {parsedResult.restrictionLevel === 'LOW' ? 'Low Restrictions' : ''}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={currentTab} onValueChange={setCurrentTab}>
              <TabsList className="grid w-full grid-cols-3 p-1 rounded-md bg-primary/5">
                <TabsTrigger value="summary" className="text-sm font-medium">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Summary
                </TabsTrigger>
                <TabsTrigger value="requirements" className="text-sm font-medium">
                  <Check className="w-4 h-4 mr-2" />
                  Requirements
                </TabsTrigger>
                <TabsTrigger value="sources" className="text-sm font-medium">
                  <Book className="w-4 h-4 mr-2" />
                  Sources & Citations
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="summary" className="mt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="mb-3 text-lg font-medium">Analysis Summary</h3>
                    <div className="p-4 rounded-md bg-gray-50">
                      <p className="leading-relaxed text-gray-700">{parsedResult.summary}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="p-4 rounded-md bg-blue-50">
                      <h4 className="mb-2 font-medium text-blue-900">Product Category</h4>
                      <p className="text-blue-700">{productCategory}</p>
                    </div>
                    <div className="p-4 rounded-md bg-green-50">
                      <h4 className="mb-2 font-medium text-green-900">Activity Type</h4>
                      <p className="text-green-700">{activityType}</p>
                    </div>
                  </div>

                  {parsedResult.lastUpdated && (
                    <div className="text-sm text-gray-500">
                      Last updated: {new Date(parsedResult.lastUpdated).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="requirements" className="mt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="mb-3 text-lg font-medium">Key Requirements</h3>
                    <ul className="space-y-3">
                      {parsedResult.keyRequirements.map((req: string, idx: number) => (
                        <li key={idx} className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Alert>
                    <AlertCircle className="w-4 h-4" />
                    <AlertTitle>Important Note</AlertTitle>
                    <AlertDescription>
                      Requirements may vary based on specific product specifications and current regulations. 
                      Always verify with relevant authorities before proceeding with your trade activities.
                    </AlertDescription>
                  </Alert>
                </div>
              </TabsContent>
              
              <TabsContent value="sources" className="mt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="mb-3 text-lg font-medium">Legal Citations & Sources</h3>
                    
                    {parsedResult.citations && parsedResult.citations.length > 0 ? (
                      <div className="space-y-3">
                        {parsedResult.citations.map((citation: string, idx: number) => (
                          <div key={idx} className="p-4 rounded-md bg-gray-50">
                            <div className="flex items-start">
                              <Book className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="font-medium text-gray-900">{citation}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center rounded-md bg-gray-50">
                        <p className="text-gray-600">No specific citations available for this analysis.</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-start">
            <Alert className="w-full bg-blue-50">
              <AlertCircle className="w-4 h-4" />
              <AlertTitle>Disclaimer</AlertTitle>
              <AlertDescription className="text-sm">
                This analysis is provided for informational purposes only and should not be considered legal advice.
                Regulations change frequently, so always consult with customs and trade authorities for the most up-to-date requirements.
              </AlertDescription>
            </Alert>
          </CardFooter>
        </Card>
      </div>
    );
  };
  
  return (
    <>
      {showForm ? renderFormView() : renderAnalysisResults()}
    </>
  );
};

export default RegulatoryAITabContent;