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
                </g>
                <g className="text-sm font-medium fill-primary-foreground pointer-events-none">
                    <text x="125" y="130" textAnchor="middle" visibility={isSelected('head') ? 'visible' : 'hidden'} className={isSelected('head') ? 'animate-in fade-in' : ''}>Head</text>
                    <text x="125" y="210" textAnchor="middle" visibility={isSelected('chest') ? 'visible' : 'hidden'} className={isSelected('chest') ? 'animate-in fade-in' : ''}>Chest</text>
                    <text x="125" y="270" textAnchor="middle" visibility={isSelected('abdomen') ? 'visible' : 'hidden'} className={isSelected('abdomen') ? 'animate-in fade-in' : ''}>Abdomen</text>
                    <text x="65" y="230" textAnchor="middle" visibility={isSelected('leftArm') ? 'visible' : 'hidden'} className={isSelected('leftArm') ? 'animate-in fade-in' : ''}>L. Arm</text>
                    <text x="185" y="230" textAnchor="middle" visibility={isSelected('rightArm') ? 'visible' : 'hidden'} className={isSelected('rightArm') ? 'animate-in fade-in' : ''}>R. Arm</text>
                    <text x="95" y="360" textAnchor="middle" visibility={isSelected('leftLeg') ? 'visible' : 'hidden'} className={isSelected('leftLeg') ? 'animate-in fade-in' : ''}>L. Leg</text>
                    <text x="155" y="360" textAnchor="middle" visibility={isSelected('rightLeg') ? 'visible' : 'hidden'} className={isSelected('rightLeg') ? 'animate-in fade-in' : ''}>R. Leg</text>
                </g>
            </svg>
        </div>
    );
}
