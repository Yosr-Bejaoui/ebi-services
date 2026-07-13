from groq import Groq
import json

client = Groq()

DEPARTMENTS = {
    "Télé-services": (
        "Centre d'appel, support client par téléphone/chat, assistance technique, "
        "prise d'appels entrants et sortants, télémarketing, hotline."
    ),
    "Business Process Outsourcing (BPO)": (
        "Externalisation de processus métier (back-office), gestion administrative, "
        "comptabilité externalisée, ressources humaines externalisées, saisie de données."
    ),
    "Solutions IT & Digitales": (
        "Développement logiciel, transformation digitale, infrastructure informatique, "
        "sites web, applications, marketing digital, cybersécurité."
    ),
    "Sourcing & Intégration de profils": (
        "Recrutement, staffing, sourcing de candidats, placement de profils, "
        "intégration de talents chez le client."
    ),
}

DEFAULT_INTENT = {
    "intent": "Aucun département approprié",
    "confiance": 0.0,
    "raison": "Classification indisponible",
}

FEW_SHOT_EXAMPLES = [
    {
        "input": "Je veux la liste des services de la société",
        "output": {
            "intent": "Aucun département approprié",
            "confiance": 0.0,
            "raison": "Question générale sur l'ensemble des services de l'entreprise, ne cible aucun département en particulier.",
        },
    },
    {
        "input": "Quels sont vos différents départements ?",
        "output": {
            "intent": "Aucun département approprié",
            "confiance": 0.0,
            "raison": "Question générale sur l'organisation de l'entreprise, pas une demande spécifique.",
        },
    },
    {
        "input": "Je veux externaliser mon centre d'appel",
        "output": {
            "intent": "Business Process Outsourcing (BPO)",
            "confiance": 0.9,
            "raison": "Demande explicite d'externalisation d'une fonction métier.",
        },
    },
    {
        "input": "J'ai besoin d'assistance technique par téléphone",
        "output": {
            "intent": "Télé-services",
            "confiance": 0.9,
            "raison": "Demande explicite de support téléphonique.",
        },
    },
    {
        "input": "Je cherche à recruter des développeurs pour mon entreprise",
        "output": {
            "intent": "Sourcing & Intégration de profils",
            "confiance": 0.9,
            "raison": "Demande explicite de recrutement de profils.",
        },
    },
    {
        "input": "Bonjour, comment allez-vous ?",
        "output": {
            "intent": "Aucun département approprié",
            "confiance": 0.0,
            "raison": "Message de politesse sans intention métier.",
        },
    },
]

department_list = "\n".join(f"- {name} : {desc}" for name, desc in DEPARTMENTS.items())
few_shot_text = "\n\n".join(
    f"Utilisateur : \"{ex['input']}\"\nRéponse : {json.dumps(ex['output'], ensure_ascii=False)}"
    for ex in FEW_SHOT_EXAMPLES
)

SYSTEM_PROMPT = f"""Tu es un assistant qui classifie les intentions des utilisateurs pour une société de services.

Voici les départements disponibles et leur périmètre :
{department_list}

Règles de classification :
1. Classe l'intention uniquement si l'utilisateur exprime un besoin précis et actionnable qui correspond clairement au périmètre d'un seul département.
2. Si la question est générale sur l'entreprise (ex: liste de tous les services, présentation, à propos, "que faites-vous", salutations, questions hors sujet), réponds "Aucun département approprié" avec une confiance de 0.0. Ne force jamais un département sur une question générale même si un mot-clé du domaine y ressemble.
3. Si le besoin pourrait correspondre à plusieurs départements à la fois ou reste ambigu, réponds "Aucun département approprié" avec une confiance basse (inférieure à 0.4).
4. La confiance doit refléter la spécificité réelle de la demande : 0.8-1.0 pour une demande explicite et non ambiguë, 0.4-0.7 pour une demande probable mais pas totalement explicite, 0.0-0.3 pour une question générale, vague ou hors périmètre.
5. Réponds UNIQUEMENT avec un objet JSON, sans aucun autre texte, au format suivant :
{{"intent": "nom exact du département ou Aucun département approprié", "confiance": 0.0, "raison": "raison courte de la classification"}}

Exemples :
{few_shot_text}
"""


def classify_intent(user_input):
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"Classifie l'intention de l'utilisateur suivant : '{user_input}'."},
            ],
            temperature=0,
            response_format={"type": "json_object"},
        )

        raw_content = response.choices[0].message.content
        result = json.loads(raw_content) if raw_content else None

        if not isinstance(result, dict):
            return dict(DEFAULT_INTENT)

        if result.get("intent") not in DEPARTMENTS and result.get("intent") != DEFAULT_INTENT["intent"]:
            result["intent"] = DEFAULT_INTENT["intent"]
            result["confiance"] = 0.0

        if "confiance" not in result or not isinstance(result["confiance"], (int, float)):
            result["confiance"] = DEFAULT_INTENT["confiance"]

        result["confiance"] = max(0.0, min(1.0, float(result["confiance"])))

        if "raison" not in result:
            result["raison"] = ""

        return result

    except Exception as e:
        fallback = dict(DEFAULT_INTENT)
        fallback["raison"] = f"Erreur de classification: {str(e)}"
        return fallback


if __name__ == "__main__":
    import sys
    query = " ".join(sys.argv[1:]) if len(sys.argv) > 1 else "Je veux externaliser mon centre d'appel"
    result = classify_intent(query)
    print(json.dumps(result, ensure_ascii=False))