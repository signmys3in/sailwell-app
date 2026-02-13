
"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

export const BODY_PARTS = {
    head: "Head",
    brain: "Brain",
    eyes: "Eyes",
    ears: "Ears",
    nose: "Nose",
    mouth: "Mouth",
    chest: "Chest",
    abdomen: "Abdomen",
    leftArm: "Left Arm",
    rightArm: "Right Arm",
    leftLeg: "Left Leg",
    rightLeg: "Right Leg",
    heart: "Heart",
    lungs: "Lungs",
    liver: "Liver",
    stomach: "Stomach",
    kidneys: "Kidneys",
    elbows: "Elbows",
    hands: "Hands",
    knees: "Knees",
    feet: "Feet",
} as const;

export type BodyPart = keyof typeof BODY_PARTS;

// Fine-tuned positions for the new diagram
const LABEL_POSITIONS: Record<BodyPart, { x: number; y: number; anchor?: 'start' | 'middle' | 'end' }> = {
    head: { x: 275, y: 105 },
    brain: { x: 265, y: 65 },
    eyes: { x: 245, y: 110 },
    ears: { x: 125, y: 110, anchor: 'end' },
    nose: { x: 200, y: 130, anchor: 'middle' },
    mouth: { x: 200, y: 155, anchor: 'middle' },
    chest: { x: 115, y: 250, anchor: 'end' },
    abdomen: { x: 115, y: 370, anchor: 'end' },
    leftArm: { x: 60, y: 280, anchor: 'end' },
    rightArm: { x: 340, y: 280 },
    leftLeg: { x: 115, y: 520, anchor: 'end' },
    rightLeg: { x: 285, y: 520 },
    heart: { x: 200, y: 285, anchor: 'middle' },
    lungs: { x: 145, y: 260, anchor: 'end' },
    liver: { x: 265, y: 350 },
    stomach: { x: 135, y: 350, anchor: 'end' },
    kidneys: { x: 250, y: 400 },
    elbows: { x: 85, y: 340, anchor: 'end' },
    hands: { x: 45, y: 450, anchor: 'end' },
    knees: { x: 120, y: 580, anchor: 'end' },
    feet: { x: 120, y: 700, anchor: 'end' },
};


interface InteractiveBodyDiagramProps {
    selectedParts: BodyPart[];
    onPartClick: (part: BodyPart) => void;
    className?: string;
}

export default function InteractiveBodyDiagram({ selectedParts, onPartClick, className }: InteractiveBodyDiagramProps) {
    const [hoveredPart, setHoveredPart] = useState<BodyPart | null>(null);
    const isSelected = (part: BodyPart) => selectedParts.includes(part);

    const getPartClasses = (part: BodyPart) => {
        return cn(
            "transition-all duration-300 ease-in-out cursor-pointer",
            "hover:fill-primary/20 hover:stroke-primary",
            isSelected(part) 
                ? "fill-primary/80 stroke-primary-foreground animate-pulse-glow" 
                : "fill-transparent stroke-foreground/80"
        );
    };
    
    const displayedParts = [...new Set([...selectedParts, ...(hoveredPart ? [hoveredPart] : [])])];


    return (
        <div className={cn("flex justify-center items-center", className)}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 400 750"
                className="max-h-[500px] w-auto"
                aria-label="Interactive human body diagram"
                fill="none"
                strokeWidth="2"
            >
                <defs>
                    <linearGradient id="body-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="hsl(var(--primary) / 0.08)" />
                        <stop offset="100%" stopColor="hsl(var(--primary) / 0.18)" />
                    </linearGradient>
                     <filter id="glow">
                        <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
                
                {/* Base Body Silhouette with more details */}
                <g stroke="hsl(var(--foreground) / 0.1)" strokeWidth="1.5">
                    <path fill="url(#body-gradient)" d="M200,30 C160,30,130,60,130,110 S150,180,165,190 L135,200 C80,210,65,280,80,410 L125,590 L140,720 H260 L275,590 L320,410 C335,280,320,210,265,200 L235,190 C250,180,270,160,270,110 S240,30,200,30 Z" />
                    {/* Subtle muscle/bone lines */}
                    <path d="M200,190 V 450" stroke="hsl(var(--foreground) / 0.05)" />
                    <path d="M165,190 C175,230,175,230,200,240 C225,230,225,230,235,190" stroke="hsl(var(--foreground) / 0.05)" /> {/* Clavicle */}
                </g>

                <g onMouseLeave={() => setHoveredPart(null)}>
                    {/* Head */}
                    <path
                        d="M200,35C155,35 132,65,132,105C132,145 160,170,200,170C240,170 268,145 268,105C268,65 245,35 200,35Z"
                        onClick={() => onPartClick('head')}
                        onMouseEnter={() => setHoveredPart('head')}
                        className={getPartClasses('head')}
                        id="head"
                        data-testid="body-part-head"
                    />

                    {/* Brain */}
                    <path
                        d="M200,42C165,42 142,67,142,100C142,130 165,150,200,150C235,150 258,130 258,100C258,67 235,42 200,42Z"
                        onClick={() => onPartClick('brain')}
                        onMouseEnter={() => setHoveredPart('brain')}
                        className={getPartClasses('brain')}
                        id="brain"
                        data-testid="body-part-brain"
                    />

                    {/* Facial Features */}
                    <g onClick={() => onPartClick('eyes')} onMouseEnter={() => setHoveredPart('eyes')} className={getPartClasses('eyes')}>
                        <ellipse cx="175" cy="105" rx="10" ry="6" id="eye-left" data-testid="body-part-eyes"/>
                        <ellipse cx="225" cy="105" rx="10" ry="6" id="eye-right" data-testid="body-part-eyes"/>
                    </g>
                    <g onClick={() => onPartClick('ears')} onMouseEnter={() => setHoveredPart('ears')} className={getPartClasses('ears')}>
                        <path d="M132,105C125,95,125,125,132,115" id="ear-left" data-testid="body-part-ears"/>
                        <path d="M268,105C275,95,275,125,268,115" id="ear-right" data-testid="body-part-ears"/>
                    </g>
                    <path
                        d="M198,120 L202,130 L200,120Z"
                        onClick={() => onPartClick('nose')}
                        onMouseEnter={() => setHoveredPart('nose')}
                        className={getPartClasses('nose')}
                        id="nose"
                        data-testid="body-part-nose"
                    />
                    <path
                        d="M185,145C200,150 215,150 215,145"
                        onClick={() => onPartClick('mouth')}
                        onMouseEnter={() => setHoveredPart('mouth')}
                        className={getPartClasses('mouth')}
                        id="mouth"
                        data-testid="body-part-mouth"
                    />

                    {/* Torso (Chest + Abdomen) */}
                    <path
                        d="M165,190L135,210C125,270,125,350,135,430L170,450 H230 L265,430 C275,350,275,270,265,210 L235,190Z"
                        onClick={() => onPartClick('chest')}
                        onMouseEnter={() => setHoveredPart('chest')}
                        className={getPartClasses('chest')}
                        id="chest"
                        data-testid="body-part-chest"
                    />
                    <path
                        d="M135,330 C135,390,135,390,135,430 L170,450 H230 L265,430 C265,390,265,390,265,330Z"
                        onClick={() => onPartClick('abdomen')}
                        onMouseEnter={() => setHoveredPart('abdomen')}
                        className={getPartClasses('abdomen')}
                        id="abdomen"
                        data-testid="body-part-abdomen"
                    />

                    {/* Arms */}
                    <path
                        d="M135,210 Q80,250,70,380 L95,385 Q105,280,150,215 Z"
                        onClick={() => onPartClick('leftArm')}
                        onMouseEnter={() => setHoveredPart('leftArm')}
                        className={getPartClasses('leftArm')}
                        id="left-arm"
                        data-testid="body-part-leftArm"
                    />
                    <path
                        d="M265,210 Q320,250,330,380 L305,385 Q295,280,250,215 Z"
                        onClick={() => onPartClick('rightArm')}
                        onMouseEnter={() => setHoveredPart('rightArm')}
                        className={getPartClasses('rightArm')}
                        id="right-arm"
                        data-testid="body-part-rightArm"
                    />

                    {/* Legs */}
                    <path
                        d="M170,450 L125,650 L185,650 L175,450 Z"
                        onClick={() => onPartClick('leftLeg')}
                        onMouseEnter={() => setHoveredPart('leftLeg')}
                        className={getPartClasses('leftLeg')}
                        id="left-leg"
                        data-testid="body-part-leftLeg"
                    />
                    <path
                        d="M230,450 L275,650 L215,650 L225,450 Z"
                        onClick={() => onPartClick('rightLeg')}
                        onMouseEnter={() => setHoveredPart('rightLeg')}
                        className={getPartClasses('rightLeg')}
                        id="right-leg"
                        data-testid="body-part-rightLeg"
                    />

                     {/* Joints & Extremities */}
                    <g onClick={() => onPartClick('elbows')} onMouseEnter={() => setHoveredPart('elbows')} className={getPartClasses('elbows')}>
                        <circle cx="90" cy="330" r="14" id="elbow-left" data-testid="body-part-elbows"/>
                        <circle cx="310" cy="330" r="14" id="elbow-right" data-testid="body-part-elbows"/>
                    </g>
                    <g onClick={() => onPartClick('hands')} onMouseEnter={() => setHoveredPart('hands')} className={getPartClasses('hands')}>
                        <path d="M70,380 C40,390,40,430,70,440 L95,385 Z" id="hand-left" data-testid="body-part-hands"/>
                        <path d="M330,380 C360,390,360,430,330,440 L305,385 Z" id="hand-right" data-testid="body-part-hands"/>
                    </g>
                    <g onClick={() => onPartClick('knees')} onMouseEnter={() => setHoveredPart('knees')} className={getPartClasses('knees')}>
                        <circle cx="155" cy="570" r="18" id="knee-left" data-testid="body-part-knees"/>
                        <circle cx="245" cy="570" r="18" id="knee-right" data-testid="body-part-knees"/>
                    </g>
                    <g onClick={() => onPartClick('feet')} onMouseEnter={() => setHoveredPart('feet')} className={getPartClasses('feet')}>
                        <path d="M125,650 C100,660,140,700,185,670" id="foot-left" data-testid="body-part-feet" />
                        <path d="M215,670 C260,700,300,660,275,650" id="foot-right" data-testid="body-part-feet" />
                    </g>

                    {/* Fine-tuned Organs */}
                    <g onClick={() => onPartClick('lungs')} onMouseEnter={() => setHoveredPart('lungs')} className={getPartClasses('lungs')} id="lungs" data-testid="body-part-lungs" style={isSelected('lungs') ? {filter: 'url(#glow)'} : {}}>
                        <path d="M195,230 C150,230,140,300,170,330 C180,310,195,300,195,230 Z" />
                        <path d="M205,230 C250,230,260,300,230,330 C220,310,205,300,205,230 Z" />
                    </g>
                    <path
                        d="M200,270 C180,280,180,310,200,320 C220,310,220,280,200,270 Z"
                        onClick={() => onPartClick('heart')}
                        onMouseEnter={() => setHoveredPart('heart')}
                        className={getPartClasses('heart')}
                        id="heart"
                        data-testid="body-part-heart"
                        style={isSelected('heart') ? {filter: 'url(#glow)'} : {}}
                    />
                    <path
                        d="M205,340 C250,330,260,380,210,385 Z"
                        onClick={() => onPartClick('liver')}
                        onMouseEnter={() => setHoveredPart('liver')}
                        className={getPartClasses('liver')}
                        id="liver"
                        data-testid="body-part-liver"
                        style={isSelected('liver') ? {filter: 'url(#glow)'} : {}}
                    />
                    <path
                        d="M195,340 C150,330,140,380,190,385 Z"
                        onClick={() => onPartClick('stomach')}
                        onMouseEnter={() => setHoveredPart('stomach')}
                        className={getPartClasses('stomach')}
                        id="stomach"
                        data-testid="body-part-stomach"
                        style={isSelected('stomach') ? {filter: 'url(#glow)'} : {}}
                    />
                    <g onClick={() => onPartClick('kidneys')} onMouseEnter={() => setHoveredPart('kidneys')} className={getPartClasses('kidneys')} id="kidneys" data-testid="body-part-kidneys" style={isSelected('kidneys') ? {filter: 'url(#glow)'} : {}}>
                        <path d="M175,390 C160,390,160,420,175,420 C190,410,190,400,175,390 Z" />
                        <path d="M225,390 C240,390,240,420,225,420 C210,410,210,400,225,390 Z" />
                    </g>
                </g>
                <g className="pointer-events-none text-sm font-semibold">
                    {displayedParts.map((part) => {
                        const pos = LABEL_POSITIONS[part];
                        return (
                            <text 
                                key={part} 
                                x={pos.x} 
                                y={pos.y}
                                textAnchor={pos.anchor || 'start'}
                                className="fill-foreground drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]"
                            >
                                {BODY_PARTS[part]}
                            </text>
                        );
                    })}
                </g>
            </svg>
        </div>
    );
}
