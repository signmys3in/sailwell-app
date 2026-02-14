"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState, useTransition, useContext, useEffect, useCallback, useMemo } from "react";

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
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";

import { getDrugSuggestions } from "@/app/actions";
import { CHRONIC_DISEASES, COUNTRY_DRUG_NAMES, ALLERGY_TYPES } from "@/lib/data";
import type { DrugSuggestion, DrugStock as DrugStockType, CrewInfo } from "@/lib/types";
import { AppContext } from "@/contexts/app-context";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, ArrowLeft, ArrowRight, Bot, Loader2, Pill, Redo, ShieldCheck, Copy } from "lucide-react";
import { Label } from "@/components/ui/label";
import InteractiveBodyDiagram, { BodyPart, BODY_PARTS } from "@/components/interactive-body-diagram";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";


// Schemas
const crewInfoFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  dob: z.string().refine((dob) => {
    const year = dob.split('-')[0];
    return year.length === 4;
  }, {
    message: "The year must be exactly 4 digits."
  }).refine((dob) => new Date(dob).toString() !== 'Invalid Date', {
    message: 'Please enter a valid date.'
  }).refine((dob) => new Date(dob) < new Date(), {
    message: 'Date of birth cannot be in the future.'
  }),
  alcoholUsage: z.enum(["none", "moderate", "heavy"]),
  isSmoker: z.boolean().default(false),
  chronicDiseases: z.array(z.string()),
  hasAllergies: z.boolean().default(false),
  allergies: z.array(z.string()).optional(),
});


const CONSCIOUSNESS_LEVELS = ["Alert", "Responds to Voice", "Responds to Pain", "Unresponsive"] as const;

const symptomsSchema = z.object({
  symptoms: z.string().min(10, "Please describe symptoms in at least 10 characters."),
  temperature: z.string().min(1, "Temperature is required."),
  bloodPressure: z.string().min(1, "Blood pressure is required."),
  heartRate: z.string().min(1, "Heart rate is required."),
  oxygenLevel: z.string().min(1, "Oxygen level is required."),
  consciousnessLevel: z.enum(CONSCIOUSNESS_LEVELS, {
    required_error: "You need to select a consciousness level.",
  }),
});


type CrewInfoForm = z.infer<typeof crewInfoFormSchema>;
type SymptomsInfo = z.infer<typeof symptomsSchema>;

// Main Component
export default function MediAssistantPage() {
  const [step, setStep] = useState(1);
  const [crewInfo, setCrewInfo] = useState<CrewInfo | null>(null);
  const [selectedBodyParts, setSelectedBodyParts] = useState<BodyPart[]>([]);
  const [suggestions, setSuggestions] = useState<DrugSuggestion[]>([]);
  const [diagnosis, setDiagnosis] = useState<string | null>(null);
  const [shortDiagnosis, setShortDiagnosis] = useState<string | null>(null);
  const [severity, setSeverity] = useState<'red' | 'orange' | 'green' | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const { addDrugsToStock, addCrewMember, findCrewMember } = useContext(AppContext);


  const startOver = useCallback(() => {
    setStep(1);
    setCrewInfo(null);
    setSelectedBodyParts([]);
    setSuggestions([]);
    setError(null);
    setDiagnosis(null);
    setSeverity(null);
    setShortDiagnosis(null);
  }, []);

  const onCrewInfoSubmit = useCallback((values: CrewInfo) => {
    addCrewMember(values);
    setCrewInfo(values);
    setStep(2);
  }, [addCrewMember]);

  const onCrewLookup = useCallback((medicalId: string) => {
    const foundCrewMember = findCrewMember(medicalId);
    if(foundCrewMember) {
      setCrewInfo(foundCrewMember);
      setStep(2);
    }
  }, [findCrewMember]);

  const onBodyPartSelectionSubmit = useCallback((parts: BodyPart[]) => {
    setSelectedBodyParts(parts);
    setStep(3);
  }, []);

  const onSymptomsSubmit = useCallback((values: SymptomsInfo) => {
    if (!crewInfo) return;
    const input = {
      symptoms: values.symptoms,
      chronicDiseases: crewInfo.chronicDiseases,
      allergies: crewInfo.allergies,
      temperature: values.temperature,
      bloodPressure: values.bloodPressure,
      heartRate: values.heartRate,
      oxygenLevel: values.oxygenLevel,
      consciousnessLevel: values.consciousnessLevel,
    };

    setStep(4);
    startTransition(async () => {
      const result = await getDrugSuggestions(input);
      if (result.error) {
        setError(result.error);
      } else if (result.drugSuggestions) {
        if (result.drugSuggestions.length > 0) {
          addDrugsToStock(result.drugSuggestions.map(s => ({ name: s.drugName, isNarcotic: s.isNarcotic })));
        }
        setSuggestions(result.drugSuggestions);
        setDiagnosis(result.diagnosis || "No diagnosis provided.");
        setSeverity(result.severity || null);
        setShortDiagnosis(result.shortDiagnosis || null);
      }
    });
  }, [crewInfo, addDrugsToStock]);

  const currentProgress = (step / 4) * 100;

  return (
    <div className="flex flex-col h-full">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Diagnosing & Drug Selection</h1>
        <p className="text-muted-foreground mt-1">AI-powered diagnosis and medication suggestions.</p>
      </header>
      <div className="w-full mb-6">
        <Progress value={currentProgress} className="h-2" />
      </div>

      <div className="flex-grow">
        {step === 1 && <CrewInfoStep onSubmit={onCrewInfoSubmit} onCrewLookup={onCrewLookup} />}
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
            crewInfo={crewInfo}
          />
        )}
        {step === 4 && crewInfo && (
          <SuggestionsStep
            suggestions={suggestions}
            isLoading={isPending}
            error={error}
            onStartOver={startOver}
            crewInfo={crewInfo}
            diagnosis={diagnosis}
            severity={severity}
            shortDiagnosis={shortDiagnosis}
          />
        )}
      </div>
    </div>
  );
}

// Step 1: Crew Member Info
function CrewInfoStep({ onSubmit, onCrewLookup }: { onSubmit: (values: CrewInfo) => void; onCrewLookup: (medicalId: string) => void; }) {
  const form = useForm<CrewInfoForm>({
    resolver: zodResolver(crewInfoFormSchema),
    defaultValues: {
      name: "",
      dob: "",
      alcoholUsage: "none",
      isSmoker: false,
      chronicDiseases: [],
      hasAllergies: false,
      allergies: [],
    },
  });

  const { findCrewMember } = useContext(AppContext);
  const { toast } = useToast();
  const [searchId, setSearchId] = useState("");
  const [searchError, setSearchError] = useState("");
  const [medicalId, setMedicalId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("new-crew-member");
  const [isAllergyDialogOpen, setAllergyDialogOpen] = useState(false);

  const { watch, formState, getValues, reset, setValue } = form;
  const nameValue = watch("name");
  const dobValue = watch("dob");
  const hasAllergies = watch('hasAllergies');
  const selectedAllergies = watch('allergies') || [];
  const today = new Date().toISOString().split("T")[0];


  useEffect(() => {
    const { name, dob } = getValues();
    if (activeTab === "new-crew-member" && name && name.length >= 2 && dob && !formState.errors.dob && !medicalId) {
      setMedicalId(Math.floor(1000 + Math.random() * 9000).toString());
    }
  }, [nameValue, dobValue, formState.errors.dob, medicalId, getValues, activeTab]);
  
  useEffect(() => {
    if (hasAllergies) {
        setAllergyDialogOpen(true);
    } else {
        setValue('allergies', []);
    }
  }, [hasAllergies, setValue]);

  const handleAllergySave = (allergies: string[]) => {
      setValue('allergies', allergies, { shouldValidate: true });
      if (allergies.length === 0) {
          setValue('hasAllergies', false);
      }
      setAllergyDialogOpen(false);
  };

  const handleNewCrewMemberSubmit = (values: CrewInfoForm) => {
    const idToSubmit = medicalId || Math.floor(1000 + Math.random() * 9000).toString();
    if (!medicalId) {
      setMedicalId(idToSubmit);
    }
    const { hasAllergies, ...crewMemberData } = values;
    onSubmit({ ...crewMemberData, medicalId: idToSubmit });
  };

  const handleSearch = useCallback(() => {
    if (!searchId) {
        setSearchError("Please enter a Medical ID.");
        return;
    }
    const crewMember = findCrewMember(searchId);
    if (crewMember) {
      const { medicalId: foundMedicalId, ...formData } = crewMember;
      reset({
        ...formData,
        hasAllergies: !!(formData.allergies && formData.allergies.length > 0)
      });
      setMedicalId(foundMedicalId);
      setActiveTab("new-crew-member");
      setSearchId("");
      setSearchError("");
    } else {
      setSearchError("Crew member with this Medical ID not found.");
    }
  }, [searchId, findCrewMember, reset]);
  
  const handleCopy = useCallback(() => {
    if (medicalId) {
        navigator.clipboard.writeText(medicalId);
        toast({
            title: "Copied!",
            description: `Medical ID ${medicalId} copied to clipboard.`,
            className: "bg-accent text-accent-foreground",
        });
    }
  }, [medicalId, toast]);


  return (
    <Card>
      <CardHeader>
        <CardTitle>Crew Member Medical ID</CardTitle>
        <CardDescription>
          Create a new crew member record or find an existing one using their medical ID.
        </CardDescription>
      </CardHeader>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="new-crew-member">New Crew Member</TabsTrigger>
            <TabsTrigger value="find-crew-member">Find by Medical ID</TabsTrigger>
        </TabsList>
        <TabsContent value="new-crew-member">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleNewCrewMemberSubmit)}>
                <CardContent className="space-y-6 pt-6">
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
                            <Input type="date" max={today} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    </div>
                    {medicalId && (
                        <div className="rounded-lg border bg-muted/50 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label className="text-base font-semibold">Generated Medical ID</Label>
                                    <p className="text-sm text-muted-foreground">
                                        This unique ID will be used to identify the crew member in the future.
                                    </p>
                                </div>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <button
                                                type="button"
                                                onClick={handleCopy}
                                                className="flex items-center gap-3 rounded-md bg-background px-4 py-2 text-primary shadow-sm transition-colors hover:bg-accent"
                                            >
                                                <span className="text-2xl font-bold font-mono tracking-widest">{medicalId}</span>
                                                <Copy className="h-5 w-5 text-muted-foreground" />
                                            </button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Copy to Clipboard</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="alcoholUsage"
                        render={({ field }) => (
                        <FormItem>
                            <Label>Alcohol Usage</Label>
                            <Select onValueChange={field.onChange} value={field.value}>
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
                                Check if the crew member is a smoker.
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
                            <Label className="text-base">Chronic Diseases & Allergies</Label>
                            <FormDescription>
                            Select any pre-existing conditions.
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
                            <FormField
                                control={form.control}
                                name="hasAllergies"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <Label className="font-normal text-destructive">
                                        Allergies
                                    </Label>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    {selectedAllergies.length > 0 && (
                        <div className="p-4 border rounded-md bg-muted/50">
                            <Label>Selected Allergies:</Label>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {selectedAllergies.map(allergy => (
                                    <Badge key={allergy} variant="secondary" className="bg-destructive/10 text-destructive border-destructive/20">{allergy}</Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-end">
                    <Button type="submit">
                    Next <ArrowRight />
                    </Button>
                </CardFooter>
                </form>
            </Form>
            <AllergySelectionDialog
                open={isAllergyDialogOpen}
                onOpenChange={(isOpen) => {
                    setAllergyDialogOpen(isOpen);
                    if (!isOpen && getValues('allergies')?.length === 0) {
                        setValue('hasAllergies', false);
                    }
                }}
                onSave={handleAllergySave}
                selectedAllergies={getValues('allergies') || []}
            />
        </TabsContent>
        <TabsContent value="find-crew-member">
             <CardContent className="space-y-6 pt-6">
                <div className="space-y-2">
                <Label htmlFor="medical-id">Crew Member Medical ID</Label>
                <Input id="medical-id" value={searchId} onChange={(e) => { setSearchId(e.target.value); setSearchError(""); }} placeholder="Enter Medical ID" />
                </div>
                {searchError && <p className="text-sm text-destructive">{searchError}</p>}
            </CardContent>
            <CardFooter className="flex justify-end">
                <Button onClick={handleSearch}>Find Crew Member</Button>
            </CardFooter>
        </TabsContent>
      </Tabs>
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

  const handlePartClick = useCallback((part: BodyPart) => {
    setSelectedParts((prev) =>
      prev.includes(part) ? prev.filter((p) => p !== part) : [...prev, part]
    );
  }, []);

  const handleSubmit = useCallback(() => {
    onSubmit(selectedParts);
  }, [onSubmit, selectedParts]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pain Area Selection</CardTitle>
        <CardDescription>
          Click on the body parts where the crew member is experiencing pain. You can
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
  crewInfo,
}: {
  onSubmit: (values: SymptomsInfo) => void;
  onBack: () => void;
  initialSelectedParts: BodyPart[];
  crewInfo: CrewInfo | null;
}) {
  const form = useForm<SymptomsInfo>({
    resolver: zodResolver(symptomsSchema),
    defaultValues: {
      symptoms: "",
      temperature: "",
      bloodPressure: "",
      heartRate: "",
      oxygenLevel: "",
      consciousnessLevel: "Alert",
    },
  });

  useEffect(() => {
    let initialSymptoms = "";
    if (initialSelectedParts.length > 0) {
      initialSymptoms = initialSelectedParts
        .map(part => `Pain in ${BODY_PARTS[part]}`)
        .join(', ');
      initialSymptoms += '. ';
    }
    
    if(crewInfo?.chronicDiseases && crewInfo.chronicDiseases.length > 0) {
      const diseaseText = `Crew member has a history of: ${crewInfo.chronicDiseases.join(', ')}. `;
      initialSymptoms += diseaseText;
    }

    if(crewInfo?.allergies && crewInfo.allergies.length > 0) {
        const allergyText = `Crew member has known allergies to: ${crewInfo.allergies.join(', ')}. `;
        initialSymptoms += allergyText;
    }
    
    form.setValue('symptoms', initialSymptoms);
  }, [initialSelectedParts, crewInfo, form]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Symptoms & Vital Signs</CardTitle>
        <CardDescription>
          Describe the crew member's symptoms and provide vital signs.
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
                    Describe the crew member's symptoms in detail. You can add more information to what was pre-filled from the body diagram and allergy selection.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-4">
                <Label className="text-base">Vital Signs & Consciousness (Required)</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <FormField control={form.control} name="temperature" render={({ field }) => (
                        <FormItem>
                            <Label className="text-sm font-normal">Temp (°C)</Label>
                            <FormControl><Input placeholder="37.5" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="bloodPressure" render={({ field }) => (
                        <FormItem>
                            <Label className="text-sm font-normal">BP (mmHg)</Label>
                            <FormControl><Input placeholder="120/80" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="heartRate" render={({ field }) => (
                        <FormItem>
                            <Label className="text-sm font-normal">HR (bpm)</Label>
                            <FormControl><Input placeholder="70" {...field} /></FormControl>
                             <FormMessage />
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="oxygenLevel" render={({ field }) => (
                        <FormItem>
                            <Label className="text-sm font-normal">O₂ Level (%)</Label>
                            <FormControl><Input placeholder="98" {...field} /></FormControl>
                             <FormMessage />
                        </FormItem>
                    )}/>
                     <FormField
                        control={form.control}
                        name="consciousnessLevel"
                        render={({ field }) => (
                        <FormItem>
                            <Label className="text-sm font-normal">Consciousness</Label>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                <SelectValue placeholder="Select level" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {CONSCIOUSNESS_LEVELS.map(level => (
                                    <SelectItem key={level} value={level}>{level}</SelectItem>
                                ))}
                            </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
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
function SuggestionsStep({ suggestions, isLoading, error, onStartOver, crewInfo, diagnosis, severity, shortDiagnosis }: { suggestions: DrugSuggestion[], isLoading: boolean, error: string | null, onStartOver: () => void, crewInfo: CrewInfo, diagnosis: string | null, severity: 'red' | 'orange' | 'green' | null, shortDiagnosis: string | null }) {
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
        <p className="text-muted-foreground">Our AI is analyzing the crew member's data. Please wait.</p>
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
            The suggestions below are ordered by recommendation priority. This is not a substitute for professional medical advice.
            <br />
            Crew Member: {crewInfo.name} | Medical ID: <span className="font-mono text-xs p-1 bg-muted rounded">{crewInfo.medicalId}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {suggestions.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suggestions.map((suggestion) => {
                const stockInfo = drugStock.find(d => d.name.toLowerCase() === suggestion.drugName.toLowerCase());
                return <DrugCard key={suggestion.drugName} suggestion={suggestion} stockInfo={stockInfo} crewInfo={crewInfo} diagnosis={diagnosis} shortDiagnosis={shortDiagnosis} severity={severity} />;
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
function DrugCard({ suggestion, stockInfo, crewInfo, diagnosis, shortDiagnosis, severity }: { suggestion: DrugSuggestion, stockInfo: DrugStockType | undefined, crewInfo: CrewInfo, diagnosis: string | null, shortDiagnosis: string | null, severity: 'red' | 'orange' | 'green' | null }) {
  const { dispenseDrug } = useContext(AppContext);
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedCountry, setSelectedCountry] = useState('Generic');
  const [isNarcoticModalOpen, setNarcoticModalOpen] = useState(false);

  const stockLevel = stockInfo ? (stockInfo.stock / stockInfo.maxStock) * 100 : 0;
  
  const availableCountries = useMemo(() => Object.keys(COUNTRY_DRUG_NAMES).filter(country => 
    Object.keys(COUNTRY_DRUG_NAMES[country]).some(drug => drug.toLowerCase() === suggestion.drugName.toLowerCase())
  ), [suggestion.drugName]);

  const commercialName = useMemo(() => {
    if (selectedCountry === 'Generic' || !COUNTRY_DRUG_NAMES[selectedCountry]) {
        return undefined;
    }
    const drugKey = Object.keys(COUNTRY_DRUG_NAMES[selectedCountry]).find(key => key.toLowerCase() === suggestion.drugName.toLowerCase());
    return drugKey ? COUNTRY_DRUG_NAMES[selectedCountry][drugKey] : undefined;
  }, [selectedCountry, suggestion.drugName]);
  

  const handleDispense = useCallback(() => {
    if (!stockInfo || stockInfo.stock < quantity) {
      toast({ variant: "destructive", title: "Out of Stock", description: "Not enough stock to dispense." });
      return;
    }
    if (stockInfo.isNarcotic) {
        setNarcoticModalOpen(true);
    } else {
        dispenseDrug(stockInfo.id, quantity, crewInfo, diagnosis || 'AI-assisted diagnosis', shortDiagnosis, severity);
        toast({ variant: "default", title: "Dispensed", description: `${quantity} x ${stockInfo.name} dispensed.`, className: "bg-accent text-accent-foreground" });
    }
  }, [stockInfo, quantity, toast, dispenseDrug, crewInfo, diagnosis, shortDiagnosis, severity]);

  const onNarcoticApproved = useCallback(() => {
      if (!stockInfo) return;
      dispenseDrug(stockInfo.id, quantity, crewInfo, diagnosis || 'AI-assisted diagnosis', shortDiagnosis, severity);
      toast({ variant: "default", title: "Dispensed", description: `${quantity} x ${stockInfo.name} dispensed with approval.`, className: "bg-accent text-accent-foreground" });
      setNarcoticModalOpen(false);
  }, [stockInfo, dispenseDrug, quantity, crewInfo, diagnosis, shortDiagnosis, severity, toast]);

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

    const handleVerify = useCallback(() => {
        if (password === "TAMER") {
            onApproved();
            setPassword("");
            setError("");
        } else {
            setError("Invalid password. Approval denied.");
        }
    }, [password, onApproved]);

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
                    <p className="text-lg font-bold text-center mt-1 animate-flash">{currentSeverity.message}</p>
                </div>
                <DialogFooter>
                    <Button onClick={() => onOpenChange(false)}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


function AllergySelectionDialog({ open, onOpenChange, onSave, selectedAllergies }: { open: boolean, onOpenChange: (open: boolean) => void, onSave: (allergies: string[]) => void, selectedAllergies: string[] }) {
    const [currentSelection, setCurrentSelection] = useState(selectedAllergies);

    useEffect(() => {
        setCurrentSelection(selectedAllergies);
    }, [selectedAllergies, open]);

    const handleAllergyToggle = (allergy: string) => {
        setCurrentSelection(prev =>
            prev.includes(allergy) ? prev.filter(a => a !== allergy) : [...prev, allergy]
        );
    };

    const handleSave = () => {
        onSave(currentSelection);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Select Allergies</DialogTitle>
                    <DialogDescription>
                        Please select all known allergies from the list below.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-72 my-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-1">
                        {ALLERGY_TYPES.map((allergy) => (
                            <div key={allergy} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`allergy-${allergy}`}
                                    checked={currentSelection.includes(allergy)}
                                    onCheckedChange={() => handleAllergyToggle(allergy)}
                                />
                                <Label htmlFor={`allergy-${allergy}`} className="font-normal cursor-pointer">{allergy}</Label>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Save Allergies</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
