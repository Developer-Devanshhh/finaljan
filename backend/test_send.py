import asyncio
from app.services.telegram_bot import get_bot_application

async def test_send():
    app = get_bot_application()
    await app.bot.send_message(chat_id=12345, text="Test")

# We can't actually do this without chat_id
