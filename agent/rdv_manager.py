import re
from datetime import datetime, timedelta
from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://minyar1820_db_user:btsjhope1618@cluster0.ffxoxxa.mongodb.net/EBI_SERVICES?appName=Cluster0")


class RDVManager:
    def __init__(self):
        self._client = None
        self._db = None
        self._rdvs = None
        self._disponibilites = None

    def _ensure_connected(self):
        if self._client is None:
            try:
                self._client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
                self._db = self._client.get_database()
                self._rdvs = self._db["rdvs"]
                self._disponibilites = self._db["disponibilites"]
            except Exception:
                self._client = None
                raise

    def extract_date_time(self, message: str):
        patterns = [
            r"(\d{1,2})[-/](\d{1,2})[-/](\d{2,4})\s*(?:à|a|@)?\s*(\d{1,2})[h:](\d{2})?",
            r"(\d{1,2})[-/](\d{1,2})[-/](\d{2,4})",
            r"(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})",
        ]
        for pattern in patterns:
            m = re.search(pattern, message)
            if m:
                groups = m.groups()
                if len(groups) == 5:
                    day, month, year, hour, minute = groups
                    minute = minute or "00"
                elif len(groups) == 3:
                    day, month, year = groups
                    hour, minute = "09", "00"
                else:
                    continue
                year = int(year)
                if year < 100:
                    year += 2000
                return datetime(year, int(month), int(day), int(hour), int(minute))
        return None

    def _db_operation(self, func, *args, **kwargs):
        try:
            self._ensure_connected()
            return func(*args, **kwargs)
        except Exception as e:
            return f"Service de rendez-vous temporairement indisponible. Veuillez réessayer plus tard. ({str(e)})"

    def _db_list_operation(self, func, *args, **kwargs):
        try:
            self._ensure_connected()
            return func(*args, **kwargs)
        except Exception:
            return []

    def is_slot_available(self, date_time: datetime) -> bool:
        return self._db_operation(lambda: self._disponibilites.find_one(
            {"date": date_time.isoformat(), "disponible": True}
        ) is not None)

    def schedule_rdv(self, message: str, user_id: str = None) -> str:
        date_time = self.extract_date_time(message)
        if not date_time:
            return "Je n'ai pas pu reconnaître une date valide. Veuillez préciser le jour et l'heure (ex: 15/03/2025 à 14h30)."

        try:
            self._ensure_connected()
        except Exception:
            return "Service de rendez-vous temporairement indisponible. Veuillez réessayer plus tard."

        existing = self._rdvs.find_one({"date": date_time.isoformat()})
        if existing:
            return f"Le créneau du {date_time.strftime('%d/%m/%Y à %H:%M')} est déjà réservé. Veuillez en choisir un autre."

        if not self.is_slot_available(date_time):
            return f"Le créneau du {date_time.strftime('%d/%m/%Y à %H:%M')} n'est pas disponible."

        rdv = {
            "user_id": user_id,
            "date": date_time.isoformat(),
            "statut": "confirmé",
            "cree_le": datetime.now().isoformat(),
        }
        self._rdvs.insert_one(rdv)
        self._disponibilites.update_one(
            {"date": date_time.isoformat()},
            {"$set": {"disponible": False}},
        )

        return f"Votre rendez-vous a été confirmé pour le {date_time.strftime('%d/%m/%Y à %H:%M')}."

    def cancel_rdv(self, message: str, user_id: str = None) -> str:
        date_time = self.extract_date_time(message)
        if not date_time:
            return "Je n'ai pas pu reconnaître une date valide dans votre message."

        try:
            self._ensure_connected()
        except Exception:
            return "Service de rendez-vous temporairement indisponible."

        result = self._rdvs.delete_one(
            {"date": date_time.isoformat(), "statut": "confirmé"}
            if not user_id
            else {"date": date_time.isoformat(), "user_id": user_id, "statut": "confirmé"}
        )

        if result.deleted_count == 0:
            return f"Aucun rendez-vous trouvé pour le {date_time.strftime('%d/%m/%Y à %H:%M')}."

        self._disponibilites.update_one(
            {"date": date_time.isoformat()},
            {"$set": {"disponible": True}},
        )

        return f"Votre rendez-vous du {date_time.strftime('%d/%m/%Y à %H:%M')} a été annulé."

    def list_rdvs(self, user_id: str = None) -> list:
        try:
            self._ensure_connected()
        except Exception:
            return []
        query = {"statut": "confirmé"}
        if user_id:
            query["user_id"] = user_id
        return list(self._rdvs.find(query, {"_id": 0}).sort("date", 1))

    def list_disponibilites(self) -> list:
        try:
            self._ensure_connected()
        except Exception:
            return []
        return list(
            self._disponibilites.find({"disponible": True}, {"_id": 0}).sort("date", 1)
        )

    def manage_rdvs(self, message: str, rdv_list: list = None, disponibility_calender: list = None) -> str:
        msg_lower = message.lower()
        if "planifier" in msg_lower or "programmer" in msg_lower or "prendre" in msg_lower or "réserver" in msg_lower or "rdv" in msg_lower:
            return self.schedule_rdv(message)
        elif "annuler" in msg_lower or "supprimer" in msg_lower:
            return self.cancel_rdv(message)
        elif "liste" in msg_lower or "mes rdv" in msg_lower or "mes rendez" in msg_lower:
            rdvs = self.list_rdvs()
            if not rdvs:
                return "Vous n'avez aucun rendez-vous planifié."
            return "Vos rendez-vous :\n" + "\n".join(
                f"- {r['date']}" for r in rdvs
            )
        elif "disponible" in msg_lower or "créneau" in msg_lower or "créneaux" in msg_lower:
            dispo = self.list_disponibilites()
            if not dispo:
                return "Aucun créneau disponible pour le moment. Veuillez revenir plus tard ou nous contacter directement."
            seen = set()
            grouped = []
            for d in dispo:
                dt = datetime.fromisoformat(d["date"])
                date_str = dt.strftime("%d/%m/%Y")
                day_name = dt.strftime("%A")
                time_str = dt.strftime("%H:%M")
                if date_str not in seen:
                    if len(seen) >= 7:
                        break
                    seen.add(date_str)
                    grouped.append({"date": date_str, "day": day_name, "times": []})
                grouped[-1]["times"].append(time_str)
            day_map = {"Monday": "Lundi", "Tuesday": "Mardi", "Wednesday": "Mercredi", "Thursday": "Jeudi", "Friday": "Vendredi", "Saturday": "Samedi", "Sunday": "Dimanche"}
            table = "| Jour | Date | Creneaux |\n|------|------|----------|\n"
            for g in grouped:
                fr_day = day_map.get(g["day"], g["day"])
                times_str = ", ".join(g["times"])
                table += f"| {fr_day} | {g['date']} | {times_str} |\n"
            return "## Creneaux disponibles (7 prochains jours)\n\n" + table
        else:
            return "Je n'ai pas compris votre demande. Veuillez préciser si vous voulez planifier, annuler, ou consulter les rendez-vous."
