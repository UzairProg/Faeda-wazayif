import sys
import os

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from app import create_app, db
from services.chat import Conversation, ConversationParticipant, ChatMessage

def init_chat_tables():
    app = create_app()
    with app.app_context():
        db.create_all()
        print("Successfully created chat tables (conversations, conversation_participants, chat_messages)!")

if __name__ == '__main__':
    init_chat_tables()
