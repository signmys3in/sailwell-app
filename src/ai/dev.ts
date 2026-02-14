'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/ai-powered-drug-recommendation.ts';
import '@/ai/flows/is-narcotic-check.ts';
import '@/ai/flows/ada-health-integration.ts';
