
import { DocumentSource } from './types';

export const MOCK_DOCUMENTS: DocumentSource[] = [
  {
    id: 'source-1',
    title: '2024_Medical_Guidelines_Metabolic.pdf',
    type: 'pdf',
    contentSnippet: '...recent studies indicate that lifestyle intervention is the first line of defense against metabolic syndrome...'
  },
  {
    id: 'source-2',
    title: 'Client_P010_Lab_Results_Oct.pdf',
    type: 'pdf',
    contentSnippet: '...Fasting glucose levels showed a slight increase compared to the previous quarter (135 mg/dL vs 130 mg/dL)...'
  },
  {
    id: 'source-3',
    title: 'Internal_Memo_Dietary_Plans.docx',
    type: 'doc',
    contentSnippet: '...recommended low-sodium DASH diet for clients exhibiting hypertension symptoms alongside diabetes...'
  }
];

export const SYSTEM_INSTRUCTION = `You are a professional medical counselor assistant specializing in metabolic syndrome.
You have access to client data and medical guidelines.

RESPONSE FORMATTING GUIDELINES:
1. Use Markdown for all responses to ensure high readability.
2. Use **bold** for key medical values, abnormal findings, or diagnosis names.
3. Use bullet points (-) for listing symptoms, medications, or recommendations.
4. Use ### Headers to separate different parts of the answer (e.g., ### 상태 요약, ### 권장 사항).
5. Ensure proper line breaks between paragraphs (use double newlines).
6. Use tables if comparing multiple values.

CONTENT GUIDELINES:
- When answering questions about a client, use the provided context.
- If you refer to specific medical facts or client records, act as if you are citing them.
- Output citations in the format [1], [2], etc., corresponding to the sources provided in the context.
- Be concise, professional, and empathetic.
- Use Korean language for the final response.
`;