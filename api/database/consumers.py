import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Broadcast

class BroadcastConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add("broadcasts", self.channel_name)
        await self.accept()
    
    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("broadcasts", self.channel_name)
    
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        
        await self.channel_layer.group_send(
            "broadcasts",
            {
                'type': 'broadcast_message',
                'message': message
            }
        )
    
    async def broadcast_message(self, event):
        message = event['message']
        await self.send(text_data=json.dumps({
            'message': message
        }))
    
    async def new_broadcast(self, event):
        await self.send(text_data=json.dumps({
            'type': 'new_broadcast',
            'broadcast': event['broadcast']
        }))