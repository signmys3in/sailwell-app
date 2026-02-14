# Ada Health Integration Guide

This document provides a guide for completing the integration of the Ada Health API into your SailWell application. The foundational code has been created for you, but you will need to take the final steps to activate it.

## What Has Been Done

1.  **New Genkit Flow:** A new file at `src/ai/flows/ada-health-integration.ts` has been created. This file contains a Genkit flow specifically designed to communicate with an external API like Ada Health. It includes placeholder logic and detailed comments to guide you.

2.  **New Server Action:** The new flow has been exposed to the front end via a server action named `getAdaAssessment` in the `src/app/actions.ts` file. You can now call this function from your React components.

3.  **Simulated Response:** Currently, the flow returns a hardcoded, *simulated* response. This allows you to start building the UI without needing a live API key, but it does not represent a real diagnosis.

## Your Next Steps

To make the integration fully functional, you need to complete the following steps.

### Step 1: Obtain Ada Health API Credentials

You must register on the [Ada Health for Developers](https://ada.com/developers/) website to get access to their API and receive an API key. This key is essential for authenticating your requests.

### Step 2: Configure Your API Key

Once you have your API key, you need to store it securely.

1.  **Create a `.env.local` file** in the root directory of your project if it doesn't already exist.
2.  Add your API key to this file. The key name should match the one used in the placeholder flow.

    ```
    # .env.local
    ADA_API_KEY="your_actual_api_key_from_ada"
    ```

    **Note:** The `.env.local` file is listed in `.gitignore` by default and should never be committed to your repository, keeping your key secure.

### Step 3: Implement the Live API Call

Now you will edit the placeholder flow to make a real request to the Ada Health API.

1.  **Open the file:** `src/ai/flows/ada-health-integration.ts`.
2.  **Locate the `TODO` section** inside the `adaHealthSymptomAssessmentFlow` function.
3.  **Uncomment the `try...catch` block** that contains the `fetch` call.
4.  **Update the `fetch` call:**
    *   Verify the `adaApiEndpoint` is correct based on the Ada Health documentation.
    *   Examine the `body` of the request. You will need to structure the data sent to Ada Health according to their API specifications. The current placeholder is just an example. You may need to parse the symptom string or add more fields.
5.  **Remove the simulated response:** Once your live API call is working, you can delete the simulated data at the end of the function.

### Step 4: Integrate into the User Interface (Optional)

With the backend flow working, you can now call it from the user interface.

1.  **Open the file:** `src/app/page.tsx`.
2.  **Import the action:**
    ```tsx
    import { getAdaAssessment } from "@/app/actions";
    ```
3.  **Call the action:** You could add a new button in the `SuggestionsStep` component to act as a "second opinion" feature.

    **Example:**
    ```tsx
    // Inside a component...
    const [adaResponse, setAdaResponse] = useState(null);

    const handleGetAdaOpinion = async () => {
        // You would get this data from your form state
        const input = {
            symptoms: "Patient has a headache and fever.",
            yearOfBirth: 1985,
            sex: "male"
        };
        
        const result = await getAdaAssessment(input);
        
        if (result.error) {
            // Handle error...
        } else {
            // Set the response to state and display it
            setAdaResponse(result);
        }
    };

    // In your JSX...
    <Button onClick={handleGetAdaOpinion}>Get Second Opinion from Ada</Button>
    {adaResponse && (
        <div>
            <h3>Ada Health Assessment:</h3>
            {/* Render the conditions from adaResponse */}
        </div>
    )}
    ```

By following these steps, you can transition from the provided scaffolding to a fully functional integration with the Ada Health API.
