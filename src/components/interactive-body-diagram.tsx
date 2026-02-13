
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
                : "fill-transparent stroke-foreground"
        );
    };


    return (
        <div className={cn("flex justify-center items-center", className)}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 300 600"
                className="max-h-[400px] w-auto"
                aria-label="Interactive human body diagram"
                fill="none"
                strokeWidth="2"
            >
                <g>
                    {/* Head */}
                    <path
                        d="M150 20 C110 20 80 50 80 90 C80 120 100 140 120 145 L130 150 L130 160 C130 160 170 160 170 160 L170 150 L180 145 C200 140 220 120 220 90 C220 50 190 20 150 20 Z"
                        onClick={() => onPartClick('head')}
                        onMouseEnter={() => setHoveredPart('head')}
                        onMouseLeave={() => setHoveredPart(null)}
                        className={getPartClasses('head')}
                        id="head"
                        data-testid="body-part-head"
                    />

                    {/* Brain */}
                    <path
                        d="M150 25 C115 25 90 50 90 80 C90 105 110 120 150 120 C190 120 210 105 210 80 C210 50 185 25 150 25 Z"
                        onClick={() => onPartClick('brain')}
                        onMouseEnter={() => setHoveredPart('brain')}
                        onMouseLeave={() => setHoveredPart(null)}
                        className={getPartClasses('brain')}
                        id="brain"
                        data-testid="body-part-brain"
                    />

                    {/* Facial Features */}
                    <g onClick={() => onPartClick('eyes')} onMouseEnter={() => setHoveredPart('eyes')} onMouseLeave={() => setHoveredPart(null)} className={getPartClasses('eyes')}>
                        <ellipse cx="125" cy="95" rx="8" ry="5" id="eye-left" data-testid="body-part-eyes"/>
                        <ellipse cx="175" cy="95" rx="8" ry="5" id="eye-right" data-testid="body-part-eyes"/>
                    </g>
                    <g onClick={() => onPartClick('ears')} onMouseEnter={() => setHoveredPart('ears')} onMouseLeave={() => setHoveredPart(null)} className={getPartClasses('ears')}>
                        <path d="M80 90 C70 80 70 110 80 100" id="ear-left" data-testid="body-part-ears"/>
                        <path d="M220 90 C230 80 230 110 220 100" id="ear-right" data-testid="body-part-ears"/>
                    </g>
                    <path
                        d="M148,105 L152,115 L150,105 Z"
                        onClick={() => onPartClick('nose')}
                        onMouseEnter={() => setHoveredPart('nose')}
                        onMouseLeave={() => setHoveredPart(null)}
                        className={getPartClasses('nose')}
                        id="nose"
                        data-testid="body-part-nose"
                    />
                    <path
                        d="M140,130 C150,135 160,135 170,130"
                        onClick={() => onPartClick('mouth')}
                        onMouseEnter={() => setHoveredPart('mouth')}
                        onMouseLeave={() => setHoveredPart(null)}
                        className={getPartClasses('mouth')}
                        id="mouth"
                        data-testid="body-part-mouth"
                    />

                    {/* Torso */}
                    <path
                        d="M130 160 L110 170 L100 250 L105 340 L195 340 L200 250 L190 170 L170 160 Z"
                        onClick={() => onPartClick('chest')}
                        onMouseEnter={() => setHoveredPart('chest')}
                        onMouseLeave={() => setHoveredPart(null)}
                        className={getPartClasses('chest')}
                        id="chest"
                        data-testid="body-part-chest"
                    />
                     <path
                        d="M105 250 H195 V340 H105 Z"
                        onClick={() => onPartClick('abdomen')}
                        onMouseEnter={() => setHoveredPart('abdomen')}
                        onMouseLeave={() => setHoveredPart(null)}
                        className={getPartClasses('abdomen')}
                        id="abdomen"
                        data-testid="body-part-abdomen"
                    />

                    {/* Arms */}
                    <path
                        d="M110 172 L95 180 L60 300 L80 305 L108 178 Z"
                        onClick={() => onPartClick('leftArm')}
                        onMouseEnter={() => setHoveredPart('leftArm')}
                        onMouseLeave={() => setHoveredPart(null)}
                        className={getPartClasses('leftArm')}
                        id="left-arm"
                        data-testid="body-part-leftArm"
                    />
                    <path
                        d="M190 172 L205 180 L240 300 L220 305 L192 178 Z"
                        onClick={() => onPartClick('rightArm')}
                        onMouseEnter={() => setHoveredPart('rightArm')}
                        onMouseLeave={() => setHoveredPart(null)}
                        className={getPartClasses('rightArm')}
                        id="right-arm"
                        data-testid="body-part-rightArm"
                    />

                    {/* Legs */}
                     <path
                        d="M105 340 L100 350 L90 500 L140 500 L135 340 Z"
                        onClick={() => onPartClick('leftLeg')}
                        onMouseEnter={() => setHoveredPart('leftLeg')}
                        onMouseLeave={() => setHoveredPart(null)}
                        className={getPartClasses('leftLeg')}
                        id="left-leg"
                        data-testid="body-part-leftLeg"
                    />
                     <path
                        d="M195 340 L200 350 L210 500 L160 500 L165 340 Z"
                        onClick={() => onPartClick('rightLeg')}
                        onMouseEnter={() => setHoveredPart('rightLeg')}
                        onMouseLeave={() => setHoveredPart(null)}
                        className={getPartClasses('rightLeg')}
                        id="right-leg"
                        data-testid="body-part-rightLeg"
                    />

                    {/* Joints & Extremities */}
                    <g onClick={() => onPartClick('elbows')} onMouseEnter={() => setHoveredPart('elbows')} onMouseLeave={() => setHoveredPart(null)} className={getPartClasses('elbows')}>
                        <circle cx="85" cy="240" r="10" id="elbow-left" data-testid="body-part-elbows"/>
                        <circle cx="215" cy="240" r="10" id="elbow-right" data-testid="body-part-elbows"/>
                    </g>
                    <g onClick={() => onPartClick('hands')} onMouseEnter={() => setHoveredPart('hands')} onMouseLeave={() => setHoveredPart(null)} className={getPartClasses('hands')}>
                        <ellipse cx="70" cy="302" rx="15" ry="12" id="hand-left" data-testid="body-part-hands"/>
                        <ellipse cx="230" cy="302" rx="15" ry="12" id="hand-right" data-testid="body-part-hands"/>
                    </g>
                    <g onClick={() => onPartClick('knees')} onMouseEnter={() => setHoveredPart('knees')} onMouseLeave={() => setHoveredPart(null)} className={getPartClasses('knees')}>
                        <circle cx="115" cy="420" r="12" id="knee-left" data-testid="body-part-knees"/>
                        <circle cx="185" cy="420" r="12" id="knee-right" data-testid="body-part-knees"/>
                    </g>
                    <g onClick={() => onPartClick('feet')} onMouseEnter={() => setHoveredPart('feet')} onMouseLeave={() => setHoveredPart(null)} className={getPartClasses('feet')}>
                        <ellipse cx="115" cy="505" rx="25" ry="10" id="foot-left" data-testid="body-part-feet"/>
                        <ellipse cx="185" cy="505" rx="25" ry="10" id="foot-right" data-testid="body-part-feet"/>
                    </g>

                    {/* Organs */}
                    <g onClick={() => onPartClick('lungs')} onMouseEnter={() => setHoveredPart('lungs')} onMouseLeave={() => setHoveredPart(null)} className={getPartClasses('lungs')} id="lungs" data-testid="body-part-lungs">
                      <path d="M140 180 C110 180 110 240 130 250 L140 250 Z" />
                      <path d="M160 180 C190 180 190 240 170 250 L160 250 Z" />
                    </g>
                    <path
                        d="M150 210 C135 220 138 245 150 250 C162 245 165 220 150 210 Z"
                        onClick={() => onPartClick('heart')}
                        onMouseEnter={() => setHoveredPart('heart')}
                        onMouseLeave={() => setHoveredPart(null)}
                        className={getPartClasses('heart')}
                        id="heart"
                        data-testid="body-part-heart"
                    />
                    <path
                        d="M155 260 C180 260 185 290 160 290 L155 285 Z"
                        onClick={() => onPartClick('liver')}
                        onMouseEnter={() => setHoveredPart('liver')}
                        onMouseLeave={() => setHoveredPart(null)}
                        className={getPartClasses('liver')}
                        id="liver"
                        data-testid="body-part-liver"
                    />
                    <path
                        d="M145 260 C120 260 115 290 140 290 L145 285 Z"
                        onClick={() => onPartClick('stomach')}
                        onMouseEnter={() => setHoveredPart('stomach')}
                        onMouseLeave={() => setHoveredPart(null)}
                        className={getPartClasses('stomach')}
                        id="stomach"
                        data-testid="body-part-stomach"
                    />
                    <g onClick={() => onPartClick('kidneys')} onMouseEnter={() => setHoveredPart('kidneys')} onMouseLeave={() => setHoveredPart(null)} className={getPartClasses('kidneys')} id="kidneys" data-testid="body-part-kidneys">
                      <path d="M140 300 C130 305 130 325 140 330 C145 325 145 305 140 300 Z" />
                      <path d="M160 300 C170 305 170 325 160 330 C155 325 155 305 160 300 Z" />
                    </g>
                </g>
                <g className="text-sm font-medium pointer-events-none">
                    <text x="150" y="90" textAnchor="middle" visibility={isSelected('head') || hoveredPart === 'head' ? 'visible' : 'hidden'} className={cn(isSelected('head') ? 'animate-in fade-in fill-primary-foreground' : 'fill-foreground')}>Head</text>
                    <text x="150" y="60" textAnchor="middle" visibility={isSelected('brain') || hoveredPart === 'brain' ? 'visible' : 'hidden'} className={cn(isSelected('brain') ? 'animate-in fade-in fill-primary-foreground' : 'fill-foreground')}>Brain</text>
                    <text x="150" y="100" textAnchor="middle" visibility={isSelected('eyes') || hoveredPart === 'eyes' ? 'visible' : 'hidden'} className={cn(isSelected('eyes') ? 'animate-in fade-in fill-primary-foreground' : 'fill-foreground')}>Eyes</text>
                    <text x="150" y="95" textAnchor="middle" visibility={isSelected('ears') || hoveredPart === 'ears' ? 'visible' : 'hidden'} className={cn(isSelected('ears') ? 'animate-in fade-in fill-primary-foreground' : 'fill-foreground')}>Ears</text>
                    <text x="150" y="115" textAnchor="middle" visibility={isSelected('nose') || hoveredPart === 'nose' ? 'visible' : 'hidden'} className={cn(isSelected('nose') ? 'animate-in fade-in fill-primary-foreground' : 'fill-foreground')}>Nose</text>
                    <text x="150" y="133" textAnchor="middle" visibility={isSelected('mouth') || hoveredPart === 'mouth' ? 'visible' : 'hidden'} className={cn(isSelected('mouth') ? 'animate-in fade-in fill-primary-foreground' : 'fill-foreground')}>Mouth</text>
                    <text x="150" y="210" textAnchor="middle" visibility={isSelected('chest') || hoveredPart === 'chest' ? 'visible' : 'hidden'} className={cn(isSelected('chest') ? 'animate-in fade-in fill-primary-foreground' : 'fill-foreground')}>Chest</text>
                    <text x="150" y="290" textAnchor="middle" visibility={isSelected('abdomen') || hoveredPart === 'abdomen' ? 'visible' : 'hidden'} className={cn(isSelected('abdomen') ? 'animate-in fade-in fill-primary-foreground' : 'fill-foreground')}>Abdomen</text>
                    <text x="75" y="240" textAnchor="middle" visibility={isSelected('leftArm') || hoveredPart === 'leftArm' ? 'visible' : 'hidden'} className={cn(isSelected('leftArm') ? 'animate-in fade-in fill-primary-foreground' : 'fill-foreground')}>L. Arm</text>
                    <text x="225" y="240" textAnchor="middle" visibility={isSelected('rightArm') || hoveredPart === 'rightArm' ? 'visible' : 'hidden'} className={cn(isSelected('rightArm') ? 'animate-in fade-in fill-primary-foreground' : 'fill-foreground')}>R. Arm</text>
                    <text x="115" y="420" textAnchor="middle" visibility={isSelected('leftLeg') || hoveredPart === 'leftLeg' ? 'visible' : 'hidden'} className={cn(isSelected('leftLeg') ? 'animate-in fade-in fill-primary-foreground' : 'fill-foreground')}>L. Leg</text>
                    <text x="185" y="420" textAnchor="middle" visibility={isSelected('rightLeg') || hoveredPart === 'rightLeg' ? 'visible' : 'hidden'} className={cn(isSelected('rightLeg') ? 'animate-in fade-in fill-primary-foreground' : 'fill-foreground')}>R. Leg</text>
                    
                    <text x="150" y="245" textAnchor="middle" visibility={isSelected('elbows') || hoveredPart === 'elbows' ? 'visible' : 'hidden'} className={cn(isSelected('elbows') ? 'animate-in fade-in fill-primary-foreground' : 'fill-foreground')}>Elbows</text>
                    <text x="150" y="305" textAnchor="middle" visibility={isSelected('hands') || hoveredPart === 'hands' ? 'visible' : 'hidden'} className={cn(isSelected('hands') ? 'animate-in fade-in fill-primary-foreground' : 'fill-foreground')}>Hands</text>
                    <text x="150" y="425" textAnchor="middle" visibility={isSelected('knees') || hoveredPart === 'knees' ? 'visible' : 'hidden'} className={cn(isSelected('knees') ? 'animate-in fade-in fill-primary-foreground' : 'fill-foreground')}>Knees</text>
                    <text x="150" y="510" textAnchor="middle" visibility={isSelected('feet') || hoveredPart === 'feet' ? 'visible' : 'hidden'} className={cn(isSelected('feet') ? 'animate-in fade-in fill-primary-foreground' : 'fill-foreground')}>Feet</text>

                    <text x="150" y="235" textAnchor="middle" visibility={isSelected('heart') || hoveredPart === 'heart' ? 'visible' : 'hidden'} className={cn(isSelected('heart') ? 'animate-in fade-in fill-primary-foreground' : 'fill-foreground')}>Heart</text>
                    <text x="150" y="200" textAnchor="middle" visibility={isSelected('lungs') || hoveredPart === 'lungs' ? 'visible' : 'hidden'} className={cn(isSelected('lungs') ? 'animate-in fade-in fill-primary-foreground' : 'fill-foreground')}>Lungs</text>
                    <text x="170" y="275" textAnchor="middle" visibility={isSelected('liver') || hoveredPart === 'liver' ? 'visible' : 'hidden'} className={cn(isSelected('liver') ? 'animate-in fade-in fill-primary-foreground' : 'fill-foreground')}>Liver</text>
                    <text x="130" y="275" textAnchor="middle" visibility={isSelected('stomach') || hoveredPart === 'stomach' ? 'visible' : 'hidden'} className={cn(isSelected('stomach') ? 'animate-in fade-in fill-primary-foreground' : 'fill-foreground')}>Stomach</text>
                    <text x="150" y="315" textAnchor="middle" visibility={isSelected('kidneys') || hoveredPart === 'kidneys' ? 'visible' : 'hidden'} className={cn(isSelected('kidneys') ? 'animate-in fade-in fill-primary-foreground' : 'fill-foreground')}>Kidneys</text>
                </g>
            </svg>
        </div>
    );
}

    