const JUDGE0_API = "https://ce.judge0.com";

const LANGUAGE_IDS = {
    javascript: 93, 
    python:     92, 
    java:       91, 
    cpp:        75, 
};

export function getFileExtension(language) {
    const extensions = { javascript: "js", python: "py", java: "java", cpp: "cpp" };
    return extensions[language] || "txt";
}

async function getSubmissionResult(token) {
    const maxTries = 5;
    
    for (let i = 0; i < maxTries; i++) {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const res = await fetch(`${JUDGE0_API}/submissions/${token}?base64_encoded=true`);
        if (!res.ok) continue;

        const data = await res.json();
        
        if (data.status?.id <= 2) continue;

        // Browser native Base64 decoding using atob()
        const decode = (str) => {
            try {
                return str ? atob(str.trim()) : "";
            } catch (e) {
                return str || ""; // Fallback if it's already plain text
            }
        };

        const output  = decode(data.stdout);
        const compile = decode(data.compile_output);
        const error   = decode(data.stderr);

        if (compile) return { success: false, error: compile };
        if (error)   return { success: false, error };

        return { success: true, output: output || "No output" };
    }

    return { success: false, error: "Execution timed out." };
}

export async function executeCode(language, code) {
    try {
        const languageId = LANGUAGE_IDS[language];
        if (!languageId) {
            return { success: false, error: `Unsupported language: ${language}` };
        }

        // Browser native Base64 encoding using btoa()
        // btoa handles standard characters; btoa(unescape(encodeURIComponent(code))) handles emojis/special symbols safely
        const base64Code = btoa(unescape(encodeURIComponent(code)));

        const response = await fetch(`${JUDGE0_API}/submissions?base64_encoded=true`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                language_id: languageId,
                source_code: base64Code,
            })
        });

        if (!response.ok) {
            return { success: false, error: `HTTP error! status: ${response.status}` };
        }

        const data = await response.json();
        
        if (data.token) {
            return await getSubmissionResult(data.token);
        } else {
            return { success: false, error: "Failed to retrieve token." };
        }

    } catch (error) {
        return { success: false, error: `Failed to execute code: ${error.message}` };
    }
}