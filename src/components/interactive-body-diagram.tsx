"use client";

import { cn } from "@/lib/utils";

export const BODY_PARTS = {
    head: "Head",
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
} as const;

export type BodyPart = keyof typeof BODY_PARTS;

interface InteractiveBodyDiagramProps {
    selectedParts: BodyPart[];
    onPartClick: (part: BodyPart) => void;
    className?: string;
}

export default function InteractiveBodyDiagram({ selectedParts, onPartClick, className }: InteractiveBodyDiagramProps) {
    const isSelected = (part: BodyPart) => selectedParts.includes(part);

    const getPartClasses = (part: BodyPart) => {
        return cn(
            "transition-all duration-300 ease-in-out cursor-pointer",
            "hover:fill-primary/20 hover:stroke-primary",
            isSelected(part) 
                ? "fill-primary stroke-primary animate-pulse-glow" 
                : "fill-transparent stroke-foreground"
        );
    };


    return (
        <div className={cn("flex justify-center items-center", className)}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 250 500"
                className="max-h-[400px] w-auto"
                aria-label="Interactive human body diagram"
                fill="none"
                strokeWidth="2"
            >
                <g>
                    {/* Head */}
                    <path
                        d="M125,80 C100,80 80,100 80,125 C80,150 100,170 125,170 C150,170 170,150 170,125 C170,100 150,80 125,80 Z"
                        onClick={() => onPartClick('head')}
                        className={getPartClasses('head')}
                        id="head"
                        data-testid="body-part-head"
                    />
                    {/* Torso (Chest + Abdomen) */}
                    <path
                        d="M90,175 H160 V240 H90 Z"
                        onClick={() => onPartClick('chest')}
                        className={getPartClasses('chest')}
                        id="chest"
                        data-testid="body-part-chest"
                    />
                    <path
                        d="M90,240 H160 V300 H90 Z"
                        onClick={() => onPartClick('abdomen')}
                        className={getPartClasses('abdomen')}
                        id="abdomen"
                        data-testid="body-part-abdomen"
                    />
                    {/* Arms */}
                    <path
                        d="M90,175 L60,280 L80,285 L105,180 Z"
                        onClick={() => onPartClick('leftArm')}
                        className={getPartClasses('leftArm')}
                        id="left-arm"
                        data-testid="body-part-leftArm"
                    />
                    <path
                        d="M160,175 L190,280 L170,285 L145,180 Z"
                        onClick={() => onPartClick('rightArm')}
                        className={getPartClasses('rightArm')}
                        id="right-arm"
                        data-testid="body-part-rightArm"
                    />
                    {/* Legs */}
                    <path
                        d="M90,300 L80,420 L105,420 L110,300 Z"
                        onClick={() => onPartClick('leftLeg')}
                        className={getPartClasses('leftLeg')}
                        id="left-leg"
                        data-testid="body-part-leftLeg"
                    />
                    <path
                        d="M160,300 L170,420 L145,420 L140,300 Z"
                        onClick={() => onPartClick('rightLeg')}
                        className={getPartClasses('rightLeg')}
                        id="right-leg"
                        data-testid="body-part-rightLeg"
                    />

                    {/* Organs */}
                    {/* Lungs */}
                    <path
                        d="M122,180 C110,180 100,200 100,215 C100,230 110,235 122,235 Z"
                        onClick={() => onPartClick('lungs')}
                        className={getPartClasses('lungs')}
                        id="lungs-right"
                        data-testid="body-part-lungs"
                    />
                    <path
                         d="M128,180 C140,180 150,200 150,215 C150,230 140,235 128,235 Z"
                        onClick={() => onPartClick('lungs')}
                        className={getPartClasses('lungs')}
                        id="lungs-left"
                        data-testid="body-part-lungs"
                    />
                    {/* Heart */}
                    <path
                        d="M125,200 C115,210 118,230 125,235 C132,230 135,210 125,200 Z"
                        onClick={() => onPartClick('heart')}
                        className={getPartClasses('heart')}
                        id="heart"
                        data-testid="body-part-heart"
                    />
                    {/* Liver */}
                     <path
                        d="M148,245 C148,265 128,265 128,255 C128,245 148,245 148,245 Z"
                        onClick={() => onPartClick('liver')}
                        className={getPartClasses('liver')}
                        id="liver"
                        data-testid="body-part-liver"
                    />
                    {/* Stomach */}
                    <path
                        d="M102,245 C102,265 122,265 122,255 C122,245 102,245 102,245 Z"
                        onClick={() => onPartClick('stomach')}
                        className={getPartClasses('stomach')}
                        id="stomach"
                        data-testid="body-part-stomach"
                    />
                    {/* Kidneys */}
                    <path
                        d="M118,275 C122,280 122,295 118,300 C110,300 110,275 118,275 Z"
                        onClick={() => onPartClick('kidneys')}
                        className={getPartClasses('kidneys')}
                        id="kidneys-right"
                        data-testid="body-part-kidneys"
                    />
                    <path
                        d="M132,275 C128,280 128,295 132,300 C140,300 140,275 132,275 Z"
                        onClick={() => onPartClick('kidneys')}
                        className={getPartClasses('kidneys')}
                        id="kidneys-left"
                        data-testid="body-part-kidneys"
                    />
                </g>
                <g className="text-sm font-medium fill-primary-foreground pointer-events-none">
                    <text x="125" y="130" textAnchor="middle" visibility={isSelected('head') ? 'visible' : 'hidden'} className={isSelected('head') ? 'animate-in fade-in' : ''}>Head</text>
                    <text x="125" y="210" textAnchor="middle" visibility={isSelected('chest') ? 'visible' : 'hidden'} className={isSelected('chest') ? 'animate-in fade-in' : ''}>Chest</text>
                    <text x="125" y="270" textAnchor="middle" visibility={isSelected('abdomen') ? 'visible' : 'hidden'} className={isSelected('abdomen') ? 'animate-in fade-in' : ''}>Abdomen</text>
                    <text x="65" y="230" textAnchor="middle" visibility={isSelected('leftArm') ? 'visible' : 'hidden'} className={isSelected('leftArm') ? 'animate-in fade-in' : ''}>L. Arm</text>
                    <text x="185" y="230" textAnchor="middle" visibility={isSelected('rightArm') ? 'visible' : 'hidden'} className={isSelected('rightArm') ? 'animate-in fade-in' : ''}>R. Arm</text>
                    <text x="95" y="360" textAnchor="middle" visibility={isSelected('leftLeg') ? 'visible' : 'hidden'} className={isSelected('leftLeg') ? 'animate-in fade-in' : ''}>L. Leg</text>
                    <text x="155" y="360" textAnchor="middle" visibility={isSelected('rightLeg') ? 'visible' : 'hidden'} className={isSelected('rightLeg') ? 'animate-in fade-in' : ''}>R. Leg</text>
                    
                    <text x="125" y="220" textAnchor="middle" visibility={isSelected('heart') ? 'visible' : 'hidden'} className={isSelected('heart') ? 'animate-in fade-in' : ''}>Heart</text>
                    <text x="125" y="190" textAnchor="middle" visibility={isSelected('lungs') ? 'visible' : 'hidden'} className={isSelected('lungs') ? 'animate-in fade-in' : ''}>Lungs</text>
                    <text x="140" y="255" textAnchor="middle" visibility={isSelected('liver') ? 'visible' : 'hidden'} className={isSelected('liver') ? 'animate-in fade-in' : ''}>Liver</text>
                    <text x="110" y="255" textAnchor="middle" visibility={isSelected('stomach') ? 'visible' : 'hidden'} className={isSelected('stomach') ? 'animate-in fade-in' : ''}>Stomach</text>
                    <text x="125" y="285" textAnchor="middle" visibility={isSelected('kidneys') ? 'visible' : 'hidden'} className={isSelected('kidneys') ? 'animate-in fade-in' : ''}>Kidneys</text>
                </g>
            </svg>
        </div>
    );
}
