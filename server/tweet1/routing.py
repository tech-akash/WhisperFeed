from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
import mytweet.routing


application = ProtocolTypeRouter({
    'websocket': URLRouter(
            mytweet.routing.websocket_urlpatterns
        )
})
