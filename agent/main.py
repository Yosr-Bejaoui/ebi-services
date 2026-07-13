import sys
import re
import inspect
from general_questions_responder import generate_response
from department_handler import classify_intent
from department_contexts import build_context
from rdv_manager import RDVManager

rdv_manager = RDVManager()

RDV_KEYWORDS = [
    "rdv", "rendez-vous", "rendez vous", "planifier", "programmer",
    "réserver", "reserver", "annuler", "créneau", "creneau",
    "disponible", "prendre rdv", "calendrier", "agenda",
    "mes rdv", "mes rendez-vous",
    "appointment", "appointments", "book", "booking", "schedule",
    "reschedule", "cancel", "slot", "available", "availability",
    "my appointment", "my appointments", "calendar",
]

FORM_KEYWORDS = [
    "formulaire", "inscription", "contact", "souscrire",
    "je veux être contacté", "me contacter", "m'inscrire",
    "devis", "demande de devis", "soumettre",
    "form", "sign up", "signup", "subscribe", "contact me",
    "get in touch", "quote", "request a quote", "submit",
]

GENERAL_INFO_KEYWORDS = [
    "heure", "heures", "horaire", "horaires", "ouvert", "ouverte",
    "ouverture", "ferme", "fermé", "fermeture", "à partir de quelle heure",
    "quand êtes-vous ouvert", "adresse", "où êtes-vous", "où se trouve",
    "localisation", "emplacement", "numéro de téléphone", "téléphone",
    "email", "courriel", "site web",
    "hour", "hours", "opening", "open", "close", "closed", "closing",
    "what time", "when are you open", "address", "where are you",
    "location", "phone number", "phone", "website",
]

ENGLISH_HINTS = [
    "the", "what", "when", "where", "how", "is", "are", "you", "please",
    "hello", "hi", "want", "need", "book", "cancel", "appointment",
]

FRENCH_HINTS = [
    "le", "la", "les", "je", "veux", "vous", "êtes", "quand", "où",
    "comment", "bonjour", "svp", "s'il", "rendez", "société",
]

RDV_ACTION_KEYWORDS = {
    "schedule": ("planifier", "programmer", "prendre", "réserver", "reserver", "rdv", "book", "schedule"),
    "cancel": ("annuler", "supprimer", "cancel"),
    "list": ("liste", "mes rdv", "mes rendez", "my appointment", "consulter"),
    "dispo": ("disponible", "créneau", "creneau", "available", "availability", "slot"),
}

NO_DATE_MARKERS = {
    "fr": "Je n'ai pas pu reconnaître une date valide",
    "en": "I could not recognize a valid date",
}

ASK_REDIRECT_THRESHOLD = 0.8
AUTO_REDIRECT_THRESHOLD = 0.9

MESSAGES = {
    "fr": {
        "form_redirect": (
            "### Formulaire de contact\n\n"
            "Je vous redirige vers notre **formulaire de contact**.\n\n"
            "Veuillez remplir vos informations :\n"
            "- Nom\n"
            "- Email\n"
            "- Téléphone\n"
            "- Votre besoin\n\n"
            "Notre équipe vous recontactera rapidement."
        ),
        "ask_redirect": (
            "### Département détecté\n\n"
            "J'ai remarqué que votre question concerne le département suivant :\n"
            "**{intent}**\n\n"
            "Voulez-vous que je vous redirige vers ce département "
            "pour une assistance plus spécialisée ?\n"
            "*(Répondez oui ou non)*"
        ),
        "auto_redirect": (
            "### Département détecté\n\n"
            "J'ai remarqué que votre question concerne le département suivant :\n"
            "**{intent}**\n\n"
            "Je vous redirige vers ce département "
            "pour une assistance plus spécialisée."
        ),
        "error": "### Une erreur est survenue\n\nJe suis désolé, une erreur est survenue lors du traitement de votre demande.\n\nVeuillez réessayer ou contacter notre équipe par formulaire.\n\n`Erreur: {error}`",
    },
    "en": {
        "form_redirect": (
            "### Contact Form\n\n"
            "I'm redirecting you to our **contact form**.\n\n"
            "Please fill in your information :\n"
            "- Name\n"
            "- Email\n"
            "- Phone\n"
            "- Your request\n\n"
            "Our team will get back to you shortly."
        ),
        "ask_redirect": (
            "### Department detected\n\n"
            "I noticed your question concerns the following department :\n"
            "**{intent}**\n\n"
            "Would you like me to redirect you to that department "
            "for more specialized help ?\n"
            "*(Answer yes or no)*"
        ),
        "auto_redirect": (
            "### Department detected\n\n"
            "I noticed your question concerns the following department :\n"
            "**{intent}**\n\n"
            "Redirecting you to that department "
            "for more specialized help."
        ),
        "error": "### An error occurred\n\nSorry, an error occurred while processing your request.\n\nPlease try again or contact our team through the form.\n\n`Error: {error}`",
    },
}

_word_re_cache = {}


def _compile_keyword_pattern(keywords):
    key = tuple(keywords)
    if key not in _word_re_cache:
        escaped = sorted((re.escape(kw) for kw in keywords), key=len, reverse=True)
        pattern = r"(?:%s)" % "|".join(escaped)
        _word_re_cache[key] = re.compile(pattern, re.IGNORECASE)
    return _word_re_cache[key]


def contains_keyword(query: str, keywords) -> bool:
    return _compile_keyword_pattern(keywords).search(query) is not None


def is_rdv_query(query: str) -> bool:
    return contains_keyword(query, RDV_KEYWORDS)


def is_form_query(query: str) -> bool:
    return contains_keyword(query, FORM_KEYWORDS)


def is_general_info_query(query: str) -> bool:
    return contains_keyword(query, GENERAL_INFO_KEYWORDS)


def detect_language(query: str) -> str:
    try:
        from langdetect import detect
        lang = detect(query)
        if lang.startswith("fr"):
            return "fr"
        if lang.startswith("en"):
            return "en"
    except Exception:
        pass

    q = query.lower()
    fr_score = sum(1 for w in FRENCH_HINTS if re.search(rf"\b{re.escape(w)}\b", q))
    en_score = sum(1 for w in ENGLISH_HINTS if re.search(rf"\b{re.escape(w)}\b", q))

    if re.search(r"[àâäéèêëîïôöùûüç]", q):
        fr_score += 2

    return "en" if en_score > fr_score else "fr"


def detect_rdv_action(query: str):
    q = query.lower()
    for action, keywords in RDV_ACTION_KEYWORDS.items():
        if any(kw in q for kw in keywords):
            return action
    return None


def _supports_lang_param(func) -> bool:
    try:
        return "lang" in inspect.signature(func).parameters
    except (TypeError, ValueError):
        return False


def call_generate_response(query: str, context, lang: str) -> str:
    if _supports_lang_param(generate_response):
        return generate_response(query, context, lang=lang)
    return generate_response(query, context)


def call_rdv_method(method_name: str, query: str, lang: str) -> str:
    method = getattr(rdv_manager, method_name)
    if _supports_lang_param(method):
        return method(query, lang=lang)
    return method(query)


conversation_state = {"pending_rdv_action": None}


def handle_rdv_query(query: str, lang: str) -> str:
    pending = conversation_state.get("pending_rdv_action")
    marker = NO_DATE_MARKERS.get(lang, NO_DATE_MARKERS["en"])

    if pending:
        if _supports_lang_param(rdv_manager.extract_date_time):
            date_time = rdv_manager.extract_date_time(query, lang=lang)
        else:
            date_time = rdv_manager.extract_date_time(query)

        if date_time is None:
            return call_rdv_method("manage_rdvs", query, lang)

        conversation_state["pending_rdv_action"] = None
        if pending == "schedule":
            return call_rdv_method("schedule_rdv", query, lang)
        elif pending == "cancel":
            return call_rdv_method("cancel_rdv", query, lang)
        else:
            return call_rdv_method("manage_rdvs", query, lang)

    response = call_rdv_method("manage_rdvs", query, lang)
    if marker in response or NO_DATE_MARKERS["fr"] in response or NO_DATE_MARKERS["en"] in response:
        conversation_state["pending_rdv_action"] = detect_rdv_action(query) or "schedule"
    return response


NEGATION_WORDS = {
    "fr": ["non", "non merci", "pas", "ne", "n'", "aucun", "jamais"],
    "en": ["no", "no thanks", "no thank you", "not", "none", "never", "don't", "dont"],
}


def is_negation(query: str, lang: str) -> bool:
    q = query.lower().strip().rstrip(".,!?;:")
    negs = NEGATION_WORDS.get(lang, NEGATION_WORDS["en"])
    return q in negs or any(q.startswith(w) for w in negs)


def process_query(query: str, lang: str = None) -> str:
    if lang is None:
        lang = detect_language(query)
    msgs = MESSAGES[lang]

    try:
        if is_rdv_query(query) and not is_negation(query, lang):
            return (
                "### Rendez-vous\n\n"
                "Souhaitez-vous **prendre un rendez-vous** avec notre équipe ?\n"
                "*(Répondez oui ou non)*"
            ) if lang == "fr" else (
                "### Appointment\n\n"
                "Would you like to **book an appointment** with our team ?\n"
                "*(Answer yes or no)*"
            )

        if conversation_state.get("pending_rdv_action"):
            return handle_rdv_query(query, lang)

        if is_form_query(query) and not is_negation(query, lang):
            return msgs["form_redirect"]

        if is_general_info_query(query):
            context = build_context({"intent": "Aucun département approprié", "confiance": 0.0})
            return call_generate_response(query, context, lang)

        intent = classify_intent(query, lang=lang) or {}
        confiance = intent.get("confiance", 0) or 0
        intent_name = intent.get("intent", "")

        no_dept_fr = "Aucun département approprié"
        no_dept_en = "No matching department"

        context = build_context(intent)
        response = call_generate_response(query, context, lang)

        # If user says no/non to a redirect offer, always respond with knowledge
        if is_negation(query, lang):
            return response

        # No department match or low confidence: answer directly (no redirect)
        if intent_name in (no_dept_fr, no_dept_en) or confiance <= 0:
            return response

        # Medium confidence: answer based on context but still offer redirect
        if confiance < ASK_REDIRECT_THRESHOLD:
            return response

        # High but not certain: ask before redirecting
        if confiance < AUTO_REDIRECT_THRESHOLD:
            return response + "\n\n" + msgs["ask_redirect"].format(intent=intent_name)

        # Very high confidence: auto-redirect
        return msgs["auto_redirect"].format(intent=intent_name)

    except Exception as e:
        return msgs["error"].format(error=str(e))


if __name__ == "__main__":
    if len(sys.argv) > 1:
        query = sys.argv[1]
        lang = sys.argv[2] if len(sys.argv) > 2 and sys.argv[2] in ("fr", "en") else None
        print(process_query(query, lang=lang))
    else:
        while True:
            query = input(">>> ")
            if query.strip().lower() == "exit":
                break
            print(process_query(query))