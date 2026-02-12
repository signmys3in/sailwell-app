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

    return (
        <div className={cn("flex justify-center items-center", className)}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 250 500"
                className="max-h-[400px] w-auto"
                aria-label="Interactive human body diagram"
            >
                <g className="fill-muted stroke-foreground/50 stroke-2 cursor-pointer group">
                    {/* Head */}
                    <path
                        d="M125,80 C100,80 80,100 80,125 C80,150 100,170 125,170 C150,170 170,150 170,125 C170,100 150,80 125,80 Z"
                        onClick={() => onPartClick('head')}
                        className={cn("hover:fill-primary/50 transition-colors", { "fill-primary": isSelected('head') })}
                        id="head"
                        data-testid="body-part-head"
                    />
                    {/* Torso (Chest + Abdomen) */}
                    <path
                        d="M90,175 H160 V240 H90 Z"
                        onClick={() => onPartClick('chest')}
                        className={cn("hover:fill-primary/50 transition-colors", { "fill-primary": isSelected('chest') })}
                        id="chest"
                        data-testid="body-part-chest"
                    />
                    <path
                        d="M90,240 H160 V300 H90 Z"
                        onClick={() => onPartClick('abdomen')}
                        className={cn("hover:fill-primary/50 transition-colors", { "fill-primary": isSelected('abdomen') })}
                        id="abdomen"
                        data-testid="body-part-abdomen"
                    />
                    {/* Arms */}
                    <path
                        d="M90,175 L60,280 L80,285 L105,180 Z"
                        onClick={() => onPartClick('leftArm')}
                        className={cn("hover:fill-primary/50 transition-colors", { "fill-primary": isSelected('leftArm') })}
                        id="left-arm"
                        data-testid="body-part-leftArm"
                    />
                    <path
                        d="M160,175 L190,280 L170,285 L145,180 Z"
                        onClick={() => onPartClick('rightArm')}
                        className={cn("hover:fill-primary/50 transition-colors", { "fill-primary": isSelected('rightArm') })}
                        id="right-arm"
                        data-testid="body-part-rightArm"
                    />
                    {/* Legs */}
                    <path
                        d="M90,300 L80,420 L105,420 L110,300 Z"
                        onClick={() => onPartClick('leftLeg')}
                        className={cn("hover:fill-primary/50 transition-colors", { "fill-primary": isSelected('leftLeg') })}
                        id="left-leg"
                        data-testid="body-part-leftLeg"
                    />
                    <path
                        d="M160,300 L170,420 L145,420 L140,300 Z"
                        onClick={() => onPartClick('rightLeg')}
                        className={cn("hover:fill-primary/50 transition-colors", { "fill-primary": isSelected('rightLeg') })}
                        id="right-leg"
                        data-testid="body-part-rightLeg"
                    />
                </g>
                <g className="text-sm font-medium fill-primary-foreground pointer-events-none">
                    <text x="125" y="130" textAnchor="middle" visibility={isSelected('head') ? 'visible' : 'hidden'}>Head</text>
                    <text x="125" y="210" textAnchor="middle" visibility={isSelected('chest') ? 'visible' : 'hidden'}>Chest</text>
                    <text x="125" y="270" textAnchor="middle" visibility={isSelected('abdomen') ? 'visible' : 'hidden'}>Abdomen</text>
                    <text x="65" y="230" textAnchor="middle" visibility={isSelected('leftArm') ? 'visible' : 'hidden'}>L. Arm</text>
                    <text x="185" y="230" textAnchor="middle" visibility={isSelected('rightArm') ? 'visible' : 'hidden'}>R. Arm</text>
                    <text x="95" y="360" textAnchor="middle" visibility={isSelected('leftLeg') ? 'visible' : 'hidden'}>L. Leg</text>
                    <text x="155" y="360" textAnchor="middle" visibility={isSelected('rightLeg') ? 'visible' : 'hidden'}>R. Leg</text>
                </g>
            </svg>
        </div>
    );
}
