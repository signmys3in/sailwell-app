
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
    heart: { x: 200, y: 270, anchor: 'middle' },
    lungs: { x: 145, y: 250, anchor: 'end' },
    liver: { x: 245, y: 340 },
    stomach: { x: 155, y: 340, anchor: 'end' },
    kidneys: { x: 230, y: 385 },
    elbows: { x: 85, y: 295, anchor: 'end' },
    hands: { x: 45, y: 360, anchor: 'end' },
    knees: { x: 120, y: 530, anchor: 'end' },
    feet: { x: 120, y: 635, anchor: 'end' },
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
                ? "fill-primary stroke-primary-foreground animate-pulse-glow" 
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
                        <stop offset="0%" stopColor="hsl(var(--primary) / 0.05)" />
                        <stop offset="100%" stopColor="hsl(var(--primary) / 0.15)" />
                    </linearGradient>
                </defs>
                
                {/* Base Body Silhouette */}
                <g stroke="hsl(var(--foreground) / 0.1)" strokeWidth="1">
                    <path fill="url(#body-gradient)" d="M200 30 C 150 30, 120 60, 120 110 C 120 160, 150 180, 160 190 L 120 200 C 70 210, 50 280, 70 400 L 120 600 L 140 720 H 260 L 280 600 L 330 400 C 350 280, 330 210, 280 200 L 240 190 C 250 180, 280 160, 280 110 C 280 60, 250 30, 200 30 Z" />
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
                        d="M165,180L130,210C120,270,120,350,130,420L170,430 H230 L270,420 C280,350,280,270,270,210 L235,180Z"
                        onClick={() => onPartClick('chest')}
                        onMouseEnter={() => setHoveredPart('chest')}
                        className={getPartClasses('chest')}
                        id="chest"
                        data-testid="body-part-chest"
                    />
                    <path
                        d="M130,320 C130,380,130,380,130,420 L170,430 H230 L270,420 C270,380,270,380,270,320Z"
                        onClick={() => onPartClick('abdomen')}
                        onMouseEnter={() => setHoveredPart('abdomen')}
                        className={getPartClasses('abdomen')}
                        id="abdomen"
                        data-testid="body-part-abdomen"
                    />

                    {/* Arms */}
                    <path
                        d="M130,210 Q80,240,70,350 L90,355 Q100,270,145,215 Z"
                        onClick={() => onPartClick('leftArm')}
                        onMouseEnter={() => setHoveredPart('leftArm')}
                        className={getPartClasses('leftArm')}
                        id="left-arm"
                        data-testid="body-part-leftArm"
                    />
                    <path
                        d="M270,210 Q320,240,330,350 L310,355 Q300,270,255,215 Z"
                        onClick={() => onPartClick('rightArm')}
                        onMouseEnter={() => setHoveredPart('rightArm')}
                        className={getPartClasses('rightArm')}
                        id="right-arm"
                        data-testid="body-part-rightArm"
                    />

                    {/* Legs */}
                    <path
                        d="M170,430 L130,620 L180,620 L175,430 Z"
                        onClick={() => onPartClick('leftLeg')}
                        onMouseEnter={() => setHoveredPart('leftLeg')}
                        className={getPartClasses('leftLeg')}
                        id="left-leg"
                        data-testid="body-part-leftLeg"
                    />
                    <path
                        d="M230,430 L270,620 L220,620 L225,430 Z"
                        onClick={() => onPartClick('rightLeg')}
                        onMouseEnter={() => setHoveredPart('rightLeg')}
                        className={getPartClasses('rightLeg')}
                        id="right-leg"
                        data-testid="body-part-rightLeg"
                    />

                    {/* Joints & Extremities */}
                    <g onClick={() => onPartClick('elbows')} onMouseEnter={() => setHoveredPart('elbows')} className={getPartClasses('elbows')}>
                        <circle cx="95" cy="290" r="12" id="elbow-left" data-testid="body-part-elbows"/>
                        <circle cx="305" cy="290" r="12" id="elbow-right" data-testid="body-part-elbows"/>
                    </g>
                    <g onClick={() => onPartClick('hands')} onMouseEnter={() => setHoveredPart('hands')} className={getPartClasses('hands')}>
                        <path d="M70,350 C50,350 50,370 70,370 L 90,355 Z" id="hand-left" data-testid="body-part-hands"/>
                        <path d="M330,350 C350,350 350,370 330,370 L 310,355 Z" id="hand-right" data-testid="body-part-hands"/>
                    </g>
                    <g onClick={() => onPartClick('knees')} onMouseEnter={() => setHoveredPart('knees')} className={getPartClasses('knees')}>
                        <circle cx="155" cy="520" r="15" id="knee-left" data-testid="body-part-knees"/>
                        <circle cx="245" cy="520" r="15" id="knee-right" data-testid="body-part-knees"/>
                    </g>
                    <g onClick={() => onPartClick('feet')} onMouseEnter={() => setHoveredPart('feet')} className={getPartClasses('feet')}>
                        <path d="M130,620 C110,630 150,650 180,630" id="foot-left" data-testid="body-part-feet" />
                        <path d="M220,630 C250,650 290,630 270,620" id="foot-right" data-testid="body-part-feet" />
                    </g>

                    {/* Organs */}
                    <g onClick={() => onPartClick('lungs')} onMouseEnter={() => setHoveredPart('lungs')} className={getPartClasses('lungs')} id="lungs" data-testid="body-part-lungs">
                        <path d="M190,210 C150,210,150,290,180,310 L190,300Z" />
                        <path d="M210,210 C250,210,250,290,220,310 L210,300Z" />
                    </g>
                    <path
                        d="M200,250 C185,260 188,285 200,290 C212,285 215,260 200,250 Z"
                        onClick={() => onPartClick('heart')}
                        onMouseEnter={() => setHoveredPart('heart')}
                        className={getPartClasses('heart')}
                        id="heart"
                        data-testid="body-part-heart"
                    />
                    <path
                        d="M205,320 C240,320,245,360,210,360 L205,355Z"
                        onClick={() => onPartClick('liver')}
                        onMouseEnter={() => setHoveredPart('liver')}
                        className={getPartClasses('liver')}
                        id="liver"
                        data-testid="body-part-liver"
                    />
                    <path
                        d="M195,320 C160,320,155,360,190,360 L195,355Z"
                        onClick={() => onPartClick('stomach')}
                        onMouseEnter={() => setHoveredPart('stomach')}
                        className={getPartClasses('stomach')}
                        id="stomach"
                        data-testid="body-part-stomach"
                    />
                    <g onClick={() => onPartClick('kidneys')} onMouseEnter={() => setHoveredPart('kidneys')} className={getPartClasses('kidneys')} id="kidneys" data-testid="body-part-kidneys">
                        <path d="M180,370 C170,375,170,395,180,400 C185,395,185,375,180,370 Z" />
                        <path d="M220,370 C230,375,230,395,220,400 C215,395,215,375,220,370 Z" />
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

    
