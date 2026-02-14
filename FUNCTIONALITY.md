# SailWell Application Functionality

This document provides a detailed breakdown of the features and capabilities of the SailWell application. The application is an AI-powered medical assistant designed for maritime environments.

## Core Feature: AI-Powered Medical Diagnosis & Drug Suggestion

The central feature of the application is a multi-step wizard that guides the user through a diagnostic process, culminating in AI-generated medication suggestions.

### 1. Multi-Step Diagnostic Workflow

-   **Step 1: Crew Member Information:**
    -   **New Crew Member:** Users can create a profile for a new crew member, capturing their full name, date of birth, alcohol usage habits, and smoking status. A unique Medical ID is automatically generated.
    -   **Existing Crew Member:** Users can look up an existing crew member by their Medical ID to pre-fill their information and proceed to the next step.
    -   **Chronic Diseases & Allergies:** The form allows for the selection of pre-existing chronic conditions and allergies. If "Allergies" is checked, a dialog window appears, allowing the user to select from a comprehensive list of known allergy types.

-   **Step 2: Pain Area Selection:**
    -   An interactive and detailed human body diagram is presented.
    -   Users can click on specific body parts (e.g., Head, Chest, Abdomen, Limbs) and internal organs (e.g., Heart, Lungs, Liver) to visually indicate where the crew member is experiencing pain or discomfort.

-   **Step 3: Symptoms & Vital Signs:**
    -   A form is provided to input detailed information about the crew member's condition.
    -   **Symptom Description:** A text area for a detailed description of symptoms. This field is automatically pre-populated based on the selections from the body diagram and the specified allergies.
    -   **Mandatory Vital Signs:** Input fields for Temperature, Blood Pressure, and Heart Rate are required.
    -   **Mandatory Consciousness Level:** A dropdown menu requires the user to select the patient's level of consciousness from "Alert," "Responds to Voice," "Responds to Pain," or "Unresponsive."

-   **Step 4: AI Analysis & Suggestions:**
    -   All collected information is sent to a backend Genkit AI flow (`aiPoweredDrugRecommendation`).
    -   The AI analyzes the data and returns:
        -   A potential **medical diagnosis**.
        -   A **severity level** for the condition (red, orange, or green).
        -   A list of **suggested drugs**, including the reasoning, recommended dosage, and a flag indicating if the drug is a narcotic.
    -   A modal dialog immediately informs the user of the AI's diagnosis and the severity, using color-coding for quick visual reference.
    -   The suggested medications are displayed as individual cards.

### 2. Drug Dispensing

-   **Drug Suggestion Cards:** Each suggested drug is presented on a card showing:
    -   Drug name, dosage, and the AI's reasoning.
    -   A prominent icon if the drug is a narcotic.
    -   The current stock level, visualized with a progress bar.
    -   A dropdown to look up commercial brand names of the generic drug by country (USA, UK, Germany, India).
-   **Dispensing Action:**
    -   Users can input a quantity and click a "Dispense" button.
    -   **Narcotic Approval Workflow:** If the drug is a narcotic, a password-protected dialog appears, requiring a master password for approval before the dispensing is logged.

---

## Inventory & Stock Management

### 1. Stock Overview Page (`/stock`)

-   Provides a comprehensive table of all drugs in the ship's inventory.
-   For each drug, it displays the name (with a narcotic indicator), current vs. max stock, and the expiry date.
-   **Refilling:** Allows for the direct refilling of stock for each drug.
-   **Update Expiry:** The expiry date for each medication can be updated directly from the table.

### 2. Adding New Drugs

-   A dialog allows for the addition of new drugs to the inventory.
-   The user provides the drug name, initial quantity, and expiry date.
-   The system automatically calls a separate AI flow (`isDrugNarcotic`) to determine if the new drug is a controlled substance and flags it accordingly in the system.

### 3. Automatic Stock Addition

-   If the AI diagnosis step suggests a drug that is not currently in the inventory, it is automatically added to the stock with a default quantity.

---

## Reporting & Analytics

### 1. Dispensing and Diagnoses Report (`/reports`)

-   A detailed, filterable, and sortable log of all dispensing events.
-   Displays crew name, medical ID, drug name, quantity, diagnosis, and timestamp for each entry.
-   **Filtering:** Users can filter the entire log by crew name or medical ID to isolate a specific individual's history.
-   **Sorting:** The data can be sorted by "Crew Name" or "Timestamp" by clicking the respective column headers.

### 2. Disease Trends Report (`/reports/disease-trends`)

-   Presents a pie chart that visualizes the frequency of different diagnoses recorded across the ship.
-   This provides an at-a-glance overview of the most common health issues affecting the crew.

### 3. Low Stock Report (`/reports/low-stock`)

-   Automatically lists all medications in the inventory with stock levels below 50% capacity.
-   This report helps the crew proactively manage inventory and reorder necessary supplies.

### 4. Crew List (`/reports/patient-list`)

-   A simple, searchable list of all registered crew members, showing their full name and unique medical ID.

---

## User Interface & Experience

-   **Modern & Responsive Design:** Built using Next.js, React, and ShadCN UI components for a clean and professional look that works on various screen sizes.
-   **Collapsible Sidebar Navigation:** Provides easy access to all major sections of the application: Drug Suggester, Stock Management, Analytics (with sub-links to reports), and Narcotics.
-   **Interactive & Guided Workflow:** The multi-step form, progress bar, interactive body diagram, and notification toasts create an intuitive user experience.
-   **Centralized State Management:** Utilizes React Context (`AppContext`) to manage application-wide state (drug stock, logs, crew members) consistently across all components.
