import os
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "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")
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
GROQ_BASE_URL = os.getenv("GROQ_BASE_URL", "https://api.groq.com/openai/v1")

BREVO_API_KEY = os.getenv("BREVO_API_KEY", "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")
BREVO_SENDER_EMAIL = os.getenv("BREVO_SENDER_EMAIL", "minyar1820@gmail.com")
BREVO_SENDER_NAME = os.getenv("BREVO_SENDER_NAME", "EBI Services")

MONGO_URI = os.getenv("MONGODB_URI", "mongodb+srv://minyar1820_db_user:btsjhope1618@cluster0.ffxoxxa.mongodb.net/EBI_SERVICES?appName=Cluster0")

AGENT_MAX_RETRIES = int(os.getenv("AGENT_MAX_RETRIES", "3"))
