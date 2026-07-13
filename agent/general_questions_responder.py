from config import GROQ_API_KEY, GROQ_BASE_URL, GROQ_MODEL
from groq import Groq
import os

client = Groq(
    api_key=GROQ_API_KEY
)

LANGUAGE_INSTRUCTIONS = {
    "fr": "Réponds obligatoirement en français.",
    "en": "You must answer in English.",
}

def generate_response(query, context=None, lang="fr"):
    lang_instruction = LANGUAGE_INSTRUCTIONS.get(lang, LANGUAGE_INSTRUCTIONS["fr"])

    if context:
        if lang == "en":
            system_prompt = (
                "You are the virtual assistant for EBI Services. Answer the user's "
                "question using the information provided below. Do not mention "
                "missing or unavailable information — just answer as best you can "
                "with what you have. Never say \"the information is not there\" or "
                "\"I don't have that information\".\n\n"
                "CRITICAL: Your entire response MUST be in English only. Translate any "
                "French words, names, or phrases from the context below into English. "
                "Do NOT mix languages under any circumstance.\n\n"
                "Be concise: include ONLY the information needed to answer the question. "
                "Do not list all services or stats unless the user asks for them. "
                "Keep responses as short as possible — 1-3 sentences if sufficient, "
                "no more than 5-6 lines unless the user asks for details.\n\n"
                "Format your response clearly:\n"
                "- Use **bold** for important words\n"
                "- Use bullet lists (`- `) to enumerate\n"
                "- Use headings (`### `) to separate sections if the answer is long\n"
                "- Use line breaks to make the text breathable\n\n"
                f"{lang_instruction}\n\n"
                f"INFORMATION ABOUT EBI SERVICES:\n{context}"
            )
        else:
            system_prompt = (
                "Tu es l'assistant virtuel d'EBI Services. Réponds à la question "
                "de l'utilisateur en utilisant les informations fournies ci-dessous. "
                "Ne mentionne pas d'informations manquantes ou indisponibles — réponds "
                "simplement du mieux possible avec ce que tu as. Ne dis jamais "
                "\"l'information n'est pas là\" ou \"je n'ai pas cette information\".\n\n"
                "IMPORTANT : Ta réponse entière DOIT être en français uniquement. Traduis "
                "tout mot, nom ou phrase en anglais du contexte ci-dessous en français. "
                "Ne mélange PAS les langues.\n\n"
                "Sois concis : n'inclus QUE l'information nécessaire pour répondre à la question. "
                "Ne liste pas tous les services ou statistiques sauf si l'utilisateur le demande. "
                "Garde les réponses aussi courtes que possible — 1 à 3 phrases si suffisant, "
                "pas plus de 5-6 lignes sauf si l'utilisateur demande des détails.\n\n"
                "Formate ta réponse clairement :\n"
                "- Utilise **gras** pour les mots importants\n"
                "- Utilise des listes à puces (`- `) pour énumérer\n"
                "- Utilise des titres (`### `) pour séparer les sections si la réponse est longue\n"
                "- Utilise des retours à la ligne pour aérer le texte\n\n"
                f"{lang_instruction}\n\n"
                f"INFORMATIONS SUR EBI SERVICES :\n{context}"
            )
    else:
        if lang == "en":
            system_prompt = (
                f"You are a helpful, clear and concise general assistant. {lang_instruction} "
                "Do NOT mix languages — respond entirely in English. "
                "Be concise: answer in 1-3 sentences when possible. "
                "Never mention missing information — just answer as best you can. "
                "Format with **bold** for key points and lists where appropriate."
            )
        else:
            system_prompt = (
                f"Tu es un assistant généraliste utile, clair et concis. {lang_instruction} "
                "Ne mélange PAS les langues — réponds entièrement en français. "
                "Sois concis : réponds en 1 à 3 phrases quand c'est possible. "
                "Ne mentionne jamais d'informations manquantes — réponds du mieux possible. "
                "Utilise **gras** pour les points importants et des listes si nécessaire."
            )

    response = client.chat.completions.create(
        model=os.environ.get("GROQ_MODEL", "llama-3.3-70b-versatile"),
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": query},
        ],
        max_tokens=500,
    )
    return response.choices[0].message.content