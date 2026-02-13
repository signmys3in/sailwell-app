"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState, useTransition, useContext, useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { getDrugSuggestions } from "@/app/actions";
import { CHRONIC_DISEASES, COUNTRY_DRUG_NAMES } from "@/lib/data";
import type { DrugSuggestion, DrugStock as DrugStockType, PatientInfo } from "@/lib/types";
import { AppContext } from "@/contexts/app-context";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, ArrowLeft, ArrowRight, Bot, Loader2, Pill, Redo, ShieldCheck } from "lucide-react";
import { Label } from "@/components/ui/label";
import InteractiveBodyDiagram, { BodyPart, BODY_PARTS } from "@/components/interactive-body-diagram";
import { Badge } from "@/components/ui/badge";


// Schemas
const patientInfoSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  dob: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date of birth."),
  alcoholUsage: z.enum(["none", "moderate", "heavy"]),
  isSmoker: z.boolean().default(false),
  chronicDiseases: z.array(z.string()),
});

const symptomsSchema = z.object({
  symptoms: z.string().min(10, "Please describe symptoms in at least 10 characters."),
  temperature: z.string().optional(),
  bloodPressure: z.string().optional(),
  heartRate: z.string().optional(),
});

type SymptomsInfo = z.infer<typeof symptomsSchema>;

// Main Component
export default function MediAssistantPage() {
  const [step, setStep] = useState(1);
  const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(null);
  const [selectedBodyParts, setSelectedBodyParts] = useState<BodyPart[]>([]);
  const [suggestions, setSuggestions] = useState<DrugSuggestion[]>([]);
  const [diagnosis, setDiagnosis] = useState<string | null>(null);
  const [severity, setSeverity] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const { addDrugsToStock } = useContext(AppContext);

  const startOver = () => {
    setStep(1);
    setPatientInfo(null);
    setSelectedBodyParts([]);
    setSuggestions([]);
    setError(null);
    setDiagnosis(null);
    setSeverity(null);
  };

  const onPatientInfoSubmit = (values: PatientInfo) => {
    setPatientInfo(values);
    setStep(2);
  };

  const onBodyPartSelectionSubmit = (parts: BodyPart[]) => {
    setSelectedBodyParts(parts);
    setStep(3);
  };

  const onSymptomsSubmit = (values: SymptomsInfo) => {
    if (!patientInfo) return;
    const input = {
      symptoms: values.symptoms,
      chronicDiseases: patientInfo.chronicDiseases,
      temperature: values.temperature,
      bloodPressure: values.bloodPressure,
      heartRate: values.heartRate,
    };

    setStep(4);
    startTransition(async () => {
      const result = await getDrugSuggestions(input);
      if (result.error) {
        setError(result.error);
        setDiagnosis(null);
        setSeverity(null);
      } else {
        const newSuggestions = result.suggestions || [];
        if (newSuggestions.length > 0) {
          addDrugsToStock(newSuggestions.map(s => ({ name: s.drugName, isNarcotic: s.isNarcotic })));
        }
        setSuggestions(newSuggestions);
        setDiagnosis(result.diagnosis || "No diagnosis provided.");
        setSeverity(result.severity || null);
      }
    });
  };

  const currentProgress = (step / 4) * 100;

  return (
    <div className="flex flex-col h-full">
      <header className="mb-6">
        <h1 className="text-4xl font-bold tracking-tighter">MediAssistant</h1>
        <p className="text-muted-foreground">Your AI-Powered Drug Suggestion Tool</p>
      </header>
      <div className="w-full mb-6">
        <Progress value={currentProgress} className="h-2" />
      </div>

      <div className="flex-grow">
        {step === 1 && <PatientInfoStep onSubmit={onPatientInfoSubmit} />}
        {step === 2 && (
          <BodyPartSelectionStep
            initialSelectedParts={selectedBodyParts}
            onSubmit={onBodyPartSelectionSubmit}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && (
          <SymptomsStep
            onSubmit={onSymptomsSubmit}
            onBack={() => setStep(2)}
            initialSelectedParts={selectedBodyParts}
          />
        )}
        {step === 4 && patientInfo && (
          <SuggestionsStep
            suggestions={suggestions}
            isLoading={isPending}
            error={error}
            onStartOver={startOver}
            patientInfo={patientInfo}
            diagnosis={diagnosis}
            severity={severity}
          />
        )}
      </div>
    </div>
  );
}

// Step 1: Patient Info
function PatientInfoStep({ onSubmit }: { onSubmit: (values: PatientInfo) => void }) {
  const form = useForm<PatientInfo>({
    resolver: zodResolver(patientInfoSchema),
    defaultValues: {
      name: "",
      dob: "",
      alcoholUsage: "none",
      isSmoker: false,
      chronicDiseases: [],
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Medical ID</CardTitle>
        <CardDescription>
          Please enter the patient's information. All data is handled locally.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <Label>Full Name</Label>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem>
                    <Label>Date of Birth</Label>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="alcoholUsage"
                render={({ field }) => (
                  <FormItem>
                    <Label>Alcohol Usage</Label>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select usage level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="heavy">Heavy</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isSmoker"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-start space-x-3 space-y-0 rounded-md border p-4 h-full">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <Label>Smoker</Label>
                      <FormDescription>
                        Check if the patient is a smoker.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="chronicDiseases"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <Label className="text-base">Chronic Diseases</Label>
                    <FormDescription>
                      Select any pre-existing chronic diseases.
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {CHRONIC_DISEASES.map((disease) => (
                      <FormField
                        key={disease}
                        control={form.control}
                        name="chronicDiseases"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={disease}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(disease)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...field.value,
                                          disease,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== disease
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <Label className="font-normal">
                                {disease}
                              </Label>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit">
              Next <ArrowRight />
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

// Step 2: Body Part Selection
function BodyPartSelectionStep({
  initialSelectedParts,
  onSubmit,
  onBack,
}: {
  initialSelectedParts: BodyPart[];
  onSubmit: (parts: BodyPart[]) => void;
  onBack: () => void;
}) {
  const [selectedParts, setSelectedParts] = useState<BodyPart[]>(initialSelectedParts);

  const handlePartClick = (part: BodyPart) => {
    setSelectedParts((prev) =>
      prev.includes(part) ? prev.filter((p) => p !== part) : [...prev, part]
    );
  };

  const handleSubmit = () => {
    onSubmit(selectedParts);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pain Area Selection</CardTitle>
        <CardDescription>
          Click on the body parts where the patient is experiencing pain. You can
          select multiple areas.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <InteractiveBodyDiagram
          selectedParts={selectedParts}
          onPartClick={handlePartClick}
        />
        <div className="mt-4 flex flex-wrap gap-2">
            {selectedParts.map(part => (
                <Badge key={part} variant="secondary" className="text-sm">
                    {BODY_PARTS[part]}
                </Badge>
            ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          <ArrowLeft /> Back
        </Button>
        <Button type="button" onClick={handleSubmit}>
          Next <ArrowRight />
        </Button>
      </CardFooter>
    </Card>
  );
}

// Step 3: Symptoms
function SymptomsStep({
  onSubmit,
  onBack,
  initialSelectedParts,
}: {
  onSubmit: (values: SymptomsInfo) => void;
  onBack: () => void;
  initialSelectedParts: BodyPart[];
}) {
  const form = useForm<SymptomsInfo>({
    resolver: zodResolver(symptomsSchema),
    defaultValues: {
      symptoms: "",
      temperature: "",
      bloodPressure: "",
      heartRate: "",
    },
  });

  useEffect(() => {
    if (initialSelectedParts.length > 0) {
      const initialSymptoms = initialSelectedParts
        .map(part => `Pain in ${BODY_PARTS[part]}`)
        .join(', ');
      form.setValue('symptoms', initialSymptoms + '. ');
    }
  }, [initialSelectedParts, form]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Symptoms & Vital Signs</CardTitle>
        <CardDescription>
          Describe the patient's symptoms and provide vital signs if available.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="symptoms"
              render={({ field }) => (
                <FormItem>
                  <Label>Symptom Description</Label>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., persistent headache, fever, and sore throat for 3 days..."
                      className="resize-none h-40"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Describe the patient's symptoms in detail. You can add more information to what was pre-filled from the body diagram.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
                <Label className="text-base">Vital Signs (Optional)</Label>
                <div className="grid grid-cols-3 gap-4 mt-2">
                    <FormField control={form.control} name="temperature" render={({ field }) => (
                        <FormItem><Label className="text-sm font-normal">Temp (°C)</Label><FormControl><Input placeholder="37.5" {...field} /></FormControl></FormItem>
                    )}/>
                    <FormField control={form.control} name="bloodPressure" render={({ field }) => (
                        <FormItem><Label className="text-sm font-normal">BP (mmHg)</Label><FormControl><Input placeholder="120/80" {...field} /></FormControl></FormItem>
                    )}/>
                    <FormField control={form.control} name="heartRate" render={({ field }) => (
                        <FormItem><Label className="text-sm font-normal">HR (bpm)</Label><FormControl><Input placeholder="70" {...field} /></FormControl></FormItem>
                    )}/>
                </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={onBack}>
              <ArrowLeft /> Back
            </Button>
            <Button type="submit">
              Get Suggestions <Bot />
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

// Step 4: Suggestions
function SuggestionsStep({ suggestions, isLoading, error, onStartOver, patientInfo, diagnosis, severity }: { suggestions: DrugSuggestion[], isLoading: boolean, error: string | null, onStartOver: () => void, patientInfo: PatientInfo, diagnosis: string | null, severity: string | null }) {
  const { drugStock } = useContext(AppContext);
  const [isDiagnosisModalOpen, setDiagnosisModalOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && diagnosis) {
      setDiagnosisModalOpen(true);
    }
  }, [isLoading, diagnosis]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
        <h2 className="text-2xl font-semibold">Generating Suggestions...</h2>
        <p className="text-muted-foreground">Our AI is analyzing the patient's data. Please wait.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <Alert variant="destructive" className="max-w-lg">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={onStartOver} className="mt-6">
          <Redo className="mr-2 h-4 w-4" /> Try Again
        </Button>
      </div>
    );
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Drug Suggestions</CardTitle>
          <CardDescription>
            Based on the provided information, here are some potential medication suggestions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {suggestions.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suggestions.map((suggestion) => {
                const stockInfo = drugStock.find(d => d.name.toLowerCase() === suggestion.drugName.toLowerCase());
                return <DrugCard key={suggestion.drugName} suggestion={suggestion} stockInfo={stockInfo} patientInfo={patientInfo} diagnosis={diagnosis} />;
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p>No specific drug suggestions could be generated.</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-start">
            <Button onClick={onStartOver}>
              <Redo/> Start Over
            </Button>
        </CardFooter>
      </Card>
      {diagnosis && severity && <DiagnosisDialog open={isDiagnosisModalOpen} onOpenChange={setDiagnosisModalOpen} diagnosis={diagnosis} severity={severity} />}
    </div>
  );
}

// Drug Card Component
function DrugCard({ suggestion, stockInfo, patientInfo, diagnosis }: { suggestion: DrugSuggestion, stockInfo: DrugStockType | undefined, patientInfo: PatientInfo, diagnosis: string | null }) {
  const { dispenseDrug } = useContext(AppContext);
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedCountry, setSelectedCountry] = useState('Generic');
  const [isNarcoticModalOpen, setNarcoticModalOpen] = useState(false);

  const stockLevel = stockInfo ? (stockInfo.stock / stockInfo.maxStock) * 100 : 0;
  
  const availableCountries = Object.keys(COUNTRY_DRUG_NAMES).filter(country => 
    Object.keys(COUNTRY_DRUG_NAMES[country]).some(drug => drug.toLowerCase() === suggestion.drugName.toLowerCase())
  );

  const getCommercialName = (country: string, drug: string) => {
    if (country === 'Generic' || !COUNTRY_DRUG_NAMES[country]) {
        return undefined;
    }
    const drugKey = Object.keys(COUNTRY_DRUG_NAMES[country]).find(key => key.toLowerCase() === drug.toLowerCase());
    return drugKey ? COUNTRY_DRUG_NAMES[country][drugKey] : undefined;
  }
  
  const commercialName = getCommercialName(selectedCountry, suggestion.drugName);

  const handleDispense = () => {
    if (!stockInfo || stockInfo.stock < quantity) {
      toast({ variant: "destructive", title: "Out of Stock", description: "Not enough stock to dispense." });
      return;
    }
    if (stockInfo.isNarcotic) {
        setNarcoticModalOpen(true);
    } else {
        dispenseDrug(stockInfo.id, quantity, patientInfo.name, diagnosis || 'AI-assisted diagnosis', patientInfo.chronicDiseases);
        toast({ variant: "default", title: "Dispensed", description: `${quantity} x ${stockInfo.name} dispensed.`, className: "bg-accent text-accent-foreground" });
    }
  };

  const onNarcoticApproved = () => {
      if (!stockInfo) return;
      dispenseDrug(stockInfo.id, quantity, patientInfo.name, diagnosis || 'AI-assisted diagnosis', patientInfo.chronicDiseases);
      toast({ variant: "default", title: "Dispensed", description: `${quantity} x ${stockInfo.name} dispensed with approval.`, className: "bg-accent text-accent-foreground" });
      setNarcoticModalOpen(false);
  }

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Pill /> {suggestion.drugName}
          {stockInfo?.isNarcotic && <ShieldCheck className="text-destructive"/>}
        </CardTitle>
        {commercialName && selectedCountry !== 'Generic' && (
          <CardDescription>{selectedCountry} Brand: {commercialName}</CardDescription>
        )}
        <CardDescription>{suggestion.dosage || 'Dosage not specified'}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div>
          <h4 className="font-semibold text-sm mb-1">Reasoning</h4>
          <p className="text-sm text-muted-foreground">{suggestion.reasoning}</p>
        </div>
        <div>
            <h4 className="font-semibold text-sm mb-1">Stock Level</h4>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger className="w-full">
                        <Progress value={stockLevel} />
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{stockInfo ? `${stockInfo.stock} / ${stockInfo.maxStock}` : '0 / 0'} units remaining</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
        <div>
            <Label>Brand Name by Country</Label>
            <Select onValueChange={setSelectedCountry} defaultValue={selectedCountry} disabled={availableCountries.length === 0}>
                <SelectTrigger>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Generic">Generic</SelectItem>
                    {availableCountries.map(country => (
                        <SelectItem key={country} value={country}>{country}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
      </CardContent>
      <CardFooter className="flex items-center gap-2">
        <Input type="number" min="1" max={stockInfo?.stock} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="w-20" disabled={!stockInfo || stockInfo.stock === 0} />
        <Button onClick={handleDispense} className="w-full" disabled={!stockInfo || stockInfo.stock === 0 || quantity <= 0}>
            Dispense
        </Button>
      </CardFooter>
      {stockInfo?.isNarcotic && <NarcoticsDialog open={isNarcoticModalOpen} onOpenChange={setNarcoticModalOpen} onApproved={onNarcoticApproved} drugName={stockInfo.name} />}
    </Card>
  );
}


// Narcotics Dialog Component
function NarcoticsDialog({ open, onOpenChange, onApproved, drugName }: { open: boolean, onOpenChange: (open: boolean) => void, onApproved: () => void, drugName: string }) {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleVerify = () => {
        if (password === "TAMER") {
            onApproved();
            setPassword("");
            setError("");
        } else {
            setError("Invalid password. Approval denied.");
        }
    }

    return (
        <Dialog open={open} onOpenChange={(isOpen) => { onOpenChange(isOpen); setError(""); setPassword(""); }}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2"><ShieldCheck className="text-destructive" /> Narcotic Dispensing Approval</DialogTitle>
                    <DialogDescription>
                        Dispensing of "{drugName}" requires master approval. Please enter the password to proceed.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-2">
                    <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter master password" />
                    {error && <p className="text-sm text-destructive">{error}</p>}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleVerify}>Verify & Dispense</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

// Diagnosis Dialog Component
function DiagnosisDialog({ open, onOpenChange, diagnosis, severity }: { open: boolean, onOpenChange: (open: boolean) => void, diagnosis: string, severity: string }) {
    const severityInfo = {
        red: {
            message: "Requires immediate medical attention",
            colorClass: "text-red-600 border-red-600 bg-red-50 dark:bg-red-950/50 dark:text-red-400 dark:border-red-500",
            iconColor: "text-red-600 dark:text-red-400",
        },
        orange: {
            message: "Needs close monitoring",
            colorClass: "text-orange-600 border-orange-600 bg-orange-50 dark:bg-orange-950/50 dark:text-orange-400 dark:border-orange-500",
            iconColor: "text-orange-600 dark:text-orange-400",
        },
        green: {
            message: "Needs medication",
            colorClass: "text-green-600 border-green-600 bg-green-50 dark:bg-green-950/50 dark:text-green-400 dark:border-green-500",
            iconColor: "text-green-600 dark:text-green-400",
        },
    };

    const currentSeverity = severityInfo[severity as keyof typeof severityInfo] || severityInfo.green;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Bot className={currentSeverity.iconColor} /> AI Diagnosis
                    </DialogTitle>
                    <DialogDescription>
                        Based on the symptoms provided, here is a possible diagnosis. This is not a substitute for professional medical advice.
                    </DialogDescription>
                </DialogHeader>
                <div className={`p-4 rounded-lg border ${currentSeverity.colorClass}`}>
                    <p className="font-semibold text-lg text-center">{diagnosis}</p>
                    <p className="text-sm text-center mt-1 animate-flash">{currentSeverity.message}</p>
                </div>
                <DialogFooter>
                    <Button onClick={() => onOpenChange(false)}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
